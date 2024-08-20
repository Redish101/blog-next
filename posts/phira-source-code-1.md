---
title: "Phira源码解析1: 入口函数"
date: "2023-12-17 13:43:12"
---

`phira`，原`prpr`，一款Phigros自制谱播放器，程序主体部分使用rust编写，底层为轻量的跨平台的rust图形库`miniquad`与其封装库`macroquad`。

## 项目结构

phira的仓库内有以下几个包

```text
.
├── Cargo.lock
├── Cargo.toml
├── LICENSE
├── README-zh_CN.md
├── README.md
├── assets
├── build_wasm.sh
├── phira
├── phira-main
├── phira-monitor
├── prpr
├── prpr-avc
└── rustfmt.toml
```

其中核心程序部分

```text
.
├── phira
├── prpr
└── phira-main
```

我们也主要展开这两个包的解析。

### `phira-main/src/main.rs`

```rust
fn main() {
    phira::quad_main();
}
```

### `phira::quad_main`

`phira::quad_main();`调用位于phira包内的入口函数。`quad_main`函数内容如下

```rust
pub extern "C" fn quad_main() {
    macroquad::Window::from_config(build_conf(), async {
        if let Err(err) = the_main().await {
            error!("Error: {:?}", err);
        }
    });
}
```

`macroquad::Window::from_config`函数用于从配置新建一个macroquad窗口，此处配置由`build_conf`函数生成。

### `build_conf`

此函数位于`prpr`包内。内容如下

```rust
pub fn build_conf() -> macroquad::window::Conf {
    macroquad::window::Conf {
        window_title: "Phira".to_string(),
        window_width: 973,
        window_height: 608,
        ..Default::default()
    }
}
```

此函数返回了`macroquad::window::Conf`结构体，此结构体用以指定macroquad窗口的标题，尺寸等配置项。

### `the_main`

在`quad_main`函数中被调用，程序实际主体部分。内容如下：

```rust
async fn the_main() -> Result<()> {
    // 注册日志记录器
    log::register();

    // 初始化资源文件
    init_assets();

    // 创建tokio运行时
    let rt = tokio::runtime::Builder::new_multi_thread()
        .worker_threads(4) // 设置工作线程数为4
        .enable_all() // 启用所有功能
        .build() // 构建运行时
        .unwrap(); // 获取运行时实例
    let _guard = rt.enter(); // 进入运行时上下文

    // ios环境下的特殊设置
    #[cfg(target_os = "ios")]
    unsafe {
        use prpr::objc::*;
        #[allow(improper_ctypes)]
        extern "C" {
            pub fn NSSearchPathForDirectoriesInDomains(
                directory: std::os::raw::c_ulong,
                domain_mask: std::os::raw::c_ulong,
                expand_tilde: bool,
            ) -> *mut NSArray<*mut NSString>;
        }
        let directories = NSSearchPathForDirectoriesInDomains(5, 1, true);
        let first: &mut NSString = msg_send![directories, firstObject];
        let path = first.as_str().to_owned();
        *DATA_PATH.lock().unwrap() = Some(path);
        *CACHE_DIR.lock().unwrap() = Some("Caches".to_owned());
    }

    // 读取数据文件目录
    let dir = dir::root()?;
    let mut data: Data = std::fs::read_to_string(format!("{dir}/data.json")) // 读取数据文件
        .map_err(anyhow::Error::new) // 处理错误
        .and_then(|s| Ok(serde_json::from_str(&s)?)) // 解析JSON数据
        .unwrap_or_default(); // 如果解析失败，使用默认值
    data.init().await?; // 初始化数据
    set_data(data); // 设置数据
    sync_data(); // 同步数据

    // 创建消息通道
    let rx = {
        let (tx, rx) = mpsc::channel();
        *MESSAGES_TX.lock().unwrap() = Some(tx);
        rx
    };

    // 创建防沉迷消息通道
    let aa_rx = {
        let (tx, rx) = mpsc::channel();
        *AA_TX.lock().unwrap() = Some(tx);
        rx
    };

    // 设置暂停恢复监听器
    unsafe { get_internal_gl() }
        .quad_context
        .display_mut()
        .set_pause_resume_listener(on_pause_resume);

    // 如果存在用户信息，执行防沉迷操作
    if let Some(me) = &get_data().me {
        anti_addiction_action("startup", Some(format!("phira-{}", me.id)));
    }

    // 加载Phigros字体文件
    let pgr_font = FontArc::try_from_vec(load_file("phigros.ttf").await?)?;
    PGR_FONT.with(move |it| *it.borrow_mut() = Some(TextPainter::new(pgr_font, None)));

    // 加载其他字体文件
    let font = FontArc::try_from_vec(load_file("font.ttf").await?)?;
    let mut painter = TextPainter::new(font.clone(), None);

    // 创建主场景、时间管理器和帧率计时器
    let main = Main::new(Box::new(MainScene::new(font).await?), TimeManager::default(), None).await?;
    let tm = TimeManager::default();
    let mut fps_time = -1;

    // 主循环
    'app: loop {
        let frame_start = tm.real_time(); // 记录当前帧开始时间
        let res = || -> Result<()> {
            main.update()?; // 更新主场景
            main.render(&mut painter)?; // 渲染主场景
            if let Ok(paused) = rx.try_recv() { // 接收暂停恢复消息
                if paused {
                    main.pause()?; // 暂停主场景
                } else {
                    main.resume()?; // 恢复主场景
                }
            }
            Ok(())
        }();
        if let Err(err) = res { // 处理错误
            error!("uncaught error: {err:?}");
            show_error(err);
        }
        if main.should_exit() { // 判断是否退出游戏
            break 'app;
        }

        if let Ok(code) = aa_rx.try_recv() { // 接收防沉迷消息
            info!("anti addiction callback: {code}");
            match code {
                500 => {
                    anti_addiction_action("enterGame", None);
                }
                1001 => {
                    anti_addiction_action("exit", None);
                    get_data_mut().me = None;
                    get_data_mut().tokens = None;
                    let _ = save_data(); // 保存数据
                    sync_data(); // 同步数据
                    use crate::login::L10N_LOCAL;
                    show_message(crate::login::tl!("logged-out")).ok(); // 显示退出登录提示
                }
                1030 => {
                    show_and_exit("你当前为未成年账号，已被纳入防沉迷系统。根据国家相关规定，周五、周六、周日及法定节假日 20 点 - 21 点之外为健康保护时段。当前时间段无法游玩，请合理安排时间。");
                    exit_time = frame_start;
                }
                1050 => {
                    show_and_exit("你当前为未成年账号，已被纳入防沉迷系统。根据国家相关规定，周五、周六、周日及法定节假日 20 点 - 21 点之外为健康保护时段。你已达时间限制，无法继续游戏。");
                    exit_time = frame_start;
                }
                9002 => {
                    show_and_exit("必须实名认证方可进行游戏。");
                    exit_time = frame_start;
                }
                _ => {}
            }
        }

        let t = tm.real_time(); // 获取当前时间

        if t > exit_time + 5. { // 判断是否达到退出条件
            break;
        }

        let fps_now = t as i32; // 计算当前帧率
        if fps_now != fps_time { // 如果帧率发生变化，更新帧率计时器
            fps_time = fps_now;
            info!("FPS {}", (1. / (t - frame_start)) as u32);
        }

        next_frame().await; // 等待下一帧
    }
    Ok(())
}
```
