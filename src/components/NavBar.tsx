import Link from "next/link";
import config from "@/../site.config";

import style9 from "style9";

const styles = style9.create({
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 2.25rem",
    height: "54px",
    backgroundColor: "var(--card-bg)",
    boxShadow: "var(--shadow)",
    "@media screen and (max-width: 785px)": {
      justifyContent: "center",
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
    },
    zIndex: "2000",
  },
  navbar_left: {
    display: "flex",
    alignItems: "center",
  },
  navbar_right: {
    display: "flex",
    alignItems: "center",
  },
  logo: {
    color: "var(--title)",
    fontSize: "18px",
    fontWeight: 450,
  },
  menu: {
    color: "var(--text)",
    margin: "15px",
    "@media screen and (max-width: 785px)": {
      display: "none",
    },
  },
});

export default function NavBar() {
  return (
    <nav className={styles("navbar")}>
      <div className={styles("navbar_left")}>
        <Link href={"/"} className={styles("logo")}>
          {config.name}
        </Link>
      </div>
      <div className={styles("navbar_right")}>
        {config.menu.map((item) => {
          return (
            <Link className={styles("menu")} href={item.to} key={item.key}>
              {item.name}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
