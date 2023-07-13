import Card from "@/components/Card";
import Image from "next/image";

import config from "@/../site.config";

import style9 from "style9";

const styles = style9.create({
  avatarContainer: { display: "flex", justifyContent: "center" },
  avatar: {
    borderRadius: "100%",
    height: "96px",
    width: "96px",
    margin: "0 auto",
  },
  name: {
    fontSize: "1.40625rem",
    fontWeight: 400,
    lineHeight: 1.125,
    textAlign: "center",
  },
  desc: { textAlign: "center", marginBottom: "15px" },
});

export default function Avatar() {
  return (
    <Card label="你好">
      <div className={styles("avatarContainer")}>
        <Image
          src={"/favicon.ico"}
          alt="Avatar"
          className={styles("avatar")}
          width={96}
          height={96}
        />
      </div>
      <h2 className={styles("name")}>Redish101</h2>
      <div className={styles("desc")}>{config.description}</div>
    </Card>
  );
}
