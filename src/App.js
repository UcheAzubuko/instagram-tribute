import React, { useState, useEffect } from "react";
import Post from "./components/post/Post";
import "./App.css";
import { db, auth } from "./firebase/FirebaseInit";
import { makeStyles } from "@material-ui/core";
import Modal from "@material-ui/core/Modal";
import ImageUpload from "./components/imageUpload/ImageUpload";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles(() => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: "rgba(255,255,255,1)",
    boxShadow: 24,
    padding: "30px 60px",
    borderRadius: "12px",
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [posts, setPosts] = useState([]);
  const [openSignup, setOpenSignup] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // create state to keep track of user
  const [user, setUser] = useState(null);

  // For authentication - Signup
  useEffect(() => {
    // listens to auth-based changes
    auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // user has logged in
        console.log(authUser);
        setUser(authUser);
        // function to keep the user logged in
      } else {
        // user has logged out

        setUser(null);
      }
    });
  }, [user, username]);

  useEffect(() => {
    db.collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        // Everytime a new snapshot is noted (i.e. changes are made to posts in the database), this piece of code is fired
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            post: doc.data(),
          }))
        );
      });
  }, []);

  const signUp = (e) => {
    e.preventDefault();

    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username,
        });
      })
      .catch((err) => alert(err.message));

    setOpenSignup(false);
    setUsername("");
    setEmail("");
    setPassword("");
  };

  const login = (e) => {
    e.preventDefault();

    auth
      .signInWithEmailAndPassword(email, password)
      .catch((err) => alert(err.message));

    setOpenLogin(false);
    setEmail("");
    setPassword("");
  };

  return (
    <div className="app">
      <Modal open={openSignup} onClose={() => setOpenSignup(false)}>
        <div style={modalStyle} className={classes.paper}>
          <center>
            <img
              src="	https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
              alt="Instagram original logo"
            />
          </center>
          <form className="app__signUp">
            <input
              placeholder="Username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              placeholder="Email address"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="primary__button" type="submit" onClick={signUp}>
              Sign up
            </button>
          </form>

          <center className="authFooter">
            <small>
              &copy; 2021 Instagram Tribute by{" "}
              <a href="mailto:azubukouche@yahoo.com"> Uche Azubuko</a>
            </small>
          </center>
        </div>
      </Modal>

      {/* Change modal open to be determined by openLogin */}
      <Modal open={openLogin} onClose={() => setOpenLogin(false)}>
        <div style={modalStyle} className={classes.paper}>
          <center>
            <img
              src="	https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
              alt="Instagram original logo"
            />
          </center>
          <form className="app__signUp">
            <input
              placeholder="Email address"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="primary__button" type="submit" onClick={login}>
              Log in
            </button>
          </form>

          <center className="authFooter">
            <small>
              &copy; 2021 Instagram Tribute by{" "}
              <a href="mailto:azubukouche@yahoo.com"> Uche Azubuko</a>
            </small>
          </center>
        </div>
      </Modal>

      <div className="app__header">
        <div className="app__headerWrapper">
          <img
            src="	https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
            alt="Instagram original logo"
          />
          {user ? (
            <button className="text__button" onClick={() => auth.signOut()}>
              Logout
            </button>
          ) : (
            <div className="app__headerButtons">
              <button
                className="primary__button"
                onClick={() => setOpenLogin(true) || setOpenSignup(false)}
              >
                Log in
              </button>
              <button
                className="text__button"
                onClick={() => setOpenSignup(true) || setOpenLogin(false)}
              >
                Sign up
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="timeline">
        {user && <ImageUpload user={user} />}

        {posts.map(({ id, post }) => (
          <Post
            key={id}
            postId={id}
            user={user} // To pass current user to add current user when adding comment
            username={post.username}
            caption={post.caption}
            imageUrl={post.imageUrl}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
