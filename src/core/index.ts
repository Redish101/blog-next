import fs from "fs";
import { join } from "path";
import matter from "gray-matter";
import { cache } from "react";

export type Items = {
  [key: string]: string;
};

const postsDirectory = join(process.cwd(), "posts");

export const getPostSlugs = cache(() => {
  return fs.readdirSync(postsDirectory);
});

export const getPostBySlug = cache((slug: string, fields: string[] = []) => {
  const items: Items = {};
  if (slug == null) {
    return items;
  }
  const realSlug = slug.replace(/\.md$/, "");
  const fullPath = join(postsDirectory, `${realSlug}.md`);
  if (!fs.existsSync(fullPath)) {
    return items;
  }
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  fields.forEach((field) => {
    if (field === "slug") {
      items[field] = realSlug;
    }
    if (field === "content") {
      items[field] = content;
    }

    if (typeof data[field] !== "undefined") {
      items[field] = data[field];
    }
  });
  

  return items;
});

export const getAllPosts = cache((fields: string[] = []) => {
  const slugs = getPostSlugs();
  const posts = slugs
    .map((slug) => getPostBySlug(slug, fields))
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
  return posts;
});
