---
title: 使用Next.js重构我的博客
desc: 其实最早做博客的时候是想自制博客系统的，但是由于当时技术能力的限制，便一直在用Hexo、Typecho等博客系统，最近抽出时间，就开始使用Next.js重构我的博客，在重构完成后便写下本文，记录下开发历程。
date: "2023-03-04 12:33:10"
---

## 技术选型

### React VS Vue

在这两者之间，我对React的使用更加熟练些，而且我认为使用TSX开发React应用的体验是愉悦的，所以选择React。

### Gatsby VS Next.js

这两者都是十分优秀的React框架，但我一直无法成功配置Gatsby环境，而且考虑到应用以后可能使用服务端渲染，所以选择Next.js。

### SSR VS SSG

博客目前并没有一些复杂的功能需要使用SSR实现，为了节省性能，选择了Next.js的SSG（以后会计划开发管理后台，所以以后可能会更换为SSR）。

## UI设计

为了提高界面主题的美观，降低实现的难度，我设计了较为简单（简陋）的ui，并做了移动端适配，尽量让移动端的用户能有较好的体验。

## 内容管理

最开始，我准备效仿苏卡卡，使用hexo管理文章，但在进行一段时间的开发后，发现我对hexo api的了解无法满足使用。最后，我选择将文章储存为Markdown文件，并在每次更新后将其渲染为静态页面。

在众多Markdown渲染库中，我选择使用比较简单易用的`remark`将markdown渲染为html：

```typescript
import { remark } from "remark";
import html from "remark-html";

export default async function markdownToHtml(markdown: string) {
  const result = await remark().use(html).process(markdown);
  return result.toString();
}
```

搞定正文的渲染，还有一个问题，由于并没有使用数据库文章信息，所以需要将文章信息放到`front matter`内，再在构建时解析，转换为js能够读取的数据格式，并储存到页面的`props`中，供前端使用。在处理`front-matter`中，我选择了`gray-matter`。

在读取Markdown并处理后，需要将文章数据传递给前端，供前端使用，但我并没有使用SSR，所以无法做到获取实时的文章数据，但得益于强大的Next.js，我们可以通过`getStaticProps`，`getStaticPaths`在执行构建时获取数据，储存到props中，例如文章详情页的数据可以这样获取：

```typescript
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

这样在前端就可以十分方便的使用数据：

```tsx
export default function Post(props: props) {
  const router = useRouter();
  const post = props.post;
  const title = `${post.title} | Redish101 Blog`;
  if (!router.isFallback && !post?.slug) {
    return <Error404 />;
  }
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <PostBody title={post.title} date={post.date} content={post.content} />
    </>
  );
}
```

## 样式实现

在众多css in js库中，我选择了`griffel`，它可以自动生成随机的类名，对于我这种起名困难党算是个福音，其次，它使用起来也十分的顺畅，只需要使用`makeStyles()`定义样式，即可通过`useStyles()`使用样式。使用它定义样式，在编码过程中ide会给出效果较好的代码提示：

![](https://cdn.chuqis.com/gh/Redish101/cdn@src/img/20230304193114.png)

在开发的过程中节约了很多时间，生成的随机类名可以很好的避免类名重复导致的错误：

![](https://cdn.chuqis.com/gh/Redish101/cdn@src/img/20230304193416.png)

## 一言

在新版博客的首页，我将原来固定的副标题替换为从一言api获取一句质量较高的话作为副标题，数据的获取与文章数据的获取一样，都使用`getStaticProps`在构建时获取，所以一言的更新频率完去取决于我的更新频率。

## 部署

网站的部署有以下几个选择：服务器部署，vercel，netlify。前面说过，本站是静态网站，所以如果选择服务器部署，在每次内容更新后都需要上传到服务器，浪费时间，即使使用ci，服务器由于地域原因也无法从GitHub拉取网站源码进行构建，所以率先出局。在vercel和netlify中我选择vercel，一是使用熟练，二是对Next.js有较好的支持，若是以后更改为ssr也很方便。

## 重构博客给我带来了什么

Nextjs SSG网站的性能明显是要好于动态博客的，而且构建速度也比之前用Hexo的时候更快。而且自己造的轮子，自己肯定更熟悉，改起来也方便。

## 彩蛋

key01:

```
XHU4YmY3XHU1NzI4XHU2M2E3XHU1MjM2XHU1M2YwXHU2MjY3XHU4ODRjXHUwMDZiXHUwMDY1XHUwMDc5XHU1MWZkXHU2NTcw
```
