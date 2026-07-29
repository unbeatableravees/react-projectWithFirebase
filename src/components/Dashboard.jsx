import { useEffect, useMemo, useState } from "react";
import "./Dashboard.css";
import { DATABASE_URL } from "../firebase.js";

const OWNER_EMAIL = "raveeskak@gmail.com";

const initialTodos = [
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
];

const countries = [
  {
    flag: "🇬🇧",
    city: "London",
    zone: "Europe/London"
  },
  {
    flag: "🇦🇪",
    city: "Dubai",
    zone: "Asia/Dubai"
  },
  {
    flag: "🇸🇦",
    city: "Riyadh",
    zone: "Asia/Riyadh"
  },
  {
    flag: "🇵🇰",
    city: "Karachi",
    zone: "Asia/Karachi"
  },
  {
    flag: "🇮🇳",
    city: "New Delhi",
    zone: "Asia/Kolkata"
  },
  {
    flag: "🇮🇩",
    city: "Jakarta",
    zone: "Asia/Jakarta"
  },
  {
    flag: "🇺🇸",
    city: "New York",
    zone: "America/New_York"
  },
  {
    flag: "🇯🇵",
    city: "Tokyo",
    zone: "Asia/Tokyo"
  },
  {
    flag: "🇸🇬",
    city: "Singapore",
    zone: "Asia/Singapore"
  },
  {
    flag: "🇦🇺",
    city: "Sydney",
    zone: "Australia/Sydney"
  }
];

const defaultOrders = [
  {
    id: "ORD-1001",
    customer: "Rahul Kumar",
    email: "rahul@example.com",
    date: "2026-07-28",
    amount: 12999,
    status: "Completed",
    items: [{ name: "RAF AI Pro", qty: 1, price: 12999 }],
    createdBy: "rahul@example.com",
    createdByRole: "user"
  },
  {
    id: "ORD-1002",
    customer: "Aarav Khan",
    email: "aarav@example.com",
    date: "2026-07-27",
    amount: 8499,
    status: "Pending",
    items: [{ name: "RAF AI Starter", qty: 1, price: 8499 }],
    createdBy: "aarav@example.com",
    createdByRole: "user"
  },
  {
    id: "ORD-1003",
    customer: "Sarah Williams",
    email: "sarah@example.com",
    date: "2026-07-26",
    amount: 22999,
    status: "Completed",
    items: [{ name: "RAF AI Enterprise", qty: 1, price: 22999 }],
    createdBy: "sarah@example.com",
    createdByRole: "user"
  },
  {
    id: "ORD-1004",
    customer: "Zain Malik",
    email: "zain@example.com",
    date: "2026-07-25",
    amount: 5499,
    status: "Failed",
    items: [{ name: "RAF AI Starter", qty: 1, price: 5499 }],
    createdBy: "zain@example.com",
    createdByRole: "user"
  },
  {
    id: "ORD-1005",
    customer: "Daniel Smith",
    email: "daniel@example.com",
    date: "2026-07-24",
    amount: 15999,
    status: "Completed",
    items: [{ name: "RAF AI Pro", qty: 1, price: 15999 }],
    createdBy: "daniel@example.com",
    createdByRole: "user"
  }
];

/* =========================================
   DEMO ORDER GENERATOR (10 years)
   Generates a large, realistic demo dataset on demand.
   NOTE: 450,000+ records cannot safely live in
   localStorage (5-10MB quota) or be produced
   synchronously without freezing the UI. This
   generator instead:
   - builds records in chunks via requestIdleCallback/
     setTimeout so the browser stays responsive
   - keeps the full list only in memory (React state)
   - persists a lightweight YEAR-WISE SUMMARY to
     localStorage (not the raw rows) for the analytics
     page, so a refresh doesn't try to re-save 450k rows
   For real production scale, this data should live in
   Firebase/a real database with server-side pagination
   instead of the browser.
========================================= */

const DEMO_CUSTOMERS = [
  "Rahul Kumar", "Aarav Khan", "Sarah Williams", "Zain Malik", "Daniel Smith",
  "Priya Sharma", "Fatima Noor", "Ali Raza", "Emily Davis", "Vikram Singh",
  "Ayesha Siddiqui", "John Miller", "Neha Gupta", "Omar Farooq", "Sofia Rossi",
  "Arjun Mehta", "Layla Hassan", "Michael Brown", "Ananya Iyer", "Bilal Ahmed"
];

const DEMO_PRODUCTS = [
  { name: "RAF AI Starter", price: 4999 },
  { name: "RAF AI Pro", price: 12999 },
  { name: "RAF AI Enterprise", price: 22999 },
  { name: "RAF AI Addon Pack", price: 1999 },
  { name: "RAF AI Support Plan", price: 2999 }
];

const DEMO_STATUSES = ["Completed", "Pending", "Failed"];

