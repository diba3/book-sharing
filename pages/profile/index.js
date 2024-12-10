import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { auth, db } from "../../firebase";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import Header from "../../components/Header";
import styles from "../../styles/Profile.module.css";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState(""); // State for user's name
  const [bio, setBio] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [posts, setPosts] = useState([]); // State for storing user posts

  const router = useRouter();

  const avatars = [
    "/avatars/avatar1.png",
    "/avatars/avatar2.png",
    "/avatars/avatar3.png",
    "/avatars/avatar4.png",
  ];

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        router.push("/login");
        return;
      }
      setUser(currentUser);
      setName(currentUser.displayName || "Anonymous User"); // Default to "Anonymous User" if no name

      try {
        // Fetch user profile
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setBio(userData.bio || "");
          setProfilePicture(userData.profilePicture || avatars[0]);
        }

        // Fetch user posts
        const postsQuery = query(
          collection(db, "posts"),
          where("userId", "==", currentUser.uid)
        );
        const querySnapshot = await getDocs(postsQuery);
        const userPosts = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPosts(userPosts);
      } catch (error) {
        console.error("Error fetching user data or posts:", error.message);
      }
    };

    fetchUserData();
  }, [router]);

  const handleDeletePost = async (postId) => {
    try {
      // Delete the post from Firestore
      await deleteDoc(doc(db, "posts", postId));

      // Update UI by filtering out the deleted post
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
      alert("Post deleted successfully!");
    } catch (error) {
      console.error("Error deleting post:", error.message);
      alert("Failed to delete post. Please try again.");
    }
  };

  const handleSaveProfile = async () => {
    try {
      if (!user || !user.uid) {
        throw new Error("User is not authenticated.");
      }

      const userDocRef = doc(db, "users", user.uid);
      console.log("Updating document at:", userDocRef.path);

      await updateDoc(userDocRef, {
        bio,
        profilePicture: selectedAvatar || profilePicture,
      });

      setProfilePicture(selectedAvatar || profilePicture);
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error.message);
      alert("Failed to update profile. Please try again.");
    }
  };

  if (!user) return null;

  return (
    <>
      <Header />
      <div className={styles.profileContainer}>
        <img
          src={profilePicture}
          alt="Profile Avatar"
          className={styles.profileAvatar}
        />
        <h1 className={styles.profileName}>{name}</h1> {/* Display user name */}
        {isEditing ? (
          <>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className={styles.bioInput}
              placeholder="Write something about yourself..."
            ></textarea>
            <div className={styles.avatarSelection}>
              {avatars.map((avatar, index) => (
                <img
                  key={index}
                  src={avatar}
                  alt={`Avatar ${index + 1}`}
                  className={`${styles.avatar} ${
                    selectedAvatar === avatar ? styles.selectedAvatar : ""
                  }`}
                  onClick={() => setSelectedAvatar(avatar)}
                />
              ))}
            </div>
            <button onClick={handleSaveProfile} className={styles.saveButton}>
              Save Profile
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className={styles.cancelButton}
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <p className={styles.profileBio}>{bio || "No bio available."}</p>
            <button
              onClick={() => setIsEditing(true)}
              className={styles.editProfileButton}
            >
              Edit Profile
            </button>
          </>
        )}
        {/* Section for User Posts */}
        <section className={styles.postsSection}>
          <h2 className={styles.postsTitle}>Your Posts</h2>
          <div className={styles.postsContainer}>
            {posts.length === 0 ? (
              <p className={styles.noPostsMessage}>
                You don’t have any posts yet!
              </p>
            ) : (
              posts.map((post) => (
                <div key={post.id} className={styles.postCard}>
                  <h3>{post.title}</h3>
                  <p>{post.review}</p>
                  <button
                    onClick={() => handleDeletePost(post.id)}
                    className={styles.deleteButton}
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </>
  );
}
