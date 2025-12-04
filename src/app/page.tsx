import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <div className={styles.center}>
        <div className={styles.buttons}>
          <Link className={styles.primary} href="/login">
            Sign in
          </Link>
          <Link className={styles.secondary} href="/register">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