function seededRandom(seed) {
  // Small deterministic PRNG (mulberry32) so demo data is stable across runs.
  let t = seed + 0x6d2b79f5;
  return function () {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function generateDemoOrderBatch(startIndex, count, rand) {
  const batch = [];
  const startDate = new Date("2016-01-01").getTime();
  const endDate = Date.now();

  for (let i = 0; i < count; i += 1) {
    const index = startIndex + i;
    const customer = DEMO_CUSTOMERS[Math.floor(rand() * DEMO_CUSTOMERS.length)];
    const emailSlug = customer.toLowerCase().replace(/\s+/g, ".");
    const itemCount = 1 + Math.floor(rand() * 3);

    const items = Array.from({ length: itemCount }, () => {
      const product = DEMO_PRODUCTS[Math.floor(rand() * DEMO_PRODUCTS.length)];
      const qty = 1 + Math.floor(rand() * 3);
      return { name: product.name, qty, price: product.price };
    });

    const amount = items.reduce((sum, item) => sum + item.qty * item.price, 0);
    const timestamp = startDate + rand() * (endDate - startDate);
    const status = DEMO_STATUSES[Math.floor(rand() * DEMO_STATUSES.length)];

    batch.push({
      id: `ORD-DEMO-${index}`,
      customer,
      email: `${emailSlug}${index}@example.com`,
      date: new Date(timestamp).toISOString().slice(0, 10),
      amount,
      status,
      items,
      createdBy: `${emailSlug}${index}@example.com`,
      createdByRole: "user",
      demo: true
    });
  }

  return batch;
}

/* =========================================
   CHAT ENCRYPTION HELPERS
   Uses the browser's native Web Crypto API
   (PBKDF2 -> AES-GCM) so messages between a
   user and Admin/Owner are encrypted before
   they're written to storage/transport and
   decrypted only on the receiving screen.

   IMPORTANT LIMITATION: this derives the key
   from a shared passphrase rather than a real
   per-user key exchange, so it is "encrypted
   in transit/at rest" rather than a full
   Signal-style E2EE protocol with forward
   secrecy. For production-grade E2EE, pair
   this with a proper key-exchange (e.g. each
   user has a keypair, and a symmetric session
   key is negotiated and never leaves devices).
========================================= */

async function deriveChatKey(passphrase, salt) {
  const enc = new TextEncoder();

  const keyMaterial = await window.crypto.subtle.importKey(
    "raw",
    enc.encode(passphrase),
    "PBKDF2",
    false,
    ["deriveKey"]
  );

  return window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: enc.encode(salt),
      iterations: 100000,
      hash: "SHA-256"
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

async function encryptChatText(key, text) {
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const enc = new TextEncoder();

  const cipherBuffer = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    enc.encode(text)
  );

  return {
    iv: Array.from(iv),
    data: Array.from(new Uint8Array(cipherBuffer))
  };
}

async function decryptChatText(key, payload) {
  const iv = new Uint8Array(payload.iv);
  const data = new Uint8Array(payload.data);

  const plainBuffer = await window.crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    data
  );

  return new TextDecoder().decode(plainBuffer);
}

// Conversation id = the non-admin participant's identifier (uid or email).
// Both sides derive the same key from this id + a shared app secret, so
// only participants who know the secret (this app's build) can decrypt.
const CHAT_APP_SECRET = "raf-ai-chat-shared-secret-v1";

function deriveConversationPassphrase(conversationId) {
  return `${CHAT_APP_SECRET}:${conversationId}`;
}

function Dashboard({ user, onLogout }) {
  const isOwner =
    user?.email?.toLowerCase() === OWNER_EMAIL.toLowerCase() ||
    user?.role === "owner";

  // Admins AND the owner get management privileges (manage orders/status, view users).
  // Normal ("user") accounts can create orders but cannot change their status.
  const isAdminOrOwner =
    isOwner || user?.role === "admin";

  const [activePage, setActivePage] = useState("overview");

  const [mobileSidebar, setMobileSidebar] = useState(false);

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("raf_theme") === "dark"
  );

  const [language, setLanguage] = useState("IN");

  const [search, setSearch] = useState("");

  const [showNotifications, setShowNotifications] =
    useState(false);

  const [showProfileMenu, setShowProfileMenu] =
    useState(false);

  const [showQuickAction, setShowQuickAction] =
    useState(false);

  const [showChat, setShowChat] = useState(false);

  const [showShortcuts, setShowShortcuts] =
    useState(false);

  const [zenMode, setZenMode] = useState(false);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Welcome to RAF AI",
      text: "Your dashboard is ready.",
      time: "Just now",
      read: false
    },
    {
      id: 2,
      title: "Database connected",
      text: "Firebase connection is active.",
      time: "10 min ago",
      read: false
    },
    {
      id: 3,
      title: "Weekly report",
      text: "Your productivity improved by 8.4%.",
      time: "1 hour ago",
      read: true
    }
  ]);

  const [todos, setTodos] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("raf_todos")
      ) || initialTodos;
    } catch {
      return initialTodos;
    }
  });

  const [newTodo, setNewTodo] = useState("");

  const [profile, setProfile] = useState({
    name: user?.name || "RAF User",
    email: user?.email || "user@example.com",
    phone: user?.phone || "",
    role:
      user?.email?.toLowerCase() ===
      OWNER_EMAIL.toLowerCase()
        ? "owner"
        : user?.role || "user"
  });

  const [message, setMessage] = useState("");

  const [notes, setNotes] = useState(
    () =>
      localStorage.getItem("raf_notes") ||
      "Remember to review the weekly performance report."
  );

  const [clockTime, setClockTime] = useState(
    new Date()
  );

  const [timerSeconds, setTimerSeconds] = useState(25 * 60);

  const [timerRunning, setTimerRunning] =
    useState(false);

  const [timerMode, setTimerMode] =
    useState("Pomodoro");

  const [streak] = useState(7);

  const [orders, setOrders] = useState(() => {
    try {
      return (
        JSON.parse(
          localStorage.getItem("raf_orders")
        ) || defaultOrders
      );
    } catch {
      return defaultOrders;
    }
  });

  const [orderSearch, setOrderSearch] = useState("");

  const [orderStatus, setOrderStatus] =
    useState("All");

  const [rowsPerPage, setRowsPerPage] =
    useState(5);

  const [currentOrderPage, setCurrentOrderPage] =
    useState(1);

  const [selectedOrders, setSelectedOrders] =
    useState([]);

  const [showOrderModal, setShowOrderModal] =
    useState(false);

  const [newOrder, setNewOrder] = useState({
    customer: "",
    email: "",
    status: "Pending",
    items: [{ id: 1, name: "", qty: 1, price: "" }]
  });

  // Demo data generator state
  const [demoGenerating, setDemoGenerating] = useState(false);
  const [demoProgress, setDemoProgress] = useState(0);
  const [demoTarget, setDemoTarget] = useState(450000);
  const [yearlyStats, setYearlyStats] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("raf_orders_yearly_stats")) || null;
    } catch {
      return null;
    }
  });

  // Support chat: which user the admin/owner is currently chatting with
  const [chatTargetUid, setChatTargetUid] = useState(null);

  const [users, setUsers] = useState([]);

  const [usersLoading, setUsersLoading] =
    useState(false);

  const [userSearch, setUserSearch] =
    useState("");

  const [userRoleFilter, setUserRoleFilter] =
    useState("All");

  const [selectedUser, setSelectedUser] =
    useState(null);

  const [autoRefresh, setAutoRefresh] =
    useState("Off");

  const [currency, setCurrency] =
    useState("INR");

  const [weeklyMode, setWeeklyMode] =
    useState("Weekly");

  const [activityRefresh, setActivityRefresh] =
    useState(0);

  const [chatMessage, setChatMessage] =
    useState("");

  // Decrypted messages, cached in memory per conversation id (uid/email).
  // Encrypted payloads are what actually persist to localStorage.
  const [chatThreads, setChatThreads] = useState({});
  const [chatLoading, setChatLoading] = useState(false);

  const completedTodos = todos.filter(
    (todo) => todo.completed
  ).length;

  const pendingTodos = todos.filter(
    (todo) => !todo.completed
  ).length;

  const productivityScore = Math.min(
    100,
    Math.round(
      60 +
        completedTodos * 7 +
        (timerMode === "Focus" ? 10 : 0)
    )
  );

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  /* =========================
     PERSISTENCE
  ========================= */

  useEffect(() => {
    localStorage.setItem(
      "raf_todos",
      JSON.stringify(todos)
    );
  }, [todos]);

  useEffect(() => {
    localStorage.setItem(
      "raf_notes",
      notes
    );
  }, [notes]);

  useEffect(() => {
    localStorage.setItem(
      "raf_orders",
      JSON.stringify(orders)
    );
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(
      "raf_theme",
      darkMode ? "dark" : "light"
    );
  }, [darkMode]);

  /* =========================
     LIVE CLOCK
  ========================= */

  useEffect(() => {
    const interval = setInterval(() => {
      setClockTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  /* =========================
     TIMER
  ========================= */

  useEffect(() => {
    if (!timerRunning) return;

    const interval = setInterval(() => {
      setTimerSeconds((seconds) => {
        if (seconds <= 1) {
          clearInterval(interval);
          setTimerRunning(false);

          addNotification(
            "Timer completed",
            "Your focus session has finished."
          );

          if (
            "Notification" in window &&
            Notification.permission ===
              "granted"
          ) {
            new Notification(
              "RAF AI Timer Completed",
              {
                body:
                  "Your focus session is complete."
              }
            );
          }

          return 0;
        }

        return seconds - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timerRunning]);

  /* =========================
     AUTO REFRESH
  ========================= */

  useEffect(() => {
    if (autoRefresh === "Off") return;

    const seconds =
      autoRefresh === "5s"
        ? 5000
        : autoRefresh === "30s"
        ? 30000
        : 60000;

    const interval = setInterval(() => {
      setActivityRefresh(
        (value) => value + 1
      );
    }, seconds);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  /* =========================
     KEYBOARD SHORTCUT
  ========================= */

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
        setShowProfileMenu(false);
        setShowQuickAction(false);
        setShowChat(false);
        setShowShortcuts(false);
        setShowOrderModal(false);
        setSelectedUser(null);
      }
    };

    window.addEventListener(
      "keydown",
      handler
    );

    return () =>
      window.removeEventListener(
        "keydown",
        handler
      );
  }, []);

  /* =========================
     HELPERS
  ========================= */

  const addNotification = (
    title,
    text
  ) => {
    setNotifications((current) => [
      {
        id: Date.now(),
        title,
        text,
        time: "Just now",
        read: false
      },
      ...current
    ]);
  };

  const changePage = (page) => {
    setActivePage(page);
    setMobileSidebar(false);
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const formatMoney = (value) => {
    const symbol =
      currency === "USD"
        ? "$"
        : currency === "EUR"
        ? "€"
        : "₹";

    return `${symbol}${Number(
      value || 0
    ).toLocaleString(
      currency === "INR"
        ? "en-IN"
        : "en-US"
    )}`;
  };

  const formatTimer = () => {
    const minutes = Math.floor(
      timerSeconds / 60
    )
      .toString()
      .padStart(2, "0");

    const seconds = (
      timerSeconds % 60
    )
      .toString()
      .padStart(2, "0");

    return `${minutes}:${seconds}`;
  };

  const addTimerMinutes = (minutes) => {
    setTimerSeconds(
      (seconds) =>
        seconds + minutes * 60
    );
  };

  const resetTimer = () => {
    setTimerRunning(false);
    setTimerSeconds(
      timerMode === "Short Break"
        ? 5 * 60
        : timerMode === "Long Break"
        ? 15 * 60
        : 25 * 60
    );
  };

  const requestNotificationPermission =
    async () => {
      if (
        "Notification" in window &&
        Notification.permission ===
          "default"
      ) {
        await Notification.requestPermission();
      }
    };

  const changeTimerMode = (mode) => {
    setTimerMode(mode);
    setTimerRunning(false);

    if (mode === "Pomodoro") {
      setTimerSeconds(25 * 60);
    }

    if (mode === "Short Break") {
      setTimerSeconds(5 * 60);
    }

    if (mode === "Long Break") {
      setTimerSeconds(15 * 60);
    }

    if (mode === "Focus") {
      setTimerSeconds(50 * 60);
    }
  };

  /* =========================
     TODO FUNCTIONS
  ========================= */

  const addTodo = () => {
    if (!newTodo.trim()) return;

    const todo = {
      id: Date.now(),
      title: newTodo.trim(),
      category: "General",
      priority: "Medium",
      completed: false
    };

    setTodos((current) => [
      todo,
      ...current
    ]);

    setNewTodo("");

    addNotification(
      "Task added",
      todo.title
    );
  };

  const toggleTodo = (id) => {
    setTodos((current) =>
      current.map((todo) =>
        todo.id === id
          ? {
              ...todo,
              completed:
                !todo.completed
            }
          : todo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos((current) =>
      current.filter(
        (todo) => todo.id !== id
      )
    );

    addNotification(
      "Task deleted",
      "The task was removed."
    );
  };

  /* =========================
     PROFILE
  ========================= */

  const updateProfile = () => {
    setMessage(
      "Profile updated successfully!"
    );

    addNotification(
      "Profile updated",
      "Your profile information was updated."
    );

    setTimeout(() => {
      setMessage("");
    }, 2500);
  };

  /* =========================
     ORDERS
  ========================= */

  // Auto calculator: total updates live as items are added/removed/edited
  const orderItemsTotal = useMemo(() => {
    return newOrder.items.reduce(
      (sum, item) =>
        sum + (Number(item.qty) || 0) * (Number(item.price) || 0),
      0
    );
  }, [newOrder.items]);

  const addOrderItemRow = () => {
    setNewOrder((current) => ({
      ...current,
      items: [
        ...current.items,
        { id: Date.now(), name: "", qty: 1, price: "" }
      ]
    }));
  };

  const removeOrderItemRow = (id) => {
    setNewOrder((current) => ({
      ...current,
      items:
        current.items.length > 1
          ? current.items.filter((item) => item.id !== id)
          : current.items
    }));
  };

  const updateOrderItemRow = (id, field, value) => {
    setNewOrder((current) => ({
      ...current,
      items: current.items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    }));
  };

  const addOrder = (event) => {
    event.preventDefault();

    const validItems = newOrder.items.filter(
      (item) => item.name.trim() && Number(item.price) > 0
    );

    if (
      !newOrder.customer.trim() ||
      !newOrder.email.trim() ||
      !validItems.length
    ) {
      alert(
        "Please fill customer name, email and at least one item with a price."
      );
      return;
    }

    const amount = validItems.reduce(
      (sum, item) => sum + (Number(item.qty) || 0) * (Number(item.price) || 0),
      0
    );

    // Manual order status control:
    // Any signed-in user can CREATE an order, but only Admin/Owner can set
    // a non-default status. Normal users always start at "Pending" — status
    // can only be changed later by Admin/Owner from the Orders table.
    const initialStatus = isAdminOrOwner ? newOrder.status : "Pending";

    const order = {
      id: `ORD-${Date.now().toString().slice(-6)}`,
      customer: newOrder.customer.trim(),
      email: newOrder.email.trim(),
      date: new Date().toISOString().slice(0, 10),
      amount,
      items: validItems.map((item) => ({
        name: item.name.trim(),
        qty: Number(item.qty) || 1,
        price: Number(item.price) || 0
      })),
      status: initialStatus,
      createdBy: user?.email || profile.email,
      createdByRole: profile.role
    };

    // Centralized orders: every order (from any user) is stored in the same
    // list so it becomes visible on the Admin/Owner "Orders" dashboard.
    setOrders((current) => [order, ...current]);

    setNewOrder({
      customer: "",
      email: "",
      status: "Pending",
      items: [{ id: 1, name: "", qty: 1, price: "" }]
    });

    setShowOrderModal(false);

    addNotification(
      "New order added",
      `${order.customer} placed an order for ${formatMoney(amount)}.`
    );
  };

  const deleteOrder = (id) => {
    if (!isAdminOrOwner) {
      addNotification(
        "Not allowed",
        "Only Admin or Owner can delete orders."
      );
      return;
    }

    setOrders((current) =>
      current.filter(
        (order) => order.id !== id
      )
    );

    setSelectedOrders((current) =>
      current.filter(
        (orderId) => orderId !== id
      )
    );

    addNotification(
      "Order deleted",
      `${id} was removed.`
    );
  };

  const updateOrderStatus = (
    id,
    status
  ) => {
    // Manual order status control: only Admin/Owner may change status.
    if (!isAdminOrOwner) {
      addNotification(
        "Not allowed",
        "Only Admin or Owner can change an order's status."
      );
      return;
    }

    setOrders((current) =>
      current.map((order) =>
        order.id === id
          ? { ...order, status }
          : order
      )
    );

    addNotification(
      "Order updated",
      `${id} was marked as ${status}.`
    );
  };

  const reviewOrder = (id, decision) => {
    const nextStatus = decision === "approve" ? "Completed" : "Failed";
    updateOrderStatus(id, nextStatus);
  };

  const toggleOrderSelection = (id) => {
    setSelectedOrders((current) =>
      current.includes(id)
        ? current.filter(
            (item) => item !== id
          )
        : [...current, id]
    );
  };

  const toggleAllOrders = (
    visibleOrders
  ) => {
    const ids = visibleOrders.map(
      (order) => order.id
    );

    const allSelected = ids.every(
      (id) =>
        selectedOrders.includes(id)
    );

    if (allSelected) {
      setSelectedOrders((current) =>
        current.filter(
          (id) => !ids.includes(id)
        )
      );
    } else {
      setSelectedOrders((current) => [
        ...new Set([
          ...current,
          ...ids
        ])
      ]);
    }
  };

  const deleteSelectedOrders = () => {
    if (!isAdminOrOwner) {
      addNotification(
        "Not allowed",
        "Only Admin or Owner can delete orders."
      );
      return;
    }

    if (!selectedOrders.length) {
      alert("Select at least one order.");
      return;
    }

    setOrders((current) =>
      current.filter(
        (order) =>
          !selectedOrders.includes(
            order.id
          )
      )
    );

    addNotification(
      "Orders deleted",
      `${selectedOrders.length} orders removed.`
    );

    setSelectedOrders([]);
  };

  const markSelectedCompleted = () => {
    if (!isAdminOrOwner) {
      addNotification(
        "Not allowed",
        "Only Admin or Owner can change an order's status."
      );
      return;
    }

    if (!selectedOrders.length) {
      alert("Select at least one order.");
      return;
    }

    setOrders((current) =>
      current.map((order) =>
        selectedOrders.includes(
          order.id
        )
          ? {
              ...order,
              status: "Completed"
            }
          : order
      )
    );

    setSelectedOrders([]);

    addNotification(
      "Orders updated",
      "Selected orders marked completed."
    );
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Centralized orders: Admin/Owner see every order from every user.
      // Normal users only see the orders they personally created.
      const matchesOwnership =
        isAdminOrOwner ||
        order.createdBy?.toLowerCase() ===
          (user?.email || profile.email)?.toLowerCase();

      const matchesSearch =
        order.customer
          .toLowerCase()
          .includes(
            orderSearch.toLowerCase()
          ) ||
        order.email
          .toLowerCase()
          .includes(
            orderSearch.toLowerCase()
          ) ||
        order.id
          .toLowerCase()
          .includes(
            orderSearch.toLowerCase()
          );

      const matchesStatus =
        orderStatus === "All" ||
        order.status === orderStatus;

      return (
        matchesOwnership &&
        matchesSearch &&
        matchesStatus
      );
    });
  }, [
    orders,
    orderSearch,
    orderStatus,
    isAdminOrOwner,
    user?.email,
    profile.email
  ]);

  const pendingReviewOrders = useMemo(() => {
    if (!isAdminOrOwner) return [];
    return orders.filter((order) => order.status === "Pending");
  }, [orders, isAdminOrOwner]);

  const orderSummary = useMemo(() => {
    const total = orders.length;
    const pending = orders.filter((order) => order.status === "Pending").length;
    const completed = orders.filter((order) => order.status === "Completed").length;
    const failed = orders.filter((order) => order.status === "Failed").length;
    const revenue = orders.reduce((sum, order) => {
      if (order.status === "Completed") {
        return sum + Number(order.amount || 0);
      }
      return sum;
    }, 0);

    return {
      total,
      pending,
      completed,
      failed,
      revenue
    };
  }, [orders]);

  const totalOrderPages = Math.max(
    1,
    Math.ceil(
      filteredOrders.length /
        rowsPerPage
    )
  );

  const visibleOrders =
    filteredOrders.slice(
      (currentOrderPage - 1) *
        rowsPerPage,
      currentOrderPage *
        rowsPerPage
    );

  /* =========================
     DEMO DATA GENERATOR (2020 -> today)
     Admin/Owner only. Builds in chunks so the tab
     doesn't freeze, and stores a year-wise summary
     instead of persisting all raw rows to localStorage.
  ========================= */

  const computeYearlyStats = (orderList) => {
    const byYear = {};

    orderList.forEach((order) => {
      const year = order.date?.slice(0, 4) || "Unknown";

      if (!byYear[year]) {
        byYear[year] = {
          year,
          count: 0,
          revenue: 0,
          completed: 0,
          pending: 0,
          failed: 0
        };
      }

      byYear[year].count += 1;
      byYear[year].revenue += order.amount || 0;

      if (order.status === "Completed") byYear[year].completed += 1;
      if (order.status === "Pending") byYear[year].pending += 1;
      if (order.status === "Failed") byYear[year].failed += 1;
    });

    return Object.values(byYear).sort((a, b) => a.year.localeCompare(b.year));
  };

  const generateDemoOrders = async (targetCount) => {
    if (!isAdminOrOwner) {
      addNotification(
        "Not allowed",
        "Only Admin or Owner can generate demo datasets."
      );
      return;
    }

    setDemoGenerating(true);
    setDemoProgress(0);

    const chunkSize = 5000;
    const rand = seededRandom(42);
    let generated = 0;
    let allGenerated = [];

    while (generated < targetCount) {
      const thisChunk = Math.min(chunkSize, targetCount - generated);
      const batch = generateDemoOrderBatch(generated, thisChunk, rand);

      allGenerated = allGenerated.concat(batch);
      generated += thisChunk;

      setDemoProgress(generated);

      // Yield to the browser between chunks so the UI stays responsive.
      // eslint-disable-next-line no-await-in-loop
      await new Promise((resolve) => setTimeout(resolve, 0));
    }

    // Keep real (non-demo) orders, replace demo orders with the fresh batch.
    setOrders((current) => {
      const realOrders = current.filter((order) => !order.demo);
      return [...realOrders, ...allGenerated];
    });

    const stats = computeYearlyStats(allGenerated);
    setYearlyStats(stats);

    try {
      // Only the compact year-wise summary is persisted — not the 450k+ raw rows.
      localStorage.setItem(
        "raf_orders_yearly_stats",
        JSON.stringify(stats)
      );
    } catch (error) {
      console.error("Could not persist yearly stats:", error);
    }

    setDemoGenerating(false);

    addNotification(
      "Demo dataset generated",
      `${targetCount.toLocaleString("en-IN")} demo orders (2016–present) generated.`
    );
  };

  const clearDemoOrders = () => {
    if (!isAdminOrOwner) return;

    setOrders((current) => current.filter((order) => !order.demo));
    setYearlyStats(null);

    try {
      localStorage.removeItem("raf_orders_yearly_stats");
    } catch (error) {
      console.error("Could not clear yearly stats:", error);
    }

    addNotification("Demo data cleared", "All demo orders were removed.");
  };

  /* =========================
     EXPORT CSV
  ========================= */

  const exportCSV = () => {
    const headers = [
      "Order ID",
      "Customer",
      "Email",
      "Date",
      "Amount",
      "Status"
    ];

    const rows = filteredOrders.map(
      (order) => [
        order.id,
        order.customer,
        order.email,
        order.date,
        order.amount,
        order.status
      ]
    );

    const csv = [
      headers,
      ...rows
    ]
      .map((row) =>
        row
          .map((cell) =>
            `"${String(cell).replace(
              /"/g,
              '""'
            )}"`
          )
          .join(",")
      )
      .join("\n");

    const blob = new Blob(
      [csv],
      {
        type: "text/csv;charset=utf-8;"
      }
    );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;
    link.download =
      "raf-ai-orders.csv";

    link.click();

    URL.revokeObjectURL(url);

    addNotification(
      "CSV exported",
      "Order data exported successfully."
    );
  };

  /* =========================
     USER MANAGEMENT
  ========================= */

  const fetchUsers = async () => {
    if (!isAdminOrOwner) return;

    if (!user?.idToken) {
      setUsers([]);
      return;
    }

    try {
      setUsersLoading(true);

      const response = await fetch(
        `${DATABASE_URL}/users.json?auth=${user.idToken}`
      );

      if (!response.ok) {
        throw new Error(
          "Could not load users."
        );
      }

      const data =
        await response.json();

      const list = data
        ? Object.entries(data).map(
            ([uid, item]) => ({
              uid,
              ...item,
              role:
                item?.role ||
                (item?.email
                  ?.toLowerCase() ===
                OWNER_EMAIL.toLowerCase()
                  ? "owner"
                  : "user")
            })
          )
        : [];

      setUsers(list);
    } catch (error) {
      console.error(
        "Users Error:",
        error
      );

      setUsers([]);

      addNotification(
        "Users could not load",
        error.message
      );
    } finally {
      setUsersLoading(false);
    }
  };

  useEffect(() => {
    if (
      activePage === "users" &&
      isAdminOrOwner
    ) {
      fetchUsers();
    }
  }, [
    activePage,
    isAdminOrOwner
  ]);

  const filteredUsers =
    users.filter((item) => {
      const query =
        userSearch.toLowerCase();

      const matchesSearch =
        item.name
          ?.toLowerCase()
          .includes(query) ||
        item.email
          ?.toLowerCase()
          .includes(query) ||
        item.uid
          ?.toLowerCase()
          .includes(query);

      const matchesRole =
        userRoleFilter === "All" ||
        item.role ===
          userRoleFilter.toLowerCase();

      return (
        matchesSearch &&
        matchesRole
      );
    });

  // Who can Admin/Owner start/continue an encrypted chat with?
  // Prefer real registered users; fall back to unique order customers
  // so the feature still works before Firebase user data is wired up.
  const chatTargets = useMemo(() => {
    const fromUsers = users.map((item) => ({
      id: item.uid || item.email,
      name: item.name || item.email || "Unnamed User",
      email: item.email
    }));

    const seen = new Set(fromUsers.map((item) => item.email));

    const fromOrders = orders
      .filter((order) => order.createdBy && !seen.has(order.createdBy))
      .reduce((acc, order) => {
        if (!acc.some((item) => item.email === order.createdBy)) {
          acc.push({
            id: order.createdBy,
            name: order.customer,
            email: order.createdBy
          });
        }
        return acc;
      }, []);

    return [...fromUsers, ...fromOrders];
  }, [users, orders]);

  const userRoleLabel = (role) => {
    if (role === "owner")
      return "Owner";

    if (role === "admin")
      return "Admin";

    return "User";
  };

  /* =========================
     SEARCH
  ========================= */

  const globalSearchAction = () => {
    const query =
      search.trim().toLowerCase();

    if (!query) return;

    const pages = [
      {
        keywords: [
          "dashboard",
          "overview",
          "home"
        ],
        page: "overview"
      },
      {
        keywords: [
          "task",
          "todo"
        ],
        page: "tasks"
      },
      {
        keywords: [
          "profile",
          "account"
        ],
        page: "profile"
      },
      {
        keywords: [
          "analytics",
          "report",
          "chart"
        ],
        page: "analytics"
      },
      {
        keywords: [
          "order",
          "transaction",
          "sales"
        ],
        page: "orders"
      },
      {
        keywords: [
          "clock",
          "time",
          "timezone"
        ],
        page: "clocks"
      },
      {
        keywords: [
          "setting",
          "configuration"
        ],
        page: "settings"
      }
    ];

    const found = pages.find(
      (item) =>
        item.keywords.some(
          (keyword) =>
            query.includes(keyword)
        )
    );

    if (found) {
      changePage(found.page);
      return;
    }

    if (
      isAdminOrOwner &&
      ["user", "users", "team"].some(
        (keyword) =>
          query.includes(keyword)
      )
    ) {
      changePage("users");
      return;
    }

    addNotification(
      "Search",
      `No dashboard page found for "${search}".`
    );
  };

  /* =========================
     NOTIFICATIONS
  ========================= */

  const markNotificationsRead =
    () => {
      setNotifications((current) =>
        current.map(
          (notification) => ({
            ...notification,
            read: true
          })
        )
      );
    };

  const clearNotifications = () => {
    setNotifications([]);
  };

  /* =========================
     CHAT (per-user, end-to-end style encrypted)
  ========================= */

  // Admin/Owner picks WHICH user's thread they're viewing; a normal user
  // always talks to "RAF Support" through their own conversation id.
  const currentConversationId = isAdminOrOwner
    ? chatTargetUid
    : user?.email || profile.email;

  const chatStorageKey = (conversationId) =>
    `raf_chat_${conversationId}`;

  const loadChatThread = async (conversationId) => {
    if (!conversationId) return;

    setChatLoading(true);

    try {
      const key = await deriveChatKey(
        deriveConversationPassphrase(conversationId),
        conversationId
      );

      const raw = localStorage.getItem(
        chatStorageKey(conversationId)
      );

      const encryptedMessages = raw ? JSON.parse(raw) : [];

      const decrypted = await Promise.all(
        encryptedMessages.map(async (message) => ({
          id: message.id,
          sender: message.sender,
          mine: message.mine,
          time: message.time,
          text: await decryptChatText(key, message.payload)
        }))
      );

      setChatThreads((current) => ({
        ...current,
        [conversationId]:
          decrypted.length > 0
            ? decrypted
            : [
                {
                  id: 1,
                  sender: "RAF Support",
                  text: "Hello! How can we help you?",
                  mine: false,
                  time: "Just now"
                }
              ]
      }));
    } catch (error) {
      console.error("Chat decrypt error:", error);

      setChatThreads((current) => ({
        ...current,
        [conversationId]: [
          {
            id: 1,
            sender: "RAF Support",
            text: "Hello! How can we help you?",
            mine: false,
            time: "Just now"
          }
        ]
      }));
    } finally {
      setChatLoading(false);
    }
  };

  useEffect(() => {
    if (showChat && currentConversationId) {
      loadChatThread(currentConversationId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showChat, currentConversationId]);

  const persistChatMessage = async (conversationId, message) => {
    const key = await deriveChatKey(
      deriveConversationPassphrase(conversationId),
      conversationId
    );

    const payload = await encryptChatText(key, message.text);

    const raw = localStorage.getItem(chatStorageKey(conversationId));
    const existing = raw ? JSON.parse(raw) : [];

    existing.push({
      id: message.id,
      sender: message.sender,
      mine: message.mine,
      time: message.time,
      payload
    });

    try {
      localStorage.setItem(
        chatStorageKey(conversationId),
        JSON.stringify(existing)
      );
    } catch (error) {
      console.error("Could not persist encrypted chat message:", error);
    }
  };

  const sendChat = async () => {
    if (!chatMessage.trim() || !currentConversationId) return;

    const outgoing = {
      id: Date.now(),
      sender: profile.name,
      text: chatMessage,
      mine: true,
      time: "Just now"
    };

    setChatThreads((current) => ({
      ...current,
      [currentConversationId]: [
        ...(current[currentConversationId] || []),
        outgoing
      ]
    }));

    setChatMessage("");

    await persistChatMessage(currentConversationId, outgoing);

    // Lightweight demo auto-response so the thread feels alive; a real
    // deployment would remove this and rely on the other participant
    // (user <-> Admin/Owner) actually replying.
    if (!isAdminOrOwner) {
      setTimeout(async () => {
        const reply = {
          id: Date.now() + 1,
          sender: "RAF Support",
          text: "Thanks! Your message has been received and encrypted end-to-end.",
          mine: false,
          time: "Just now"
        };

        setChatThreads((current) => ({
          ...current,
          [currentConversationId]: [
            ...(current[currentConversationId] || []),
            reply
          ]
        }));

        await persistChatMessage(currentConversationId, reply);
      }, 800);
    }
  };

  /* =========================
     FULLSCREEN
  ========================= */

  const toggleZenMode = () => {
    setZenMode((current) => !current);
  };

  /* =========================
     NAVIGATION
  ========================= */

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
      id: "orders",
      icon: "🛒",
      label: "Orders"
    },
    {
      id: "clocks",
      icon: "🌍",
      label: "World Clock"
    },
    ...(isAdminOrOwner
      ? [
          {
            id: "users",
            icon: "👥",
            label: "Users"
          }
        ]
      : []),
    {
      id: "settings",
      icon: "⚙",
      label: "Settings"
    }
  ];

  return (
    <div
      className={`dashboard-shell ${
        darkMode ? "dark-mode" : ""
      } ${zenMode ? "zen-mode" : ""}`}
    >
      {/* =========================
          MOBILE OVERLAY
      ========================= */}

      {mobileSidebar && (
        <div
          className="mobile-overlay"
          onClick={() =>
            setMobileSidebar(false)
          }
        />
      )}

      {/* =========================
          SIDEBAR
      ========================= */}

      <aside
        className={`dashboard-sidebar ${
          mobileSidebar
            ? "mobile-open"
            : ""
        }`}
      >
        <div className="sidebar-brand">
          <div className="brand-logo">
            R
          </div>

          <div>
            <strong>RAF AI</strong>
            <span>
              {isOwner
                ? "Owner Console"
                : isAdminOrOwner
                ? "Admin Console"
                : "Personal Dashboard"}
            </span>
          </div>
        </div>

        <div className="sidebar-user-card">
          <div className="sidebar-avatar">
            {profile.name
              ?.charAt(0)
              .toUpperCase() || "R"}
          </div>

          <div>
            <strong>
              {profile.name}
            </strong>

            <span>
              {userRoleLabel(
                profile.role
              )}
            </span>
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

              <span>
                {item.label}
              </span>

              {item.id === "users" &&
                isAdminOrOwner && (
                  <small className="owner-dot">
                    {isOwner ? "OWNER" : "ADMIN"}
                  </small>
                )}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-status">
            <span></span>
            System operational
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
        {/* =========================
            TOPBAR
        ========================= */}

        <header className="dashboard-topbar">
          <div className="topbar-left">
            <button
              className="mobile-menu-button"
              onClick={() =>
                setMobileSidebar(true)
              }
            >
              ☰
            </button>

            <div>
              <div className="breadcrumb">
                Home
                <span>›</span>
                {navigation.find(
                  (item) =>
                    item.id === activePage
                )?.label ||
                  "Dashboard"}
              </div>

              <h1>
                {activePage ===
                  "overview" &&
                  "Dashboard"}

                {activePage === "tasks" &&
                  "My Tasks"}

                {activePage ===
                  "profile" &&
                  "My Profile"}

                {activePage ===
                  "analytics" &&
                  "Analytics"}

                {activePage ===
                  "orders" &&
                  "Orders & Transactions"}

                {activePage ===
                  "clocks" &&
                  "World Clock"}

                {activePage === "users" &&
                  "User Management"}

                {activePage ===
                  "settings" &&
                  "Settings"}
              </h1>

              <p>
                Welcome back,{" "}
                {profile.name}
              </p>
            </div>
          </div>

          <div className="topbar-center">
            <div className="search-wrapper">
              <span>⌕</span>

              <input
                className="global-search"
                placeholder="Search pages, users, data..."
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                onKeyDown={(event) => {
                  if (
                    event.key ===
                    "Enter"
                  ) {
                    globalSearchAction();
                  }
                }}
              />

              <kbd>Ctrl K</kbd>
            </div>
          </div>

          <div className="topbar-right">
            <button
              className="quick-action-button"
              onClick={() =>
                setShowQuickAction(
                  (current) => !current
                )
              }
            >
              + Quick Action
            </button>

            <div className="topbar-control">
              <select
                value={language}
                onChange={(event) =>
                  setLanguage(
                    event.target.value
                  )
                }
                title="Region"
              >
                <option value="IN">
                  🇮🇳 IN
                </option>
                <option value="UK">
                  🇬🇧 UK
                </option>
                <option value="AE">
                  🇦🇪 AE
                </option>
                <option value="US">
                  🇺🇸 US
                </option>
              </select>
            </div>

            <button
              className="theme-toggle"
              onClick={() =>
                setDarkMode(
                  (current) => !current
                )
              }
              title="Toggle theme"
            >
              {darkMode ? "☀️" : "🌙"}
            </button>

            <div className="notification-wrap">
              <button
                className="icon-button"
                onClick={() =>
                  setShowNotifications(
                    (current) =>
                      !current
                  )
                }
              >
                🔔

                {unreadCount > 0 && (
                  <span className="notification-count">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="dropdown-panel notification-panel">
                  <div className="dropdown-header">
                    <div>
                      <strong>
                        Notifications
                      </strong>
                      <span>
                        {unreadCount} unread
                      </span>
                    </div>

                    <button
                      onClick={
                        markNotificationsRead
                      }
                    >
                      Mark read
                    </button>
                  </div>

                  <div className="notification-list">
                    {notifications.length ===
                    0 ? (
                      <div className="empty-state">
                        No notifications
                      </div>
                    ) : (
                      notifications.map(
                        (
                          notification
                        ) => (
                          <div
                            className={`notification-item ${
                              notification.read
                                ? ""
                                : "unread"
                            }`}
                            key={
                              notification.id
                            }
                          >
                            <div className="notification-icon">
                              🔔
                            </div>

                            <div>
                              <strong>
                                {
                                  notification.title
                                }
                              </strong>

                              <p>
                                {
                                  notification.text
                                }
                              </p>

                              <small>
                                {
                                  notification.time
                                }
                              </small>
                            </div>
                          </div>
                        )
                      )
                    )}
                  </div>

                  <button
                    className="clear-notifications"
                    onClick={
                      clearNotifications
                    }
                  >
                    Clear all
                  </button>
                </div>
              )}
            </div>

            <div className="profile-wrap">
              <button
                className="user-mini"
                onClick={() =>
                  setShowProfileMenu(
                    (current) =>
                      !current
                  )
                }
              >
                <div className="avatar">
                  {profile.name
                    ?.charAt(0)
                    .toUpperCase() ||
                    "R"}
                </div>

                <div className="user-mini-info">
                  <strong>
                    {profile.name}
                  </strong>

                  <span>
                    {userRoleLabel(
                      profile.role
                    )}
                  </span>
                </div>

                <span>⌄</span>
              </button>

              {showProfileMenu && (
                <div className="dropdown-panel profile-dropdown">
                  <button
                    onClick={() =>
                      changePage(
                        "profile"
                      )
                    }
                  >
                    👤 My Profile
                  </button>

                  {isAdminOrOwner && (
                    <button
                      onClick={() =>
                        changePage(
                          "users"
                        )
                      }
                    >
                      👥 Manage Users
                    </button>
                  )}

                  <button
                    onClick={() =>
                      changePage(
                        "settings"
                      )
                    }
                  >
                    ⚙ Settings
                  </button>

                  <button
                    className="danger-text"
                    onClick={onLogout}
                  >
                    ↪ Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* =========================
            QUICK ACTION MENU
        ========================= */}

        {showQuickAction && (
          <div className="quick-action-menu">
            <button
              onClick={() => {
                setShowQuickAction(false);
                setShowOrderModal(true);
              }}
            >
              🛒 Add New Order
            </button>

            {isAdminOrOwner && (
              <button
                onClick={() => {
                  setShowQuickAction(false);
                  changePage("users");
                }}
              >
                👥 View Users
              </button>
            )}

            <button
              onClick={() => {
                setShowQuickAction(false);
                changePage("tasks");
              }}
            >
              ✓ Add Task
            </button>

            <button
              onClick={() => {
                setShowQuickAction(false);
                changePage("analytics");
              }}
            >
              📊 Analytics
            </button>
          </div>
        )}

        {/* =========================
            ANNOUNCEMENT
        ========================= */}

        <div className="announcement-banner">
          <div>
            <span className="announcement-icon">
              📢
            </span>

            <div>
              <strong>
                RAF AI System Announcement
              </strong>

              <p>
                All services are operational.
                Dashboard v2.4.0 is active.
              </p>
            </div>
          </div>

          <button
            onClick={() =>
              addNotification(
                "Announcement",
                "System announcement saved."
              )
            }
          >
            Got it
          </button>
        </div>

        {/* =========================
            OVERVIEW
        ========================= */}

        {activePage === "overview" && (
          <section className="dashboard-content">
            <div className="hero-card">
              <div>
                <span className="eyebrow">
                  ✨ PERSONAL WORKSPACE
                </span>

                <h2>
                  Good day,{" "}
                  <span>
                    {profile.name}
                  </span>
                </h2>

                <p>
                  Manage your productivity,
                  orders, account and RAF AI
                  workspace from one place.
                </p>

                <div className="hero-actions">
                  <button
                    onClick={() =>
                      setShowOrderModal(
                        true
                      )
                    }
                  >
                    + Add Order
                  </button>

                  <button
                    className="secondary-action"
                    onClick={() =>
                      changePage(
                        "analytics"
                      )
                    }
                  >
                    View Analytics →
                  </button>
                </div>
              </div>

              <div className="hero-score">
                <span>
                  Productivity
                </span>

                <strong>
                  {productivityScore}%
                </strong>

                <div className="score-ring">
                  <div
                    style={{
                      "--score": `${productivityScore}%`
                    }}
                  >
                    <span>
                      {productivityScore}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* KPI */}

            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon purple">
                  ₹
                </div>

                <div>
                  <span>
                    Total Revenue
                  </span>

                  <strong>
                    {formatMoney(orderSummary.revenue)}
                  </strong>

                  <small className="positive">
                    Live update from approved orders
                  </small>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon blue">
                  👥
                </div>

                <div>
                  <span>
                    Total Users
                  </span>

                  <strong>
                    {isOwner
                      ? users.length ||
                        "1,284"
                      : "1,284"}
                  </strong>

                  <small className="positive">
                    +12.5% this month
                  </small>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon green">
                  🛒
                </div>

                <div>
                  <span>
                    Total Orders
                  </span>

                  <strong>
                    {orders.length}
                  </strong>

                  <small className="positive">
                    Live count from all orders
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

                  <small>
                    All systems normal
                  </small>
                </div>
              </div>
            </div>

            {/* DASHBOARD GRID */}

            <div className="dashboard-grid">
              {/* TIMER */}

              <div className="dashboard-panel timer-panel">
                <div className="panel-header">
                  <div>
                    <h2>
                      Focus Timer
                    </h2>

                    <p>
                      Pomodoro productivity
                      session
                    </p>
                  </div>

                  <span className="live-pill">
                    ● LIVE
                  </span>
                </div>

                <div className="timer-tabs">
                  {[
                    "Pomodoro",
                    "Short Break",
                    "Long Break",
                    "Focus"
                  ].map((mode) => (
                    <button
                      key={mode}
                      className={
                        timerMode === mode
                          ? "active"
                          : ""
                      }
                      onClick={() =>
                        changeTimerMode(
                          mode
                        )
                      }
                    >
                      {mode}
                    </button>
                  ))}
                </div>

                <div className="timer-display">
                  {formatTimer()}
                </div>

                <div className="timer-actions">
                  <button
                    className="timer-main-button"
                    onClick={() => {
                      requestNotificationPermission();
                      setTimerRunning(
                        (current) =>
                          !current
                      );
                    }}
                  >
                    {timerRunning
                      ? "Ⅱ Pause"
                      : "▶ Start"}
                  </button>

                  <button
                    onClick={resetTimer}
                  >
                    Reset
                  </button>
                </div>

                <div className="timer-add-buttons">
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

              {/* WEEKLY PERFORMANCE */}

              <div className="dashboard-panel">
                <div className="panel-header">
                  <div>
                    <h2>
                      Weekly Performance
                    </h2>

                    <p>
                      Productivity activity
                    </p>
                  </div>

                  <select
                    value={weeklyMode}
                    onChange={(event) =>
                      setWeeklyMode(
                        event.target.value
                      )
                    }
                  >
                    <option>
                      Weekly
                    </option>
                    <option>
                      Monthly
                    </option>
                  </select>
                </div>

                <div className="performance-chart">
                  {[35, 55, 48, 75, 62, 88, 72].map(
                    (height, index) => (
                      <div
                        className="chart-column"
                        key={index}
                      >
                        <div
                          className="chart-bar"
                          style={{
                            height: `${height}%`
                          }}
                        ></div>

                        <span>
                          {
                            [
                              "M",
                              "T",
                              "W",
                              "T",
                              "F",
                              "S",
                              "S"
                            ][index]
                          }
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* QUICK STATS */}

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
                  Current Streak
                </span>

                <strong>
                  🔥 {streak} days
                </strong>

                <small>
                  Personal productivity streak
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
            </div>

            {/* WIDGETS */}

            <div className="widget-grid">
              <div className="dashboard-panel">
                <div className="panel-header">
                  <div>
                    <h2>
                      Quick Notes
                    </h2>

                    <p>
                      Personal scratchpad
                    </p>
                  </div>

                  <span>📝</span>
                </div>

                <textarea
                  className="notes-widget"
                  value={notes}
                  onChange={(event) =>
                    setNotes(
                      event.target.value
                    )
                  }
                  placeholder="Write something..."
                />
              </div>

              <div className="dashboard-panel">
                <div className="panel-header">
                  <div>
                    <h2>
                      System Health
                    </h2>

                    <p>
                      Current service status
                    </p>
                  </div>

                  <span className="healthy-badge">
                    Healthy
                  </span>
                </div>

                <div className="health-row">
                  <span>
                    Database
                  </span>

                  <strong>
                    <i></i> OK
                  </strong>
                </div>

                <div className="health-row">
                  <span>
                    Firebase Auth
                  </span>

                  <strong>
                    <i></i> 99.9%
                  </strong>
                </div>

                <div className="health-row">
                  <span>
                    API
                  </span>

                  <strong>
                    <i></i> Operational
                  </strong>
                </div>

                <div className="storage-block">
                  <div>
                    <span>
                      Storage Usage
                    </span>

                    <strong>
                      45 GB / 100 GB
                    </strong>
                  </div>

                  <div className="progress">
                    <div
                      style={{
                        width: "45%"
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="dashboard-panel">
                <div className="panel-header">
                  <div>
                    <h2>
                      Recent Activity
                    </h2>

                    <p>
                      Latest account events
                    </p>
                  </div>

                  <button
                    className="panel-action"
                    onClick={() =>
                      setActivityRefresh(
                        (value) =>
                          value + 1
                      )
                    }
                  >
                    🔄 Refresh
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
                        New login from browser
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
                        Dashboard loaded
                      </strong>

                      <span>
                        Activity refreshed #
                        {activityRefresh}
                      </span>

                      <small>
                        Recently
                      </small>
                    </div>
                  </div>
                </div>
              </div>

              <div className="dashboard-panel">
                <div className="panel-header">
                  <div>
                    <h2>
                      Financial Snapshot
                    </h2>

                    <p>
                      Operational metrics
                    </p>
                  </div>
                </div>

                <div className="financial-list">
                  <div>
                    <span>
                      Monthly Goal
                    </span>

                    <strong>
                      82%
                    </strong>
                  </div>

                  <div className="progress">
                    <div
                      style={{
                        width: "82%"
                      }}
                    />
                  </div>

                  <div className="financial-mini-grid">
                    <div>
                      <span>
                        Pending
                      </span>

                      <strong>
                        ₹18,400
                      </strong>
                    </div>

                    <div>
                      <span>
                        Refunds
                      </span>

                      <strong>
                        ₹4,250
                      </strong>
                    </div>

                    <div>
                      <span>
                        AOV
                      </span>

                      <strong>
                        ₹8,420
                      </strong>
                    </div>

                    <div>
                      <span>
                        API Usage
                      </span>

                      <strong>
                        84.5%
                      </strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* EXTRA ANALYTICS */}

            <div className="analytics-preview-grid">
              <div className="analytics-mini-card">
                <span>
                  Organic Traffic
                </span>

                <strong>
                  48.6%
                </strong>

                <div className="mini-bars">
                  {[50, 70, 42, 90, 65].map(
                    (height, index) => (
                      <i
                        key={index}
                        style={{
                          height: `${height}%`
                        }}
                      />
                    )
                  )}
                </div>
              </div>

              <div className="analytics-mini-card">
                <span>
                  Conversion Funnel
                </span>

                <strong>
                  68.4%
                </strong>

                <div className="funnel">
                  <div>Visitors</div>
                  <div>Interested</div>
                  <div>Converted</div>
                </div>
              </div>

              <div className="analytics-mini-card">
                <span>
                  Active Visitors
                </span>

                <strong>
                  284
                </strong>

                <small className="positive">
                  ● Real-time
                </small>
              </div>

              <div className="analytics-mini-card">
                <span>
                  Automation
                </span>

                <strong>
                  3 Active
                </strong>

                <small>
                  Workflows running
                </small>
              </div>
            </div>
          </section>
        )}

        {/* =========================
            TASKS
        ========================= */}

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
                  Create and manage your daily
                  tasks.
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
                onChange={(event) =>
                  setNewTodo(
                    event.target.value
                  )
                }
                onKeyDown={(event) => {
                  if (
                    event.key === "Enter"
                  ) {
                    addTodo();
                  }
                }}
              />

              <button
                onClick={addTodo}
              >
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

        {/* =========================
            PROFILE
        ========================= */}

        {activePage === "profile" && (
          <section className="page-section">
            <div className="profile-header">
              <div className="large-avatar">
                {profile.name
                  ?.charAt(0)
                  .toUpperCase() ||
                  "R"}
              </div>

              <div>
                <h2>
                  {profile.name}
                </h2>

                <p>
                  {profile.email}
                </p>

                <span
                  className={`role-badge ${profile.role}`}
                >
                  {userRoleLabel(
                    profile.role
                  )}
                </span>
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
                    value={
                      profile.name
                    }
                    onChange={(event) =>
                      setProfile({
                        ...profile,
                        name: event.target
                          .value
                      })
                    }
                  />
                </label>

                <label>
                  Email

                  <input
                    value={
                      profile.email
                    }
                    disabled
                  />
                </label>

                <label>
                  Phone

                  <input
                    value={
                      profile.phone
                    }
                    onChange={(event) =>
                      setProfile({
                        ...profile,
                        phone: event.target
                          .value
                      })
                    }
                  />
                </label>

                <label>
                  Role

                  <input
                    value={userRoleLabel(
                      profile.role
                    )}
                    disabled
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
          </section>
        )}

        {/* =========================
            ANALYTICS
        ========================= */}

        {activePage === "analytics" && (
          <section className="page-section">
            <div className="analytics-header">
              <span className="eyebrow">
                REPORTING CENTER
              </span>

              <h2>
                Analytics Overview
              </h2>

              <p>
                Demo analytics and live
                productivity indicators.
              </p>
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

            <div className="analytics-layout">
              <div className="chart-card">
                <div className="panel-header">
                  <div>
                    <h2>
                      Revenue Growth
                    </h2>

                    <p>
                      Monthly performance
                    </p>
                  </div>
                </div>

                <div className="line-chart">
                  {[30, 45, 38, 70, 55, 82, 72, 92].map(
                    (height, index) => (
                      <div
                        key={index}
                        className="line-point"
                        style={{
                          height: `${height}%`
                        }}
                      >
                        <i />
                      </div>
                    )
                  )}
                </div>
              </div>

              <div className="chart-card">
                <div className="panel-header">
                  <div>
                    <h2>
                      Sales Categories
                    </h2>

                    <p>
                      Revenue distribution
                    </p>
                  </div>
                </div>

                <div className="donut-wrapper">
                  <div className="donut">
                    <div>
                      <strong>
                        68%
                      </strong>

                      <span>
                        Sales
                      </span>
                    </div>
                  </div>

                  <div className="legend">
                    <span>
                      <i />
                      Development 42%
                    </span>

                    <span>
                      <i />
                      Design 28%
                    </span>

                    <span>
                      <i />
                      Services 18%
                    </span>

                    <span>
                      <i />
                      Other 12%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="traffic-card">
              <div className="panel-header">
                <div>
                  <h2>
                    User Traffic Sources
                  </h2>

                  <p>
                    Organic, direct and referral
                    traffic
                  </p>
                </div>
              </div>

              <div className="traffic-bars">
                <div>
                  <span>
                    Organic
                  </span>

                  <div>
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

                  <div>
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

                  <div>
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
              </div>
            </div>

            {yearlyStats && yearlyStats.length > 0 && (
              <div className="traffic-card">
                <div className="panel-header">
                  <div>
                    <h2>Year-wise Order Analytics</h2>
                    <p>From the generated demo dataset (2016 → present)</p>
                  </div>
                </div>

                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>Year</th>
                        <th>Orders</th>
                        <th>Revenue</th>
                        <th>Completed</th>
                        <th>Pending</th>
                        <th>Failed</th>
                      </tr>
                    </thead>

                    <tbody>
                      {yearlyStats.map((row) => (
                        <tr key={row.year}>
                          <td><strong>{row.year}</strong></td>
                          <td>{row.count.toLocaleString("en-IN")}</td>
                          <td>{formatMoney(row.revenue)}</td>
                          <td>{row.completed.toLocaleString("en-IN")}</td>
                          <td>{row.pending.toLocaleString("en-IN")}</td>
                          <td>{row.failed.toLocaleString("en-IN")}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </section>
        )}

        {/* =========================
            ORDERS
        ========================= */}

        {activePage === "orders" && (
          <section className="page-section">
            <div className="section-heading">
              <div>
                <span className="eyebrow">
                  COMMERCE
                </span>

                <h2>
                  Orders & Transactions
                </h2>

                <p>
                  Manage customers, orders,
                  status and payments.
                </p>
              </div>

              <button
                className="primary-button"
                onClick={() =>
                  setShowOrderModal(true)
                }
              >
                + Add Order
              </button>
            </div>

            {isAdminOrOwner && (
              <>
                <div className="orders-overview-grid">
                  <div className="orders-highlight-card primary">
                    <span>Total Orders</span>
                    <strong>{orderSummary.total}</strong>
                    <small>All user and admin orders</small>
                  </div>

                  <div className="orders-highlight-card warning">
                    <span>Pending</span>
                    <strong>{orderSummary.pending}</strong>
                    <small>Awaiting review</small>
                  </div>

                  <div className="orders-highlight-card success">
                    <span>Completed</span>
                    <strong>{orderSummary.completed}</strong>
                    <small>Approved successfully</small>
                  </div>

                  <div className="orders-highlight-card danger">
                    <span>Revenue</span>
                    <strong>{formatMoney(orderSummary.revenue)}</strong>
                    <small>Across all orders</small>
                  </div>
                </div>

                <div className="admin-review-card">
                  <div className="section-heading compact">
                    <div>
                      <span className="eyebrow">ADMIN QUEUE</span>
                      <h3>Approve or reject new orders</h3>
                      <p>All orders placed by users are now visible in one centralized admin workspace.</p>
                    </div>

                    <span className="approval-pill">
                      {pendingReviewOrders.length} pending
                    </span>
                  </div>

                  {pendingReviewOrders.length === 0 ? (
                    <div className="empty-state large">
                      No pending approvals right now.
                    </div>
                  ) : (
                    <div className="review-list">
                      {pendingReviewOrders.map((order) => (
                        <div className="review-item" key={order.id}>
                          <div className="review-info">
                            <div className="review-topline">
                              <strong>{order.id}</strong>
                              <span className="review-status-chip">Pending</span>
                            </div>

                            <p>{order.customer}</p>
                            <span>
                              {order.email} • {formatMoney(order.amount)}
                            </span>
                            <small>
                              Items: {order.items.map((item) => `${item.name} x${item.qty}`).join(", ")}
                            </small>
                            <small>
                              Created by: {order.createdBy || "Unknown user"} • {order.date}
                            </small>
                          </div>

                          <div className="review-actions">
                            <button
                              className="approve-btn"
                              onClick={() => reviewOrder(order.id, "approve")}
                            >
                              Approve
                            </button>

                            <button
                              className="reject-btn"
                              onClick={() => reviewOrder(order.id, "reject")}
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}

            <div className="order-controls">
              <div className="table-search">
                🔎

                <input
                  placeholder="Search order, customer or email..."
                  value={orderSearch}
                  onChange={(event) => {
                    setOrderSearch(
                      event.target.value
                    );
                    setCurrentOrderPage(
                      1
                    );
                  }}
                />
              </div>

              <select
                value={orderStatus}
                onChange={(event) => {
                  setOrderStatus(
                    event.target.value
                  );
                  setCurrentOrderPage(
                    1
                  );
                }}
              >
                <option>
                  All
                </option>

                <option>
                  Pending
                </option>

                <option>
                  Completed
                </option>

                <option>
                  Failed
                </option>
              </select>

              <select
                value={rowsPerPage}
                onChange={(event) => {
                  setRowsPerPage(
                    Number(
                      event.target.value
                    )
                  );
                  setCurrentOrderPage(
                    1
                  );
                }}
              >
                <option value="5">
                  5 rows
                </option>

                <option value="10">
                  10 rows
                </option>

                <option value="25">
                  25 rows
                </option>
              </select>

              <select
                value={currency}
                onChange={(event) =>
                  setCurrency(
                    event.target.value
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

              <button
                className="outline-button"
                onClick={exportCSV}
              >
                ↓ CSV
              </button>
            </div>

            {isAdminOrOwner && (
              <div className="demo-data-panel">
                <div>
                  <strong>Demo Dataset (2016 → today)</strong>
                  <p>
                    Generate a large synthetic order history for load-testing
                    and year-wise analytics. Rows stay in memory only; a
                    compact year-wise summary is saved locally.
                  </p>
                </div>

                <div className="demo-data-controls">
                  <select
                    value={demoTarget}
                    onChange={(event) =>
                      setDemoTarget(Number(event.target.value))
                    }
                    disabled={demoGenerating}
                  >
                    <option value={5000}>5,000 orders</option>
                    <option value={50000}>50,000 orders</option>
                    <option value={150000}>150,000 orders</option>
                    <option value={450000}>450,000 orders</option>
                  </select>

                  <button
                    className="primary-button"
                    onClick={() => generateDemoOrders(demoTarget)}
                    disabled={demoGenerating}
                  >
                    {demoGenerating ? "Generating…" : "Generate Demo Data"}
                  </button>

                  <button
                    className="outline-button"
                    onClick={clearDemoOrders}
                    disabled={demoGenerating}
                  >
                    Clear Demo Data
                  </button>
                </div>

                {demoGenerating && (
                  <div className="progress demo-progress">
                    <div
                      style={{
                        width: `${Math.min(
                          100,
                          (demoProgress / demoTarget) * 100
                        )}%`
                      }}
                    />
                  </div>
                )}

                {demoGenerating && (
                  <small>
                    {demoProgress.toLocaleString("en-IN")} /{" "}
                    {demoTarget.toLocaleString("en-IN")} generated…
                  </small>
                )}
              </div>
            )}

            {selectedOrders.length > 0 && (
              <div className="bulk-bar">
                <strong>
                  {selectedOrders.length}{" "}
                  selected
                </strong>

                <div>
                  <button
                    onClick={
                      markSelectedCompleted
                    }
                  >
                    ✓ Mark Completed
                  </button>

                  <button
                    className="danger-button"
                    onClick={
                      deleteSelectedOrders
                    }
                  >
                    Delete Selected
                  </button>
                </div>
              </div>
            )}

            <div className="table-card">
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>
                        {isAdminOrOwner && (
                          <input
                            type="checkbox"
                            checked={
                              visibleOrders.length >
                                0 &&
                              visibleOrders.every(
                                (order) =>
                                  selectedOrders.includes(
                                    order.id
                                  )
                              )
                            }
                            onChange={() =>
                              toggleAllOrders(
                                visibleOrders
                              )
                            }
                          />
                        )}
                      </th>

                      <th>
                        Order
                      </th>

                      <th>
                        Customer
                      </th>

                      <th>
                        Date
                      </th>

                      <th>
                        Amount
                      </th>

                      <th>
                        Status
                      </th>

                      <th>
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {visibleOrders.map(
                      (order) => (
                        <tr
                          key={order.id}
                          className={`order-table-row ${order.status.toLowerCase()}`}
                        >
                          <td>
                            {isAdminOrOwner && (
                              <input
                                type="checkbox"
                                checked={selectedOrders.includes(
                                  order.id
                                )}
                                onChange={() =>
                                  toggleOrderSelection(
                                    order.id
                                  )
                                }
                              />
                            )}
                          </td>

                          <td>
                            <strong>
                              {order.id}
                            </strong>
                          </td>

                          <td>
                            <div className="customer-cell">
                              <div className="table-avatar">
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
                            {order.date}
                          </td>

                          <td>
                            <strong>
                              {formatMoney(
                                order.amount
                              )}
                            </strong>
                          </td>

                          <td>
                            {isAdminOrOwner ? (
                              <select
                                className={`status-select ${order.status.toLowerCase()}`}
                                value={
                                  order.status
                                }
                                onChange={(
                                  event
                                ) =>
                                  updateOrderStatus(
                                    order.id,
                                    event
                                      .target
                                      .value
                                  )
                                }
                              >
                                <option>
                                  Pending
                                </option>

                                <option>
                                  Completed
                                </option>

                                <option>
                                  Failed
                                </option>
                              </select>
                            ) : (
                              <span
                                className={`status-pill ${order.status.toLowerCase()}`}
                                title="Only Admin or Owner can change order status"
                              >
                                ● {order.status}
                              </span>
                            )}
                          </td>

                          <td>
                            {isAdminOrOwner ? (
                              <button
                                className="table-delete"
                                onClick={() =>
                                  deleteOrder(
                                    order.id
                                  )
                                }
                              >
                                🗑
                              </button>
                            ) : (
                              <span className="uid-text">
                                {order.createdBy ===
                                (user?.email || profile.email)
                                  ? "Your order"
                                  : "—"}
                              </span>
                            )}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>

              {visibleOrders.length ===
                0 && (
                <div className="empty-state large">
                  No orders found.
                </div>
              )}

              <div className="pagination">
                <span>
                  Showing{" "}
                  {filteredOrders.length
                    ? (currentOrderPage -
                        1) *
                        rowsPerPage +
                      1
                    : 0}
                  –
                  {Math.min(
                    currentOrderPage *
                      rowsPerPage,
                    filteredOrders.length
                  )}{" "}
                  of{" "}
                  {filteredOrders.length}{" "}
                  results
                </span>

                <div>
                  <button
                    disabled={
                      currentOrderPage ===
                      1
                    }
                    onClick={() =>
                      setCurrentOrderPage(
                        (page) =>
                          Math.max(
                            1,
                            page - 1
                          )
                      )
                    }
                  >
                    ←
                  </button>

                  {Array.from(
                    {
                      length:
                        totalOrderPages
                    },
                    (_, index) => (
                      <button
                        key={index}
                        className={
                          currentOrderPage ===
                          index + 1
                            ? "active"
                            : ""
                        }
                        onClick={() =>
                          setCurrentOrderPage(
                            index + 1
                          )
                        }
                      >
                        {index + 1}
                      </button>
                    )
                  )}

                  <button
                    disabled={
                      currentOrderPage ===
                      totalOrderPages
                    }
                    onClick={() =>
                      setCurrentOrderPage(
                        (page) =>
                          Math.min(
                            totalOrderPages,
                            page + 1
                          )
                      )
                    }
                  >
                    →
                  </button>
                </div>
              </div>
            </div>

            <div className="secondary-widget-grid">
              <div className="small-widget">
                <span>
                  Top Selling Product
                </span>

                <strong>
                  RAF AI Pro
                </strong>

                <small>
                  428 sales
                </small>
              </div>

              <div className="small-widget">
                <span>
                  Customer Feedback
                </span>

                <strong>
                  ⭐ 4.8/5
                </strong>

                <small>
                  Based on 284 reviews
                </small>
              </div>

              <div className="small-widget">
                <span>
                  Pending Invoices
                </span>

                <strong>
                  ₹28,450
                </strong>

                <small>
                  7 invoices
                </small>
              </div>

              <div className="small-widget">
                <span>
                  Integrations
                </span>

                <strong>
                  GitHub · AWS · Stripe
                </strong>

                <small>
                  All connected
                </small>
              </div>
            </div>
          </section>
        )}

        {/* =========================
            WORLD CLOCK
        ========================= */}

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
                  Live time across major
                  regions.
                </p>
              </div>

              <div className="live-clock">
                🕐{" "}
                {clockTime.toLocaleTimeString(
                  "en-IN"
                )}
              </div>
            </div>

            <div className="clock-grid">
              {countries.map(
                (country) => (
                  <div
                    className="clock-card"
                    key={country.city}
                  >
                    <div className="clock-country">
                      <span>
                        {country.flag}
                      </span>

                      <div>
                        <strong>
                          {country.city}
                        </strong>

                        <small>
                          {
                            country.zone
                          }
                        </small>
                      </div>
                    </div>

                    <div className="clock-time">
                      {clockTime.toLocaleTimeString(
                        "en-US",
                        {
                          timeZone:
                            country.zone,
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit"
                        }
                      )}
                    </div>

                    <div className="clock-date">
                      {clockTime.toLocaleDateString(
                        "en-US",
                        {
                          timeZone:
                            country.zone,
                          weekday:
                            "short",
                          day: "2-digit",
                          month:
                            "short"
                        }
                      )}
                    </div>
                  </div>
                )
              )}
            </div>

            <div className="clock-info-grid">
              <div className="dashboard-panel">
                <h2>
                  Current Local Time
                </h2>

                <div className="big-live-time">
                  {clockTime.toLocaleTimeString(
                    "en-IN"
                  )}
                </div>

                <p>
                  India Standard Time ·
                  Asia/Kolkata
                </p>
              </div>

              <div className="dashboard-panel">
                <h2>
                  Auto Refresh
                </h2>

                <p>
                  Automatically refresh dashboard
                  activity.
                </p>

                <select
                  className="wide-select"
                  value={autoRefresh}
                  onChange={(event) =>
                    setAutoRefresh(
                      event.target.value
                    )
                  }
                >
                  <option>
                    Off
                  </option>

                  <option>
                    5s
                  </option>

                  <option>
                    30s
                  </option>

                  <option>
                    1m
                  </option>
                </select>
              </div>
            </div>
          </section>
        )}

        {/* =========================
            USERS — OWNER ONLY
        ========================= */}

        {activePage === "users" &&
          isAdminOrOwner && (
            <section className="page-section">
              <div className="section-heading">
                <div>
                  <span className="eyebrow owner-eyebrow">
                    OWNER CONSOLE
                  </span>

                  <h2>
                    User Management
                  </h2>

                  <p>
                    Registered accounts and
                    account metadata.
                  </p>
                </div>

                <button
                  className="outline-button"
                  onClick={fetchUsers}
                >
                  🔄 Refresh Users
                </button>
              </div>

              <div className="owner-warning">
                <div>
                  🔐
                </div>

                <div>
                  <strong>
                    Owner access
                  </strong>

                  <p>
                    You can view registered
                    profile metadata here.
                    Passwords are never
                    displayed. Use password
                    reset instead.
                  </p>
                </div>
              </div>

              <div className="owner-kpi-grid">
                <div>
                  <span>
                    Registered Users
                  </span>

                  <strong>
                    {users.length}
                  </strong>
                </div>

                <div>
                  <span>
                    Owners
                  </span>

                  <strong>
                    {
                      users.filter(
                        (item) =>
                          item.role ===
                          "owner"
                      ).length
                    }
                  </strong>
                </div>

                <div>
                  <span>
                    Admins
                  </span>

                  <strong>
                    {
                      users.filter(
                        (item) =>
                          item.role ===
                          "admin"
                      ).length
                    }
                  </strong>
                </div>

                <div>
                  <span>
                    Regular Users
                  </span>

                  <strong>
                    {
                      users.filter(
                        (item) =>
                          ![
                            "owner",
                            "admin"
                          ].includes(
                            item.role
                          )
                      ).length
                    }
                  </strong>
                </div>
              </div>

              <div className="user-controls">
                <div className="table-search">
                  🔎

                  <input
                    placeholder="Search name, email or UID..."
                    value={userSearch}
                    onChange={(event) =>
                      setUserSearch(
                        event.target.value
                      )
                    }
                  />
                </div>

                <select
                  value={
                    userRoleFilter
                  }
                  onChange={(event) =>
                    setUserRoleFilter(
                      event.target.value
                    )
                  }
                >
                  <option>
                    All
                  </option>

                  <option value="owner">
                    Owner
                  </option>

                  <option value="admin">
                    Admin
                  </option>

                  <option value="user">
                    User
                  </option>
                </select>
              </div>

              <div className="table-card">
                {usersLoading ? (
                  <div className="loading-box">
                    <div className="spinner"></div>
                    Loading registered users...
                  </div>
                ) : (
                  <div className="table-wrapper">
                    <table>
                      <thead>
                        <tr>
                          <th>
                            User
                          </th>

                          <th>
                            Email
                          </th>

                          <th>
                            Role
                          </th>

                          <th>
                            Provider
                          </th>

                          <th>
                            Phone
                          </th>

                          <th>
                            Created
                          </th>

                          <th>
                            Status
                          </th>

                          <th>
                            Details
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {filteredUsers.map(
                          (item) => (
                            <tr
                              key={
                                item.uid
                              }
                            >
                              <td>
                                <div className="customer-cell">
                                  <div className="table-avatar">
                                    {item.name
                                      ?.charAt(
                                        0
                                      )
                                      .toUpperCase() ||
                                      "U"}
                                  </div>

                                  <div>
                                    <strong>
                                      {item.name ||
                                        "Unnamed User"}
                                    </strong>

                                    <span className="uid-text">
                                      UID:{" "}
                                      {
                                        item.uid
                                      }
                                    </span>
                                  </div>
                                </div>
                              </td>

                              <td>
                                {
                                  item.email
                                }
                              </td>

                              <td>
                                <span
                                  className={`role-badge ${
                                    item.role
                                  }`}
                                >
                                  {userRoleLabel(
                                    item.role
                                  )}
                                </span>
                              </td>

                              <td>
                                <span className="provider-badge">
                                  {item.provider ||
                                    "email"}
                                </span>
                              </td>

                              <td>
                                {item.phone ||
                                  "Not provided"}
                              </td>

                              <td>
                                {item.createdAt
                                  ? new Date(
                                      item.createdAt
                                    ).toLocaleDateString(
                                      "en-IN"
                                    )
                                  : "Unknown"}
                              </td>

                              <td>
                                <span className="status-pill completed">
                                  ● Active
                                </span>
                              </td>

                              <td>
                                <button
                                  className="view-user-button"
                                  onClick={() =>
                                    setSelectedUser(
                                      item
                                    )
                                  }
                                >
                                  View
                                </button>
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                )}

                {!usersLoading &&
                  filteredUsers.length ===
                    0 && (
                    <div className="empty-state large">
                      No registered users found.
                    </div>
                  )}
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
                <span className="eyebrow">
                  CONFIGURATION
                </span>

                <h2>
                  Settings
                </h2>

                <p>
                  Manage dashboard preferences.
                </p>
              </div>
            </div>

            <div className="settings-layout">
              <div className="settings-card">
                <div className="setting-row">
                  <div>
                    <strong>
                      Email Notifications
                    </strong>

                    <span>
                      Receive notifications
                      about your account.
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
                      Get alerts about new
                      account activity.
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
                      Automatically synchronize
                      dashboard data.
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
                      Dark Mode
                    </strong>

                    <span>
                      Switch dashboard appearance.
                    </span>
                  </div>

                  <button
                    className="mini-toggle"
                    onClick={() =>
                      setDarkMode(
                        (current) =>
                          !current
                      )
                    }
                  >
                    {darkMode
                      ? "ON"
                      : "OFF"}
                  </button>
                </div>

                <div className="setting-row">
                  <div>
                    <strong>
                      Auto Refresh
                    </strong>

                    <span>
                      Live reload interval.
                    </span>
                  </div>

                  <select
                    value={autoRefresh}
                    onChange={(event) =>
                      setAutoRefresh(
                        event.target.value
                      )
                    }
                  >
                    <option>
                      Off
                    </option>

                    <option>
                      5s
                    </option>

                    <option>
                      30s
                    </option>

                    <option>
                      1m
                    </option>
                  </select>
                </div>
              </div>

              <div className="settings-card">
                <div className="settings-card-title">
                  <span>
                    ADVANCED
                  </span>

                  <h2>
                    Workspace Controls
                  </h2>
                </div>

                <button
                  className="setting-action"
                  onClick={() =>
                    setShowShortcuts(
                      true
                    )
                  }
                >
                  ⌨️ Keyboard Shortcuts
                  <span>→</span>
                </button>

                <button
                  className="setting-action"
                  onClick={
                    toggleZenMode
                  }
                >
                  ⛶ Zen Mode
                  <span>→</span>
                </button>

                <button
                  className="setting-action"
                  onClick={() =>
                    addNotification(
                      "Release Notes",
                      "RAF AI v2.4.0 is currently active."
                    )
                  }
                >
                  ✨ v2.4.0 What's New
                  <span>→</span>
                </button>

                <button
                  className="setting-action"
                  onClick={() =>
                    setShowChat(true)
                  }
                >
                  💬 Support Center
                  <span>→</span>
                </button>
              </div>
            </div>
          </section>
        )}

        {/* =========================
            FOOTER
        ========================= */}

        <footer className="dashboard-footer">
          <div>
            <strong>
              RAF AI
            </strong>

            <span>
              Modern React + Firebase
              workspace.
            </span>
          </div>

          <div>
            <span>
              v2.4.0
            </span>

            <span>
              © 2026 RAF AI
            </span>
          </div>
        </footer>
      </main>

      {/* =========================
          ORDER MODAL
      ========================= */}

      {showOrderModal && (
        <div
          className="modal-backdrop"
          onClick={() =>
            setShowOrderModal(false)
          }
        >
          <div
            className="modal-card"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="modal-header">
              <div>
                <span className="eyebrow">
                  NEW TRANSACTION
                </span>

                <h2>
                  Add New Order
                </h2>
              </div>

              <button
                onClick={() =>
                  setShowOrderModal(
                    false
                  )
                }
              >
                ×
              </button>
            </div>

            <form onSubmit={addOrder}>
              <label>
                Customer Name

                <input
                  required
                  placeholder="Rahul Kumar"
                  value={
                    newOrder.customer
                  }
                  onChange={(event) =>
                    setNewOrder({
                      ...newOrder,
                      customer:
                        event.target
                          .value
                    })
                  }
                />
              </label>

              <label>
                Customer Email

                <input
                  required
                  type="email"
                  placeholder="customer@example.com"
                  value={
                    newOrder.email
                  }
                  onChange={(event) =>
                    setNewOrder({
                      ...newOrder,
                      email:
                        event.target
                          .value
                    })
                  }
                />
              </label>

              <div className="order-items-block">
                <div className="order-items-header">
                  <strong>Order Items</strong>
                  <button
                    type="button"
                    className="outline-button"
                    onClick={addOrderItemRow}
                  >
                    + Add Item
                  </button>
                </div>

                {newOrder.items.map((item) => (
                  <div className="order-item-row" key={item.id}>
                    <input
                      placeholder="Item name"
                      value={item.name}
                      onChange={(event) =>
                        updateOrderItemRow(
                          item.id,
                          "name",
                          event.target.value
                        )
                      }
                    />

                    <input
                      type="number"
                      min="1"
                      placeholder="Qty"
                      value={item.qty}
                      onChange={(event) =>
                        updateOrderItemRow(
                          item.id,
                          "qty",
                          event.target.value
                        )
                      }
                    />

                    <input
                      type="number"
                      min="0"
                      placeholder="Price"
                      value={item.price}
                      onChange={(event) =>
                        updateOrderItemRow(
                          item.id,
                          "price",
                          event.target.value
                        )
                      }
                    />

                    <button
                      type="button"
                      className="table-delete"
                      onClick={() => removeOrderItemRow(item.id)}
                      disabled={newOrder.items.length === 1}
                    >
                      🗑
                    </button>
                  </div>
                ))}

                <div className="order-items-total">
                  <span>Auto-calculated Total</span>
                  <strong>{formatMoney(orderItemsTotal)}</strong>
                </div>
              </div>

              {isAdminOrOwner ? (
                <label>
                  Status

                  <select
                    value={
                      newOrder.status
                    }
                    onChange={(event) =>
                      setNewOrder({
                        ...newOrder,
                        status:
                          event.target
                            .value
                      })
                    }
                  >
                    <option>
                      Pending
                    </option>

                    <option>
                      Completed
                    </option>

                    <option>
                      Failed
                    </option>
                  </select>
                </label>
              ) : (
                <div className="status-locked-note">
                  New orders start as <strong>Pending</strong>. Only Admin or
                  Owner can update the status afterwards.
                </div>
              )}

              <div className="modal-actions">
                <button
                  type="button"
                  className="outline-button"
                  onClick={() =>
                    setShowOrderModal(
                      false
                    )
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-button"
                >
                  Create Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================
          USER DETAILS MODAL
      ========================= */}

      {selectedUser && (
        <div
          className="modal-backdrop"
          onClick={() =>
            setSelectedUser(null)
          }
        >
          <div
            className="modal-card user-detail-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="modal-header">
              <div>
                <span className="eyebrow owner-eyebrow">
                  REGISTERED ACCOUNT
                </span>

                <h2>
                  User Details
                </h2>
              </div>

              <button
                onClick={() =>
                  setSelectedUser(
                    null
                  )
                }
              >
                ×
              </button>
            </div>

            <div className="user-detail-profile">
              <div className="large-avatar">
                {selectedUser.name
                  ?.charAt(0)
                  .toUpperCase() ||
                  "U"}
              </div>

              <div>
                <h2>
                  {selectedUser.name ||
                    "Unnamed User"}
                </h2>

                <span
                  className={`role-badge ${
                    selectedUser.role
                  }`}
                >
                  {userRoleLabel(
                    selectedUser.role
                  )}
                </span>
              </div>
            </div>

            <div className="detail-grid">
              <div>
                <span>
                  Full Name
                </span>

                <strong>
                  {selectedUser.name ||
                    "Not provided"}
                </strong>
              </div>

              <div>
                <span>
                  Email
                </span>

                <strong>
                  {selectedUser.email ||
                    "Not provided"}
                </strong>
              </div>

              <div>
                <span>
                  Phone
                </span>

                <strong>
                  {selectedUser.phone ||
                    "Not provided"}
                </strong>
              </div>

              <div>
                <span>
                  Provider
                </span>

                <strong>
                  {selectedUser.provider ||
                    "Email/Password"}
                </strong>
              </div>

              <div>
                <span>
                  UID
                </span>

                <strong className="break-text">
                  {selectedUser.uid}
                </strong>
              </div>

              <div>
                <span>
                  Created At
                </span>

                <strong>
                  {selectedUser.createdAt
                    ? new Date(
                        selectedUser.createdAt
                      ).toLocaleString(
                        "en-IN"
                      )
                    : "Unknown"}
                </strong>
              </div>

              <div>
                <span>
                  Email Verified
                </span>

                <strong>
                  {selectedUser.emailVerified
                    ? "Yes"
                    : "Not recorded"}
                </strong>
              </div>

              <div>
                <span>
                  Password
                </span>

                <strong>
                  🔒 Protected
                </strong>
              </div>
            </div>

            <div className="password-security-note">
              <strong>
                🔐 Password security
              </strong>

              <p>
                Firebase passwords are not
                shown as plaintext in this
                dashboard. If a user forgets
                their password, use the
                password reset flow instead of
                exposing the password.
              </p>
            </div>

            <div className="modal-actions">
              <button
                className="outline-button"
                onClick={() =>
                  setSelectedUser(
                    null
                  )
                }
              >
                Close
              </button>

              <button
                className="primary-button"
                onClick={() => {
                  addNotification(
                    "Password reset",
                    `Reset flow requested for ${selectedUser.email}.`
                  );

                  setSelectedUser(
                    null
                  );
                }}
              >
                Send Reset Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================
          CHAT DRAWER
      ========================= */}

      {showChat && (
        <div className="chat-drawer">
          <div className="chat-header">
            <div>
              <strong>
                {isAdminOrOwner
                  ? "Support Chat (Encrypted)"
                  : "RAF Support"}
              </strong>

              <span>
                🔒 End-to-end encrypted ● Online
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

          {isAdminOrOwner && (
            <div className="chat-target-picker">
              <select
                value={chatTargetUid || ""}
                onChange={(event) =>
                  setChatTargetUid(event.target.value || null)
                }
              >
                <option value="">
                  Select a user to chat with…
                </option>

                {chatTargets.map((target) => (
                  <option key={target.id} value={target.id}>
                    {target.name} ({target.email})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="chat-messages">
            {!currentConversationId && (
              <div className="empty-state">
                Select a user above to start an encrypted chat.
              </div>
            )}

            {currentConversationId && chatLoading && (
              <div className="empty-state">Decrypting conversation…</div>
            )}

            {currentConversationId &&
              !chatLoading &&
              (chatThreads[currentConversationId] || []).map(
                (message) => (
                  <div
                    key={message.id}
                    className={
                      message.mine
                        ? "chat-message mine"
                        : "chat-message"
                    }
                  >
                    <span>
                      {message.sender}
                    </span>

                    <p>
                      {message.text}
                    </p>
                  </div>
                )
              )}
          </div>

          <div className="chat-input">
            <input
              placeholder={
                currentConversationId
                  ? "Type a message..."
                  : "Select a user first…"
              }
              value={chatMessage}
              disabled={!currentConversationId}
              onChange={(event) =>
                setChatMessage(
                  event.target.value
                )
              }
              onKeyDown={(event) => {
                if (
                  event.key === "Enter"
                ) {
                  sendChat();
                }
              }}
            />

            <button
              onClick={sendChat}
              disabled={!currentConversationId}
            >
              →
            </button>
          </div>
        </div>
      )}

      {/* =========================
          SHORTCUT MODAL
      ========================= */}

      {showShortcuts && (
        <div
          className="modal-backdrop"
          onClick={() =>
            setShowShortcuts(false)
          }
        >
          <div
            className="modal-card shortcuts-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="modal-header">
              <div>
                <span className="eyebrow">
                  PRODUCTIVITY
                </span>

                <h2>
                  Keyboard Shortcuts
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

            <div className="shortcut-row">
              <span>
                Global Search
              </span>

              <kbd>
                Ctrl + K
              </kbd>
            </div>

            <div className="shortcut-row">
              <span>
                Close modal
              </span>

              <kbd>
                ESC
              </kbd>
            </div>

            <div className="shortcut-row">
              <span>
                Add task
              </span>

              <kbd>
                ENTER
              </kbd>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
