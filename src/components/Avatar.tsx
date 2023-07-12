import Card from "@/components/Card";
import Image from "next/image";

import styles from "@/styles/components/Avatar.module.css";
import config from "@/../site.config";

export default function Avatar() {
  return (
    <Card label="你好">
      <div className={styles.avatarContainer}>
        <Image
          src={"/favicon.ico"}
          alt="Avatar"
          className={styles.avatar}
          width={96}
          height={96}
        />
      </div>
      <h2 className={styles.name}>Redish101</h2>
      <div className={styles.desc}>{config.description}</div>
    </Card>
  );
}
