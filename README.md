# 🚀 RAF AI — Modern React + Firebase Dashboard

A modern, responsive and clean **React + Firebase dashboard application** featuring authentication, Google Login, task management, user profile, analytics, settings and a light **white + purple UI**.

RAF AI is designed as a modular frontend project that can be extended into a complete SaaS dashboard, productivity platform or AI-powered application.

---

## ✨ Features

### 🔐 Authentication

* Email & Password Login
* Google Authentication
* Firebase Authentication integration
* Firebase ID Token handling
* User profile loading
* Automatic Google user profile creation
* Login error handling
* Loading states
* Protected application flow

### 📊 Dashboard Overview

* Modern dashboard overview
* User statistics
* Completed task counter
* Pending task counter
* Active project statistics
* Productivity percentage
* Account status
* Recent activity section
* Task completion progress
* Quick task management

### ✅ Task Manager

* Create new tasks
* Add tasks using Enter key
* Complete / uncomplete tasks
* Delete tasks
* Task categories
* Task priorities
* High / Medium / Low priority badges
* Total task counter
* Pending task counter
* Completed task counter

### 👤 User Profile

* User avatar
* Full name
* Email
* Phone number
* Editable profile information
* Save profile changes
* Profile update notification

### 📈 Analytics

* Monthly users
* Sessions
* Conversion rate
* Performance statistics
* Weekly activity visualization
* Dashboard analytics cards

> The current analytics values are frontend demo data and can later be connected to Firebase or another backend.

### ⚙️ Settings

* Email notifications
* Activity alerts
* Automatic synchronization
* Dashboard preference controls

### 🎨 UI / UX

* White and light-purple theme
* Responsive layout
* Sidebar navigation
* Modern cards
* Soft shadows
* Rounded UI elements
* Clean typography
* Mobile-friendly design
* Interactive buttons
* Dashboard state navigation
* Responsive task lists

---

# 🛠️ Tech Stack

| Technology                 | Purpose                     |
| -------------------------- | --------------------------- |
| React                      | Frontend UI                 |
| JavaScript                 | Application logic           |
| Vite                       | Development & build system  |
| CSS3                       | Styling & responsive design |
| Firebase Authentication    | User authentication         |
| Firebase Realtime Database | User/profile data           |
| Google Authentication      | Social login                |
| Git                        | Version control             |
| GitHub                     | Repository hosting          |

---

# 📁 Project Structure

```text
RAF-AI/
│
├── public/
│   └── favicon.svg
│
├── src/
│   │
│   ├── components/
│   │   ├── Login.jsx
│   │   ├── Login.css
│   │   ├── Register.jsx
│   │   ├── Register.css
│   │   ├── Dashboard.jsx
│   │   └── Dashboard.css
│   │
│   ├── firebase.js
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
│   └── index.css
│
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
└── README.md
```

> Folder names can be adjusted according to your actual project structure.

---

# 🚀 Getting Started

## 1. Clone the Repository

```bash
git clone https://github.com/YOUR-USERNAME/raf-ai.git
```

Move into the project:

```bash
cd raf-ai
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Configure Firebase

Create a Firebase project from the Firebase Console.

Enable:

* Authentication
* Email/Password Authentication
* Google Authentication
* Realtime Database

Then create your Firebase configuration.

Example:

```javascript
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  databaseURL: "YOUR_DATABASE_URL",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.firebasestorage.app",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

export const app = initializeApp(firebaseConfig);

