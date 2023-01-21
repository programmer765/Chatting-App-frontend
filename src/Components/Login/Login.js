import { Button } from "@mui/material";
import React from "react";
import { useDataLayerValue } from "../../DataLayer/DataLayer";
import { auth, provider } from "../../Firebase/firebase";
import "./login.css";

function Login() {
  // eslint-disable-next-line
  const [{}, dispatch] = useDataLayerValue();
  const signIn = () => {
    auth
      .signInWithPopup(provider)
      .then((result) => {
        dispatch({
          type: "SET_USER",
          user: result.user._delegate,
          uid: result.user._delegate.uid,
        });
        // console.log(result.user._delegate);
      })
      .catch((error) => alert(error.message));
  };

  return (
    <div className="login">
      <div className="login_container">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
          alt=""
        />
        <div className="login_text">
          <h1>Sign in to whatsapp</h1>
        </div>
        <Button onClick={signIn}>Sign In With Google</Button>
      </div>
    </div>
  );
}

export default Login;
