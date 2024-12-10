import { useRouter } from "next/router";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import styles from "../styles/Header.module.css";

export default function Header() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerLogo}>
        <h1 onClick={() => router.push("/dashboard")}>📚 Book Sharing Hub</h1>
      </div>
      <nav className={styles.navLinks}>
        <button
          className={styles.navButton}
          onClick={() => router.push("/dashboard")}
        >
          Dashboard
        </button>
        <button
          className={styles.navButton}
          onClick={() => router.push("/createPost")}
        >
          Create Post
        </button>
        <button
          className={styles.navButton}
          onClick={() => router.push("/profile")}
        >
          Profile
        </button>
        <button className={styles.navButton} onClick={handleLogout}>
          Log Out
        </button>
      </nav>
    </header>
  );
}
