---
title: Github Codespaces初体验
tags:
  - Github
categories:
  - 白嫖之道
abbrlink: 36200
date: "2022-06-10 18:52:04"
updated: "2022-06-19 18:52:04"
cover: "https://jsd.onmicrosoft.cn/gh/Redish101/cdn@src/img/20220718211307.png"
---

# 这是什么

在去年，GitHub上线了一个的新功能：`Codespaces`，使用Codespaces可以随时随地在浏览器里编辑、调试、运行托管在GitHub的代码。

在前几天，GitHub将此功能开放公测，任何用户都能申请使用，我，于是就有了这篇文章。

![邮件](https://jsd.onmicrosoft.cn/gh/Redish101/cdn@src/img/20220610210634.png)

# 性能

## 硬件配置

先说性能，GitHub面对个人项目提供了一台4Cores 8RAM的设备，这性能对于普通的开发那是绰绰有余，话不多说，上bench截图：

![测试结果](https://jsd.onmicrosoft.cn/gh/Redish101/cdn@src/img/20220610211120.png)

## 网络

配置虽好值得夸赞，但这网络之遭也十分的影响使用，在笔者试用的时候，2个小时中断线了将近十次。虽然大部分时间下编辑器的使用没有发现明显卡顿，但终端在使用时的卡顿是真的让人无法忍受。

## 终端相关

Github Codespaces的终端是可以通过`sudo su`进入root用户的，也可以直接通过`sudo`命令来运行需要root权限的服务。

## 自动休眠

这是非常重要的一个点，是我们白嫖之路的最大绊脚石，在一段时间（暂未明确结果）内如果编辑器没有活跃，codespace就会自动关闭。

# 写代码

Codespaces使用了web版本的VS Code，所以说编辑体验是与直接在本地使用Code编辑并无不同，经过测试，也能完美的适配各种插件。运行时方面也无需担心，已经自动预装了docker、python、node、c/cpp等大部分语言的开发环境。

同时，如果在终端里启动程序的开发服务器时编辑器会自动发现开放的端口并映射到公网，默认是私有的，只有codespace的所有者才能访问，但是可以在图中的这个位置中更改穿透为对外公开，但是101奉劝各位早点死了用这个搭建什么服务的心吧，同GitHub一样，几乎是无法访问，在速度这方面，甚至比不上GitHub Pages。
