import { PostCard } from "@/components/Card";
import { getAllPosts } from "@/core";
import styles from "@/styles/app/home.module.css";
import moment from "moment";
import Link from "next/link";

function Footer(props: { date: string; url: string }) {
  return (
    <div className={styles.container}>
      <div>{props.date}</div>
      <Link href={props.url}>继续阅读</Link>
    </div>
  );
}

export default async function Home() {
  const allPosts = getAllPosts(["title", "date", "slug", "cover", "content"]);
  return (
    <>
      {allPosts.map((item) => {
        return (
          <>
            <PostCard
              title={item.title}
              cover={item.cover}
              footer={
                <Footer
                  date={moment(item.date).format("YYYY-MM-DD")}
                  url={"/post/" + item.slug}
                />
              }
              slug={item.slug}
            >
              {item.content.slice(0, 150) + "..."}
            </PostCard>
          </>
        );
      })}
    </>
  );
}
