---
title: 使用Fiber Starter开始一个Golang Web后端项目
desc: 本文介绍了如何使用Fiber Starter开始一个Golang Web后端项目。Fiber是一个轻量级的Golang Web框架，Fiber Starter则是一个包含基于Git的版本信息获取、Make构建、Docker&Docker Compose、CLI等功能的起手模板。文章详细介绍了项目的目录结构、如何使用、如何修改配置文件以及如何进行开发和构建。
date: "2023-04-16 15:11:45"
---

## 什么是Fiber

Fiber是一个轻量级的Golang Web框架。

## 什么是Fiber Starter

不同于Java Web开发，开始一个Golang Web框架是很繁琐的，你需要: 设计目录结构、制作许多简单但繁琐的小工具..........如果项目更复杂些，你还需要: docker、docker-compose、make......... 这个初始化的过程往往耗费时间。为了解决这个问题，我把自己的起手模板稍微修改了下，并公开到Github：[Redish101/fiber-starter](https://github.com/Redish101/fiber-starter)，帮助大家解决这个问题。

这个项目包含了基于Git的版本信息获取，Make构建、Docker&Docker Compose、CLI等实用的功能。

```typescript
import { remark } from "remark";
import html from "remark-html";

export default async function markdownToHtml(markdown: string) {
  const result = await remark().use(html).process(markdown);
  return result.toString();
}
```

```
XHU4YmY3XHU1NzI4XHU2M2E3XHU1MjM2XHU1M2YwXHU2MjY3XHU4ODRjXHUwMDZiXHUwMDY1XHUwMDc5XHU1MWZkXHU2NTcw
```

## 项目目录结构

```bash
├── Makefile # Make配置文件(本项目使用Make管理构建)
├── bin # 构建输出目录
│   └── fiber-starter
├── cmd # CLI
│   ├── root.go
│   └── server.go
├── config # 一些配置文件
│   ├── app.go # 应用程序相关
│   └── version.go # 版本信息，会在构建时通过Git获取
├── docker-compose.yml # Docker Compose 配置文件
├── dockerfile # Dockerfile
├── go.mod
├── go.sum
├── internal # 核心部分
│   ├── handler # handler
│   │   └── home.go # 默认的demo
│   ├── server # 服务器相关操作
│   │   ├── route.go
│   │   └── server.go
│   └── utils # 零碎的小工具
│       └── res.go # 格式化相应
└── main.go
```

## 如何使用

### 准备工作

- 能够熟练使用ide进行查找与替换
- 基本的Git使用经验
- Github账号
- Make(本项目使用Make管理构建，所有构建操作请使用Make执行，否则可能会出现许多问题)

### 获取代码

Github提供了方便的模板功能，进入本项目[仓库](https://github.com/Redish101/fiber-starter)，点击右上角的`Use this template`

![image-20230416152821767](https://jsd.onmicrosoft.cn/gh/Redish101/cdn@src/img/20230416152822.png)

点击`Create a new repository`，在接下来的页面内更改仓库信息，完成后，点击下方`Create repository from template`。

### 修改信息

你需要在修改这几个文件，完成初始化:

#### Makefile

修改文件开头的部分变量:

- APP_NAME 应用程序名称
- PKG_NAME 包名
- BIN_NAME 构建输出路径

#### go.mod

修改第一行的包名，与上一步在Makefile中设置的一致。

修改包名后，你需要使用ide的替换功能，将目录内所有的`github.com/Redish101/fiber-starter`替换为你修改的包名。

#### dockerfile

> 如果不需要Docker，请忽略此项

将21行的`/bin/fiber-starter`更改为在Makefile中设置的`BIN_NAME`。

修改最后一行的`fiber-starter`，设置为在Makefile中设置的`BIN_NAME`

#### docker-compose

> 如果不需要docker-compose，请忽略此项

根据需求更改。

#### internal/utils/res.go

根据需要，修改第五行的返回数据格式。

#### config/app.go

修改`AppName`，可以选择性的删除后面的版本号。

### 开发

#### Handler

handler应存放在`internal/handler`，每个handler应该是这样的格式:

```go
package handler

import (
	"github.com/Redish101/fiber-starter/internal/utils"
	"github.com/gofiber/fiber/v2"
)

func Home(c *fiber.Ctx) error {
	return utils.Res(c, true, "Fiber Starter成功启动", nil)
}
```

其中`utils.Res`函数是标准化响应工具，需要传入这几个参数：

- c handler的Ctx
- ok 操作是否成功
- msg 提示信息
- data 返回数据，可以为任何类型

完成后，应当在`internal/server/route.go`中注册路由。在`initRoutes`函数末尾增加路由注册代码，它看起来应该像这样：

```go
app.Get("/", handler.Home)
```

其中`"/"`为路径，`handler.Home`为Handler函数。

### 开发运行

运行`make dev`。

### 开发构建

运行`make build-debug`。使用本命令构建的可执行文件可以使用gdb进行调试，且版本号为`dev-xxxxxx`。

### 生产构建

运行`make all`。使用本命令构建的可执行文件不可以使用gdb进行调试，且版本号为最新的标签。

### 构建Docker镜像

运行` make build-docker`。

## 结语

这篇文章就到这里了，如果觉得项目还不错的话就点点Star吧，谢谢了。
