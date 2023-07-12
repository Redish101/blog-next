import styles from "@/styles/components/Layout.module.css";
import Card from "@/components/Card";
import { ReactNode } from "react";
import Avatar from "@/components/Avatar";
import Count from "@/components/Count";
import { getAllPosts } from "@/core";
import Link from "next/link";

interface LayoutProps {
  children: ReactNode;
}

const posts = getAllPosts(["title", "slug"]).splice(0, 4);

export default function Layout(props: LayoutProps) {
  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <Avatar />
        <Count />
      </aside>
      <div className={styles.main}>{props.children}</div>
      <div className={styles.sidebar_r}>
        <Card label="推荐文章">
          {posts.map((item) => {
            return (
              <Link
                href={"/post/" + item.slug}
                className={styles.random}
                key={item.slug}
              >
                {item.title}
                <hr />
              </Link>
            );
          })}
        </Card>
      </div>
    </div>
  );
}
