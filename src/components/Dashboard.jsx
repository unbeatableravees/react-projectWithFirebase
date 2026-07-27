import { useEffect, useMemo, useState } from "react";
import "./Dashboard.css";

function Dashboard({ user, onLogout }) {
  const [activePage, setActivePage] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
    },
    {
      id: 5,
      title: "Prepare project README",
      category: "Documentation",
      priority: "Medium",
      completed: false
    },
    {
      id: 6,
      title: "Review UI animations",
      category: "Design",
      priority: "Low",
      completed: true
    }
  ]);

  const [newTodo, setNewTodo] = useState("");

  // =========================
  // PROFILE
  // =========================

  const [profile, setProfile] = useState({
    name: user?.name || "RAF User",
    email: user?.email || "user@example.com",
    phone: user?.phone || "+91 9876543210"
  });

  const [message, setMessage] = useState("");

  // =========================
  // TIMER
  // =========================

  const [timerMinutes, setTimerMinutes] = useState(25);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerMode, setTimerMode] = useState("Focus");

  // =========================
  // CLOCK
  // =========================

  const [currentTime, setCurrentTime] = useState(new Date());

  // =========================
  // NOTES
  // =========================

  const [notes, setNotes] = useState(
    "Remember to review Firebase rules and test Google authentication before deployment."
  );

  const [notesSaved, setNotesSaved] = useState(false);

  // =========================
  // SETTINGS
  // =========================

  const [settings, setSettings] = useState({
    emailNotifications: true,
    activityAlerts: true,
    autoSync: true
  });

  // =========================
  // EXTRA DASHBOARD DATA
  // =========================

  const demoStats = {
    users: "1,284",
    projects: "24",
    productivity: "87%",
    sessions: "38,291",
    conversion: "68.4%",
    performance: "94.8%"
  };

  const weeklyData = [
    { day: "Mon", value: 35 },
    { day: "Tue", value: 60 },
    { day: "Wed", value: 45 },
    { day: "Thu", value: 80 },
    { day: "Fri", value: 65 },
    { day: "Sat", value: 90 },
    { day: "Sun", value: 75 }
  ];

  // =========================
  // ADD TODO
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

    setTodos((current) => [...current, todo]);
    setNewTodo("");
  };

  // =========================
  // COMPLETE TODO
  // =========================

  const toggleTodo = (id) => {
    setTodos((current) =>
      current.map((todo) =>
        todo.id === id
          ? {
              ...todo,
              completed: !todo.completed
            }
          : todo
      )
    );
  };

  // =========================
  // DELETE TODO
  // =========================

  const deleteTodo = (id) => {
    setTodos((current) =>
      current.filter((todo) => todo.id !== id)
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
  // TODO STATS
  // =========================

  const completedTodos = todos.filter(
    (todo) => todo.completed
  ).length;

  const pendingTodos = todos.filter(
    (todo) => !todo.completed
  ).length;

  const completionRate = todos.length
    ? Math.round((completedTodos / todos.length) * 100)
    : 0;

  // =========================
  // TIMER FORMAT
  // =========================

  const formattedTimer = `${String(timerMinutes).padStart(
    2,
    "0"
  )}:${String(timerSeconds).padStart(2, "0")}`;

  // =========================
  // TIMER EFFECT
  // =========================

  useEffect(() => {
    if (!timerRunning) return;

    const interval = setInterval(() => {
      setTimerSeconds((seconds) => {
        if (seconds > 0) {
          return seconds - 1;
        }

        setTimerMinutes((minutes) => {
          if (minutes > 0) {
            return minutes - 1;
          }

          setTimerRunning(false);

          if (typeof window !== "undefined") {
            if ("Notification" in window) {
              if (Notification.permission === "granted") {
                new Notification("RAF AI Timer", {
                  body: `${timerMode} session completed!`
                });
              }
            }
          }

          return 0;
        });

        return 59;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timerRunning, timerMode]);

  // =========================
  // CLOCK EFFECT
  // =========================

  useEffect(() => {
    const clock = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(clock);
  }, []);

  // =========================
  // REQUEST NOTIFICATION
  // =========================

  const requestNotificationPermission = async () => {
    if (
      typeof window !== "undefined" &&
      "Notification" in window &&
      Notification.permission === "default"
    ) {
      await Notification.requestPermission();
    }
  };

  // =========================
  // TIMER CONTROLS
  // =========================

  const startTimer = async () => {
    await requestNotificationPermission();
    setTimerRunning(true);
  };

  const pauseTimer = () => {
    setTimerRunning(false);
  };

  const resetTimer = () => {
    setTimerRunning(false);

    if (timerMode === "Focus") {
      setTimerMinutes(25);
    } else if (timerMode === "Short Break") {
      setTimerMinutes(5);
    } else {
      setTimerMinutes(15);
    }

    setTimerSeconds(0);
  };

  const addTimerMinutes = (amount) => {
    setTimerMinutes((minutes) => minutes + amount);
  };

  const changeTimerMode = (mode) => {
    setTimerMode(mode);
    setTimerRunning(false);
    setTimerSeconds(0);

    if (mode === "Focus") {
      setTimerMinutes(25);
    }

    if (mode === "Short Break") {
      setTimerMinutes(5);
    }

    if (mode === "Long Break") {
      setTimerMinutes(15);
    }
  };

  // =========================
  // SAVE NOTES
  // =========================

  const saveNotes = () => {
    setNotesSaved(true);

    setTimeout(() => {
      setNotesSaved(false);
    }, 2000);
  };

  // =========================
  // SETTINGS
  // =========================

  const toggleSetting = (key) => {
    setSettings((current) => ({
      ...current,
      [key]: !current[key]
    }));
  };

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
      id: "settings",
      icon: "⚙",
      label: "Settings"
    }
  ];

  const pageTitles = {
    overview: "Dashboard",
    tasks: "My Tasks",
    profile: "My Profile",
    analytics: "Analytics",
    settings: "Settings"
  };

  const changePage = (page) => {
    setActivePage(page);
    setSidebarOpen(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  // =========================
  // DATE
  // =========================

  const formattedDate = useMemo(() => {
    return currentTime.toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  }, [currentTime]);

  const formattedClock = useMemo(() => {
    return currentTime.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
  }, [currentTime]);

  return (
    <div className="dashboard">

      {/* MOBILE OVERLAY */}

      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* =========================
          SIDEBAR
      ========================= */}

      <aside
        className={
          sidebarOpen
            ? "dashboard-sidebar open"
            : "dashboard-sidebar"
        }
      >

        <div className="brand">

          <div className="brand-logo">
            R
          </div>

          <div>
            <strong>RAF AI</strong>
            <span>Smart Workspace</span>
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

        {/* SIDEBAR INFO */}

        <div className="sidebar-mini-card">

          <div className="mini-card-icon">
            ⚡
          </div>

          <div>
            <strong>Productivity</strong>
            <span>87% this week</span>
          </div>

        </div>

        <div className="sidebar-bottom">

          <div className="sidebar-user">

            <div className="avatar small">
              {profile.name
                ? profile.name.charAt(0).toUpperCase()
                : "R"}
            </div>

            <div>
              <strong>
                {profile.name}
              </strong>

              <span>
                {profile.email}
              </span>
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

      {/* =========================
          MAIN
      ========================= */}

      <main className="dashboard-main">

        {/* TOPBAR */}

        <header className="dashboard-topbar">

          <div className="mobile-menu-area">

            <button
              className="mobile-menu"
              onClick={() =>
                setSidebarOpen(!sidebarOpen)
              }
            >
              ☰
            </button>

          </div>

          <div className="topbar-title">

            <div className="breadcrumb">
              RAF AI
              <span>/</span>
              {pageTitles[activePage]}
            </div>

            <h1>
              {pageTitles[activePage]}
            </h1>

            <p>
              Welcome back, {profile.name}
            </p>

          </div>

          <div className="topbar-right">

            <div className="live-clock">
              <span>● Live</span>
              <strong>{formattedClock}</strong>
            </div>

            <button
              className="notification-button"
              onClick={() =>
                alert("You have 3 new notifications")
              }
              aria-label="Notifications"
            >
              🔔
              <span className="notification-dot"></span>
            </button>

            <div className="user-mini">

              <div className="avatar">
                {profile.name
                  ? profile.name
                      .charAt(0)
                      .toUpperCase()
                  : "R"}
              </div>

              <div>
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

        {/* =========================
            OVERVIEW
        ========================= */}

        {activePage === "overview" && (
          <section className="dashboard-content">

            {/* WELCOME HERO */}

            <div className="welcome-hero">

              <div className="hero-copy">

                <span className="eyebrow">
                  ✨ GOOD TO SEE YOU
                </span>

                <h2>
                  Make today
                  <span> productive.</span>
                </h2>

                <p>
                  Stay focused, manage your tasks and
                  keep your projects moving forward.
                </p>

                <div className="hero-date">
                  📅 {formattedDate}
                </div>

              </div>

              <div className="hero-decoration">

                <div className="floating-orb orb-one"></div>
                <div className="floating-orb orb-two"></div>

                <div className="hero-circle">
                  <span>RAF</span>
                  <strong>AI</strong>
                </div>

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
                  <strong>{demoStats.users}</strong>
                  <small className="positive">
                    ↗ +12.5% this month
                  </small>
                </div>

              </div>

              <div className="stat-card">

                <div className="stat-icon blue">
                  ✓
                </div>

                <div>
                  <span>Completed Tasks</span>
                  <strong>{completedTodos}</strong>
                  <small className="positive">
                    ↗ +8.2% this week
                  </small>
                </div>

              </div>

              <div className="stat-card">

                <div className="stat-icon green">
                  ◉
                </div>

                <div>
                  <span>Active Projects</span>
                  <strong>{demoStats.projects}</strong>
                  <small>
                    4 due this week
                  </small>
                </div>

              </div>

              <div className="stat-card">

                <div className="stat-icon orange">
                  ★
                </div>

                <div>
                  <span>Productivity</span>
                  <strong>{demoStats.productivity}</strong>
                  <small className="positive">
                    ↗ +5.4% improvement
                  </small>
                </div>

              </div>

            </div>

            {/* MAIN GRID */}

            <div className="dashboard-grid">

              {/* TODO */}

              <div className="dashboard-panel todo-panel">

                <div className="panel-header">

                  <div>
                    <h2>Quick Tasks</h2>
                    <p>
                      Manage your daily tasks
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      changePage("tasks")
                    }
                  >
                    View All
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

                  <span className="live-badge">
                    ● Live
                  </span>

                </div>

                <div className="activity-list">

                  <div className="activity">
                    <div className="activity-icon">
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
                    <div className="activity-icon">
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
                    <div className="activity-icon">
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
                    <div className="activity-icon">
                      ★
                    </div>

                    <div>
                      <strong>
                        New project created
                      </strong>

                      <span>
                        RAF AI Dashboard
                      </span>

                      <small>
                        2 hours ago
                      </small>
                    </div>
                  </div>

                </div>

              </div>

            </div>

            {/* TIMER + PRODUCTIVITY */}

            <div className="feature-grid">

              {/* TIMER */}

              <div className="dashboard-panel timer-panel">

                <div className="panel-header">

                  <div>
                    <span className="panel-kicker">
                      FOCUS MODE
                    </span>

                    <h2>Focus Timer</h2>

                    <p>
                      Use Pomodoro sessions to stay focused.
                    </p>
                  </div>

                  <div className="timer-status">
                    {timerRunning
                      ? "Running"
                      : "Paused"}
                  </div>

                </div>

                <div className="timer-modes">

                  {[
                    "Focus",
                    "Short Break",
                    "Long Break"
                  ].map((mode) => (
                    <button
                      key={mode}
                      className={
                        timerMode === mode
                          ? "timer-mode active"
                          : "timer-mode"
                      }
                      onClick={() =>
                        changeTimerMode(mode)
                      }
                    >
                      {mode}
                    </button>
                  ))}

                </div>

                <div className="timer-display">

                  <div
                    className={
                      timerRunning
                        ? "timer-ring running"
                        : "timer-ring"
                    }
                  >
                    <div className="timer-inner">
                      <span>
                        {timerMode}
                      </span>

                      <strong>
                        {formattedTimer}
                      </strong>

                      <small>
                        {timerRunning
                          ? "Stay focused"
                          : "Ready when you are"}
                      </small>
                    </div>
                  </div>

                </div>

                <div className="timer-controls">

                  {!timerRunning ? (
                    <button
                      className="timer-primary"
                      onClick={startTimer}
                    >
                      ▶ Start
                    </button>
                  ) : (
                    <button
                      className="timer-primary"
                      onClick={pauseTimer}
                    >
                      ❚❚ Pause
                    </button>
                  )}

                  <button
                    className="timer-secondary"
                    onClick={resetTimer}
                  >
                    ↻ Reset
                  </button>

                </div>

                <div className="timer-extra">

                  <button
                    onClick={() =>
                      addTimerMinutes(5)
                    }
                  >
                    +5 min
                  </button>

                  <button
                    onClick={() =>
                      addTimerMinutes(10)
                    }
                  >
                    +10 min
                  </button>

                </div>

              </div>

              {/* PRODUCTIVITY */}

              <div className="dashboard-panel productivity-panel">

                <div className="panel-header">

                  <div>
                    <span className="panel-kicker">
                      YOUR PERFORMANCE
                    </span>

                    <h2>Productivity</h2>

                    <p>
                      Your current productivity overview.
                    </p>
                  </div>

                  <span className="score-circle">
                    87
                  </span>

                </div>

                <div className="productivity-progress">

                  <div className="progress-label">
                    <span>Weekly score</span>
                    <strong>87%</strong>
                  </div>

                  <div className="large-progress">
                    <div style={{ width: "87%" }}></div>
                  </div>

                </div>

                <div className="productivity-items">

                  <div>
                    <span>Tasks completed</span>
                    <strong>
                      {completedTodos}
                    </strong>
                  </div>

                  <div>
                    <span>Tasks pending</span>
                    <strong>
                      {pendingTodos}
                    </strong>
                  </div>

                  <div>
                    <span>Focus sessions</span>
                    <strong>12</strong>
                  </div>

                  <div>
                    <span>Current streak</span>
                    <strong>7 days</strong>
                  </div>

                </div>

                <div className="streak-box">

                  <div className="streak-fire">
                    🔥
                  </div>

                  <div>
                    <strong>
                      7 day streak
                    </strong>

                    <span>
                      Keep going! You're doing great.
                    </span>
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
                      width: `${completionRate}%`
                    }}
                  ></div>
                </div>

                <small>
                  {completionRate}% completion rate
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

            {/* EXTRA DATA */}

            <div className="extra-grid">

              <div className="dashboard-panel mini-analytics">

                <div className="panel-header">

                  <div>
                    <h2>Weekly Activity</h2>
                    <p>
                      Demo activity data
                    </p>
                  </div>

                  <span className="growth">
                    +18.4%
                  </span>

                </div>

                <div className="mini-chart">

                  {weeklyData.map((item) => (
                    <div
                      className="mini-bar-wrapper"
                      key={item.day}
                    >
                      <div
                        className="mini-bar"
                        style={{
                          height: `${item.value}%`
                        }}
                      ></div>

                      <span>
                        {item.day}
                      </span>
                    </div>
                  ))}

                </div>

              </div>

              {/* NOTES */}

              <div className="dashboard-panel notes-panel">

                <div className="panel-header">

                  <div>
                    <h2>Quick Notes</h2>
                    <p>
                      Keep something important here.
                    </p>
                  </div>

                  {notesSaved && (
                    <span className="saved-label">
                      ✓ Saved
                    </span>
                  )}

                </div>

                <textarea
                  value={notes}
                  onChange={(e) =>
                    setNotes(e.target.value)
                  }
                  placeholder="Write your notes..."
                />

                <button
                  className="save-notes"
                  onClick={saveNotes}
                >
                  Save Notes
                </button>

              </div>

            </div>

          </section>
        )}

        {/* =========================
            TASKS PAGE
        ========================= */}

        {activePage === "tasks" && (
          <section className="page-section">

            <div className="section-heading">

              <div>
                <span className="panel-kicker">
                  PRODUCTIVITY
                </span>

                <h2>Task Manager</h2>

                <p>
                  Create and manage your tasks.
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
                Add Task
              </button>

            </div>

            <div className="task-summary">

              <div>
                <span>Total</span>
                <strong>{todos.length}</strong>
              </div>

              <div>
                <span>Completed</span>
                <strong>{completedTodos}</strong>
              </div>

              <div>
                <span>Pending</span>
                <strong>{pendingTodos}</strong>
              </div>

              <div>
                <span>Progress</span>
                <strong>{completionRate}%</strong>
              </div>

            </div>

            <div className="full-task-list">

              {todos.map((todo) => (
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
              ))}

            </div>

          </section>
        )}

        {/* =========================
            PROFILE
        ========================= */}

        {activePage === "profile" && (
          <section className="page-section">

            <div className="profile-header">

              <div className="large-avatar">
                {profile.name
                  ? profile.name
                      .charAt(0)
                      .toUpperCase()
                  : "R"}
              </div>

              <div>
                <span className="panel-kicker">
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

            <div className="profile-layout">

              <div className="form-card">

                <h2>Personal Information</h2>

                <p className="form-description">
                  Update your account information below.
                </p>

                <div className="profile-form">

                  <label>
                    Full Name

                    <input
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
                      value={profile.email}
                      disabled
                    />
                  </label>

                  <label>
                    Phone

                    <input
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
                  Save Changes
                </button>

              </div>

              <div className="profile-side-card">

                <div className="profile-security-icon">
                  🔐
                </div>

                <h3>
                  Account Security
                </h3>

                <p>
                  Your account is currently protected
                  by Firebase Authentication.
                </p>

                <div className="security-status">
                  <span></span>
                  Authentication Active
                </div>

                <div className="security-row">
                  <span>Provider</span>
                  <strong>Firebase</strong>
                </div>

                <div className="security-row">
                  <span>Account status</span>
                  <strong>Active</strong>
                </div>

              </div>

            </div>

          </section>
        )}

        {/* =========================
            ANALYTICS
        ========================= */}

        {activePage === "analytics" && (
          <section className="page-section">

            <div className="analytics-header">

              <div>
                <span className="panel-kicker">
                  PERFORMANCE CENTER
                </span>

                <h2>
                  Analytics Overview
                </h2>

                <p>
                  Your application performance
                </p>
              </div>

              <span className="analytics-date">
                Last 7 days
              </span>

            </div>

            <div className="analytics-grid">

              <div className="analytics-card">
                <span>Monthly Users</span>
                <strong>{demoStats.users}</strong>
                <b>+18.4%</b>
              </div>

              <div className="analytics-card">
                <span>Sessions</span>
                <strong>{demoStats.sessions}</strong>
                <b>+12.7%</b>
              </div>

              <div className="analytics-card">
                <span>Conversion</span>
                <strong>{demoStats.conversion}</strong>
                <b>+7.2%</b>
              </div>

              <div className="analytics-card">
                <span>Performance</span>
                <strong>{demoStats.performance}</strong>
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

                <span className="growth">
                  +18.4%
                </span>

              </div>

              <div className="fake-chart">

                {weeklyData.map((item) => (
                  <div
                    style={{
                      height: `${item.value}%`
                    }}
                    key={item.day}
                  >
                    <span>
                      {item.day}
                    </span>
                  </div>
                ))}

              </div>

            </div>

            <div className="analytics-bottom">

              <div className="dashboard-panel">

                <div className="panel-header">

                  <div>
                    <h2>Performance Metrics</h2>
                    <p>
                      Current system overview
                    </p>
                  </div>

                </div>

                <div className="metric-list">

                  <div className="metric">
                    <div>
                      <span>System uptime</span>
                      <strong>99.9%</strong>
                    </div>

                    <div className="metric-progress">
                      <div style={{ width: "99%" }}></div>
                    </div>
                  </div>

                  <div className="metric">
                    <div>
                      <span>User satisfaction</span>
                      <strong>94%</strong>
                    </div>

                    <div className="metric-progress">
                      <div style={{ width: "94%" }}></div>
                    </div>
                  </div>

                  <div className="metric">
                    <div>
                      <span>Task efficiency</span>
                      <strong>87%</strong>
                    </div>

                    <div className="metric-progress">
                      <div style={{ width: "87%" }}></div>
                    </div>
                  </div>

                </div>

              </div>

              <div className="dashboard-panel achievement-panel">

                <span className="achievement-icon">
                  🏆
                </span>

                <h2>
                  Great progress!
                </h2>

                <p>
                  You have completed {completedTodos}
                  tasks and maintained a 7-day streak.
                </p>

                <strong>
                  Keep it up 🚀
                </strong>

              </div>

            </div>

          </section>
        )}

        {/* =========================
            SETTINGS
        ========================= */}

        {activePage === "settings" && (
          <section className="page-section">

            <div className="section-heading">

              <div>
                <span className="panel-kicker">
                  PREFERENCES
                </span>

                <h2>Settings</h2>

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

                <button
                  className={
                    settings.emailNotifications
                      ? "switch active"
                      : "switch"
                  }
                  onClick={() =>
                    toggleSetting(
                      "emailNotifications"
                    )
                  }
                >
                  <span></span>
                </button>

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

                <button
                  className={
                    settings.activityAlerts
                      ? "switch active"
                      : "switch"
                  }
                  onClick={() =>
                    toggleSetting(
                      "activityAlerts"
                    )
                  }
                >
                  <span></span>
                </button>

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

                <button
                  className={
                    settings.autoSync
                      ? "switch active"
                      : "switch"
                  }
                  onClick={() =>
                    toggleSetting("autoSync")
                  }
                >
                  <span></span>
                </button>

              </div>

            </div>

            <div className="settings-info-grid">

              <div className="settings-info-card">

                <span>🎨</span>

                <div>
                  <strong>
                    Interface
                  </strong>

                  <p>
                    Light purple dashboard theme
                  </p>
                </div>

              </div>

              <div className="settings-info-card">

                <span>☁️</span>

                <div>
                  <strong>
                    Cloud Sync
                  </strong>

                  <p>
                    Firebase connection enabled
                  </p>
                </div>

              </div>

              <div className="settings-info-card">

                <span>🛡️</span>

                <div>
                  <strong>
                    Security
                  </strong>

                  <p>
                    Protected authentication system
                  </p>
                </div>

              </div>

            </div>

          </section>
        )}

        {/* FOOTER */}

        <footer className="dashboard-footer">

          <div>
            <strong>RAF AI</strong>

            <span>
              Smart productivity workspace
            </span>
          </div>

          <p>
            © 2026 RAF AI. All rights reserved.
          </p>

        </footer>

      </main>

    </div>
  );
}

export default Dashboard;
