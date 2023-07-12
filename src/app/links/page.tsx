import styles from "@/styles/app/links.module.css";
import config from "@/../site.config";
import { Metadata } from "next";
import Card from "@/components/Card";
import Link from "next/link";
import { getAllPosts } from "@/core";

interface FriendLink {
  name: string;
  desc: string;
  link: string;
}

export const metadata: Metadata = {
  title: `友情链接 - ${config.name}`,
};

export default async function FriendLinks() {
  const data: FriendLink[] = await fetch(config.friendLinks!).then((res) => {
    return res.json();
  });
  getAllPosts();
  return (
    <div className={styles.container}>
      {data.map((item) => {
        return (
          <div className={styles.item} key={item.name}>
            <Link href={item.link}>
              <Card>
                <div className={styles.item_text}>
                  <h3>{item.name}</h3>
                  <p>{item.desc}</p>
                </div>
              </Card>
            </Link>
          </div>
        );
      })}
      <Link
        href={"https://github.com/Redish101/friend-links"}
        className={styles.item_text}
        style={{
          margin: "30px auto",
        }}
      >
        添加您的网站
      </Link>
    </div>
  );
}
