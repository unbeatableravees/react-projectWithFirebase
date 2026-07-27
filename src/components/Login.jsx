import { useState } from "react";
import "./Login.css";

import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";

import {
  app,
  API_KEY,
  DATABASE_URL
} from "../firebase.js";


function Login({
  onLoginSuccess,
  onRegister,
  onBack
}) {

  const auth = getAuth(app);
  const googleProvider = new GoogleAuthProvider();

  const [data, setData] = useState({
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);


  // =========================================
  // INPUT HANDLE
  // =========================================

  const handleInput = (event) => {
    setData({
      ...data,
      [event.target.name]: event.target.value
    });

    if (message) {
      setMessage("");
    }
  };


  // =========================================
  // EMAIL / PASSWORD LOGIN
  // =========================================

  const login = async () => {

    if (!data.email || !data.password) {
      setMessage("Email and password are required.");
      return;
    }

    try {

      setLoading(true);
      setMessage("");

      const response = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`,
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

        let errorMessage = "Login failed.";

        switch (result.error?.message) {

          case "EMAIL_NOT_FOUND":
          case "INVALID_LOGIN_CREDENTIALS":
            errorMessage = "Invalid email or password.";
            break;

          case "INVALID_PASSWORD":
            errorMessage = "Invalid password.";
            break;

          case "USER_DISABLED":
            errorMessage = "This account has been disabled.";
            break;

          case "TOO_MANY_ATTEMPTS_TRY_LATER":
            errorMessage =
              "Too many attempts. Please try again later.";
            break;

          default:
            errorMessage =
              result.error?.message || "Login failed.";
        }

        throw new Error(errorMessage);
      }

      const uid = result.localId;
      const idToken = result.idToken;


      // =========================================
      // GET USER PROFILE
      // =========================================

      const profileResponse = await fetch(
        `${DATABASE_URL}/users/${uid}.json?auth=${idToken}`
      );

      if (!profileResponse.ok) {
        throw new Error("Could not load user profile.");
      }

      const profile = await profileResponse.json();


      // =========================================
      // LOGIN SUCCESS
      // =========================================

      onLoginSuccess({

        uid,

        email:
          result.email ||
          data.email,

        name:
          profile?.name || "",

        phone:
          profile?.phone || "",

        idToken

      });

    } catch (error) {

      console.error("Login Error:", error);

      setMessage(
        error.message || "Something went wrong."
      );

    } finally {

      setLoading(false);

    }
  };


  // =========================================
  // GOOGLE LOGIN
  // =========================================

  const googleLogin = async () => {

    try {

      setLoading(true);
      setMessage("");


      // Open Google popup

      const result = await signInWithPopup(
        auth,
        googleProvider
      );

      const user = result.user;


      // Firebase ID Token

      const idToken =
        await user.getIdToken();


      // =========================================
      // GET PROFILE FROM RTDB
      // =========================================

      const profileResponse =
        await fetch(
          `${DATABASE_URL}/users/${user.uid}.json?auth=${idToken}`
        );


      if (!profileResponse.ok) {
        throw new Error(
          "Could not load Google profile."
        );
      }


      let profile =
        await profileResponse.json();


      // =========================================
      // CREATE PROFILE IF NOT EXISTS
      // =========================================

      if (!profile) {

        profile = {

          uid: user.uid,

          name:
            user.displayName || "",

          email:
            user.email || "",

          phone: "",

          provider: "google",

          createdAt:
            new Date().toISOString()

        };


        const saveResponse =
          await fetch(
            `${DATABASE_URL}/users/${user.uid}.json?auth=${idToken}`,
            {
              method: "PUT",

              headers: {
                "Content-Type":
                  "application/json"
              },

              body:
                JSON.stringify(profile)
            }
          );


        if (!saveResponse.ok) {

          const errorData =
            await saveResponse.json();

          throw new Error(
            errorData?.error ||
            "Google profile could not be saved."
          );
        }
      }


      // =========================================
      // LOGIN SUCCESS
      // =========================================

      onLoginSuccess({

        uid:
          user.uid,

        email:
          user.email || "",

        name:
          profile?.name ||
          user.displayName ||
          "",

        phone:
          profile?.phone || "",

        idToken

      });

    } catch (error) {

      console.error(
        "Google Login Error:",
        error
      );


      if (
        error.code ===
        "auth/popup-closed-by-user"
      ) {

        setMessage(
          "Google login was cancelled."
        );

      } else if (
        error.code ===
        "auth/popup-blocked"
      ) {

        setMessage(
          "Google popup was blocked. Please allow popups."
        );

      } else if (
        error.code ===
        "auth/cancelled-popup-request"
      ) {

        setMessage(
          "Google login request was cancelled."
        );

      } else {

        setMessage(
          error.message ||
          "Google login failed."
        );
      }

    } finally {

      setLoading(false);

    }
  };


  // =========================================
  // UI
  // =========================================

  return (

    <div className="login-page">

      <div className="login-card">


        {/* BACK */}

        <button
          className="back-button"
          onClick={onBack}
          disabled={loading}
          type="button"
        >
          <span className="back-arrow">←</span>
          Back
        </button>


        {/* LOGO */}

        <div className="login-logo">
          R
        </div>


        {/* TITLE */}

        <h1>
          Welcome Back
        </h1>

        <p className="login-subtitle">
          Login to your RAF AI account
        </p>


        {/* MESSAGE */}

        {message && (

          <div className="login-message">
            <span className="message-icon">
              !
            </span>

            <span>
              {message}
            </span>
          </div>

        )}


        {/* EMAIL */}

        <div className="form-group">

          <label htmlFor="login-email">
            Email
          </label>

          <input
            id="login-email"
            type="email"
            name="email"
            placeholder="you@example.com"
            value={data.email}
            onChange={handleInput}
            disabled={loading}
            autoComplete="email"
          />

        </div>


        {/* PASSWORD */}

        <div className="form-group">

          <label htmlFor="login-password">
            Password
          </label>

          <div className="password-wrapper">

            <input
              id="login-password"
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              name="password"
              placeholder="••••••••"
              value={data.password}
              onChange={handleInput}
              disabled={loading}
              autoComplete="current-password"
            />

            <button
              type="button"
              className="password-toggle"
              onClick={() =>
                setShowPassword(!showPassword)
              }
              disabled={loading}
              aria-label={
                showPassword
                  ? "Hide password"
                  : "Show password"
              }
            >
              {showPassword ? "Hide" : "Show"}
            </button>

          </div>

        </div>


        {/* LOGIN */}

        <button
          className="login-button"
          onClick={login}
          disabled={loading}
          type="button"
        >

          {loading ? (

            <>
              <span className="button-spinner"></span>
              Please wait...
            </>

          ) : (

            "Login"

          )}

        </button>


        {/* DIVIDER */}

        <div className="divider">
          <span>OR</span>
        </div>


        {/* GOOGLE LOGIN */}

        <button
          className="google-button"
          onClick={googleLogin}
          disabled={loading}
          type="button"
        >

          <svg
            className="google-icon"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              fill="#4285F4"
              d="M21.35 12.27c0-.77-.07-1.51-.22-2.22H12v4.2h5.23a4.47 4.47 0 0 1-1.94 2.93v2.44h3.14c1.84-1.69 2.92-4.18 2.92-7.35z"
            />

            <path
              fill="#34A853"
              d="M12 21.75c2.63 0 4.84-.87 6.45-2.37l-3.14-2.44c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.3v2.52A9.75 9.75 0 0 0 12 21.75z"
            />

            <path
              fill="#FBBC05"
              d="M6.54 13.83A5.86 5.86 0 0 1 6.23 12c0-.64.11-1.26.31-1.83V7.65H3.3A9.75 9.75 0 0 0 2.25 12c0 1.57.38 3.06 1.05 4.35l3.24-2.52z"
            />

            <path
              fill="#EA4335"
              d="M12 6.14c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.84 3.24 14.63 2.25 12 2.25a9.75 9.75 0 0 0-8.7 5.4l3.24 2.52C7.31 7.86 9.46 6.14 12 6.14z"
            />
          </svg>

          <span>
            Continue with Google
          </span>

        </button>


        {/* REGISTER */}

        <p className="register-text">

          Don't have an account?

          <button
            onClick={onRegister}
            disabled={loading}
            type="button"
          >
            Create Account
          </button>

        </p>


      </div>

    </div>

  );
}


export default Login;
