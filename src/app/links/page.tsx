import config from "@/../site.config";
import { Metadata } from "next";
import Card from "@/components/Card";
import Link from "next/link";

import style9 from "style9";
import Links from "@/components/Links";
import { FriendLink } from "@/../interfaces/config";

const styles = style9.create({
  container: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  item: { width: "100%" },
  item_text: { color: "var(--text)" },
});


export const metadata: Metadata = {
  title: `友情链接 - ${config.name}`,
};

export default async function FriendLinks() {
  const data: FriendLink[] = config.links!
  return (
    <div className={styles("container")}>
      {data.map((item) => {
        return (
          <div className={styles("item")} key={item.name}>
            <Link href={item.link}>
              <Card>
                <Links data={item}></Links>
              </Card>
            </Link>
          </div>
        );
      })}
      <Link
        href={"https://github.com/Redish101/blog-next"}
        className={styles("item_text")}
        style={{
          margin: "30px auto",
        }}
      >
        添加您的网站
      </Link>
    </div>
  );
}
