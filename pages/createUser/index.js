import { useState } from "react";
import { useRouter } from "next/router";
import { auth, db } from "../../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import styles from "../../styles/CreateUser.module.css";

export default function CreateUser() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const router = useRouter();

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Update display name
      await updateProfile(user, { displayName: name });

      // Initialize Firestore document
      await setDoc(doc(db, "users", user.uid), {
        bio: "",
        profilePicture: "/avatars/avatar1.png",
      });

      alert("Account created successfully!");
      router.push("/profile");
    } catch (error) {
      console.error("Error creating account:", error.message);
      alert("Failed to create account. Please try again.");
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSignUp} className={styles.form}>
        <h1 className={styles.title}>Create Account</h1>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={styles.input}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.input}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.input}
          required
        />
        <button type="submit" className={styles.submitButton}>
          Create Account
        </button>
        <p className={styles.alreadyHaveAccount}>
          Already have an account?{" "}
          <span onClick={() => router.push("/login")} className={styles.link}>
            Login
          </span>
        </p>
      </form>
    </div>
  );
}
