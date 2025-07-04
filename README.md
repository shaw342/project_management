# 🚀 ProjectFlow – Collaborative Project Management App

**ProjectFlow** is a modern web application designed to help teams manage projects efficiently, take notes, assign tasks, and track team progress in real-time.

🚧 This project is currently under active development. Some features may not yet be functional.

## 🧩 Key Features

- ✅ **Project Creation**: Easily create, edit, and archive projects.
- 📝 **Note-Taking**: Keep track of ideas, meeting notes, or project documentation.
- 📋 **Task Management**: Create tasks, assign them to team members, set priorities and deadlines.
- 👥 **Team Collaboration**: View team responsibilities, individual progress, and overall project health.
- 📊 **Dashboard**: Real-time project insights and progress tracking.
- 🕒 **Timeboxing**: Allocate fixed time slots to tasks to boost focus and prevent overworking.
- 🔔 **Smart Notifications**: Automatic reminders for upcoming or overdue tasks.
- 🔒 **Secure Authentication**: Login and role-based access (admin, member, guest).

## 🛠️ Tech Stack

- **Frontend**: React.js + nextjs
- **Backend**: golang + gin
- **Database**: postgresql
- **Authentication**: JWT (JSON Web Token)
- **Deployment**: Vercel / Render / Heroku

## 🚧 Local Setup

```bash
# 1. Clone the repository
git clone https://github.com/shaw342/project_management.git
cd project_management

## 🚧 Getting Started (Local Dev)

### 1. Backend (Gin)

```bash
cd backend
go mod tidy
go run main.go

cd frontend
npm install
npm run dev
