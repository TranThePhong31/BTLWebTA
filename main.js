function openTab(tabId) {
  document.querySelectorAll(".tab").forEach(tab => tab.classList.remove("active"));
  document.getElementById(tabId).classList.add("active");
  document.querySelectorAll("nav button").forEach(btn => btn.classList.remove("active"));
  event.target.classList.add("active");
}

function sendMessage() {
  const input = document.getElementById("chatInput");
  const chatbox = document.getElementById("chatbox");
  if(input.value.trim() !== ""){
    chatbox.innerHTML += `<p><b>You:</b> ${input.value}</p>`;
    chatbox.innerHTML += `<p><b>Bot:</b> (AI trả lời ở đây)</p>`;
    input.value = "";
    chatbox.scrollTop = chatbox.scrollHeight;
  }
}

function showAuth(type) {
  document.getElementById("authModal").style.display = "block";
  document.getElementById("loginForm").style.display = type === "login" ? "block" : "none";
  document.getElementById("registerForm").style.display = type === "register" ? "block" : "none";
}
function closeAuth() {
  document.getElementById("authModal").style.display = "none";
}
function login() {
  const user = document.getElementById("loginUser").value;
  const pass = document.getElementById("loginPass").value;
  alert("Đăng nhập thành công!\nTài khoản: " + user);
  closeAuth();
}
function register() {
  const user = document.getElementById("regUser").value;
  const pass = document.getElementById("regPass").value;
  alert("Đăng ký thành công!\nTài khoản: " + user);
  closeAuth();
}

let slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
  showSlides(slideIndex += n);
}
function showSlides(n) {
  let slides = document.getElementsByClassName("slide");
  if (slides.length === 0) return;
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  for (let i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  slides[slideIndex-1].style.display = "block";
}

// Tự động chuyển slide mỗi 5 giây
setInterval(() => {
  plusSlides(1);
}, 5000);