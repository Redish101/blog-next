---
title: "Next.js App Router初体验与实践: 将我的博客迁移到Next.js App Router与React Server Components"
cover: https://cdn1.tianli0.top/gh/Redish101/cdn@src/img/20230711114346.png
date: "2023-07-13 13:03:10"
---

在今年三月初，我使用 Next.js 重构了我的博客。现在，随着 Next.js AppRouter 的稳定，我又将博客从 Next.js Pages Router 迁移到了 Next.js 13 AppRouter 与 React Server Components，同时，我也做了大量的底层重构以及样式重构。

## 性能优化: React Server Components

在 React 18 之前，所有的组件均为`Client Components`，即客户端组件。顾名思义，客户端组件中的所有逻辑均在客户端执行。浏览器渲染客户端组件需要从服务端获取 chunk，然后渲染组件到页面。即使是在 SSR 中，也需要等待客户端组件所对应的 bundle 完成加载才能让页面具有逻辑，能够交互。而我们的一些操作并不需要在客户端调用：如获取数据，大量的类似的逻辑，大大提高了 bundle 的体积，使得页面加载相对较慢，而`React Server Components`（以下简称`RSC`）的出现很好的解决了这一问题。

RSC 不同于客户端组件，RSC 在服务端的 React 执行，客户端所收到的是服务端的执行结果，也就是说，客户端不会加载任何 RSC 的逻辑代码，以此我们就能缩小 Client Bundle。因为 RSC 是在服务端执行的，所以理所当然，RSC 内能够调用 node 环境，我们也就不必通过`getStaticProps`等 api 获取数据。

之前的文章提到过，我将博客从 Hexo 迁移到了基于文件的 CMS，以往博客版本是这样获取数据的：

```tsx
export async function getStaticPaths() {
  const posts = getAllPosts(["slug"]);

  return {
    paths: posts.map((post) => {
      return {
        params: {
          slug: post.slug,
        },
      };
    }),
    fallback: false,
  };
}

export async function getStaticProps({ params }: any) {
  const post = getPostBySlug(params.slug, ["title", "date", "slug", "content"]);
  const content = await markdownToHtml(post.content || "");
  await generateRss();

  return {
    props: {
      post: {
        ...post,
        content,
      },
    },
  };
}
```

而在使用 RSC 后，我们可以直接获取数据：

```tsx
export default async function Post({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug, [
    "title",
    "date",
    "slug",
    "cover",
    "content",
  ]);
  if (!post.title) {
    return notFound();
  }
  const content = await markdownToHtml(post.content || "");
  return (
    <>
      <Card title={post.title} cover={post.cover} label={post.date.toString()}>
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </Card>
    </>
  );
}

export async function generateStaticParams() {
  const posts = getAllPosts(["slug"]);
  return posts.map((post) => ({
    slug: post.slug,
  }));
}
```

可以看见，使用 RSC 后的页面相比于不使用 RSC 的页面大幅减少了代码长度。

但正因 RSC 是在 node 环境运行的，所以我们不能在 RSC 使用浏览器的 api，也无法使用`useState`等 api，也就是说，RSC 不能直接响应用户的交互。而当我们需要调用浏览器api时，可以通过在组件代码前加上`"use client";`将组件更改为客户端组件，就能调用浏览器api。

值得一提的是，我们可以在RSC中引入客户端组件：

```tsx
<div>
  This is a RSC
  <ClientComponent />
</div>
```

但我们不能在客户端组件内引入RSC：

```tsx
<ClientComponent>
  <ServerComponent />
</ClientComponent>
```

但我们依然有办法在客户端组件内直接调用RSC。前文提到，RSC在渲染过程中需要node的参与，但是返回结果是相当于静态的，所以我们可以通过Props的方式向客户端组件传入RSC的返回值实现：

```tsx
<ServerComponent>
  const res = <AnotherSC />
  <ClientComponent aprop={res} />
</ServerComponent>
```

## 布局优化： Next.js App Router

在 Next.js 13 中，Next.js 新增了一种新的路由方式：`App Router`。它基于`React Server Components`开发，支持共享布局，加载状态，嵌套路由，错误处理等。其中对我而言最重要的更新就是嵌套路由。

