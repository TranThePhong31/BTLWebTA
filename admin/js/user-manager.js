// ===============================
// MODULE QUẢN LÝ USER
// ===============================

const ITEMS_PER_PAGE = 5;
let currentPage = 1;
let filteredUsers = [...mockUsers];
let currentActionUser = null;

// ===============================
// KHỞI TẠO
// ===============================

document.addEventListener("DOMContentLoaded", function() {
    // Khởi tạo User List Page
    if (document.getElementById("userTable")) {
        loadUsers();
        setupEventListeners();
    }

    // Khởi tạo User Detail Page
    if (document.getElementById("userName")) {
        loadUserDetail();
    }

    // Khởi tạo Dashboard
    if (document.getElementById("total-users")) {
        loadDashboardStats();
    }
});

// ===============================
// USER LIST PAGE
// ===============================

function loadUsers() {
    filteredUsers = [...mockUsers];
    currentPage = 1;
    renderTable();
    updatePagination();
}

function setupEventListeners() {
    // Search
    document.getElementById("searchInput").addEventListener("input", searchUsers);

    // Filters
    document.getElementById("statusFilter").addEventListener("change", filterUsers);
    document.getElementById("roleFilter").addEventListener("change", filterUsers);

    // Pagination
    document.getElementById("prevBtn").addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            renderTable();
        }
    });

    document.getElementById("nextBtn").addEventListener("click", () => {
        const maxPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
        if (currentPage < maxPages) {
            currentPage++;
            renderTable();
        }
    });
}

function searchUsers() {
    const searchTerm = document.getElementById("searchInput").value.toLowerCase();
    filteredUsers = mockUsers.filter(user => 
        user.name.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm) ||
        user.id.toString().includes(searchTerm)
    );
    
    // Re-apply other filters
    applyFilters();
    currentPage = 1;
    renderTable();
    updatePagination();
}

function filterUsers() {
    currentPage = 1;
    applyFilters();
    renderTable();
    updatePagination();
}

function applyFilters() {
    const statusFilter = document.getElementById("statusFilter").value;
    const roleFilter = document.getElementById("roleFilter").value;

    filteredUsers = mockUsers.filter(user => {
        const matchStatus = !statusFilter || user.status === statusFilter;
        const matchRole = !roleFilter || user.role === roleFilter;
        return matchStatus && matchRole;
    });
}

