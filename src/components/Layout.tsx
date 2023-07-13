import Card from "@/components/Card";
import { ReactNode } from "react";
import Avatar from "@/components/Avatar";
import Count from "@/components/Count";
import { getAllPosts } from "@/core";
import Link from "next/link";

import style9 from "style9";

const styles = style9.create({
  container: {
    display: "flex",
    flexWrap: "wrap",
    maxWidth: "1185px",
    margin: "0px auto",
    gap: "6px",
    "@media screen and (max-width: 1190px)": {
      display: "flex",
      flexWrap: "wrap",
      padding: "0px 15px",
      margin: "0px auto",
      maxWidth: "900px",
    },
    "@media screen and (max-width: 785px)": {
      display: "flex",
      flexDirection: "column-reverse",
      flexWrap: "wrap",
      padding: "0px 15px",
      maxWidth: "700px",
      margin: "10px auto",
    },
  },
  sidebar: {
    flex: "1",
    minWidth: "200px",
    padding: "10px",
    boxSizing: "border-box",
    position: "sticky",
    height: "30px",
    top: "-10px",
    "@media screen and (max-width: 785px)": {
      flex: "1 0 100%",
    },
  },
  sidebar_r: {
    flex: "1",
    minWidth: "200px",
    padding: "10px",
    boxSizing: "border-box",
    position: "sticky",
    height: "30px",
    top: "-10px",
    "@media screen and (max-width: 1190px)": {
      display: "none",
    },
  },
  main: {
    flex: "2",
    padding: "10px",
    boxSizing: "border-box",
    maxWidth: "550px",
    width: "100%",
    margin: "0 auto",
  },
  random: {
    color: "var(--text-l)",
    fontSize: ".875rem",
  },
  random_date: {
    fontSize: ".8125rem",
  },
});

interface LayoutProps {
  children: ReactNode;
}

const posts = getAllPosts(["title", "slug", "date"]).splice(0, 4);

export default function Layout(props: LayoutProps) {
  return (
    <div className={styles("container")}>
      <aside className={styles("sidebar")}>
        <Avatar />
        <Count />
      </aside>
      <div className={styles("main")}>{props.children}</div>
      <div className={styles("sidebar_r")}>
        <Card label="推荐文章">
          {posts.map((item) => {
            return (
              <div key={item.slug}>
                <div className={styles("random_date")}>{item.date}</div>
                <Link
                  href={"/post/" + item.slug}
                  className={styles("random")}
                >
                  {item.title}
                  <hr />
                </Link>
              </div>
            );
          })}
        </Card>
      </div>
    </div>
  );
}
