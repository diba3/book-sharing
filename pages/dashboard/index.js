import { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../../firebase";
import Header from "../../components/Header";
import styles from "../../styles/Dashboard.module.css";

export default function Dashboard() {
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPosts, setFilteredPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsQuery = query(
          collection(db, "posts"),
          orderBy("timestamp", "desc")
        );
        const querySnapshot = await getDocs(postsQuery);
        const fetchedPosts = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp?.toDate() || new Date(),
        }));
        setPosts(fetchedPosts);
        setFilteredPosts(fetchedPosts);
      } catch (error) {
        console.error("Error fetching posts:", error.message);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    const filtered = posts.filter((post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredPosts(filtered);
  }, [searchQuery, posts]);

  const formatDate = (date) => {
    if (!date || !(date instanceof Date)) {
      return "Unknown Date";
    }
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <>
      <Header />
      <main className={styles.dashboardContainer}>
        <h1 className={styles.dashboardTitle}>Welcome to Your Dashboard</h1>
        <input
          type="text"
          placeholder="Search posts by title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchBar}
        />
        <div className={styles.posts}>
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <div key={post.id} className={styles.postCard}>
                <h3 className={styles.postTitle}>{post.title}</h3>
                <p className={styles.postContent}>{post.review}</p>
                <span className={styles.postAuthor}>
                  By: {post.authorName || "Anonymous"}
                </span>
                <small className={styles.postDate}>
                  Posted on: {formatDate(post.timestamp)}
                </small>
              </div>
            ))
          ) : (
            <p>No posts match your search.</p>
          )}
        </div>
      </main>
    </>
  );
}
