import { useState } from "react";
import "./Dashboard.css";

function Dashboard({ user, onLogout }) {
  const [activePage, setActivePage] = useState("overview");

  // =========================
  // TODO DATA
  // =========================

  const [todos, setTodos] = useState([
    {
      id: 1,
      title: "Complete Firebase project",
      category: "Development",
      priority: "High",
      completed: false
    },
    {
      id: 2,
      title: "Design dashboard",
      category: "Design",
      priority: "Medium",
      completed: true
    },
    {
      id: 3,
      title: "Update user profile",
      category: "Personal",
      priority: "Low",
      completed: false
    },
    {
      id: 4,
      title: "Test Google Login",
      category: "Testing",
      priority: "High",
      completed: false
    }
  ]);

  const [newTodo, setNewTodo] = useState("");

  // =========================
  // PROFILE
  // =========================

  const [profile, setProfile] = useState({
    name: user?.name || "RAF User",
    email: user?.email || "user@example.com",
    phone: user?.phone || ""
  });

  const [message, setMessage] = useState("");

  // =========================
  // CONTACT
  // =========================

  const [contact, setContact] = useState({
    name: user?.name || "",
    email: user?.email || "",
    message: ""
  });

  const [contactSent, setContactSent] = useState(false);

  // =========================
  // NAVIGATION
  // =========================

  const changePage = (page) => {
    setActivePage(page);

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  // =========================
  // TODO FUNCTIONS
  // =========================

  const addTodo = () => {
    if (!newTodo.trim()) return;

    const todo = {
      id: Date.now(),
      title: newTodo.trim(),
      category: "General",
      priority: "Medium",
      completed: false
    };

    setTodos((prev) => [...prev, todo]);
    setNewTodo("");
  };

  const toggleTodo = (id) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id
          ? {
              ...todo,
              completed: !todo.completed
            }
          : todo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos((prev) =>
      prev.filter((todo) => todo.id !== id)
    );
  };

  // =========================
  // PROFILE UPDATE
  // =========================

  const updateProfile = () => {
    setMessage("Profile updated successfully!");

    setTimeout(() => {
      setMessage("");
    }, 2500);
  };

  // =========================
  // CONTACT
  // =========================

  const handleContactInput = (e) => {
    setContact((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));

    setContactSent(false);
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();

    if (
      !contact.name.trim() ||
      !contact.email.trim() ||
      !contact.message.trim()
    ) {
      alert("Please fill all fields.");
      return;
    }

    setContactSent(true);

    setContact((prev) => ({
      ...prev,
      message: ""
    }));
  };

  // =========================
  // STATS
  // =========================

  const completedTodos = todos.filter(
    (todo) => todo.completed
  ).length;

  const pendingTodos = todos.filter(
    (todo) => !todo.completed
  ).length;

  const completionPercentage = todos.length
    ? Math.round(
        (completedTodos / todos.length) * 100
      )
    : 0;

  // =========================
  // NAVIGATION
  // =========================

  const navigation = [
    {
      id: "overview",
      icon: "⌂",
      label: "Overview"
    },
    {
      id: "tasks",
      icon: "✓",
      label: "Tasks"
    },
    {
      id: "profile",
      icon: "♙",
      label: "Profile"
    },
    {
      id: "analytics",
      icon: "▥",
      label: "Analytics"
    },
    {
      id: "about",
      icon: "ⓘ",
      label: "About"
    },
    {
      id: "contact",
      icon: "✉",
      label: "Contact"
    },
    {
      id: "settings",
      icon: "⚙",
      label: "Settings"
    }
  ];

  // =========================
  // PAGE TITLE
  // =========================

  const getPageTitle = () => {
    const titles = {
      overview: "Dashboard",
      tasks: "My Tasks",
      profile: "My Profile",
      analytics: "Analytics",
      about: "About RAF AI",
      contact: "Contact Us",
      settings: "Settings"
    };

    return titles[activePage] || "Dashboard";
  };

  return (
    <div className="dashboard">

      {/* =====================================
          SIDEBAR
      ===================================== */}

      <aside className="dashboard-sidebar">

        <div className="brand">
          <div className="brand-logo">
            R
          </div>

          <div className="brand-text">
            <strong>RAF AI</strong>
            <span>Dashboard</span>
          </div>
        </div>

        <nav className="sidebar-nav">

          <p className="nav-title">
            MAIN MENU
          </p>

          {navigation.map((item) => (
            <button
              key={item.id}
              className={
                activePage === item.id
                  ? "nav-item active"
                  : "nav-item"
              }
              onClick={() => changePage(item.id)}
            >
              <span className="nav-icon">
                {item.icon}
              </span>

              <span>
                {item.label}
              </span>
            </button>
          ))}

        </nav>

        <div className="sidebar-bottom">

          <div className="sidebar-user">

            <div className="sidebar-avatar">
              {profile.name
                ? profile.name.charAt(0).toUpperCase()
                : "R"}
            </div>

            <div>
              <strong>{profile.name}</strong>
              <span>{profile.email}</span>
            </div>

          </div>

          <button
            className="logout-button"
            onClick={onLogout}
          >
            <span>↪</span>
            Logout
          </button>

        </div>

      </aside>

      {/* =====================================
          MAIN
      ===================================== */}

      <main className="dashboard-main">

        {/* =====================================
            TOPBAR
        ===================================== */}

        <header className="dashboard-topbar">

          <div className="topbar-title">
            <h1>{getPageTitle()}</h1>

            <p>
              Welcome back, {profile.name}
            </p>
          </div>

          <div className="topbar-right">

            <button
              className="notification-button"
              onClick={() =>
                alert("You have 3 new notifications")
              }
              title="Notifications"
            >
              🔔
              <span className="notification-dot"></span>
            </button>

            <div className="user-mini">

              <div className="avatar">
                {profile.name
                  ? profile.name.charAt(0).toUpperCase()
                  : "R"}
              </div>

              <div className="user-mini-info">
                <strong>
                  {profile.name}
                </strong>

                <span>
                  {profile.email}
                </span>
              </div>

            </div>

          </div>

        </header>


        {/* =====================================
            OVERVIEW
        ===================================== */}

        {activePage === "overview" && (
          <section className="dashboard-content">

            <div className="welcome-banner">

              <div>
                <span className="welcome-label">
                  ✨ Welcome back
                </span>

                <h2>
                  Hello,{" "}
                  <span>{profile.name}</span> 👋
                </h2>

                <p>
                  Manage your tasks, profile and
                  RAF AI project from one place.
                </p>
              </div>

              <div className="welcome-art">
                ✦
              </div>

            </div>


            {/* STATS */}

            <div className="stats-grid">

              <div className="stat-card">

                <div className="stat-icon purple">
                  👥
                </div>

                <div>
                  <span>Total Users</span>
                  <strong>1,284</strong>
                  <small>+12.5% this month</small>
                </div>

              </div>


              <div className="stat-card">

                <div className="stat-icon blue">
                  ✓
                </div>

                <div>
                  <span>Completed Tasks</span>
                  <strong>{completedTodos}</strong>
                  <small>
                    {completionPercentage}% completed
                  </small>
                </div>

              </div>


              <div className="stat-card">

                <div className="stat-icon green">
                  ◉
                </div>

                <div>
                  <span>Active Projects</span>
                  <strong>24</strong>
                  <small>4 due this week</small>
                </div>

              </div>


              <div className="stat-card">

                <div className="stat-icon orange">
                  ★
                </div>

                <div>
                  <span>Productivity</span>
                  <strong>87%</strong>
                  <small>+5.4% improvement</small>
                </div>

              </div>

            </div>


            {/* MAIN GRID */}

            <div className="dashboard-grid">

              {/* QUICK TASKS */}

              <div className="dashboard-panel todo-panel">

                <div className="panel-header">

                  <div>
                    <h2>Quick Tasks</h2>

                    <p>
                      Manage your daily tasks
                    </p>
                  </div>

                  <button
                    className="text-button"
                    onClick={() =>
                      changePage("tasks")
                    }
                  >
                    View All →
                  </button>

                </div>


                <div className="todo-input">

                  <input
                    type="text"
                    placeholder="Add a new task..."
                    value={newTodo}
                    onChange={(e) =>
                      setNewTodo(e.target.value)
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        addTodo();
                      }
                    }}
                  />

                  <button onClick={addTodo}>
                    +
                  </button>

                </div>


                <div className="todo-list">

                  {todos.slice(0, 5).map((todo) => (

                    <div
                      className={
                        todo.completed
                          ? "todo-item completed"
                          : "todo-item"
                      }
                      key={todo.id}
                    >

                      <button
                        className="check-button"
                        onClick={() =>
                          toggleTodo(todo.id)
                        }
                      >
                        {todo.completed ? "✓" : ""}
                      </button>

                      <div className="todo-info">

                        <strong>
                          {todo.title}
                        </strong>

                        <span>
                          {todo.category}
                        </span>

                      </div>

                      <span
                        className={`priority ${todo.priority.toLowerCase()}`}
                      >
                        {todo.priority}
                      </span>

                      <button
                        className="delete-todo"
                        onClick={() =>
                          deleteTodo(todo.id)
                        }
                      >
                        ×
                      </button>

                    </div>

                  ))}

                </div>

              </div>


              {/* ACTIVITY */}

              <div className="dashboard-panel">

                <div className="panel-header">

                  <div>
                    <h2>Recent Activity</h2>

                    <p>
                      Latest account activity
                    </p>
                  </div>

                </div>


                <div className="activity-list">

                  <div className="activity">

                    <div className="activity-icon purple">
                      ✓
                    </div>

                    <div>
                      <strong>
                        Profile updated
                      </strong>

                      <span>
                        Your profile was updated
                      </span>

                      <small>
                        10 minutes ago
                      </small>
                    </div>

                  </div>


                  <div className="activity">

                    <div className="activity-icon blue">
                      🔐
                    </div>

                    <div>
                      <strong>
                        Successful login
                      </strong>

                      <span>
                        New login from Chrome
                      </span>

                      <small>
                        35 minutes ago
                      </small>
                    </div>

                  </div>


                  <div className="activity">

                    <div className="activity-icon green">
                      ☁
                    </div>

                    <div>
                      <strong>
                        Database synced
                      </strong>

                      <span>
                        Firebase data synchronized
                      </span>

                      <small>
                        1 hour ago
                      </small>
                    </div>

                  </div>


                  <div className="activity">

                    <div className="activity-icon orange">
                      ★
                    </div>

                    <div>
                      <strong>
                        RAF AI Dashboard
                      </strong>

                      <span>
                        Project is running successfully
                      </span>

                      <small>
                        2 hours ago
                      </small>
                    </div>

                  </div>

                </div>

              </div>

            </div>


            {/* BOTTOM CARDS */}

            <div className="bottom-grid">

              <div className="info-card">

                <span>Tasks Completed</span>

                <strong>
                  {completedTodos}/{todos.length}
                </strong>

                <div className="progress">

                  <div
                    style={{
                      width: `${completionPercentage}%`
                    }}
                  ></div>

                </div>

                <small>
                  Keep going! You're doing great.
                </small>

              </div>


              <div className="info-card">

                <span>Pending Tasks</span>

                <strong>
                  {pendingTodos}
                </strong>

                <small>
                  Tasks waiting for completion
                </small>

              </div>


              <div className="info-card">

                <span>Account Status</span>

                <strong className="online">
                  ● Active
                </strong>

                <small>
                  Your account is active
                </small>

              </div>

            </div>

          </section>
        )}


        {/* =====================================
            TASKS
        ===================================== */}

        {activePage === "tasks" && (
          <section className="page-section">

            <div className="section-heading">

              <div>
                <span className="section-label">
                  TASK MANAGEMENT
                </span>

                <h2>Task Manager</h2>

                <p>
                  Create and manage your daily tasks.
                </p>
              </div>

              <span className="task-count">
                {todos.length} Tasks
              </span>

            </div>


            <div className="big-todo-input">

              <input
                type="text"
                placeholder="What needs to be done?"
                value={newTodo}
                onChange={(e) =>
                  setNewTodo(e.target.value)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    addTodo();
                  }
                }}
              />

              <button onClick={addTodo}>
                + Add Task
              </button>

            </div>


            <div className="full-task-list">

              {todos.length === 0 ? (

                <div className="empty-state">
                  <div>✓</div>
                  <h3>No tasks yet</h3>
                  <p>
                    Add your first task above.
                  </p>
                </div>

              ) : (

                todos.map((todo) => (

                  <div
                    className={
                      todo.completed
                        ? "full-task completed"
                        : "full-task"
                    }
                    key={todo.id}
                  >

                    <button
                      className="check-button"
                      onClick={() =>
                        toggleTodo(todo.id)
                      }
                    >
                      {todo.completed ? "✓" : ""}
                    </button>

                    <div className="full-task-info">

                      <strong>
                        {todo.title}
                      </strong>

                      <span>
                        Category: {todo.category}
                      </span>

                    </div>

                    <span
                      className={`priority ${todo.priority.toLowerCase()}`}
                    >
                      {todo.priority}
                    </span>

                    <button
                      className="delete-button"
                      onClick={() =>
                        deleteTodo(todo.id)
                      }
                    >
                      Delete
                    </button>

                  </div>

                ))

              )}

            </div>

          </section>
        )}


        {/* =====================================
            PROFILE
        ===================================== */}

        {activePage === "profile" && (
          <section className="page-section">

            <div className="profile-header">

              <div className="large-avatar">
                {profile.name
                  ? profile.name.charAt(0).toUpperCase()
                  : "R"}
              </div>

              <div>
                <span className="section-label">
                  ACCOUNT
                </span>

                <h2>
                  {profile.name}
                </h2>

                <p>
                  {profile.email}
                </p>
              </div>

            </div>


            {message && (
              <div className="success-message">
                ✓ {message}
              </div>
            )}


            <div className="form-card">

              <div className="form-card-header">
                <div>
                  <span className="section-label">
                    PROFILE SETTINGS
                  </span>

                  <h2>
                    Personal Information
                  </h2>
                </div>
              </div>


              <div className="profile-form">

                <label>
                  Full Name

                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        name: e.target.value
                      })
                    }
                  />
                </label>


                <label>
                  Email

                  <input
                    type="email"
                    value={profile.email}
                    disabled
                  />
                </label>


                <label>
                  Phone

                  <input
                    type="tel"
                    placeholder="+91 XXXXX XXXXX"
                    value={profile.phone}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        phone: e.target.value
                      })
                    }
                  />
                </label>

              </div>


              <button
                className="save-button"
                onClick={updateProfile}
              >
                Save Changes →
              </button>

            </div>

          </section>
        )}


        {/* =====================================
            ANALYTICS
        ===================================== */}

        {activePage === "analytics" && (
          <section className="page-section">

            <div className="analytics-header">

              <span className="section-label">
                PERFORMANCE
              </span>

              <h2>Analytics Overview</h2>

              <p>
                Your application performance overview.
              </p>

            </div>


            <div className="analytics-grid">

              <div className="analytics-card">
                <span>Monthly Users</span>
                <strong>12,849</strong>
                <b>+18.4%</b>
              </div>

              <div className="analytics-card">
                <span>Sessions</span>
                <strong>38,291</strong>
                <b>+12.7%</b>
              </div>

              <div className="analytics-card">
                <span>Conversion</span>
                <strong>68.4%</strong>
                <b>+7.2%</b>
              </div>

              <div className="analytics-card">
                <span>Performance</span>
                <strong>94.8%</strong>
                <b>+4.1%</b>
              </div>

            </div>


            <div className="chart-card">

              <div className="panel-header">

                <div>
                  <h2>Weekly Activity</h2>

                  <p>
                    User activity for the last 7 days
                  </p>
                </div>

              </div>


              <div className="fake-chart">

                <div style={{ height: "35%" }}>
                  <span>Mon</span>
                </div>

                <div style={{ height: "60%" }}>
                  <span>Tue</span>
                </div>

                <div style={{ height: "45%" }}>
                  <span>Wed</span>
                </div>

                <div style={{ height: "80%" }}>
                  <span>Thu</span>
                </div>

                <div style={{ height: "65%" }}>
                  <span>Fri</span>
                </div>

                <div style={{ height: "90%" }}>
                  <span>Sat</span>
                </div>

                <div style={{ height: "75%" }}>
                  <span>Sun</span>
                </div>

              </div>

            </div>

          </section>
        )}


        {/* =====================================
            ABOUT
        ===================================== */}

        {activePage === "about" && (
          <section className="page-section">

            <div className="about-hero">

              <span className="welcome-label">
                📚 ABOUT THE PROJECT
              </span>

              <h2>
                About <span>RAF AI</span>
              </h2>

              <p>
                RAF AI is a modern React-based web
                application created to demonstrate
                authentication, user management,
                database integration and a responsive
                dashboard interface.
              </p>

            </div>


            <div className="content-card about-card">

              <span className="section-label">
                THE PROJECT
              </span>

              <h2>
                How was this project built?
              </h2>

              <p>
                This project is built using modern web
                technologies. The frontend is developed
                with React and Vite, while Firebase services
                are used for authentication and cloud data
                management.
              </p>

              <p>
                The application is separated into reusable
                React components so that every part of the
                application can be maintained independently.
              </p>

            </div>


            <div className="tech-grid">

              <div className="tech-card">
                <div className="tech-number">01</div>
                <h3>React</h3>
                <p>
                  React is used to build the user interface
                  with reusable components and state
                  management.
                </p>
              </div>

              <div className="tech-card">
                <div className="tech-number">02</div>
                <h3>Vite</h3>
                <p>
                  Vite provides a fast development server
                  and production build system.
                </p>
              </div>

              <div className="tech-card">
                <div className="tech-number">03</div>
                <h3>Firebase Authentication</h3>
                <p>
                  Firebase Authentication handles email,
                  password and Google authentication.
                </p>
              </div>

              <div className="tech-card">
                <div className="tech-number">04</div>
                <h3>Realtime Database</h3>
                <p>
                  Firebase Realtime Database stores user
                  profile information and application data.
                </p>
              </div>

              <div className="tech-card">
                <div className="tech-number">05</div>
                <h3>JavaScript</h3>
                <p>
                  JavaScript powers application logic,
                  events, API requests and dynamic content.
                </p>
              </div>

              <div className="tech-card">
                <div className="tech-number">06</div>
                <h3>CSS</h3>
                <p>
                  Custom CSS provides responsive layouts,
                  cards, navigation, buttons and animations.
                </p>
              </div>

            </div>


            <div className="content-card">

              <span className="section-label">
                FEATURES
              </span>

              <h2>
                Project Features
              </h2>

              <div className="feature-list">

                <div>
                  <span>✓</span>
                  <p>Responsive dashboard</p>
                </div>

                <div>
                  <span>✓</span>
                  <p>Email and password authentication</p>
                </div>

                <div>
                  <span>✓</span>
                  <p>Google authentication</p>
                </div>

                <div>
                  <span>✓</span>
                  <p>User profile management</p>
                </div>

                <div>
                  <span>✓</span>
                  <p>Firebase Realtime Database integration</p>
                </div>

                <div>
                  <span>✓</span>
                  <p>Task manager and todo system</p>
                </div>

                <div>
                  <span>✓</span>
                  <p>Analytics dashboard</p>
                </div>

                <div>
                  <span>✓</span>
                  <p>Contact form interface</p>
                </div>

              </div>

            </div>

          </section>
        )}


        {/* =====================================
            CONTACT
        ===================================== */}

        {activePage === "contact" && (
          <section className="page-section">

            <div className="about-hero">

              <span className="welcome-label">
                💬 GET IN TOUCH
              </span>

              <h2>
                Contact <span>Us</span>
              </h2>

              <p>
                Have a question, suggestion or feedback?
                Send us a message using the form below.
              </p>

            </div>


            <div className="contact-layout">

              <div className="contact-info">

                <div className="contact-info-card">

                  <div className="contact-icon">
                    📧
                  </div>

                  <h3>Email</h3>

                  <p>
                    raveeskak@gmail.com
                  </p>

                </div>


                <div className="contact-info-card">

                  <div className="contact-icon">
                    ⚡
                  </div>

                  <h3>Response</h3>

                  <p>
                    We will try to respond as soon
                    as possible.
                  </p>

                </div>


                <div className="contact-info-card">

                  <div className="contact-icon">
                    🌎
                  </div>

                  <h3>Available</h3>

                  <p>
                    Available online for questions
                    and feedback.
                  </p>

                </div>

              </div>


              <div className="content-card contact-form-card">

                <span className="section-label">
                  MESSAGE
                </span>

                <h2>
                  Send a Message
                </h2>


                {contactSent && (
                  <div className="success-message">
                    ✓ Your message has been submitted.
                  </div>
                )}


                <form onSubmit={handleContactSubmit}>

                  <div className="form-row">

                    <div className="form-field">

                      <label>
                        Name
                      </label>

                      <input
                        name="name"
                        type="text"
                        placeholder="Your name"
                        value={contact.name}
                        onChange={handleContactInput}
                      />

                    </div>


                    <div className="form-field">

                      <label>
                        Email
                      </label>

                      <input
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        value={contact.email}
                        onChange={handleContactInput}
                      />

                    </div>

                  </div>


                  <div className="form-field">

                    <label>
                      Message
                    </label>

                    <textarea
                      name="message"
                      rows="7"
                      placeholder="Write your message..."
                      value={contact.message}
                      onChange={handleContactInput}
                    />

                  </div>


                  <button
                    type="submit"
                    className="send-button"
                  >
                    Send Message →
                  </button>

                </form>

              </div>

            </div>

          </section>
        )}


        {/* =====================================
            SETTINGS
        ===================================== */}

        {activePage === "settings" && (
          <section className="page-section">

            <div className="section-heading">

              <div>

                <span className="section-label">
                  PREFERENCES
                </span>

                <h2>
                  Settings
                </h2>

                <p>
                  Manage your dashboard preferences.
                </p>

              </div>

            </div>


            <div className="settings-card">

              <div className="setting-row">

                <div>
                  <strong>
                    Email Notifications
                  </strong>

                  <span>
                    Receive notifications about your account
                  </span>
                </div>

                <input
                  type="checkbox"
                  defaultChecked
                />

              </div>


              <div className="setting-row">

                <div>
                  <strong>
                    Activity Alerts
                  </strong>

                  <span>
                    Get alerts about new account activity
                  </span>
                </div>

                <input
                  type="checkbox"
                  defaultChecked
                />

              </div>


              <div className="setting-row">

                <div>
                  <strong>
                    Auto Sync
                  </strong>

                  <span>
                    Automatically synchronize data
                  </span>
                </div>

                <input
                  type="checkbox"
                  defaultChecked
                />

              </div>

            </div>

          </section>
        )}

      </main>

    </div>
  );
}

export default Dashboard;