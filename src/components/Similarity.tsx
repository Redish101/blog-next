import Card from "@/components/Card";
import { getAllPosts, getPostBySlug } from "@/core";
import { similarity } from "@/utils/similarity";
import { cache } from "react";

const getSimilarityBySlug = cache((slug: string) => {
  const allPosts = getAllPosts(["slug", "content"]);
  const post = getPostBySlug(slug);
  let res: any[] = [];
  allPosts.map((item) => {
    if (item.slug != slug) {
      res.push({
        slug: item.slug,
        sim: similarity(post.content, item.content),
      });
    }
  });
  return res;
});

export default function Similarity() {
  return <Card label="相关文章">{getSimilarityBySlug("blog-v5")}</Card>;
}
