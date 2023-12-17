import Link from "next/link";
import { ReactNode } from "react";

import style9 from "style9";

const styles = style9.create({
  card: {
    backgroundColor: "var(--card-bg)",
    borderRadius: "var(--radius)",
    boxShadow: "var(--shadow)",
    marginTop: "1rem",
    width: "100%",
  },
  title: {
    fontWeight: 400,
    fontSize: "1.40625rem",
    color: "var(--title)",
    marginTop: 0,
    lineHeight: 1.125,
    marginBottom: "15px",
  },
  content: { padding: "1.25rem", fontWeight: 400 },
  post_content: { fontSize: "0.9rem", fontWeight: 400, color: "var(--text)" },
  label: {
    color: "var(--text-l)",
    fontSize: "0.8125rem",
    letterSpacing: "1px",
    marginBottom: "15px",
  },
  cover: {
    display: "block",
    width: "100%",
    height: "200px",
    objectFit: "cover",
    borderTopLeftRadius: "var(--radius)",
    borderTopRightRadius: "var(--radius)",
    position: "relative",
  },
  footer: { marginTop: "15px", color: "var(--text-l)" },
});

interface CardProps {
  cover?: string;
  title?: string;
  label?: string;
  children?: ReactNode;
  footer?: ReactNode;
}

interface PostCardProps {
  slug: string;
  cover?: string;
  title?: string;
  label?: string;
  children?: ReactNode;
  footer?: ReactNode;
}

export default function Card(props: CardProps) {
  return (
    <div className={styles("card")}>
      {props.cover ? (
        <img src={props.cover} alt="cover" className={styles("cover")} />
      ) : void 0}
      <div className={styles("content")}>
        {props.label ? (
          <div className={props.label ? styles("label") : undefined}>
            {props.label}
          </div>
        ) : undefined}
        {props.title ? (
          <h2 className={styles("title")}>{props.title}</h2>
        ) : undefined}
        <div>{props.children}</div>
        {props.footer ? (
          <div className={styles("footer")}>{props.footer}</div>
        ) : undefined}
      </div>
    </div>
  );
}

export function PostCard(props: PostCardProps) {
  const url = "/post/" + props.slug;
  return (
    <div className={styles("card")}>
      {props.cover ? (
        <Link href={url}>
          <img src={props.cover} alt="cover" className={styles("cover")} />
        </Link>
      ) : undefined}
      <div className={styles("content")}>
        {props.label ? (
          <Link href={url}>
            <div className={props.label ? styles("label") : undefined}>
              {props.label}
            </div>
          </Link>
        ) : undefined}
        {props.title ? (
          <Link href={url}>
            <h2 className={styles("title")}>{props.title}</h2>
          </Link>
        ) : undefined}
        <Link href={url}>
          <div className={styles("post_content")}>{props.children}</div>
        </Link>
        {props.footer ? (
          <div className={styles("footer")}>{props.footer}</div>
        ) : undefined}
      </div>
    </div>
  );
}