export const API_KEY = firebaseConfig.apiKey;
export const DATABASE_URL = firebaseConfig.databaseURL;
```

### ⚠️ Important

Do **not** upload private credentials, service-account JSON files or server-side Firebase credentials to GitHub.

For production applications, use environment variables and Firebase Security Rules appropriately.

---

# 🔑 Firebase Authentication

RAF AI supports:

### Email / Password

Users can log in using:

```text
Email
Password
```

### Google Login

Users can also authenticate through their Google account.

The application retrieves:

```text
UID
Email
Display Name
Firebase ID Token
```

and loads the user's profile from Realtime Database.

---

# 🗄️ Realtime Database Structure

The application can store users using a structure similar to:

```json
{
  "users": {
    "USER_UID": {
      "uid": "USER_UID",
      "name": "RAF User",
      "email": "user@example.com",
      "phone": "+91XXXXXXXXXX",
      "provider": "google",
      "createdAt": "2026-01-01T00:00:00.000Z"
    }
  }
}
```

The `USER_UID` should correspond to the Firebase Authentication UID.

---

# ▶️ Run the Project

Start the development server:

```bash
npm run dev
```

Vite will provide a local development address, usually similar to:

```text
http://localhost:5173
```

Open the address in your browser.

---

# 🏗️ Production Build

Create a production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

---

# 🧩 Dashboard Pages

The dashboard currently contains the following sections:

```text
Dashboard
│
├── Overview
│
├── Tasks
│
├── Profile
│
├── Analytics
│
└── Settings
```

---

## 🏠 Overview

The Overview page provides a quick summary of the user's dashboard.

It includes:

* Total users
* Completed tasks
* Active projects
* Productivity
* Quick Tasks
* Recent Activity
* Task completion progress
* Pending tasks
* Account status

---

## ✅ Tasks

The Task Manager allows users to:

```text
Create
    ↓
Manage
    ↓
Complete
    ↓
Delete
```

Each task contains:

```text
Title
Category
Priority
Completion Status
```

Example:

```text
Complete Firebase project
Category: Development
Priority: High
Status: Pending
```

---

## 👤 Profile

The Profile section allows users to manage:

```text
Full Name
Email
Phone
```

The email field is intentionally disabled because authentication identity should generally be managed through Firebase Authentication.

---

## 📊 Analytics

The Analytics page displays application performance information.

Current demo metrics include:

```text
Monthly Users
Sessions
Conversion
Performance
Weekly Activity
```

The analytics section can later be connected to real Firebase data.

---

## ⚙️ Settings

Users can control dashboard preferences such as:

* Email Notifications
* Activity Alerts
* Auto Sync

These controls can later be connected to persistent Firebase user preferences.

---

# 🎨 Design

RAF AI uses a modern **White + Light Purple** visual system.

### Design Principles

* Minimal
* Clean
* Professional
* Responsive
* Soft shadows
* Rounded cards
* Light purple accents
* Easy navigation

Example color direction:

```text
Background
#F8F7FC

Primary Purple
#7C5CFC

Light Purple
#EEE9FF

Dark Text
#181525

Secondary Text
#716C82

White
#FFFFFF
```

---

# 📱 Responsive Design

The dashboard is designed to work across:

* 💻 Desktop
* 🖥️ Large screens
* 📱 Mobile
* 📟 Tablets

Responsive CSS handles:

* Sidebar
* Dashboard grids
* Cards
* Forms
* Task lists
* Analytics
* Profile sections

---

# 🔒 Security Notes

Firebase Authentication provides the identity layer for the application.

For production use, make sure Firebase Realtime Database Rules are properly configured.

Never use unrestricted rules such as:

```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

Instead, restrict access based on authenticated users and ownership.

Example concept:

```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "auth != null && auth.uid === $uid",
        ".write": "auth != null && auth.uid === $uid"
      }
    }
  }
}
```

> Review and adapt Firebase Security Rules to your actual application requirements before production deployment.

---

# 🧪 Current Project Status

| Feature                 | Status        |
| ----------------------- | ------------- |
| React UI                | ✅ Complete    |
| Vite Setup              | ✅ Complete    |
| Firebase Authentication | ✅ Integrated  |
| Email Login             | ✅ Integrated  |
| Google Login            | ✅ Integrated  |
| User Profile            | ✅ Implemented |
| Dashboard               | ✅ Implemented |
| Todo Manager            | ✅ Implemented |
| Analytics UI            | ✅ Implemented |
| Settings UI             | ✅ Implemented |
| Responsive Design       | ✅ Implemented |
| Real Analytics Backend  | ⏳ Planned     |
| Persistent Todo Storage | ⏳ Planned     |
| Persistent Settings     | ⏳ Planned     |
| Real Contact Backend    | ⏳ Planned     |

---

# 🔮 Roadmap

Future versions can include:

### Authentication

* [ ] Forgot Password
* [ ] Email Verification
* [ ] Password Reset
* [ ] Account deletion
* [ ] Session persistence
* [ ] Better authentication state handling

