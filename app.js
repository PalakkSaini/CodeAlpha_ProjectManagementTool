/* =====================================================
   PROJECTFLOW PRO – CLEAN PROFESSIONAL APP.JS
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* ================= LOGIN ================= */
    const loginForm = document.getElementById("loginForm");
    const loginScreen = document.getElementById("loginScreen");
    const appContainer = document.getElementById("appContainer");
    const logoutBtn = document.getElementById("logoutBtn");
    const profileName = document.querySelector(".profile span");

    function openLogin() {
        loginScreen.style.display = "flex";
        appContainer.style.display = "none";
    }

    function openApp(userName) {
        loginScreen.style.display = "none";
        appContainer.style.display = "flex";
        profileName.textContent = userName;
    }

    if (loginForm) {
        loginForm.addEventListener("submit", e => {
            e.preventDefault();
            const name = document.getElementById("email").value.split("@")[0] || "User";
            openApp(name);
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener("click", openLogin);
    }
    // loadTasks();
    updateAllStats();

    /* ================= PROJECTS LOGIC ================= */

    const projectInput = document.getElementById("projectInput");
    const addProjectBtn = document.getElementById("addProjectBtn");
    const projectList = document.getElementById("projectList");

    const PROJECT_STORAGE = "pf_projects";

    function getProjects() {
        return JSON.parse(localStorage.getItem(PROJECT_STORAGE) || "[]");
    }

    function saveProjects(projects) {
        localStorage.setItem(PROJECT_STORAGE, JSON.stringify(projects));
    }

    function renderProject(project) {
        const div = document.createElement("div");
        div.className = "project-card";
        div.dataset.id = project.id;

        div.innerHTML = `
        <h4>${project.name}</h4>
        <button class="delete-project">Delete</button>
    `;

        projectList.appendChild(div);
    }

    function loadProjects() {
        projectList.innerHTML = "";
        getProjects().forEach(renderProject);
    }

    if (addProjectBtn) {
        addProjectBtn.addEventListener("click", () => {
            const name = projectInput.value.trim();
            if (!name) return alert("Enter project name");

            const project = {
                id: "_" + Math.random().toString(36).substr(2, 9),
                name
            };

            const projects = getProjects();
            projects.push(project);
            saveProjects(projects);

            renderProject(project);
            projectInput.value = "";
        });
    }

    document.addEventListener("click", e => {
        if (e.target.classList.contains("delete-project")) {
            const card = e.target.closest(".project-card");
            const id = card.dataset.id;

            let projects = getProjects();
            projects = projects.filter(p => p.id !== id);
            saveProjects(projects);

            card.remove();
        }
    });

    loadProjects();

    /* ================= TASK BOARD ================= */

    const taskInput = document.querySelector(".add-task-inline input");
    const taskSelect = document.querySelector(".add-task-inline select");
    const addTaskButton = document.querySelector(".add-task-inline .add-btn");
    const boardColumns = document.querySelectorAll(".board-column");
    const searchInput = document.querySelector(".search-box input");

    const STORAGE_KEY = "pf_tasks";

    const columnMap = {
        0: "todo",
        1: "progress",
        2: "done"
    };

    boardColumns.forEach((col, index) => {
        col.id = columnMap[index];
    });

    function getTasks() {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    }

    function saveTasks(tasks) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    }

    function renderTask(task) {
        const div = document.createElement("div");
        div.className = "task-card";
        div.draggable = true;
        div.dataset.id = task.id;

        div.innerHTML = `
            <h4>${task.title}</h4>
            <small>${task.status.toUpperCase()}</small>
            <button class="delete-task" style="margin-top:8px;font-size:12px;">Delete</button>
        `;

        document.getElementById(task.status).appendChild(div);
    }

    function loadTasks() {
        boardColumns.forEach(col => col.innerHTML = "");
        getTasks().forEach(renderTask);
    }

    /* Add Task */
    if (addTaskButton) {
        addTaskButton.addEventListener("click", () => {
            const title = taskInput.value.trim();
            const statusText = taskSelect.value;

            if (!title) return alert("Enter task title");

            const status =
                statusText === "To Do" ? "todo" :
                    statusText === "In Progress" ? "progress" :
                        "done";

            const task = {
                id: "_" + Math.random().toString(36).substr(2, 9),
                title,
                status
            };

            const tasks = getTasks();
            tasks.push(task);
            saveTasks(tasks);
            updateAllStats();
            renderTask(task);

            taskInput.value = "";
        });
    }

    /* Delete Task */
    document.addEventListener("click", e => {
        if (e.target.classList.contains("delete-task")) {
            const taskDiv = e.target.closest(".task-card");
            const id = taskDiv.dataset.id;

            let tasks = getTasks();
            tasks = tasks.filter(t => t.id !== id);
            saveTasks(tasks);
            updateAllStats();
            taskDiv.remove();
        }
    });

    /* Drag & Drop */
    let dragged = null;

    document.addEventListener("dragstart", e => {
        if (e.target.classList.contains("task-card")) {
            dragged = e.target;
            setTimeout(() => e.target.style.display = "none", 0);
        }
    });

    document.addEventListener("dragend", e => {
        if (e.target.classList.contains("task-card")) {
            e.target.style.display = "block";
            dragged = null;
        }
    });

    boardColumns.forEach(col => {
        col.addEventListener("dragover", e => e.preventDefault());

        col.addEventListener("drop", () => {
            if (dragged) {
                col.appendChild(dragged);

                let tasks = getTasks();
                tasks = tasks.map(t =>
                    t.id === dragged.dataset.id
                        ? { ...t, status: col.id }
                        : t
                );

                saveTasks(tasks);
                updateAllStats();
            }
        });
    });

    /* ================= SEARCH ================= */
    if (searchInput) {
        searchInput.addEventListener("input", () => {
            const val = searchInput.value.toLowerCase();
            document.querySelectorAll(".task-card").forEach(t => {
                t.style.display =
                    t.textContent.toLowerCase().includes(val)
                        ? "block"
                        : "none";
            });
        });
    }

    /* ===== FORGOT PASSWORD ===== */

    const forgotLink = document.querySelector(".remember-row a");
    const forgotModal = document.getElementById("forgotModal");
    const closeForgot = document.getElementById("closeForgot");
    const sendReset = document.getElementById("sendReset");

    if (forgotLink) {
        forgotLink.addEventListener("click", (e) => {
            e.preventDefault();
            forgotModal.classList.add("active");
        });
    }

    if (closeForgot) {
        closeForgot.addEventListener("click", () => {
            forgotModal.classList.remove("active");
        });
    }

    if (sendReset) {
        sendReset.addEventListener("click", () => {
            alert("Password reset link sent to your email!");
            forgotModal.classList.remove("active");
        });
    }

    /* ===== SCROLL INSIDE MAIN CONTENT ===== */

    document.querySelectorAll('.sidebar a').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href').replace('#', '');
            const targetSection = document.getElementById(targetId);
            const container = document.querySelector('.main-content');

            if (targetSection && container) {
                container.scrollTo({
                    top: targetSection.offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    /* ===== ACTIVITY TOGGLE ===== */

    document.querySelectorAll(".activity-header").forEach(header => {
        header.addEventListener("click", () => {
            const item = header.parentElement;
            item.classList.toggle("active");
        });
    });

    /* ===== NOTIFICATION DROPDOWN ===== */

    const notifyBtn = document.getElementById("notifyBtn");
    const notifyDropdown = document.getElementById("notifyDropdown");

    if (notifyBtn && notifyDropdown) {
        notifyBtn.addEventListener("click", (e) => {
            e.stopPropagation(); // prevent body click
            notifyDropdown.classList.toggle("active");
        });

        // Close when clicking outside
        document.addEventListener("click", (e) => {
            if (!notifyDropdown.contains(e.target) && !notifyBtn.contains(e.target)) {
                notifyDropdown.classList.remove("active");
            }
        });
    }

    /* ================= INIT ================= */
    loadTasks();

});

// ================= CALENDAR =================

document.addEventListener("DOMContentLoaded", function () {

    const monthYear = document.getElementById("monthYear");
    const calendarGrid = document.getElementById("calendarGrid");
    const prevMonth = document.getElementById("prevMonth");
    const nextMonth = document.getElementById("nextMonth");

    let currentDate = new Date();

    function renderCalendar(date) {

        if (!monthYear || !calendarGrid) return;

        calendarGrid.innerHTML = "";

        const year = date.getFullYear();
        const month = date.getMonth();

        const firstDay = new Date(year, month, 1).getDay();
        const lastDate = new Date(year, month + 1, 0).getDate();

        // Month name show
        monthYear.textContent = date.toLocaleString("default", {
            month: "long",
            year: "numeric"
        });

        // Empty boxes before first date
        for (let i = 0; i < firstDay; i++) {
            calendarGrid.innerHTML += `<div></div>`;
        }

        // Add dates
        for (let day = 1; day <= lastDate; day++) {

            const today = new Date();
            const isToday =
                day === today.getDate() &&
                month === today.getMonth() &&
                year === today.getFullYear();

            calendarGrid.innerHTML += `
                <div class="${isToday ? "today" : ""}">
                    ${day}
                </div>
            `;
        }
    }

    if (prevMonth && nextMonth) {

        prevMonth.addEventListener("click", function () {
            currentDate.setMonth(currentDate.getMonth() - 1);
            renderCalendar(currentDate);
        });

        nextMonth.addEventListener("click", function () {
            currentDate.setMonth(currentDate.getMonth() + 1);
            renderCalendar(currentDate);
        });

        renderCalendar(currentDate);
    }

});

// ================= MASTER UPDATE =================

function updateAllStats() {

    const tasks = JSON.parse(localStorage.getItem("pf_tasks") || "[]");

    const total = tasks.length;
    const completed = tasks.filter(t => t.status === "done").length;
    const pending = tasks.filter(t => t.status !== "done").length;

    // ---------------- DASHBOARD ----------------

    const totalTasks = document.getElementById("totalTasks");
    const completedTasks = document.getElementById("completedTasks");
    const pendingTasks = document.getElementById("pendingTasks");

    if (totalTasks) totalTasks.textContent = total;
    if (completedTasks) completedTasks.textContent = completed;
    if (pendingTasks) pendingTasks.textContent = pending;

    // ---------------- ANALYTICS ----------------

    const analyticsTotal = document.getElementById("analyticsTotal");
    const analyticsCompleted = document.getElementById("analyticsCompleted");
    const analyticsPending = document.getElementById("analyticsPending");

    if (analyticsTotal) analyticsTotal.textContent = total;
    if (analyticsCompleted) analyticsCompleted.textContent = completed;
    if (analyticsPending) analyticsPending.textContent = pending;

    // ---------------- PROGRESS BAR ----------------

    const progressFill = document.getElementById("progressFill");

    if (progressFill) {
        const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
        progressFill.style.width = percent + "%";
    }
}

// ================= ANALYTICS =================

function startAnalyticsAnimation() {

    const counters = document.querySelectorAll("#analyticsSection .counter");
    const progressFill = document.getElementById("progressFill");

    counters.forEach(counter => {
        const target = +counter.getAttribute("data-target");
        let count = 0;
        const increment = target / 40;

        function updateCounter() {
            count += increment;
            if (count < target) {
                counter.textContent = Math.floor(count);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        }

        updateCounter();
    });

    // progress bar animation
    if (progressFill) {
        setTimeout(() => {
            progressFill.style.width = "65%";
        }, 300);
    }
}

// ================= SIDEBAR NAVIGATION =================

document.addEventListener("DOMContentLoaded", function () {

    const menuItems = document.querySelectorAll(".menu li");

    const sections = {
        overviewsgrids: document.getElementById("overviewsgrids"),
        boardSection: document.getElementById("boardSection"),
        projectsSection: document.getElementById("projectsSection"),
        calendarSection: document.getElementById("calendarSection"),
        analyticsSection: document.getElementById("analyticsSection"),
        teams: document.getElementById("teams"),
        activitySection: document.getElementById("activitySection"),
        settingsSection: document.getElementById("settingsSection")
    };

    menuItems.forEach(item => {

        item.addEventListener("click", function () {

            // Active highlight
            menuItems.forEach(i => i.classList.remove("active"));
            this.classList.add("active");

            // Hide all sections safely
            Object.keys(sections).forEach(key => {
                if (sections[key]) {
                    sections[key].style.display = "none";
                }
            });

            // Show selected section safely
            const sectionName = this.dataset.section;

            if (sections[sectionName]) {
                sections[sectionName].style.display = "block";

                // 👇 Ye line add karo
                if (sectionName === "analyticsSection") {
                    updateAllStats();
                }
            }

        });

    });

});