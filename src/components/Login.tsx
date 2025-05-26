import React from "react";
import { signInWithGoogle, auth } from "../firebase/config";
import { onAuthStateChanged, signOut } from "firebase/auth";

const Login: React.FC = () => {
  const [user, setUser] = React.useState(auth.currentUser);

  React.useEffect(() => {
    return onAuthStateChanged(auth, (u) => setUser(u));
  }, []);

  return (
    <div style={{ textAlign: "center", marginBottom: "1rem" }}>
      {user ? (
        <>
          <p>Signed in as {user.displayName}</p>
          <button onClick={() => signOut(auth)}>Sign Out</button>
        </>
      ) : (
        <button onClick={signInWithGoogle}>Sign in with Google</button>
      )}
    </div>
  );
};

export default Login;
