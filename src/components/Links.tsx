export interface FriendLink {
    name: string;
    desc: string;
    link: string;
}

import style9 from "style9";

const styles = style9.create({
  item: { width: "100%" },
  item_text: { color: "var(--text)" },
});

export default async function Link({ data } : { data: FriendLink}) {
    return (
        <div className={styles("item_text")}>
                  <h3>{data.name}</h3>
                  <p>{data.desc}</p>
        </div>
    )
}