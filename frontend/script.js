// ========== CONFIG ==========
const BACKEND_URL = "https://noteshub-tdw3.onrender.com";

// ========== LOGIN SYSTEM ==========
function showLogin() {
  document.getElementById('loginForm').classList.remove('hidden');
  document.getElementById('signupForm').classList.add('hidden');
  const buttons = document.querySelectorAll('.toggle button');
  buttons[0].classList.add('active');
  buttons[1].classList.remove('active');
}

function showSignup() {
  document.getElementById('signupForm').classList.remove('hidden');
  document.getElementById('loginForm').classList.add('hidden');
  const buttons = document.querySelectorAll('.toggle button');
  buttons[1].classList.add('active');
  buttons[0].classList.remove('active');
}

// ========== SIGNUP ==========
document.getElementById('signupForm')?.addEventListener('submit', function (e) {
  e.preventDefault();
  const name = document.getElementById('signupName').value;
  const email = document.getElementById('signupEmail').value;
  const password = document.getElementById('signupPassword').value;

  const users = JSON.parse(localStorage.getItem('users')) || [];
  const userExists = users.some(u => u.email === email);

  if (userExists) {
    alert('Email already registered!');
  } else {
    users.push({ name, email, password });
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('loggedInUser', email);
    localStorage.setItem('fullName', name);
    alert('Sign up successful!');
    window.location.href = 'notes.html';
  }
});

// ========== LOGIN ==========
document.getElementById('loginForm')?.addEventListener('submit', function (e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  const users = JSON.parse(localStorage.getItem('users')) || [];
  const user = users.find(u => u.email === email && u.password === password);

  if (user) {
    localStorage.setItem('loggedInUser', email);
    localStorage.setItem('fullName', user.name || email);
    alert('Login successful!');
    window.location.href = 'notes.html';
  } else {
    alert('Invalid credentials!');
  }
});

// ========== WELCOME + LOGOUT + REDIRECT ==========
window.addEventListener('DOMContentLoaded', () => {
  const welcomeSpan = document.querySelector('.welcome span');
  const logoutBtn = document.getElementById('logoutBtn');
  const user = localStorage.getItem('loggedInUser');

  if (window.location.pathname.includes('notes.html') && !user) {
    window.location.href = 'index.html';
  }

  if (welcomeSpan) {
    const fullName = localStorage.getItem('fullName') || user || 'User';
    welcomeSpan.textContent = fullName;
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('loggedInUser');
      localStorage.removeItem('fullName');
      window.location.href = 'index.html';
    });
  }
});

// ========== COURSE → SEMESTER MAPPING ==========
const courseSemesterMap = {
  "MCA": ["1st Semester", "2nd Semester"],
  "BSc Physics": ["1st Semester", "2nd Semester", "3rd Semester", "4th Semester", "5th Semester", "6th Semester"],
  "Programming": ["C", "Java", "Data Structures"],
  "Web Development": ["HTML", "CSS", "JavaScript"]
};

// ========== DOM ELEMENTS ==========
const courseSelect = document.getElementById("courseSelect");
const semesterSelect = document.getElementById("semesterSelect");
const loadSubjectsBtn = document.getElementById("loadSubjectsBtn");
const notesContainer = document.getElementById("notesContainer");

// ========== LOAD SEMESTERS DYNAMICALLY ==========
courseSelect?.addEventListener("change", () => {
  const selectedCourse = courseSelect.value;
  semesterSelect.innerHTML = '<option value="">Select Semester</option>';

  if (selectedCourse && courseSemesterMap[selectedCourse]) {
    courseSemesterMap[selectedCourse].forEach(sem => {
      const option = document.createElement("option");
      option.value = sem;
      option.textContent = sem;
      semesterSelect.appendChild(option);
    });
  }
});

// ========== LOAD SUBJECTS BUTTON ==========
loadSubjectsBtn?.addEventListener("click", () => {
  const course = courseSelect.value;
  const semester = semesterSelect.value;

  if (!course || !semester) {
    alert("Please select both course and semester.");
    return;
  }

  fetchSubjects(course, semester);
});

// ========== FETCH SUBJECTS ==========
function fetchSubjects(course, semester) {
  notesContainer.innerHTML = "<p>Loading subjects...</p>";
  const category = `${course} ${semester}`;

  fetch(`${BACKEND_URL}/api/notes?category=${encodeURIComponent(category)}`)
    .then(res => res.json())
    .then(data => {
      notesContainer.innerHTML = "";

      if (data.length === 0) {
        notesContainer.innerHTML = "<p>No subjects found for this semester.</p>";
        return;
      }

      const subjects = [...new Set(data.map(note => note.subject))];

      subjects.forEach(subject => {
        const subjectCard = document.createElement("div");
        subjectCard.className = "note-card";
        subjectCard.innerHTML = `
          <button class="subject-toggle" onclick="toggleDownloads(this, '${course}', '${semester}', '${subject}')">
            <i class="fas fa-folder"></i> ${subject}
          </button>
          <div class="downloads hidden animated"></div>
        `;
        notesContainer.appendChild(subjectCard);
      });
    })
    .catch(err => {
      console.error("Error fetching subjects:", err);
      notesContainer.innerHTML = "<p>Error loading subjects.</p>";
    });
}

// ========== TOGGLE NOTES DISPLAY WITH ANIMATION ==========
function toggleDownloads(button, course, semester, subject) {
  const container = button.nextElementSibling;
  const category = `${course} ${semester}`;

  if (!container.classList.contains("hidden")) {
    container.classList.add("fade-out");
    setTimeout(() => {
      container.classList.add("hidden");
      container.classList.remove("fade-out");
      container.innerHTML = "";
      button.innerHTML = `<i class="fas fa-folder"></i> ${subject}`;
    }, 300);
    return;
  }

  button.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Loading...`;

  fetch(`${BACKEND_URL}/api/notes?category=${encodeURIComponent(category)}&subject=${encodeURIComponent(subject)}`)
    .then(res => res.json())
    .then(data => {
      container.innerHTML = "";

      if (data.length === 0) {
        container.innerHTML = "<p>No notes found.</p>";
      } else {
        const list = document.createElement("ul");
        list.className = "note-dropdown";

        data.forEach(note => {
          const item = document.createElement("li");
          item.innerHTML = `
            <span class="note-icon">📘</span>
            <div class="note-info">
              <strong>${note.title}</strong><br />
              <small>${note.subject}</small>
            </div>
            <a class="download-btn" href="${BACKEND_URL}${note.fileUrl}" download target="_blank">⬇️ Download</a>
          `;
          list.appendChild(item);
        });

        container.appendChild(list);
      }

      container.classList.remove("hidden");
      container.classList.add("fade-in");
      button.innerHTML = `<i class="fas fa-folder-open"></i> ${subject}`;
    })
    .catch(err => {
      console.error("Error loading notes:", err);
      container.innerHTML = "<p>Error fetching notes.</p>";
      container.classList.remove("hidden");
    });
}