App Router 将路由拆分为布局与内容两部分，其中布局支持嵌套，大大减少了代码冗余。例如我们要实现 AB 两个页面，二者都包含一个导航栏和一个侧边栏，B 页面在以上的基础下又包含其自身所需要的布局，即需要布局嵌套，在`Pages Router`中，我们需要这样：

```tsx
// A.tsx
export default function A() {
  return (
    <LayoutA>
      <Content />
    </LayoutA>
  );
}
```

```tsx
// B.tsx
export default function B() {
  return (
    <LayoutA>
      <LayoutB>
        <Content />
      </LayoutB>
    </LayoutA>
  );
}
```

只有两层情况就已经如此糟糕，倘若有三层，四层.......代码的可读性将大大降低。但在 App Router 中，我们可以这样做:

```tsx
// app/a/layout.tsx
export default RootLayout({ children }: { children: ReactNode }) {
  return (
  	<html lang="zh-CN">
      <body>
        <NavBar />
        <div>
          <LayoutA>{children}</LayoutA>
        </div>
      </body>
    </html>
  )
}
```

```tsx
// app/a/b/layout.tsx
export default LayoutB({ children }: { children: ReactNode }) {
  return <LayoutA>{children}</LayoutA>
}
```

此时，b 页面的布局会自动继承 a 的布局，并在其基础上新增其自身布局，代码会十分简洁。

除了语法更加简洁，我们也可以通过AppRouter实现共享布局。

## 服务端: 从 SSG 迈向 SSR