function renderTable() {
    const tbody = document.getElementById("userTableBody");
    tbody.innerHTML = "";

    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    const pageUsers = filteredUsers.slice(start, end);

    pageUsers.forEach(user => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>#${user.id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td><span style="text-transform: capitalize;">${user.role}</span></td>
            <td>
                <span class="status-badge status-${user.status}">
                    ${user.status === "active" ? "✓ Active" : user.status === "banned" ? "✕ Banned" : "⊘ Inactive"}
                </span>
            </td>
            <td>${formatDate(user.createdAt)}</td>
            <td>
                <div style="display: flex; gap: 5px;">
                    <button class="btn btn-primary" onclick="viewUserDetail(${user.id})" style="padding: 6px 10px; font-size: 12px;">Chi tiết</button>
                    <button class="btn ${user.status === "banned" ? "btn-success" : "btn-danger"}" onclick="toggleBan(${user.id})" style="padding: 6px 10px; font-size: 12px;">
                        ${user.status === "banned" ? "Mở khóa" : "Khóa"}
                    </button>
                    <button class="btn btn-warning" onclick="resetPassword(${user.id})" style="padding: 6px 10px; font-size: 12px;">Reset</button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function updatePagination() {
    const maxPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
    const pageNumbersDiv = document.getElementById("pageNumbers");
    pageNumbersDiv.innerHTML = "";

    for (let i = 1; i <= maxPages; i++) {
        const btn = document.createElement("button");
        btn.textContent = i;
        btn.className = `page-num ${i === currentPage ? "active" : ""}`;
        btn.onclick = () => {
            currentPage = i;
            renderTable();
            updatePagination();
        };
        pageNumbersDiv.appendChild(btn);
    }

    document.getElementById("prevBtn").disabled = currentPage === 1;
    document.getElementById("nextBtn").disabled = currentPage === maxPages;
}

function viewUserDetail(userId) {
    const user = mockUsers.find(u => u.id === userId);
    if (!user) return;

    // Lưu userId vào localStorage để lấy trang detail
    localStorage.setItem("selectedUserId", userId);
    window.location.href = "user-detail.html";
}

function toggleBan(userId) {
    const user = mockUsers.find(u => u.id === userId);
    if (!user) return;

    currentActionUser = user;
    const modal = document.getElementById("actionModal");
    const actionTitle = document.getElementById("actionTitle");
    const actionMessage = document.getElementById("actionMessage");

    if (user.status === "banned") {
        actionTitle.textContent = "Mở Khóa Tài Khoản";
        actionMessage.textContent = `Bạn chắc chắn muốn mở khóa tài khoản ${user.name} không?`;
    } else {
        actionTitle.textContent = "Khóa Tài Khoản";
        actionMessage.textContent = `Bạn chắc chắn muốn khóa tài khoản ${user.name} không?`;
    }

    modal.classList.add("show");

    document.getElementById("confirmBtn").onclick = () => {
        user.status = user.status === "banned" ? "active" : "banned";
        modal.classList.remove("show");
        renderTable();
        alert(user.status === "banned" ? "Tài khoản đã bị khóa" : "Tài khoản đã được mở khóa");
    };

    document.getElementById("cancelBtn").onclick = () => {
        modal.classList.remove("show");
    };
}

function resetPassword(userId) {
    const user = mockUsers.find(u => u.id === userId);
    if (!user) return;

    currentActionUser = user;
    const modal = document.getElementById("actionModal");
    document.getElementById("actionTitle").textContent = "Reset Password";
    document.getElementById("actionMessage").textContent = `Reset mật khẩu cho ${user.name}? Mật khẩu mới sẽ gửi qua email.`;

    modal.classList.add("show");

    document.getElementById("confirmBtn").onclick = () => {
        modal.classList.remove("show");
        alert(`Mật khẩu mới đã được gửi tới ${user.email}`);
    };

    document.getElementById("cancelBtn").onclick = () => {
        modal.classList.remove("show");
    };
}

// ===============================
// USER DETAIL PAGE
// ===============================

function loadUserDetail() {
    const userId = parseInt(localStorage.getItem("selectedUserId")) || 1;
    const user = mockUsers.find(u => u.id === userId);

    if (!user) return;

    // Điền thông tin user
    document.getElementById("userAvatar").src = user.avatar;
    document.getElementById("userName").textContent = user.name;
    document.getElementById("userEmail").textContent = user.email;
    document.getElementById("userId").textContent = `#${user.id}`;
    document.getElementById("userRole").textContent = user.role;
    document.getElementById("userCreatedAt").textContent = formatDate(user.createdAt);
    document.getElementById("userLastActive").textContent = user.lastActive;

    // Trạng thái
    const statusBadge = document.getElementById("userStatus");
    statusBadge.textContent = user.status.toUpperCase();
    statusBadge.className = `status-badge status-${user.status}`;

    // Tiến độ học tập
    const lessonsPercent = Math.round((user.lessonsCompleted / user.lessonsTotal) * 100);
    const quizPercent = user.quizScore;
    const coursePercent = Math.round((user.courseCompleted / 15) * 100);

    document.getElementById("lessonsPercent").textContent = `${lessonsPercent}%`;
    document.getElementById("lessonsProgress").style.width = `${lessonsPercent}%`;

    document.getElementById("quizPercent").textContent = `${quizPercent}%`;
    document.getElementById("quizProgress").style.width = `${quizPercent}%`;

    document.getElementById("coursePercent").textContent = `${coursePercent}%`;
    document.getElementById("courseProgress").style.width = `${coursePercent}%`;

    // Lịch sử hoạt động
    const activityList = document.getElementById("activityList");
    activityList.innerHTML = "";
    user.activities.forEach(activity => {
        const item = document.createElement("div");
        item.className = "activity-item";
        item.innerHTML = `
            <span class="activity-time">${activity.time}</span>
            <span class="activity-text">${activity.action}</span>
        `;
        activityList.appendChild(item);
    });
}

// ===============================
// DASHBOARD
// ===============================

function loadDashboardStats() {
    const activeUsersCount = mockUsers.filter(u => u.status === "active").length;
    const totalLessons = mockUsers.reduce((sum, u) => sum + u.lessonsCompleted, 0);
    const totalHours = mockUsers.reduce((sum, u) => sum + u.hoursSpent, 0);

    document.getElementById("total-users").textContent = mockUsers.length;
    document.getElementById("active-users").textContent = activeUsersCount;
    document.getElementById("completed-lessons").textContent = totalLessons;
    document.getElementById("total-hours").textContent = Math.round(totalHours / mockUsers.length);
}

// ===============================
// MODAL CONTROLS
// ===============================

const modals = document.querySelectorAll(".modal");

modals.forEach(modal => {
    const closeBtn = modal.querySelector(".close");
    if (closeBtn) {
        closeBtn.onclick = () => modal.classList.remove("show");
    }

    window.onclick = (event) => {
        if (event.target === modal) {
            modal.classList.remove("show");
        }
    };
});