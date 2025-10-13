// Authentication: show modal, login, register
async function login() {
    const user = document.getElementById("loginUser").value.trim();
    const pass = document.getElementById("loginPass").value.trim();
    if (!user || !pass) {
        alert("⚠️ Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.");
        return;
    }
    try {
        const body = { TenDangNhap: user, MatKhau: pass };
        const { ok, data, res } = await window.__utils.fetchJson("/Auth/Login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });
        if (!ok) {
            alert("❌ " + (data.message || "Đăng nhập thất bại!"));
            return;
        }
        alert("✅ " + (data.message || "Đăng nhập thành công") + "\nXin chào " + data.user.TenDangNhap);
        document.getElementById("userNameDisplay").textContent = data.user.TenDangNhap;
        sessionStorage.setItem("userName", data.user.TenDangNhap);
        sessionStorage.setItem("userId", data.user.MaNguoiDung);
        closeAuth();
    } catch (err) {
        console.error("Lỗi khi đăng nhập:", err);
        alert("⚠️ Đã xảy ra lỗi kết nối tới server!");
    }
}

async function register() {
    const username = document.getElementById("regUser").value.trim();
    const email = document.getElementById("regEmail").value.trim();
    const password = document.getElementById("regPass").value.trim();
    if (!username || !email || !password) {
        alert("⚠️ Vui lòng nhập đầy đủ Tên đăng nhập, Email và Mật khẩu.");
        return;
    }
    try {
        const { ok, data } = await window.__utils.fetchJson("https://localhost:7290/Auth/Register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ TenDangNhap: username, Email: email, MatKhau: password })
        });
        if (ok && data) {
            if (data.success) {
                alert("🎉 " + data.message + "\nChào mừng " + (data.user?.tenDangNhap || username) + "!");
                closeAuth();
            } else {
                alert("⚠️ " + data.message);
            }
        } else {
            alert("❌ Lỗi khi đăng ký: " + (data.message || JSON.stringify(data)));
        }
    } catch (error) {
        console.error("Lỗi fetch:", error);
        alert("❌ Không thể kết nối tới server!");
    }
}

function showAuth(type) {
    const modal = document.getElementById("authModal");
    if (!modal) return;
    modal.style.display = "block";
    document.getElementById("loginForm").style.display = type === "login" ? "block" : "none";
    document.getElementById("registerForm").style.display = type === "register" ? "block" : "none";
}
function closeAuth() {
    const modal = document.getElementById("authModal");
    if (modal) modal.style.display = "none";
}

window.login = login;
window.register = register;
window.showAuth = showAuth;
window.closeAuth = closeAuth;