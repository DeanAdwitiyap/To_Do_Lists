const API_URL = "http://localhost:5000/tasks";

async function fetchTasks() {
  const res = await fetch(API_URL); //connect to backend
  const tasks = await res.json();
  const list = document.getElementById("taskList");
  list.innerHTML = "";

  tasks.forEach(task => {
    const li = document.createElement("li");

    const contentRow = document.createElement("div");
    contentRow.className = "content-row";

    const leftDiv = document.createElement("div");
    leftDiv.className = "left";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.onchange = () => {
      li.classList.toggle("done", checkbox.checked);
    };

    const titleSpan = document.createElement("span");
    titleSpan.textContent = task.title;

    leftDiv.appendChild(checkbox);
    leftDiv.appendChild(titleSpan);

    const delBtn = document.createElement("button");
    delBtn.textContent = "❌";
    delBtn.onclick = () => deleteTask(task.id);

    contentRow.appendChild(leftDiv);
    contentRow.appendChild(delBtn);

    const deadlineEl = document.createElement("div");
    deadlineEl.className = "deadline";

    if (task.deadline) {
      const deadlineDate = new Date(task.deadline);
      const formatted = deadlineDate.toLocaleString("id-ID", {
        dateStyle: "full",
        timeStyle: "short"
      });
      deadlineEl.textContent = `⏰ Deadline: ${formatted}`;
    }

    const timeInfo = document.createElement("div");
    timeInfo.className = "timestamp";
    timeInfo.textContent = task.timestamp || "";

    li.appendChild(contentRow);
    li.appendChild(deadlineEl);
    li.appendChild(timeInfo);
    list.appendChild(li);
  });
}

async function addTask() {
  const input = document.getElementById("taskInput");
  const deadlineInput = document.getElementById("deadlineInput");
  const title = input.value;
  const deadline = deadlineInput.value;

  if (!title) return;

  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, deadline })
  });

  input.value = "";
  deadlineInput.value = "";
  fetchTasks();
}

async function deleteTask(id) {
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  fetchTasks();
}

// Jam dan hari
function updateClock() {
  const now = new Date();
  const hari = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const bulan = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli",
    "Agustus", "September", "Oktober", "November", "Desember"];
  const dayName = hari[now.getDay()];
  const day = now.getDate();
  const month = bulan[now.getMonth()];
  const year = now.getFullYear();

  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const seconds = now.getSeconds().toString().padStart(2, "0");

  const clockEl = document.getElementById("clock");
  clockEl.textContent = `${dayName}, ${day} ${month} ${year} — ${hours}:${minutes}:${seconds}`;
}

setInterval(updateClock, 1000);
updateClock();

// Dark mode toggle
const modeToggle = document.getElementById("modeToggle");
function toggleMode() {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  modeToggle.textContent = isDark ? "☀️ Mode Terang" : "🌙 Mode Gelap";
  localStorage.setItem("darkMode", isDark);
}
modeToggle.addEventListener("click", toggleMode);
if (localStorage.getItem("darkMode") === "true") {
  document.body.classList.add("dark");
  modeToggle.textContent = "☀️ Mode Terang";
}

// Init
fetchTasks();
