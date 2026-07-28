import { useEffect, useMemo, useState } from "react";
import "./Dashboard.css";

function Dashboard({ user, onLogout }) {
  const [activePage, setActivePage] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [zenMode, setZenMode] = useState(false);

  const [globalSearch, setGlobalSearch] = useState("");
  const [language, setLanguage] = useState("English");
  const [currency, setCurrency] = useState("INR");

  const [notifications, setNotifications] = useState(3);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showBugReport, setShowBugReport] = useState(false);

  const [autoRefresh, setAutoRefresh] = useState("off");
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  // =====================================================
  // TODO
  // =====================================================

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

  // =====================================================
  // PROFILE
  // =====================================================

  const [profile, setProfile] = useState({
    name: user?.name || "RAF User",
    email: user?.email || "user@example.com",
    phone: user?.phone || "+91 9876543210"
  });

  const [message, setMessage] = useState("");

  // =====================================================
  // NOTES
  // =====================================================

  const [notes, setNotes] = useState(
    localStorage.getItem("raf_notes") || ""
  );

  // =====================================================
  // TIMER
  // =====================================================

  const [timerMode, setTimerMode] = useState("pomodoro");
  const [timerSeconds, setTimerSeconds] = useState(25 * 60);
  const [timerRunning, setTimerRunning] = useState(false);

  const timerPresets = {
    pomodoro: 25 * 60,
    short: 5 * 60,
    long: 15 * 60
  };

  // =====================================================
  // CLOCKS
  // =====================================================

  const cities = [
    {
      city: "London",
      country: "UK",
      flag: "🇬🇧",
      zone: "Europe/London"
    },
    {
      city: "Dubai",
      country: "UAE",
      flag: "🇦🇪",
      zone: "Asia/Dubai"
    },
    {
      city: "Riyadh",
      country: "Saudi Arabia",
      flag: "🇸🇦",
      zone: "Asia/Riyadh"
    },
    {
      city: "Karachi",
      country: "Pakistan",
      flag: "🇵🇰",
      zone: "Asia/Karachi"
    },
    {
      city: "New Delhi",
      country: "India",
      flag: "🇮🇳",
      zone: "Asia/Kolkata"
    },
    {
      city: "Jakarta",
      country: "Indonesia",
      flag: "🇮🇩",
      zone: "Asia/Jakarta"
    },
    {
      city: "New York",
      country: "USA",
      flag: "🇺🇸",
      zone: "America/New_York"
    },
    {
      city: "Tokyo",
      country: "Japan",
      flag: "🇯🇵",
      zone: "Asia/Tokyo"
    },
    {
      city: "Singapore",
      country: "Singapore",
      flag: "🇸🇬",
      zone: "Asia/Singapore"
    },
    {
      city: "Sydney",
      country: "Australia",
      flag: "🇦🇺",
      zone: "Australia/Sydney"
    }
  ];

  const [currentTime, setCurrentTime] = useState(new Date());

  // =====================================================
  // ORDERS
  // =====================================================

  const [orders, setOrders] = useState([
    {
      id: "#RAF-1001",
      customer: "Rahul Sharma",
      email: "rahul@example.com",
      date: "28 Jul 2026",
      time: "10:24 AM",
      amount: 12999,
      status: "Completed"
    },
    {
      id: "#RAF-1002",
      customer: "Ayesha Khan",
      email: "ayesha@example.com",
      date: "28 Jul 2026",
      time: "09:18 AM",
      amount: 8499,
      status: "Pending"
    },
    {
      id: "#RAF-1003",
      customer: "Arman Malik",
      email: "arman@example.com",
      date: "27 Jul 2026",
      time: "07:42 PM",
      amount: 18999,
      status: "Completed"
    },
    {
      id: "#RAF-1004",
      customer: "Sarah Wilson",
      email: "sarah@example.com",
      date: "27 Jul 2026",
      time: "05:32 PM",
      amount: 4999,
      status: "Failed"
    },
    {
      id: "#RAF-1005",
      customer: "Daniel Lee",
      email: "daniel@example.com",
      date: "26 Jul 2026",
      time: "03:21 PM",
      amount: 24999,
      status: "Completed"
    },
    {
      id: "#RAF-1006",
      customer: "Zoya Ahmed",
      email: "zoya@example.com",
      date: "26 Jul 2026",
      time: "12:15 PM",
      amount: 6999,
      status: "Pending"
    }
  ]);

  const [orderSearch, setOrderSearch] = useState("");
  const [orderStatus, setOrderStatus] = useState("All");
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // =====================================================
  // CHAT
  // =====================================================

  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      from: "Support",
      text: "Hello! How can we help you?"
    }
  ]);

  const [chatInput, setChatInput] = useState("");

  // =====================================================
  // TIMER EFFECT
  // =====================================================

  useEffect(() => {
    if (!timerRunning) return;

    const interval = setInterval(() => {
      setTimerSeconds((seconds) => {
        if (seconds <= 1) {
          clearInterval(interval);
          setTimerRunning(false);

          if ("Notification" in window) {
            if (Notification.permission === "granted") {
              new Notification("RAF AI Timer", {
                body: "Your timer has finished!"
              });
            } else if (Notification.permission !== "denied") {
              Notification.requestPermission();
            }
          }

          return 0;
        }

        return seconds - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timerRunning]);

  // =====================================================
  // CLOCK EFFECT
  // =====================================================

  useEffect(() => {
    const clockInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(clockInterval);
  }, []);

  // =====================================================
  // AUTO REFRESH
  // =====================================================

  useEffect(() => {
    if (autoRefresh === "off") return;

    const seconds =
      autoRefresh === "5s"
        ? 5000
        : autoRefresh === "30s"
        ? 30000
        : 60000;

    const interval = setInterval(() => {
      refreshActivity();
    }, seconds);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  // =====================================================
  // KEYBOARD SHORTCUT
  // =====================================================

  useEffect(() => {
    const handler = (event) => {
      if (
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === "k"
      ) {
        event.preventDefault();
        document
          .querySelector(".global-search")
          ?.focus();
      }

      if (event.key === "Escape") {
        setShowNotifications(false);
        setShowQuickActions(false);
        setShowShortcuts(false);
        setShowChat(false);
        setShowBugReport(false);
      }
    };

    window.addEventListener("keydown", handler);

    return () => {
      window.removeEventListener("keydown", handler);
    };
  }, []);

  // =====================================================
  // TODO FUNCTIONS
  // =====================================================

  const addTodo = () => {
    if (!newTodo.trim()) return;

    const todo = {
      id: Date.now(),
      title: newTodo,
      category: "General",
      priority: "Medium",
      completed: false
    };

    setTodos((current) => [...current, todo]);
    setNewTodo("");
  };

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

  const deleteTodo = (id) => {
    setTodos((current) =>
      current.filter((todo) => todo.id !== id)
    );
  };

  // =====================================================
  // PROFILE
  // =====================================================

  const updateProfile = () => {
    setMessage("Profile updated successfully!");

    setTimeout(() => {
      setMessage("");
    }, 2500);
  };

  // =====================================================
  // TIMER FUNCTIONS
  // =====================================================

  const formatTimer = () => {
    const minutes = Math.floor(timerSeconds / 60)
      .toString()
      .padStart(2, "0");

    const seconds = (timerSeconds % 60)
      .toString()
      .padStart(2, "0");

    return `${minutes}:${seconds}`;
  };

  const setPreset = (mode) => {
    setTimerMode(mode);
    setTimerSeconds(timerPresets[mode]);
    setTimerRunning(false);
  };

  const resetTimer = () => {
    setTimerRunning(false);
    setTimerSeconds(timerPresets[timerMode]);
  };

  const addMinutes = (minutes) => {
    setTimerSeconds(
      (current) => current + minutes * 60
    );
  };

  // =====================================================
  // REFRESH
  // =====================================================

  const refreshActivity = () => {
    setRefreshing(true);

    setTimeout(() => {
      setLastRefresh(new Date());
      setRefreshing(false);
    }, 700);
  };

  // =====================================================
  // NOTES
  // =====================================================

  const saveNotes = () => {
    localStorage.setItem("raf_notes", notes);
    setMessage("Notes saved successfully!");

    setTimeout(() => {
      setMessage("");
    }, 2000);
  };

  // =====================================================
  // ORDERS FILTER
  // =====================================================

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const search =
        orderSearch.trim().toLowerCase();

      const matchesSearch =
        !search ||
        order.id.toLowerCase().includes(search) ||
        order.customer.toLowerCase().includes(search) ||
        order.email.toLowerCase().includes(search);

      const matchesStatus =
        orderStatus === "All" ||
        order.status === orderStatus;

      return matchesSearch && matchesStatus;
    });
  }, [orders, orderSearch, orderStatus]);

  // =====================================================
  // CSV EXPORT
  // =====================================================

  const exportCSV = () => {
    const headers = [
      "Order ID",
      "Customer",
      "Email",
      "Date",
      "Time",
      "Amount",
      "Status"
    ];

    const rows = filteredOrders.map((order) => [
      order.id,
      order.customer,
      order.email,
      order.date,
      order.time,
      order.amount,
      order.status
    ]);

    const csv = [
      headers,
      ...rows
    ]
      .map((row) =>
        row
          .map((value) =>
            `"${String(value).replaceAll('"', '""')}"`
          )
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;"
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "raf-ai-orders.csv";

    link.click();

    URL.revokeObjectURL(url);
  };

  // =====================================================
  // CHAT
  // =====================================================

  const sendChat = () => {
    if (!chatInput.trim()) return;

    setChatMessages((current) => [
      ...current,
      {
        id: Date.now(),
        from: "You",
        text: chatInput
      }
    ]);

    setChatInput("");

    setTimeout(() => {
      setChatMessages((current) => [
        ...current,
        {
          id: Date.now() + 1,
          from: "Support",
          text: "Thanks! Our team will get back to you shortly."
        }
      ]);
    }, 700);
  };

  // =====================================================
  // NAVIGATION
  // =====================================================

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
      id: "analytics",
      icon: "▥",
      label: "Analytics"
    },
    {
      id: "orders",
      icon: "▣",
      label: "Orders"
    },
    {
      id: "clocks",
      icon: "◷",
      label: "World Clock"
    },
    {
      id: "profile",
      icon: "♙",
      label: "Profile"
    },
    {
      id: "settings",
      icon: "⚙",
      label: "Settings"
    }
  ];

  const changePage = (page) => {
    setActivePage(page);
    setSidebarOpen(false);
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const completedTodos = todos.filter(
    (todo) => todo.completed
  ).length;

  const pendingTodos = todos.filter(
    (todo) => !todo.completed
  ).length;

  const productivityScore =
    todos.length > 0
      ? Math.round(
          (completedTodos / todos.length) * 100
        )
      : 0;

  const formatCurrency = (amount) => {
    if (currency === "USD") {
      return `$${(amount / 83).toLocaleString(
        "en-US",
        {
          maximumFractionDigits: 0
        }
      )}`;
    }

    if (currency === "EUR") {
      return `€${(amount / 90).toLocaleString(
        "de-DE",
        {
          maximumFractionDigits: 0
        }
      )}`;
    }

    return `₹${amount.toLocaleString("en-IN")}`;
  };

  const pageTitle = {
    overview: "Dashboard",
    tasks: "My Tasks",
    analytics: "Analytics",
    orders: "Orders & Transactions",
    clocks: "World Clock",
    profile: "My Profile",
    settings: "Settings"
  };

  return (
    <div
      className={
        darkMode
          ? "dashboard app-dark"
          : "dashboard"
      }
    >
      {/* MOBILE OVERLAY */}

      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <aside
        className={
          sidebarOpen
            ? "dashboard-sidebar mobile-open"
            : "dashboard-sidebar"
        }
      >
        <div className="brand">
          <div className="brand-logo">R</div>

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
              onClick={() =>
                changePage(item.id)
              }
            >
              <span className="nav-icon">
                {item.icon}
              </span>

              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-mini-card">
          <span>Storage</span>

          <strong>
            45 GB / 100 GB
          </strong>

          <div className="storage-progress">
            <div />
          </div>

          <small>
            55 GB available
          </small>
        </div>

        <div className="sidebar-bottom">
          <button
            className="help-button"
            onClick={() => setShowChat(true)}
          >
            <span>?</span>
            Help Center
          </button>

          <button
            className="logout-button"
            onClick={onLogout}
          >
            <span>↪</span>
            Logout
          </button>
        </div>
      </aside>

      {/* =================================================
          MAIN
      ================================================= */}

      <main
        className={
          zenMode
            ? "dashboard-main zen-mode"
            : "dashboard-main"
        }
      >
        {/* =================================================
            TOP BAR
        ================================================= */}

        <header className="dashboard-topbar">
          <div className="topbar-left">
            <button
              className="mobile-menu"
              onClick={() =>
                setSidebarOpen(true)
              }
            >
              ☰
            </button>

            <div>
              <div className="breadcrumb">
                Home
                <span>›</span>
                {pageTitle[activePage]}
              </div>

              <h1>
                {pageTitle[activePage]}
              </h1>

              <p>
                Welcome back,{" "}
                {profile.name}
              </p>
            </div>
          </div>

          <div className="topbar-controls">
            {/* SEARCH */}

            <div className="search-wrapper">
              <span>⌕</span>

              <input
                className="global-search"
                placeholder="Search pages, users, data..."
                value={globalSearch}
                onChange={(e) =>
                  setGlobalSearch(
                    e.target.value
                  )
                }
              />

              <kbd>Ctrl K</kbd>
            </div>

            {/* QUICK ACTION */}

            <div className="top-action-wrap">
              <button
                className="quick-action"
                onClick={() =>
                  setShowQuickActions(
                    !showQuickActions
                  )
                }
              >
                + New
              </button>

              {showQuickActions && (
                <div className="quick-menu">
                  <button
                    onClick={() => {
                      changePage("tasks");
                      setShowQuickActions(false);
                    }}
                  >
                    ✓ Add Task
                  </button>

                  <button
                    onClick={() => {
                      changePage("orders");
                      setShowQuickActions(false);
                    }}
                  >
                    + Add Order
                  </button>

                  <button
                    onClick={() => {
                      changePage("profile");
                      setShowQuickActions(false);
                    }}
                  >
                    ♙ Edit Profile
                  </button>
                </div>
              )}
            </div>

            {/* NOTIFICATIONS */}

            <div className="notification-wrap">
              <button
                className="icon-button"
                onClick={() => {
                  setShowNotifications(
                    !showNotifications
                  );
                  setNotifications(0);
                }}
              >
                🔔
                {notifications > 0 && (
                  <span className="notification-dot">
                    {notifications}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="notification-panel">
                  <div className="dropdown-heading">
                    <strong>
                      Notifications
                    </strong>

                    <span>
                      Today
                    </span>
                  </div>

                  <div className="notification-item">
                    <span>✓</span>
                    <div>
                      <strong>
                        Profile updated
                      </strong>
                      <small>
                        10 minutes ago
                      </small>
                    </div>
                  </div>

                  <div className="notification-item">
                    <span>⚡</span>
                    <div>
                      <strong>
                        New task assigned
                      </strong>
                      <small>
                        35 minutes ago
                      </small>
                    </div>
                  </div>

                  <div className="notification-item">
                    <span>☁</span>
                    <div>
                      <strong>
                        Database synced
                      </strong>
                      <small>
                        1 hour ago
                      </small>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* DARK MODE */}

            <button
              className="theme-toggle"
              onClick={() =>
                setDarkMode(!darkMode)
              }
              title="Toggle theme"
            >
              {darkMode ? "☀" : "☾"}
            </button>

            {/* LANGUAGE */}

            <select
              className="region-select"
              value={language}
              onChange={(e) =>
                setLanguage(e.target.value)
              }
            >
              <option>English</option>
              <option>Hindi</option>
              <option>Urdu</option>
              <option>Arabic</option>
            </select>

            {/* USER */}

            <button
              className="user-mini"
              onClick={() =>
                changePage("profile")
              }
            >
              <div className="avatar">
                {profile.name
                  ? profile.name
                      .charAt(0)
                      .toUpperCase()
                  : "R"}
              </div>

              <div className="user-mini-text">
                <strong>
                  {profile.name}
                </strong>

                <span>
                  {profile.email}
                </span>
              </div>

              <span>⌄</span>
            </button>
          </div>
        </header>

        {/* =================================================
            ANNOUNCEMENT
        ================================================= */}

        <div className="announcement">
          <div>
            <span className="announcement-icon">
              📢
            </span>

            <strong>
              RAF AI v2.4.0
            </strong>

            <span>
              New analytics, world clocks,
              productivity tools and improved
              dashboard experience are available.
            </span>
          </div>

          <button
            onClick={() =>
              setShowShortcuts(true)
            }
          >
            What's New
          </button>
        </div>

        {/* =================================================
            OVERVIEW
        ================================================= */}

        {activePage === "overview" && (
          <section className="dashboard-content">
            {/* KPI */}

            <div className="stats-grid four">
              <div className="stat-card premium-card">
                <div className="stat-icon purple">
                  ₹
                </div>

                <div>
                  <span>
                    Total Revenue
                  </span>

                  <strong>
                    {formatCurrency(
                      2849500
                    )}
                  </strong>

                  <small className="positive">
                    ↑ 18.4% this month
                  </small>
                </div>

                <div className="sparkline">
                  ▁▂▃▂▄▅▆▇
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon blue">
                  👥
                </div>

                <div>
                  <span>
                    Active Users
                  </span>

                  <strong>
                    12,849
                  </strong>

                  <small className="positive">
                    ↑ 12.5% this month
                  </small>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon green">
                  ◉
                </div>

                <div>
                  <span>
                    Total Orders
                  </span>

                  <strong>
                    8,492
                  </strong>

                  <small className="positive">
                    ↑ 9.8% this week
                  </small>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon orange">
                  ⚡
                </div>

                <div>
                  <span>
                    Server Uptime
                  </span>

                  <strong>
                    99.9%
                  </strong>

                  <small className="positive">
                    Stable
                  </small>
                </div>
              </div>
            </div>

            {/* MAIN ANALYTICS */}

            <div className="analytics-layout">
              <div className="dashboard-panel revenue-panel">
                <div className="panel-header">
                  <div>
                    <span className="eyebrow">
                      PERFORMANCE
                    </span>

                    <h2>
                      Revenue Growth
                    </h2>

                    <p>
                      Monthly revenue overview
                    </p>
                  </div>

                  <div className="chart-switch">
                    <button className="active">
                      Monthly
                    </button>

                    <button>
                      Weekly
                    </button>
                  </div>
                </div>

                <div className="revenue-value">
                  {formatCurrency(
                    2849500
                  )}

                  <span>
                    +18.4%
                  </span>
                </div>

                <div className="line-chart">
                  <div className="chart-grid-lines">
                    <i />
                    <i />
                    <i />
                    <i />
                  </div>

                  <svg
                    viewBox="0 0 800 250"
                    preserveAspectRatio="none"
                  >
                    <defs>
                      <linearGradient
                        id="rafGradient"
                        x1="0"
                        x2="0"
                        y1="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopOpacity="0.35"
                        />

                        <stop
                          offset="100%"
                          stopOpacity="0"
                        />
                      </linearGradient>
                    </defs>

                    <path
                      className="chart-area"
                      d="M0 205 C70 180, 90 195, 150 160 S250 170, 300 125 S390 145, 440 105 S530 125, 590 75 S680 90, 800 35 L800 250 L0 250 Z"
                    />

                    <path
                      className="chart-line"
                      d="M0 205 C70 180, 90 195, 150 160 S250 170, 300 125 S390 145, 440 105 S530 125, 590 75 S680 90, 800 35"
                    />
                  </svg>

                  <div className="chart-labels">
                    <span>Jan</span>
                    <span>Feb</span>
                    <span>Mar</span>
                    <span>Apr</span>
                    <span>May</span>
                    <span>Jun</span>
                    <span>Jul</span>
                  </div>
                </div>
              </div>

              {/* CATEGORY */}

              <div className="dashboard-panel">
                <div className="panel-header">
                  <div>
                    <span className="eyebrow">
                      SALES
                    </span>

                    <h2>
                      Category Breakdown
                    </h2>
                  </div>
                </div>

                <div className="donut-wrap">
                  <div className="donut">
                    <div>
                      <strong>
                        68%
                      </strong>

                      <span>
                        Overall
                      </span>
                    </div>
                  </div>

                  <div className="legend">
                    <div>
                      <i className="dot purple-dot" />
                      Development
                      <strong>
                        42%
                      </strong>
                    </div>

                    <div>
                      <i className="dot blue-dot" />
                      Design
                      <strong>
                        28%
                      </strong>
                    </div>

                    <div>
                      <i className="dot green-dot" />
                      Services
                      <strong>
                        18%
                      </strong>
                    </div>

                    <div>
                      <i className="dot orange-dot" />
                      Other
                      <strong>
                        12%
                      </strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* TRAFFIC / FUNNEL / VISITORS */}

            <div className="three-grid">
              <div className="dashboard-panel">
                <div className="panel-header">
                  <div>
                    <h2>
                      User Traffic
                    </h2>
                    <p>
                      Visitors by source
                    </p>
                  </div>
                </div>

                <div className="traffic-list">
                  <div>
                    <span>
                      Organic
                    </span>

                    <div className="bar">
                      <i
                        style={{
                          width: "82%"
                        }}
                      />
                    </div>

                    <strong>
                      82%
                    </strong>
                  </div>

                  <div>
                    <span>
                      Direct
                    </span>

                    <div className="bar">
                      <i
                        style={{
                          width: "64%"
                        }}
                      />
                    </div>

                    <strong>
                      64%
                    </strong>
                  </div>

                  <div>
                    <span>
                      Referral
                    </span>

                    <div className="bar">
                      <i
                        style={{
                          width: "48%"
                        }}
                      />
                    </div>

                    <strong>
                      48%
                    </strong>
                  </div>

                  <div>
                    <span>
                      Social
                    </span>

                    <div className="bar">
                      <i
                        style={{
                          width: "36%"
                        }}
                      />
                    </div>

                    <strong>
                      36%
                    </strong>
                  </div>
                </div>
              </div>

              <div className="dashboard-panel">
                <div className="panel-header">
                  <div>
                    <h2>
                      Conversion Funnel
                    </h2>

                    <p>
                      Customer journey
                    </p>
                  </div>
                </div>

                <div className="funnel">
                  <div
                    style={{
                      width: "100%"
                    }}
                  >
                    Visitors
                    <b>
                      12,849
                    </b>
                  </div>

                  <div
                    style={{
                      width: "82%"
                    }}
                  >
                    Viewed
                    <b>
                      10,452
                    </b>
                  </div>

                  <div
                    style={{
                      width: "63%"
                    }}
                  >
                    Added
                    <b>
                      8,090
                    </b>
                  </div>

                  <div
                    style={{
                      width: "42%"
                    }}
                  >
                    Converted
                    <b>
                      5,394
                    </b>
                  </div>
                </div>
              </div>

              <div className="dashboard-panel visitor-panel">
                <div className="panel-header">
                  <div>
                    <h2>
                      Live Visitors
                    </h2>

                    <p>
                      Real-time traffic
                    </p>
                  </div>

                  <span className="live-badge">
                    LIVE
                  </span>
                </div>

                <div className="visitor-number">
                  1,284
                </div>

                <div className="visitor-pulse">
                  <span />
                </div>

                <small>
                  Visitors currently online
                </small>
              </div>
            </div>

            {/* PRODUCTIVITY */}

            <div className="productivity-layout">
              {/* TIMER */}

              <div className="dashboard-panel timer-panel">
                <div className="panel-header">
                  <div>
                    <span className="eyebrow">
                      PRODUCTIVITY
                    </span>

                    <h2>
                      Focus Timer
                    </h2>

                    <p>
                      Pomodoro / countdown timer
                    </p>
                  </div>

                  <span className="timer-status">
                    {timerRunning
                      ? "Running"
                      : "Paused"}
                  </span>
                </div>

                <div className="timer-circle">
                  <div>
                    <strong>
                      {formatTimer()}
                    </strong>

                    <span>
                      {timerMode ===
                        "pomodoro"
                        ? "Focus"
                        : timerMode ===
                          "short"
                        ? "Short Break"
                        : "Long Break"}
                    </span>
                  </div>
                </div>

                <div className="timer-presets">
                  <button
                    className={
                      timerMode ===
                      "pomodoro"
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      setPreset(
                        "pomodoro"
                      )
                    }
                  >
                    25m
                  </button>

                  <button
                    className={
                      timerMode ===
                      "short"
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      setPreset("short")
                    }
                  >
                    5m
                  </button>

                  <button
                    className={
                      timerMode === "long"
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      setPreset("long")
                    }
                  >
                    15m
                  </button>
                </div>

                <div className="timer-actions">
                  <button
                    className="timer-primary"
                    onClick={() =>
                      setTimerRunning(
                        !timerRunning
                      )
                    }
                  >
                    {timerRunning
                      ? "❚❚ Pause"
                      : "▶ Start"}
                  </button>

                  <button
                    onClick={resetTimer}
                  >
                    Reset
                  </button>

                  <button
                    onClick={() =>
                      addMinutes(5)
                    }
                  >
                    +5 min
                  </button>

                  <button
                    onClick={() =>
                      addMinutes(10)
                    }
                  >
                    +10 min
                  </button>
                </div>
              </div>

              {/* NOTES */}

              <div className="dashboard-panel notes-panel">
                <div className="panel-header">
                  <div>
                    <span className="eyebrow">
                      SCRATCHPAD
                    </span>

                    <h2>
                      Quick Notes
                    </h2>

                    <p>
                      Save your important ideas
                    </p>
                  </div>

                  <span className="notes-icon">
                    📝
                  </span>
                </div>

                <textarea
                  value={notes}
                  onChange={(e) =>
                    setNotes(
                      e.target.value
                    )
                  }
                  placeholder="Write your notes here..."
                />

                <button
                  className="save-button"
                  onClick={saveNotes}
                >
                  Save Notes
                </button>
              </div>

              {/* TODAY */}

              <div className="dashboard-panel today-panel">
                <div className="panel-header">
                  <div>
                    <span className="eyebrow">
                      TODAY
                    </span>

                    <h2>
                      Productivity
                    </h2>
                  </div>
                </div>

                <div className="score-ring">
                  <strong>
                    {productivityScore}%
                  </strong>

                  <span>
                    Score
                  </span>
                </div>

                <div className="today-stats">
                  <div>
                    <strong>
                      {completedTodos}
                    </strong>

                    <span>
                      Completed
                    </span>
                  </div>

                  <div>
                    <strong>
                      {pendingTodos}
                    </strong>

                    <span>
                      Pending
                    </span>
                  </div>

                  <div>
                    <strong>
                      7 🔥
                    </strong>

                    <span>
                      Streak
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* TODO + ACTIVITY */}

            <div className="dashboard-grid">
              <div className="dashboard-panel todo-panel">
                <div className="panel-header">
                  <div>
                    <h2>
                      Quick Tasks
                    </h2>

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
                      setNewTodo(
                        e.target.value
                      )
                    }
                    onKeyDown={(e) => {
                      if (
                        e.key === "Enter"
                      ) {
                        addTodo();
                      }
                    }}
                  />

                  <button
                    onClick={addTodo}
                  >
                    +
                  </button>
                </div>

                <div className="todo-list">
                  {todos
                    .slice(0, 5)
                    .map((todo) => (
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
                            toggleTodo(
                              todo.id
                            )
                          }
                        >
                          {todo.completed
                            ? "✓"
                            : ""}
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
                            deleteTodo(
                              todo.id
                            )
                          }
                        >
                          ×
                        </button>
                      </div>
                    ))}
                </div>
              </div>

              <div className="dashboard-panel">
                <div className="panel-header">
                  <div>
                    <h2>
                      Recent Activity
                    </h2>

                    <p>
                      Latest account activity
                    </p>
                  </div>

                  <button
                    className={
                      refreshing
                        ? "refreshing"
                        : ""
                    }
                    onClick={
                      refreshActivity
                    }
                  >
                    ↻ Refresh
                  </button>
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

                <div className="refresh-time">
                  Last refreshed:{" "}
                  {lastRefresh.toLocaleTimeString(
                    "en-IN"
                  )}
                </div>
              </div>
            </div>

            {/* SYSTEM / FINANCE */}

            <div className="widget-grid">
              <div className="mini-widget">
                <span>
                  System Health
                </span>

                <strong className="online">
                  ● All Systems Operational
                </strong>

                <small>
                  Database OK · API 99.9%
                </small>
              </div>

              <div className="mini-widget">
                <span>
                  Revenue Target
                </span>

                <strong>
                  82%
                </strong>

                <div className="progress">
                  <div
                    style={{
                      width: "82%"
                    }}
                  />
                </div>

                <small>
                  ₹41,000 / ₹50,000 goal
                </small>
              </div>

              <div className="mini-widget">
                <span>
                  API Usage
                </span>

                <strong>
                  8,450 / 10,000
                </strong>

                <div className="progress">
                  <div
                    style={{
                      width: "84.5%"
                    }}
                  />
                </div>

                <small>
                  84.5% used today
                </small>
              </div>

              <div className="mini-widget">
                <span>
                  Pending Payments
                </span>

                <strong>
                  ₹84,920
                </strong>

                <small>
                  17 unpaid invoices
                </small>
              </div>
            </div>

            {/* BOTTOM */}

            <div className="bottom-grid">
              <div className="info-card">
                <span>
                  Tasks Completed
                </span>

                <strong>
                  {completedTodos}/
                  {todos.length}
                </strong>

                <div className="progress">
                  <div
                    style={{
                      width: `${
                        todos.length
                          ? (completedTodos /
                              todos.length) *
                            100
                          : 0
                      }%`
                    }}
                  />
                </div>

                <small>
                  Keep going! You're doing
                  great.
                </small>
              </div>

              <div className="info-card">
                <span>
                  Pending Tasks
                </span>

                <strong>
                  {pendingTodos}
                </strong>

                <small>
                  Tasks waiting for completion
                </small>
              </div>

              <div className="info-card">
                <span>
                  Account Status
                </span>

                <strong className="online">
                  ● Active
                </strong>

                <small>
                  Your account is active
                </small>
              </div>

              <div className="info-card">
                <span>
                  Session
                </span>

                <strong className="session-warning">
                  5 min
                </strong>

                <small>
                  Session timeout warning
                </small>
              </div>
            </div>
          </section>
        )}

        {/* =================================================
            TASKS
        ================================================= */}

        {activePage === "tasks" && (
          <section className="page-section">
            <div className="section-heading">
              <div>
                <span className="eyebrow">
                  PRODUCTIVITY
                </span>

                <h2>
                  Task Manager
                </h2>

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
                  setNewTodo(
                    e.target.value
                  )
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
                      toggleTodo(
                        todo.id
                      )
                    }
                  >
                    {todo.completed
                      ? "✓"
                      : ""}
                  </button>

                  <div className="full-task-info">
                    <strong>
                      {todo.title}
                    </strong>

                    <span>
                      Category:{" "}
                      {todo.category}
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
                      deleteTodo(
                        todo.id
                      )
                    }
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* =================================================
            ANALYTICS
        ================================================= */}

        {activePage === "analytics" && (
          <section className="page-section">
            <div className="section-heading">
              <div>
                <span className="eyebrow">
                  REPORTS
                </span>

                <h2>
                  Analytics Overview
                </h2>

                <p>
                  Your application performance
                </p>
              </div>

              <button
                className="outline-button"
                onClick={() =>
                  window.print()
                }
              >
                Export / Print
              </button>
            </div>

            <div className="analytics-grid">
              <div className="analytics-card">
                <span>
                  Monthly Users
                </span>

                <strong>
                  12,849
                </strong>

                <b>
                  +18.4%
                </b>
              </div>

              <div className="analytics-card">
                <span>
                  Sessions
                </span>

                <strong>
                  38,291
                </strong>

                <b>
                  +12.7%
                </b>
              </div>

              <div className="analytics-card">
                <span>
                  Conversion
                </span>

                <strong>
                  68.4%
                </strong>

                <b>
                  +7.2%
                </b>
              </div>

              <div className="analytics-card">
                <span>
                  Performance
                </span>

                <strong>
                  94.8%
                </strong>

                <b>
                  +4.1%
                </b>
              </div>
            </div>

            <div className="chart-card">
              <div className="panel-header">
                <div>
                  <h2>
                    Weekly Activity
                  </h2>

                  <p>
                    User activity for the last
                    7 days
                  </p>
                </div>
              </div>

              <div className="fake-chart">
                <div
                  style={{
                    height: "35%"
                  }}
                >
                  <span>Mon</span>
                </div>

                <div
                  style={{
                    height: "60%"
                  }}
                >
                  <span>Tue</span>
                </div>

                <div
                  style={{
                    height: "45%"
                  }}
                >
                  <span>Wed</span>
                </div>

                <div
                  style={{
                    height: "80%"
                  }}
                >
                  <span>Thu</span>
                </div>

                <div
                  style={{
                    height: "65%"
                  }}
                >
                  <span>Fri</span>
                </div>

                <div
                  style={{
                    height: "90%"
                  }}
                >
                  <span>Sat</span>
                </div>

                <div
                  style={{
                    height: "75%"
                  }}
                >
                  <span>Sun</span>
                </div>
              </div>
            </div>

            <div className="three-grid">
              <div className="dashboard-panel">
                <div className="panel-header">
                  <div>
                    <h2>
                      Weekly Performance
                    </h2>

                    <p>
                      Productivity trend
                    </p>
                  </div>
                </div>

                <div className="performance-bars">
                  {[65, 74, 68, 82, 76, 91, 87].map(
                    (value, index) => (
                      <div
                        key={index}
                      >
                        <i
                          style={{
                            height: `${value}%`
                          }}
                        />

                        <span>
                          {[
                            "M",
                            "T",
                            "W",
                            "T",
                            "F",
                            "S",
                            "S"
                          ][index]}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>

              <div className="dashboard-panel">
                <div className="panel-header">
                  <div>
                    <h2>
                      Geographic Activity
                    </h2>

                    <p>
                      Global users
                    </p>
                  </div>
                </div>

                <div className="world-map">
                  🌎
                  <span>
                    72 Countries
                  </span>
                </div>
              </div>

              <div className="dashboard-panel">
                <div className="panel-header">
                  <div>
                    <h2>
                      Operational Status
                    </h2>

                    <p>
                      Current infrastructure
                    </p>
                  </div>
                </div>

                <div className="status-list">
                  <div>
                    <span>
                      Firebase
                    </span>

                    <b>
                      ● Operational
                    </b>
                  </div>

                  <div>
                    <span>
                      Authentication
                    </span>

                    <b>
                      ● Operational
                    </b>
                  </div>

                  <div>
                    <span>
                      API
                    </span>

                    <b>
                      ● 99.9%
                    </b>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* =================================================
            ORDERS
        ================================================= */}

        {activePage === "orders" && (
          <section className="page-section">
            <div className="section-heading">
              <div>
                <span className="eyebrow">
                  DATA MANAGEMENT
                </span>

                <h2>
                  Orders & Transactions
                </h2>

                <p>
                  Manage customers,
                  transactions and statuses.
                </p>
              </div>

              <div className="heading-actions">
                <button
                  className="outline-button"
                  onClick={exportCSV}
                >
                  ↓ CSV
                </button>

                <button
                  className="outline-button"
                  onClick={() =>
                    window.print()
                  }
                >
                  PDF / Print
                </button>
              </div>
            </div>

            <div className="dashboard-panel table-panel">
              <div className="table-controls">
                <div className="table-search">
                  ⌕
                  <input
                    placeholder="Search orders..."
                    value={orderSearch}
                    onChange={(e) =>
                      setOrderSearch(
                        e.target.value
                      )
                    }
                  />
                </div>

                <select
                  value={orderStatus}
                  onChange={(e) =>
                    setOrderStatus(
                      e.target.value
                    )
                  }
                >
                  <option>
                    All
                  </option>

                  <option>
                    Completed
                  </option>

                  <option>
                    Pending
                  </option>

                  <option>
                    Failed
                  </option>
                </select>

                <select
                  value={currency}
                  onChange={(e) =>
                    setCurrency(
                      e.target.value
                    )
                  }
                >
                  <option value="INR">
                    ₹ INR
                  </option>

                  <option value="USD">
                    $ USD
                  </option>

                  <option value="EUR">
                    € EUR
                  </option>
                </select>

                <select
                  value={rowsPerPage}
                  onChange={(e) =>
                    setRowsPerPage(
                      Number(
                        e.target.value
                      )
                    )
                  }
                >
                  <option value={10}>
                    10 rows
                  </option>

                  <option value={25}>
                    25 rows
                  </option>

                  <option value={50}>
                    50 rows
                  </option>
                </select>

                <button
                  className="outline-button"
                  onClick={() =>
                    setZenMode(
                      !zenMode
                    )
                  }
                >
                  ⛶ Zen
                </button>
              </div>

              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>
                        <input
                          type="checkbox"
                        />
                      </th>

                      <th>
                        Order ID
                      </th>

                      <th>
                        Customer
                      </th>

                      <th>
                        Date & Time
                      </th>

                      <th>
                        Amount
                      </th>

                      <th>
                        Status
                      </th>

                      <th>
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredOrders
                      .slice(
                        0,
                        rowsPerPage
                      )
                      .map((order) => (
                        <tr
                          key={order.id}
                        >
                          <td>
                            <input
                              type="checkbox"
                            />
                          </td>

                          <td>
                            <strong>
                              {order.id}
                            </strong>
                          </td>

                          <td>
                            <div className="customer-cell">
                              <div className="small-avatar">
                                {order.customer
                                  .charAt(
                                    0
                                  )
                                  .toUpperCase()}
                              </div>

                              <div>
                                <strong>
                                  {
                                    order.customer
                                  }
                                </strong>

                                <span>
                                  {
                                    order.email
                                  }
                                </span>
                              </div>
                            </div>
                          </td>

                          <td>
                            <strong>
                              {order.date}
                            </strong>

                            <span className="table-muted">
                              {order.time}
                            </span>
                          </td>

                          <td>
                            <strong>
                              {formatCurrency(
                                order.amount
                              )}
                            </strong>
                          </td>

                          <td>
                            <span
                              className={`status-pill ${order.status.toLowerCase()}`}
                            >
                              {order.status}
                            </span>
                          </td>

                          <td>
                            <div className="table-actions">
                              <button
                                title="View"
                              >
                                👁
                              </button>

                              <button
                                title="Edit"
                              >
                                ✎
                              </button>

                              <button
                                title="Delete"
                                onClick={() =>
                                  setOrders(
                                    (current) =>
                                      current.filter(
                                        (item) =>
                                          item.id !==
                                          order.id
                                      )
                                  )
                                }
                              >
                                ×
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              <div className="table-footer">
                <span>
                  Showing 1–
                  {
                    Math.min(
                      rowsPerPage,
                      filteredOrders.length
                    )
                  }{" "}
                  of{" "}
                  {filteredOrders.length}{" "}
                  results
                </span>

                <div className="pagination">
                  <button>
                    ←
                  </button>

                  <button className="active">
                    1
                  </button>

                  <button>
                    2
                  </button>

                  <button>
                    3
                  </button>

                  <button>
                    →
                  </button>
                </div>
              </div>
            </div>

            <div className="three-grid">
              <div className="dashboard-panel financial-card">
                <span className="eyebrow">
                  FINANCIAL
                </span>

                <h2>
                  Average Order Value
                </h2>

                <strong>
                  ₹8,492
                </strong>

                <small className="positive">
                  +7.8% compared to last month
                </small>
              </div>

              <div className="dashboard-panel financial-card">
                <span className="eyebrow">
                  REFUNDS
                </span>

                <h2>
                  Refunds & Chargebacks
                </h2>

                <strong>
                  28
                </strong>

                <small>
                  2.4% of total transactions
                </small>
              </div>

              <div className="dashboard-panel financial-card">
                <span className="eyebrow">
                  AUTOMATION
                </span>

                <h2>
                  Active Automations
                </h2>

                <strong>
                  3
                </strong>

                <small className="positive">
                  All workflows running
                </small>
              </div>
            </div>
          </section>
        )}

        {/* =================================================
            WORLD CLOCK
        ================================================= */}

        {activePage === "clocks" && (
          <section className="page-section">
            <div className="section-heading">
              <div>
                <span className="eyebrow">
                  GLOBAL TIME
                </span>

                <h2>
                  World Clock
                </h2>

                <p>
                  Live time across major regions.
                </p>
              </div>

              <div className="live-clock-main">
                {currentTime.toLocaleTimeString(
                  "en-IN"
                )}
              </div>
            </div>

            <div className="clock-grid">
              {cities.map((city) => (
                <div
                  className="clock-card"
                  key={city.zone}
                >
                  <div className="clock-top">
                    <span className="clock-flag">
                      {city.flag}
                    </span>

                    <span className="clock-zone">
                      {city.country}
                    </span>
                  </div>

                  <h3>
                    {city.city}
                  </h3>

                  <strong>
                    {currentTime.toLocaleTimeString(
                      "en-US",
                      {
                        timeZone:
                          city.zone,
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: true
                      }
                    )}
                  </strong>

                  <p>
                    {currentTime.toLocaleDateString(
                      "en-IN",
                      {
                        timeZone:
                          city.zone,
                        weekday: "short",
                        day: "2-digit",
                        month: "short",
                        year: "numeric"
                      }
                    )}
                  </p>

                  <div className="clock-bar">
                    <span />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* =================================================
            PROFILE
        ================================================= */}

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
                <span className="eyebrow">
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
              <h2>
                Personal Information
              </h2>

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
                onClick={
                  updateProfile
                }
              >
                Save Changes
              </button>
            </div>

            <div className="three-grid">
              <div className="dashboard-panel">
                <span className="eyebrow">
                  SECURITY
                </span>

                <h2>
                  Authentication
                </h2>

                <p>
                  Firebase Authentication
                </p>

                <span className="status-pill completed">
                  Protected
                </span>
              </div>

              <div className="dashboard-panel">
                <span className="eyebrow">
                  PROVIDER
                </span>

                <h2>
                  Login Provider
                </h2>

                <p>
                  Email / Google
                </p>

                <span className="status-pill completed">
                  Connected
                </span>
              </div>

              <div className="dashboard-panel">
                <span className="eyebrow">
                  DATABASE
                </span>

                <h2>
                  Realtime Database
                </h2>

                <p>
                  Firebase RTDB
                </p>

                <span className="status-pill completed">
                  Synced
                </span>
              </div>
            </div>
          </section>
        )}

        {/* =================================================
            SETTINGS
        ================================================= */}

        {activePage === "settings" && (
          <section className="page-section">
            <div className="section-heading">
              <div>
                <span className="eyebrow">
                  CONFIGURATION
                </span>

                <h2>
                  Settings
                </h2>

                <p>
                  Manage your dashboard
                  preferences.
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
                    Receive notifications about
                    your account
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
                    Get alerts about new account
                    activity
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

              <div className="setting-row">
                <div>
                  <strong>
                    Auto Refresh
                  </strong>

                  <span>
                    Automatically refresh dashboard
                    data
                  </span>
                </div>

                <select
                  value={autoRefresh}
                  onChange={(e) =>
                    setAutoRefresh(
                      e.target.value
                    )
                  }
                >
                  <option value="off">
                    Off
                  </option>

                  <option value="5s">
                    Every 5 seconds
                  </option>

                  <option value="30s">
                    Every 30 seconds
                  </option>

                  <option value="1m">
                    Every minute
                  </option>
                </select>
              </div>

              <div className="setting-row">
                <div>
                  <strong>
                    Dashboard Layout
                  </strong>

                  <span>
                    Enter distraction-free Zen
                    Mode
                  </span>
                </div>

                <button
                  className="outline-button"
                  onClick={() =>
                    setZenMode(
                      !zenMode
                    )
                  }
                >
                  {zenMode
                    ? "Exit Zen"
                    : "Enter Zen"}
                </button>
              </div>

              <div className="setting-row">
                <div>
                  <strong>
                    Currency
                  </strong>

                  <span>
                    Choose dashboard display
                    currency
                  </span>
                </div>

                <select
                  value={currency}
                  onChange={(e) =>
                    setCurrency(
                      e.target.value
                    )
                  }
                >
                  <option value="INR">
                    ₹ INR
                  </option>

                  <option value="USD">
                    $ USD
                  </option>

                  <option value="EUR">
                    € EUR
                  </option>
                </select>
              </div>

              <div className="setting-row">
                <div>
                  <strong>
                    Keyboard Shortcuts
                  </strong>

                  <span>
                    View available shortcuts
                  </span>
                </div>

                <button
                  className="outline-button"
                  onClick={() =>
                    setShowShortcuts(
                      true
                    )
                  }
                >
                  Ctrl + K
                </button>
              </div>

              <div className="setting-row">
                <div>
                  <strong>
                    Version
                  </strong>

                  <span>
                    RAF AI Dashboard release
                  </span>
                </div>

                <span className="version-badge">
                  v2.4.0
                </span>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* =================================================
          CHAT DRAWER
      ================================================= */}

      {showChat && (
        <div className="chat-drawer">
          <div className="chat-header">
            <div>
              <strong>
                RAF Support
              </strong>

              <span>
                ● Online
              </span>
            </div>

            <button
              onClick={() =>
                setShowChat(false)
              }
            >
              ×
            </button>
          </div>

          <div className="chat-body">
            {chatMessages.map(
              (item) => (
                <div
                  className={
                    item.from === "You"
                      ? "chat-message mine"
                      : "chat-message"
                  }
                  key={item.id}
                >
                  <small>
                    {item.from}
                  </small>

                  <p>
                    {item.text}
                  </p>
                </div>
              )
            )}
          </div>

          <div className="chat-input">
            <input
              placeholder="Write a message..."
              value={chatInput}
              onChange={(e) =>
                setChatInput(
                  e.target.value
                )
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendChat();
                }
              }}
            />

            <button
              onClick={sendChat}
            >
              →
            </button>
          </div>
        </div>
      )}

      {/* =================================================
          BUG REPORT
      ================================================= */}

      <button
        className="bug-floating"
        onClick={() =>
          setShowBugReport(true)
        }
      >
        🐛
        <span>
          Report a Bug
        </span>
      </button>

      {showBugReport && (
        <div className="modal-backdrop">
          <div className="modal">
            <div className="modal-header">
              <div>
                <span className="eyebrow">
                  FEEDBACK
                </span>

                <h2>
                  Report a Bug
                </h2>
              </div>

              <button
                onClick={() =>
                  setShowBugReport(
                    false
                  )
                }
              >
                ×
              </button>
            </div>

            <textarea
              placeholder="Describe the problem..."
              rows="6"
            />

            <button
              className="save-button"
              onClick={() => {
                setShowBugReport(
                  false
                );

                setMessage(
                  "Bug report submitted!"
                );

                setTimeout(() => {
                  setMessage("");
                }, 2500);
              }}
            >
              Submit Report
            </button>
          </div>
        </div>
      )}

      {/* =================================================
          SHORTCUT MODAL
      ================================================= */}

      {showShortcuts && (
        <div className="modal-backdrop">
          <div className="modal shortcut-modal">
            <div className="modal-header">
              <div>
                <span className="eyebrow">
                  RAF AI
                </span>

                <h2>
                  What's New
                </h2>
              </div>

              <button
                onClick={() =>
                  setShowShortcuts(
                    false
                  )
                }
              >
                ×
              </button>
            </div>

            <div className="shortcut-list">
              <div>
                <kbd>Ctrl</kbd>
                <span>+</span>
                <kbd>K</kbd>
                <p>
                  Focus global search
                </p>
              </div>

              <div>
                <kbd>ESC</kbd>
                <p>
                  Close modal / drawer
                </p>
              </div>

              <div>
                <kbd>+</kbd>
                <p>
                  Add tasks from dashboard
                </p>
              </div>

              <div>
                <strong>
                  v2.4.0
                </strong>

                <p>
                  Added World Clock,
                  Pomodoro Timer,
                  advanced analytics,
                  orders table and productivity
                  widgets.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =================================================
          SESSION WARNING
      ================================================= */}

      <div className="session-badge">
        🔐 Session expires in 5 mins
      </div>
    </div>
  );
}

export default Dashboard;
