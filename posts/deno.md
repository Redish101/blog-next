---
title: Deno再尝试：使用Deno编写一个简单的WebAPI
cover: /deno-cover.png
date: "2024-07-23T04:13:46.106Z"
---

两年前，我通过[Ray(@so1ve)](https://mk1.io/)的博客系统[dolan-x](https://github.com/dolan-x/dolan-server)了解到了`Deno`这一新的 js 运行时以及其对应的 saas 服务`Deno Deploy`，为了~~白嫖`Deno Deploy`~~，决定尝试一下，用 Deno + oak + LeanCloud 写了一个简单的友链管理。但是 Deno 脆弱的生态和与 go 类似的基于 url 的模块系统（即使能通过`import_map.json`定义别名）实在没有太多优势，最近 Deno Deploy 又被群友提及，看到 Deno 本身变化很大，便决定再尝试用 Deno 写一个东西。凑巧[个人主页](https://redish101.top)想加一个活动监测器，便决定用 Deno 来实现。

## web 框架的选择

相比之前的友链，这次要做的比较简单，所以没有使用一些框架，而是直接使用标准库中的`Deno.serve`实现。

`Deno.serve`接受一个函数，函数接受请求对象返回响应。

```typescript
const handler = (req: Request) {
    return new Response("Hello, World!");
}

Deno.serve(handler);
```

## 路由

Deno 本身并没有实现路由，但是可以通过手动解析`pathname`实现。

```typescript
const handler = (req: Request) {
    const { pathname } = new URL(req.url);

    if (pathname === "/") {
        return new Response("Hello, World!");
    }

    if (pathname === "/foo") {
        return new Response("bar");
    }

    return new Response("Not Found", { status: 404 });
}
```

对于复杂的路由，可以尝试把 handler 封装到 map 中：

```typescript
type Handler = (req: Request) => Response;
type HandlerMap = { [pathname: string]: Handler };

const handlers: HandlerMap = {
  "/": () => new Responese("Hello, World!"),
  "/foo": () => new Response("bar"),
};

const handler = (req: Request) => {
  const { pathname } = new URL(req.url);

  const matchedHandler = handlers[pathname];

  if (matchedHandler) {
    return matchedHandler(req);
  }

  return new Response("Not Found", { status: 404 });
};
```

## 格式化响应

最好封装一个格式化响应对象，封装`success`，`message`，`data`等属性，方便处理：

```typescript
class FmtResponse<T> {
  private code: number = 200;
  private success: boolean = true;
  private message: string = "success";
  private data: T | null = null;

  constructor(opts: { code?: number; message?: string; data?: T }) {
    if (opts.code && opts.code >= 400) {
      this.success = false;
    }
    this.message = opts.message || "success";
    this.data = opts.data || null;
  }
}
```

并提供一个`json`方法返回 json 格式的响应：

```typescript
public json() {
    const resObj = {
      success: this.success,
      message: this.message,
      data: this.data,
    };

    return new Response(JSON.stringify(resObj), {
      status: this.code,
      headers: {
        "content-type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, apikey",
      },
    });
}
```

## 数据的储存

选择`Deno Deploy`很大一部分原因是因为其方便的 kv 储存，可以方便的持久化储存数据：

```typescript
const kv = await Deno.openKv();

await kv.set(["settings", "username"], "redish101");

const username = await kv.get(["settings", "username"]);

console.log(username.value); // "redish101"
```

值得一提的是，`DenoKV`虽然可以在本地使用，但是需要在 cli 传入`--unstable-kv`：

```bash
deno run --unstable-kv main.ts
```

## 监控数据的上报

这部分没什么可说的，用 rust 写了一个上报器，每 20 分钟通过请求接口上报正常状态的数据，并作为 macOS 服务运行：

```rust
use std::env;

use tokio::time;
use tracing::info;

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt::init();

    info!("Welcome to remonitor!");

    let apiurl = "https://redish101-remonitor.deno.dev/remonitor";
    let apikey = env::var("APIKEY").unwrap();

    let mut interval = time::interval(time::Duration::from_secs(1200));

    loop {
        interval.tick().await;
        info!("Post status");
        reqwest::Client::new()
           .get(apiurl)
           .header("apikey", apikey.clone())
           .send()
           .await
           .expect("Failed to send request");
        info!("Sent request");
    }
}
```

macos 的服务不能直接读取环境变量，只能读取通过`launchctl setenv`设置的环境变量。通过 plist 设置`keepAlive`可以实现后台运行：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>top.redish101.remonitor</string>
    <key>ProgramArguments</key>
    <array>
        <string>/path/to/client</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
</dict>
</plist>
```

## 部署

`Deno Deploy`是Deno推出的saas服务，提供了Deno程序的部署、KV、定时任务等功能，并且速度不错，所以选择了通过Deno Deploy部署。

## 总结

Deno虽说目前不怎么适合放到大型项目的生产环境，但是写一些小服务玩玩还是很舒服的，编码体验很好
