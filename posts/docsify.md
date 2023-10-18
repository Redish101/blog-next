---
abbrlink: "45082"
author:
  - Redish101
categories:
  - 教程
cover: https://jsd.onmicrosoft.cn/gh/Redish101/cdn@src/img/20220718215950.png
date: "2022-03-05 00:00:00"
tags:
  - docsify
  - 静态站点
title: docsify - 一个优雅的静态文档生成器
desc: docsify是一个静态文档站点生成器，可以快速的制作静态文档站点，本文将介绍docsify的安装、使用和部署
updated: "2022-11-15 11:53:07"
---

## docsify好在哪里

docsify相比于其他的静态文档站点生成器相比更加的简洁，易用。

<!-- more -->

###

#### Sphinx

先拿Sphinx来说吧，Sphinx因背后有python的驱动，功能十分强大，但是rst的语法还是比较复杂的

#### Vuepress

vuepress更适合大型项目的文档编写，而且维护成本高。

## 使用

### 安装

全局安装Docsify-cli:

```bash
yarn global add docsify-cli
# 或者使用npm
```

### 开始一个项目

```bash
docsify init <项目路径>
```

### 配置

本文不再对配置方面进行过多的论述，可以参考[配置项 (docsify.js.org)](https://docsify.js.org/#/zh-cn/configuration)

### 编写

docsify会自动识别目录下的所有markdown文件，所以在docs目录新增markdown文件即可编写文档

#### 路径问题

这里要注意一下路径：

假设你的目录结构如下：

```text
.
└── docs
├── README.md
├── guide.md
└── zh-cn
├── README.md
└── guide.md
```

那么渲染后的路径就是：

```text
docs/README.md        => http://domain.com
docs/guide.md         => http://domain.com/guide
docs/zh-cn/README.md  => http://domain.com/zh-cn/
docs/zh-cn/guide.md   => http://domain.com/zh-cn/guide
```

## 部署

### Github Pages

将Github Pages的工作目录设置到docsify所在目录。

### Vercel

选中docsify所在仓库，点击下面的deploy

### 服务器

将docsify所在文件夹上传到网站目录即可
