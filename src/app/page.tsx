import { PostCard } from "@/components/Card";
import { getAllPosts } from "@/core";
import moment from "moment";
import Link from "next/link";

import style9 from "style9";

const styles = style9.create({
  container: { display: "flex", justifyContent: "space-between" },
});

function Footer(props: { date: string; url: string }) {
  return (
    <div className={styles("container")}>
      <div>{props.date}</div>
      <Link href={props.url}>继续阅读</Link>
    </div>
  );
}

function getPostDesc(content: string) {
  content = content.replaceAll("#", "").slice(0, 150) + "..."
  content = content.replaceAll("`", "")
  return content
}

export default function Home() {
  const allPosts = getAllPosts(["title", "date", "slug", "cover", "content"]);
  return (
    <>
      {allPosts.map((item) => {
        if (item.content != undefined) {
          return (
            <>
              <PostCard
                title={item.title}
                cover={item.cover}
                key={item.slug}
                footer={
                  <Footer
                    date={moment(item.date).format("YYYY-MM-DD")}
                    url={"/post/" + item.slug}
                  />
                }
                slug={item.slug}
              >
                {
                  getPostDesc(item.content)
                }
              </PostCard>
            </>
          );
        }
      })}
    </>
  );
}
