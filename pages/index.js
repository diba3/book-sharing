import { useRouter } from "next/router";
import styles from "../styles/Home.module.css";

export default function Home() {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Welcome to Book Sharing Hub</h1>
      <div className={styles.buttonGroup}>
        <button
          onClick={() => router.push("/login")}
          className={`${styles.button} ${styles.loginButton}`}
        >
          Login
        </button>
        <button
          onClick={() => router.push("/createUser")}
          className={`${styles.button} ${styles.createButton}`}
        >
          Create Account
        </button>
      </div>
    </div>
  );
}
