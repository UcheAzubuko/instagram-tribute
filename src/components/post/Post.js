import React, { useState, useEffect } from "react";
import "./Post.css";
import Avatar from "@material-ui/core/Avatar";
import { db, fb } from "../../firebase/FirebaseInit";

function Post({ postId, user, username, caption, imageUrl }) {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");

  useEffect(() => {
    let unsubscribe;

    if (postId) {
      unsubscribe = db
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) => {
          setComments(snapshot.docs.map((doc) => doc.data()));
        });
    }

    return () => {
      unsubscribe();
    };
  }, [postId]);

  const postComment = (e) => {
    e.preventDefault();

    db.collection("posts").doc(postId).collection("comments").add({
      text: comment,
      username: user.displayName,
      timestamp: fb.firestore.FieldValue.serverTimestamp(),
    });

    setComment("");
  };

  return (
    <div className="post">
      <div className="post__header">
        {/* Header - avatar with username */}
        <Avatar
          className="post__avatar"
          alt={username}
          src="/static/images/avatar/1.jpg"
        />
        <h3>{username}</h3>
      </div>

      {/* Image */}
      <img className="post__image" src={imageUrl} alt="" />

      {/* Username + caption */}
      <h4 className="post__text">
        <strong>{username}</strong> {caption}
      </h4>

      {/* List of comments */}
      {
        <div className={comments.length > 0 ? "post__comments" : ""}>
          {comments.map((comment) => (
            <p>
              <strong>{comment.username}</strong> {comment.text}
            </p>
          ))}
        </div>
      }

      {/* Form for adding comments */}
      {user && (
        <form className="comment__form">
          <div className="comment__wrapper">
            <input
              className="comment__Input"
              type="text"
              placeholder="Add a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button
              className="comment__button text__button"
              disabled={!comment}
              onClick={postComment}
              type="submit"
            >
              Post
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default Post;
