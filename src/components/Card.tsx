import styles from "@/styles/components/Card.module.css";
import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";

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
    <div className={styles.card}>
      {props.cover ? (
        <img src={props.cover} alt="cover" className={styles.cover} />
      ) : undefined}
      <div className={styles.content}>
        {props.label ? (
          <div className={props.label ? styles.label : undefined}>
            {props.label}
          </div>
        ) : undefined}
        {props.title ? (
          <h2 className={styles.title}>{props.title}</h2>
        ) : undefined}
        <div>{props.children}</div>
        {props.footer ? (
          <div className={styles.footer}>{props.footer}</div>
        ) : undefined}
      </div>
    </div>
  );
}

export function PostCard(props: PostCardProps) {
  const url = "/post/" + props.slug;
  return (
    <div className={styles.card}>
      {props.cover ? (
        <Link href={url}>
          <img src={props.cover} alt="cover" className={styles.cover} />
        </Link>
      ) : undefined}
      <div className={styles.content}>
        {props.label ? (
          <Link href={url}>
            <div className={props.label ? styles.label : undefined}>
              {props.label}
            </div>
          </Link>
        ) : undefined}
        {props.title ? (
          <Link href={url}>
            <h2 className={styles.title}>{props.title}</h2>
          </Link>
        ) : undefined}
        <Link href={url}>
          <div className={styles.post_content}>{props.children}</div>
        </Link>
        {props.footer ? (
          <div className={styles.footer}>{props.footer}</div>
        ) : undefined}
      </div>
    </div>
  );
}
