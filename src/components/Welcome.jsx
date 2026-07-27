import "./Welcome.css";

function Welcome({ onLogin, onRegister }) {
  return (
    <div className="welcome-page">

      {/* Background Glow */}
      <div className="welcome-glow glow-one"></div>
      <div className="welcome-glow glow-two"></div>

      <div className="welcome-card">

        {/* Logo */}
        <div className="logo-circle">
          R
        </div>

        <p className="welcome-small">
          RAF AI
        </p>

        <h1>Welcome</h1>

        <p className="welcome-text">
          Welcome to RAF AI.
          <br />
          Login or create your account to continue.
        </p>

        <div className="welcome-buttons">

          <button
            type="button"
            className="primary-btn"
            onClick={onLogin}
          >
            Login
          </button>

          <button
            type="button"
            className="secondary-btn"
            onClick={onRegister}
          >
            Create Account
          </button>

        </div>

        <p className="welcome-footer">
          Secure • Fast • Firebase Powered
        </p>

      </div>

    </div>
  );
}

export default Welcome;