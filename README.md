# 📚 NotesHub - Your Academic Notes Portal

NotesHub is a web application for managing and accessing categorized academic notes based on course and semester. Admins can upload PDFs, and users can easily view and download them.

## 🚀 Live Demo

- 🌐 Frontend: [https://quicknoteshub.netlify.app](https://quicknoteshub.netlify.app)
- 🛠️ Backend API: [https://noteshub-tdw3.onrender.com](https://noteshub-tdw3.onrender.com)

---

## 🛠 Tech Stack

### Frontend:
- HTML5, CSS3
- JavaScript (Vanilla)

### Backend:
- Node.js
- Express.js
- MongoDB (MongoDB Atlas)
- Multer (for file uploads)

### Deployment:
- Netlify (Frontend)
- Render (Backend)

---

## ✨ Features

- 🔐 **User Login/Signup** using localStorage
- 📁 **Admin Panel** to upload PDF notes
- 🎯 **Categorized Notes** (Course → Semester → Subject)
- 🧾 **Notes Preview and Download** in one click
- 🎨 Stylish UI with animations and dropdown toggles

---

## 📂 How It Works

1. **Admin** logs in via `admin.html` and uploads PDFs with metadata (Title, Subject, Category).
2. Files are stored on the server (`/uploads`) and metadata saved in MongoDB.
3. **User** selects Course → Semester → Subject to view & download notes.

---

### 👨‍🏫 Faculty/Admin
- Faculty Registration & Login
- Upload Notes (PDF)
- Upload Quizzes (questions provided by faculty/admin)
- Only see & upload for their assigned subjects

---
