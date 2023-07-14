import Card from "@/components/Card";
import { getAllPosts, getPostBySlug } from "@/core";
import markdownToHtml from "@/core/markdownToHtml";
import config from "@/../site.config";
import { Metadata } from "next";
import { notFound } from "next/navigation";

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
    <Card title={post.title} cover={post.cover} label={post.date.toString()}>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </Card>
  );
}

export async function generateStaticParams() {
  const posts = getAllPosts(["slug"]);
  return posts.map((post) => ({
    slug: post.slug,
  }));
}