在[「使用 Next.js 重构我的博客」](https://blog.redish101.top/post/blog-v5)一文中我提到，我将博客核心所使用的 CMS 从`Hexo`迁移到自研的基于文件的 CMS，在构建时使用`Next.js Pages Router`提供的`getStaticProps`等一系列 api 在构建时从本地获取文章并渲染，但在我迁移博客到`Next.js App Router`时这样的做法无法通过构建，原因是 App Router 并不支持使用`getStaticProps`等 api 获取数据。同时，在构建时渲染 Markdown 也会导致构建速度很慢，在考虑之下，我决定放弃 SSG，迈向 SSR。

但是，如果在每次访问都渲染一次文章，就会导致服务器压力激增，客户端访问速度直线上升。显然，这种做法是极其不明智的。好在，React 18 中提供了一个`cache`方法，被`cache`包裹的方法，在传参不变的情况下不会执行方法，而是直接返回缓存值，例如：

```typescript
import { cache } from "react";

const add = (a: number, b: number) => {
  return a + b;
};

const cacheAdd = cache(add);

cacheAdd(1, 2); // 3
cacheAdd(1, 2); // 3
```

如果参数不变，多次调用`cacheAdd`方法，并不会执行`add`方法，而是会直接返回缓存值。上面的代码也可以写成这样：

```typescript
import { cache } from "react";

const add = cache((a: number, b: number) => {
  return a + b;
});

add(1, 2); // 3
add(1, 2); // 3
```

接下来的事情就简单了，只需要在读取和渲染文章的方法外包裹`cache`就能提高性能：

```typescript
export const getPostBySlug = cache((slug: string, fields: string[] = []) => {
  // ...
});
```

> 顺便提一下，本人参与开发的评论系统「retalk」也大量使用了缓存提高性能

但现在依然有一个问题，现在服务端在收到请求后，会根据请求路径中的 slug 查找文章，并读取文章内容，但当文件不存在时，node 的 fs api 就会抛出错误，使`getPostBySlug`方法没有返回任何内容，进而导致服务端返回 500，所以我们需要在`getPostBySlug`方法中检测 slug 是否存在，若不存在则返回空对象而不是没有返回值：

```typescript
if (!fs.existsSync(fullPath)) {
  return items;
}
```

在调用时检测返回对象是否包含 slug：

```typescript
if (!post.title) {
  return notFound();
}
```

`notFound()`是 Next.js 提供的方法，可以手动返回 404。

这时，我们再尝试访问不存在的文章，服务端会返回 404，而非 500。

## 元数据: 从 next/head 到 Next Metadata

在 Pages Router 中，我们可以在页面中返回`Head`组件自定义页面的元数据：

```tsx
import Head from "next/head";

export default function PageA() {
  return (
    <Head>
      <title>Your Title</title>
    </Head>
  );
}
```

而在 App Router 中，我们可以通过导出`metadata`的方法设置元数据：

```tsx
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Title",
};
```

> 简介等属性同理

除了静态导出，我们还可以通过导出`generateMetadata`函数实现动态设置元数据：

```tsx
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = getPostBySlug(params.slug, ["title", "content"]);
  if (!post.title) {
    return {
      title: `404 - ${config.name}`,
    };
  }
  return {
    title: `${post.title} - ${config.name}`,
    description: post.content.slice(0, 200),
  };
}
```

## Markdown 渲染: 从 remark 到 marked

在以往的版本中，我使用`remark`完成 Markdown 的渲染，但我逐渐发现，remark 逐渐无法满足我的需求，所以更换到`marked`。marked 支持自定义渲染器，可以更方便的修改渲染逻辑。

本站的 markdown 渲染被封装到了一个`markdownToHtml`函数，所以更改渲染器十分方便：

```typescript
export default async function markdownToHtml(markdown: string) {
  const renderer = new marked.Renderer();

  renderer.code = function (code, language) {
    // 添加hljs类和data-language属性
    let lang = language ? language.toUpperCase() : "";
    if (!language) {
      lang = "TEXT";
    }
    if (language == "") {
      language = "plaintext";
    }
    const highlightedCode = highlightjs(code, language);
    return `<pre class="hljs language-${lang}" data-language="${lang}">
      <code>${highlightedCode}</code>
    </pre>`;
  };
  return marked.parse(markdown, { mangle: false, headerIds: false, renderer });
}
```

> 完整的渲染器代码较长，此处仅展示部分代码，可能无法单独使用

React 无法直接将 html 嵌入到组件作为子元素使用，但提供了属性`dangerouslySetInnerHTML`供开发者显示 html 字符串，所以在这里可以这样写：

```tsx
export default async function Post({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug, [
    "title",
    "date",
    "slug",
    "cover",
    "content",
  ]);
  if (!post.title) {
    return notFound();
  }
  const content = await markdownToHtml(post.content || "");
  return (
    <>
      <Card title={post.title} cover={post.cover} label={post.date.toString()}>
        <div>
          <div>{post.desc}</div>
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </div>
      </Card>
    </>
  );
}
```

## 代码高亮: 自定义主题

以往版本中，正文部分所使用的代码高亮主题是由`github-markdown-css`提供的，我逐渐发现其设计不满足我的需求，便进行了自定义。

代码高亮配色我觉得没有必要更改，但是`highlight.js`提供的主题不支持深色模式，我就不得不手写配色。我将包含深色模式的配色放到了全局变量中：

```css
:root {
  --pre: #fafafa;
  --pre-comment: #6a737d;
  --pre-string: #032f62;
  --pre-literal: #032f62;
  --pre-keyword: #d73a49;
  --pre-function: #6f42c1;
  --pre-deleted: #24292e;
  --pre-class: #22863a;
  --pre-property: #005cc5;
  --pre-namespace: #6f42c1;
  --pre-punctuation: #24292e;
}

@media (prefers-color-scheme: dark) {
  :root {
    --pre-comment: #757575;
    --pre-string: #977cdc;
    --pre-literal: #c64640;
    --pre-keyword: #77b7d7;
    --pre-function: #86d9ca;
    --pre-deleted: #fff;
    --pre-class: #dfab5c;
    --pre-property: #77b7d7;
    --pre-namespace: #86d9ca;
    --pre-punctuation: #fff;
  }
}
```

然后在 highlight.js 提供的默认主题基础上做修改，将颜色从固定值改为变量：

```css
.hljs {
  color: var(--text);
  background: var(--pre);
}
.hljs-doctag,
.hljs-keyword,
.hljs-meta .hljs-keyword,
.hljs-template-tag,
.hljs-template-variable,
.hljs-type,
.hljs-variable.language_ {
  color: var(--pre-keyword);
}
.hljs-title,
.hljs-title.class_,
.hljs-title.class_.inherited__,
.hljs-title.function_ {
  color: var(--pre-function);
}
```

> 此处因篇幅原因只展示部分

原有代码块并没有直接显示语言，容易产生歧义。出现了以下设计方案：

![两种方案](https://cdn1.tianli0.top/gh/Redish101/cdn@src/img/20230712213628.png)

显然第一种更显眼并具有设计感。

具体实现我使用了`before`伪类的方式，通过`attr(data-language)`读取自定义渲染器所输入的语言名称：

```typescript
return `<pre class="hljs language-${lang}" data-language="${lang}">
      <code>${highlightedCode}</code>
    </pre>`;
```

```css
pre::before {
  color: var(--text-l);
  opacity: 0.25;
  content: attr(data-language);
  font-size: 1.625rem;
  font-weight: 700;
  position: absolute;
  right: 0.5rem;
}
```

至此完成了代码块的修改。

## CSS: Atomic CSS In JS

传统的css在使用重复布局时回产生大量冗余，例如以下三个类：

```css
.a {
  padding: 1.125rem;
  color: pink;
}

.b {
  padding: 1.125rem;
  color: skyblue;
}

.c {
  margin: 1.125rem;
  color: pink;
}
```

可以看见，`pading: 1.125rem`与`color: pink`被在css中出现了多次，现在这个css文件共有6个属性。我们可以将它们拆分，封装成4个类：

```css
.p-125 {
  pading: 1.125rem;
}

.color-pink {
  color: pink;
}

.color-skyblue {
  color: skyblue;
}

.m-125 {
  margin: 1.125rem;
}
```

在html中我们可以直接使用这些类的组合实现与第一种方式相同的效果，这就是原子化css。使用原子化设计的css只出现了4个属性。不难看出，原子化css能够减少css的体积。

在实际使用中，我们往往会使用已经绑定好的原子化css库，例如tailwindcss等。

但是，这种做法会导致代码中有一大串的类名，显然不够优雅。所以，我使用了`style9`，实现atomic css in js，您可以打开devtools查看效果。

## 布局设计: 拥抱双飞翼

以往版本的博客使用单栏设计，只留出中间一栏展示所有信息，这样做实现简单，但会导致比较单调。在新博客的设计中，我采用了「双飞翼」布局，即三栏布局：

![三栏布局](https://cdn1.tianli0.top/gh/Redish101/cdn@src/img/20230713131357.png)

将布局拆分为`Sidebar`与`Content`，使用Next App Router可以实现路由跳转只加载`Content`。具体实现使用`CSS Flex`布局。

## 基础设计: Card

如你所见，本站现在的所有组件都是卡片，基础是一个具有`title`，`label`，`content`，`size`，`cover`等众多属性的组件：

![布局演示](https://cdn1.tianli0.top/gh/Redish101/cdn@src/img/20230713131238.png)

以此保证样式的统一。

## 深色模式: CSS变量

深色模式能够提高用户体验，为了实现深色模式，我为深色模式单独设计了配色，并通过`@media (prefers-color-scheme: dark)`实现根据系统设置自动切换。

## 友情链接: 从静态到动态

以往的友情链接是静态储存的，这样做难免会有局限性，在新版博客中，我将友情链接数据迁移到了GitHub仓库，并通过`Chuqi CDN`实时获取友情链接信息。

> 你想与101互换友情链接吗，那就看看下面的步骤吧

### 前置条件

- 友情链接，先友后链，所以最好是101比较眼熟的朋友
- 您的网站不是免费域名，包括但不限于：
  - 由Freenom公司运营的`.tk`，`.ml`等免费域名（不包括付费购买的域名）
  - 由 Joshua Anderson 运营的 Afraid FreeDNS 提供的免费子域名
  - 其他不包含在 Public Suffix List 中的 **免费子域名** 服务
  - `*.github.io`，`*.gitee.io`等域名
- 不能是采集站！！！！！！！！！
- 有三篇以上的原创文章（包括三篇）
- 站点上有我的链接

### 我的信息

```json
{
  "name": "Redish101 Blog",
  "desc": "人文 科技 白日梦",
  "icon": "https://blog.redish101.top/favicon.ico",
  "link": "https://blog.redish101.top"
}
```

### 添加

如果你满足前置条件，就可以开始提交。

1. Fork本仓库
2. 更改data.json
3. 添加你的网站
4. 向本仓库提交pr
5. 等待审核
6. 审核完成后将会在Redish101 Blog下次构建时生效

## 尾声

感谢阅读
