import { useState } from "react";
import { useRouter } from "next/router";
import { auth, db } from "../../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import Header from "../../components/Header";
import styles from "../../styles/CreatePost.module.css";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [review, setReview] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = auth.currentUser;
      if (!user) {
        alert("You need to be logged in to create a post.");
        router.push("/login");
        return;
      }

      await addDoc(collection(db, "posts"), {
        title,
        review,
        userId: user.uid,
        authorName: user.displayName || "Anonymous User",
        timestamp: serverTimestamp(),
      });

      alert("Post created successfully!");
      router.push("/dashboard");
    } catch (error) {
      console.error("Error creating post:", error.message);
      alert("Failed to create post. Please try again.");
    }
  };

  return (
    <>
      <Header />
      <div className={styles.createPostContainer}>
        <h1 className={styles.createPostTitle}>Create a New Post</h1>
        <form onSubmit={handleSubmit} className={styles.createPostForm}>
          <input
            type="text"
            placeholder="Enter a title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={styles.postInput}
            required
          />
          <textarea
            placeholder="Write your review here"
            value={review}
            onChange={(e) => setReview(e.target.value)}
            className={styles.postTextarea}
            required
          ></textarea>
          <button type="submit" className={styles.submitButton}>
            Post
          </button>
        </form>
      </div>
    </>
  );
}
