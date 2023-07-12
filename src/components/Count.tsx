import Card from "@/components/Card";
import { getAllPosts } from "@/core";

import styles from "@/styles/components/Count.module.css";

const allPosts = getAllPosts(["content"]);

let count = 0;

allPosts.map((item) => {
  count += item.content.length;
});

const data = [
  {
    key: "post",
    data: allPosts.length,
    label: "文章",
  },
  {
    key: "word",
    data: (count / 10000).toString().slice(0, 3),
    label: "万字",
  },
];
export default function Count() {
  return (
    <Card label="数据统计">
      <div className={styles.count}>
        {data.map((item) => {
          return (
            <div key={item.key}>
              <div className={styles.data}>{item.data}</div>
              <div className={styles.label}>{item.label}</div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
