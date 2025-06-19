# 📚 NotesHub - Your Academic Notes Portal

**NotesHub** is a dynamic web platform built for students and faculty. It allows **students to access subject-wise categorized academic notes**, while **faculty/admins can upload notes and quizzes** securely using their login credentials.

---

## 🚀 Live Demo

- 🌐 **Frontend**: [https://quicknoteshub.netlify.app](https://quicknoteshub.netlify.app)
- ⚙️ **Backend API**: [https://noteshub-tdw3.onrender.com](https://noteshub-tdw3.onrender.com)

---

## 🛠 Tech Stack

### 🔸 Frontend
- HTML5, CSS3
- JavaScript (Vanilla)
- LocalStorage-based login system

### 🔹 Backend
- Node.js
- Express.js
- MongoDB (Atlas)
- Supabase Storage (for permanent PDF storage)
- JWT Authentication (for faculty)
- Multer (for handling PDF file uploads)

### ☁️ Deployment
- **Frontend**: Netlify  
- **Backend**: Render  
- **Storage**: Supabase (bucket: `notes-pdf`)

---

## ✨ Key Features

### 👨‍🏫 Faculty/Admin
- 🔐 Faculty login using JWT token
- 📄 Upload Notes as PDFs to Supabase
- 📝 Upload quizzes (MCQs)
- 📌 See only their assigned subjects

### 👩‍🎓 Student Panel
- 🧾 Login/Signup using LocalStorage
- 🔍 Filter notes by Course → Semester → Subject
- 📂 Animated dropdown toggles for notes
- 📥 Direct PDF download

---
