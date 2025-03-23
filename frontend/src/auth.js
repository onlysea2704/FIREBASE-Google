import React, { useState } from "react";
import { auth } from "./firebase-config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import "./Auth.css";

function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");

  const register = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: userCredential.user.uid, email, role: "user" }),
      });
      alert("Đăng ký thành công:", userCredential);
    } catch (error) {
      alert("Lỗi đăng ký:", error.message);
    }
  };

  const login = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();
      setToken(token);
      console.log("Token:", token);
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      alert(data);
    } catch (error) {
      alert("Lỗi đăng nhập:", error.message);
    }
  };

  const fetchProtectedData = async () => {

    try{
      const response = await fetch("http://localhost:5000/api/admin-data", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      alert("Dữ liệu từ Backend:\n" + JSON.stringify(data, null, 2));
    }
    catch(error) {
      alert(error);
    }
    
  };

  return (
    <div className="auth-container">
      <h2>Sign Up & Sign In</h2>
      <input
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
        className="auth-input"
      />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
        className="auth-input"
      />
      <button onClick={register} className="auth-button">Sign Up</button>
      <button onClick={login} className="auth-button">Sign In</button>
      {token && (
        <button onClick={fetchProtectedData} className="auth-button">Get Data Admin</button>
      )}
    </div>
  );
}

export default Auth;