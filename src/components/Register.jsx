import { useState } from "react";
import "./Register.css";

import {
  API_KEY,
  DATABASE_URL
} from "../firebase.js";

function Register({
  onLogin,
  onBack,
  onRegisterSuccess
}) {
  const [data, setData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // =========================
  // INPUT HANDLE
  // =========================

  const handleInput = (event) => {
    setData({
      ...data,
      [event.target.name]: event.target.value
    });
  };


  // =========================
  // REGISTER
  // =========================

  const register = async () => {

    // Check empty fields
    if (
      !data.name.trim() ||
      !data.email.trim() ||
      !data.phone.trim() ||
      !data.password ||
      !data.confirmPassword
    ) {
      setMessage("Please fill all fields.");
      return;
    }

    // Password length
    if (data.password.length < 6) {
      setMessage(
        "Password must be at least 6 characters."
      );
      return;
    }

    // Confirm password
    if (
      data.password !== data.confirmPassword
    ) {
      setMessage(
        "Passwords do not match."
      );
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      // =========================
      // CREATE FIREBASE AUTH USER
      // =========================

      const response = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            email: data.email.trim(),
            password: data.password,
            returnSecureToken: true
          })
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error?.message ||
          "Registration failed."
        );
      }

      const uid = result.localId;


      // =========================
      // SAVE USER IN REALTIME DB
      // =========================

      const profileResponse = await fetch(
        `${DATABASE_URL}/users/${uid}.json?auth=${result.idToken}`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({
            uid: uid,
            name: data.name.trim(),
            email: data.email.trim(),
            phone: data.phone.trim(),
            provider: "password",
            createdAt:
              new Date().toISOString()
          })
        }
      );

      if (!profileResponse.ok) {
        throw new Error(
          "Account created but profile could not be saved."
        );
      }


      // =========================
      // SUCCESS
      // =========================

      alert("Account created successfully!");

      // Send user to parent App.jsx
      if (onRegisterSuccess) {
        onRegisterSuccess({
          uid: uid,
          email: data.email.trim(),
          name: data.name.trim(),
          phone: data.phone.trim(),
          idToken: result.idToken
        });
      } else {
        // Fallback
        onLogin();
      }

    } catch (error) {

      console.error(
        "Registration Error:",
        error
      );

      // Firebase errors ko readable banana
      let errorMessage =
        error.message;

      if (
        errorMessage ===
        "EMAIL_EXISTS"
      ) {
        errorMessage =
          "This email is already registered.";
      }

      if (
        errorMessage ===
        "INVALID_EMAIL"
      ) {
        errorMessage =
          "Please enter a valid email.";
      }

      if (
        errorMessage ===
        "WEAK_PASSWORD : Password should be at least 6 characters"
      ) {
        errorMessage =
          "Password must be at least 6 characters.";
      }

      setMessage(errorMessage);

    } finally {
      setLoading(false);
    }
  };


  // =========================
  // UI
  // =========================

  return (
    <div className="register-page">

      <div className="register-card">

        {/* Back */}

        <button
          className="back-button"
          onClick={onBack}
        >
          ← Back
        </button>


        {/* Logo */}

        <div className="register-logo">
          R
        </div>


        {/* Heading */}

        <h1>
          Create Account
        </h1>

        <p className="register-subtitle">
          Create your RAF AI account
        </p>


        {/* Error / Message */}

        {message && (
          <div className="register-message">
            {message}
          </div>
        )}


        {/* Name */}

        <div className="form-group">

          <label>
            Full Name
          </label>

          <input
            name="name"
            type="text"
            placeholder="Your name"
            value={data.name}
            onChange={handleInput}
          />

        </div>


        {/* Email */}

        <div className="form-group">

          <label>
            Email
          </label>

          <input
            name="email"
            type="email"
            placeholder="you@example.com"
            value={data.email}
            onChange={handleInput}
          />

        </div>


        {/* Phone */}

        <div className="form-group">

          <label>
            Phone Number
          </label>

          <input
            name="phone"
            type="tel"
            placeholder="9876543210"
            value={data.phone}
            onChange={handleInput}
          />

        </div>


        {/* Password */}

        <div className="form-group">

          <label>
            Password
          </label>

          <input
            name="password"
            type="password"
            placeholder="Minimum 6 characters"
            value={data.password}
            onChange={handleInput}
          />

        </div>


        {/* Confirm Password */}

        <div className="form-group">

          <label>
            Confirm Password
          </label>

          <input
            name="confirmPassword"
            type="password"
            placeholder="Repeat password"
            value={data.confirmPassword}
            onChange={handleInput}
          />

        </div>


        {/* Register */}

        <button
          className="register-button"
          onClick={register}
          disabled={loading}
        >
          {loading
            ? "Creating Account..."
            : "Create Account"}
        </button>


        {/* Login */}

        <p className="login-text">

          Already have an account?

          <button onClick={onLogin}>
            Login
          </button>

        </p>

      </div>

    </div>
  );
}

export default Register;