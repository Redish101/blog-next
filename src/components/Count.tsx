import Card from "@/components/Card";
import { getAllPosts } from "@/core";

import style9 from "style9";

const styles = style9.create({
  count: { display: "flex", justifyContent: "center", gap: "50px" },
  container: { margin: "5px", textAlign: "center" },
  data: { fontSize: "1.40625rem", textAlign: "center" },
  label: { fontSize: "0.875rem", textAlign: "center" },
});

const allPosts = getAllPosts(["content"]);

let count = 0;

allPosts.map((item) => {
  if (item.content != undefined) {
    count += item.content.length;
  }
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
      <div className={styles("count")}>
        {data.map((item) => {
          return (
            <div key={item.key}>
              <div className={styles("data")}>{item.data}</div>
              <div className={styles("label")}>{item.label}</div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