### Dashboard

* [ ] Real Firebase statistics
* [ ] Real-time notifications
* [ ] Search
* [ ] Dashboard customization
* [ ] Dark mode
* [ ] Theme selector

### Tasks

* [ ] Firebase task storage
* [ ] Edit task
* [ ] Task categories
* [ ] Task filters
* [ ] Task search
* [ ] Due dates
* [ ] Drag & drop
* [ ] Persistent task history

### Profile

* [ ] Profile image upload
* [ ] Firebase Storage integration
* [ ] Persistent profile editing
* [ ] Account security page

### Analytics

* [ ] Real-time charts
* [ ] Firebase analytics integration
* [ ] Daily / weekly / monthly filters
* [ ] Export reports
* [ ] Advanced statistics

### Contact

* [ ] Firebase contact message storage
* [ ] Email notifications
* [ ] Contact history
* [ ] Admin message management

---

# 🖼️ Screenshots

Add screenshots of your application here after taking them.

Example:

```markdown
## Dashboard

![RAF AI Dashboard](screenshots/dashboard.png)

## Task Manager

![RAF AI Tasks](screenshots/tasks.png)

## Profile

![RAF AI Profile](screenshots/profile.png)

## Analytics

![RAF AI Analytics](screenshots/analytics.png)

## Settings

![RAF AI Settings](screenshots/settings.png)
```

Recommended structure:

```text
screenshots/
├── dashboard.png
├── tasks.png
├── profile.png
├── analytics.png
├── settings.png
└── login.png
```

---

# 🧑‍💻 Development

Start development:

```bash
npm run dev
```

Build:

```bash
npm run build
```

Preview:

```bash
npm run preview
```

---

# 🐛 Troubleshooting

## Google Login doesn't work

Check:

1. Google provider is enabled in Firebase Authentication.
2. Your development domain is authorized.
3. Firebase configuration is correct.
4. Browser popup blocking is disabled for the application.

---

## User profile is not loading

Check:

```text
Firebase Authentication UID
        ↓
Realtime Database
        ↓
users
        ↓
USER_UID
```

Make sure the authenticated UID matches the database path.

---

## Database permission denied

Check Firebase Realtime Database Rules.

The authenticated user's UID must have permission to access their own data.

---

## Build error

Try:

```bash
rm -rf node_modules
npm install
npm run dev
```

On Windows PowerShell:

```powershell
Remove-Item -Recurse -Force node_modules
npm install
npm run dev
```

---

# 🤝 Contributing

Contributions are welcome.

### 1. Fork the repository

```bash
git clone https://github.com/YOUR-USERNAME/raf-ai.git
```

### 2. Create a branch

```bash
git checkout -b feature/new-feature
```

### 3. Make your changes

Update the project and test your changes.

### 4. Commit

```bash
git add .
git commit -m "Add new dashboard feature"
```

### 5. Push

```bash
git push origin feature/new-feature
```

### 6. Create a Pull Request

Open a Pull Request and describe your changes.

---

# 📌 Suggested Commit Convention

Use clear commit messages:

```text
feat: add task manager
fix: repair google login
style: update dashboard theme
refactor: improve profile component
docs: update README
chore: update dependencies
```

---

# 📜 License

This project is currently intended for educational and portfolio purposes.

If you want to distribute RAF AI publicly, add an appropriate open-source license such as MIT after deciding how you want others to use the project.

---

# 👨‍💻 Author

**RAF AI**

A modern React + Firebase dashboard project focused on:

```text
Authentication
     +
User Management
     +
Task Management
     +
Analytics
     +
Modern UI
```

---

# ⭐ Support

If you find this project useful:

* ⭐ Star the repository
* 🍴 Fork the project
* 🐛 Report bugs
* 💡 Suggest features
* 🔧 Submit improvements

---

# 🚀 Final

RAF AI is more than a simple dashboard UI.

It provides a foundation for building a complete modern web application with:

**React + Vite + Firebase Authentication + Realtime Database + Responsive UI**

The architecture can be extended with real-time data, persistent tasks, advanced analytics, notifications, admin functionality and additional Firebase services.

---

## Built with ❤️ using React & Firebase

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
