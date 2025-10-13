// Quiz flow (start / select / next / finish)
let quizQuestions = [];
let currentIndex = 0;
let totalQuestions = 10;
let correctCount = 0;
let answered = false;
let autoAdvanceTimeout = 800;

async function startQuiz() {
    currentIndex = 0; correctCount = 0; answered = false;
    const startBtn = document.getElementById("startQuizBtn");
    const resultEl = document.getElementById("quizResult");
    if (resultEl) resultEl.style.display = "none";
    if (document.getElementById("nextBtn")) document.getElementById("nextBtn").style.display = "none";
    if (startBtn) startBtn.style.display = "none";
    document.getElementById("progressInfo").textContent = "";

    try {
        const res = await fetch(`https://localhost:7290/api/Exam/GetQuestions?count=${totalQuestions}`);
        if (!res.ok) throw new Error("Không thể tải câu hỏi từ server");
        const data = await res.json();
        quizQuestions = data.map(q => ({
            id: q.ma_cau,
            question: q.noi_dung,
            choices: q.luaChon.reduce((acc, lc, idx) => {
                const letter = String.fromCharCode(65 + idx);
                acc[letter] = lc.noi_dung;
                if (lc.la_dap_an) acc.correct = letter;
                return acc;
            }, {})
        })).slice(0, totalQuestions);
    } catch (err) {
        console.error("❌ Lỗi khi tải câu hỏi:", err);
        alert("Không thể tải câu hỏi từ server, vui lòng thử lại sau.");
        return;
    }
    document.getElementById("totalQuestions").textContent = totalQuestions;
    document.querySelectorAll(".answer-btn").forEach(btn => { btn.disabled = false; btn.classList.remove("correct","incorrect","selected"); });
    loadQuestion();
}

function loadQuestion() {
    answered = false;
    const q = quizQuestions[currentIndex];
    if (!q) return finishQuiz();
    document.getElementById("questionNumber").textContent = currentIndex + 1;
    document.getElementById("examQuestion").textContent = q.question;
    const buttons = document.querySelectorAll(".answer-btn");
    buttons.forEach(btn => {
        const choice = btn.getAttribute("data-choice");
        btn.textContent = `${choice}. ${q.choices[choice] || ''}`;
        btn.disabled = false;
        btn.classList.remove("correct","incorrect","selected");
    });
    document.getElementById("nextBtn").style.display = "none";
    document.getElementById("progressInfo").textContent = `Đã đúng ${correctCount} / ${currentIndex} câu`;
}

function selectAnswer(choice) {
    if (answered) return;
    answered = true;
    const q = quizQuestions[currentIndex];
    const correct = q.choices.correct;
    document.querySelectorAll(".answer-btn").forEach(btn => {
        const c = btn.getAttribute("data-choice");
        btn.disabled = true;
        if (c === correct) btn.classList.add("correct");
        if (c === choice && c !== correct) btn.classList.add("incorrect");
    });
    if (choice === correct) correctCount++;
    document.getElementById("progressInfo").textContent = `Đã đúng ${correctCount} / ${currentIndex + 1} câu`;
    if (currentIndex < totalQuestions - 1) {
        setTimeout(() => { currentIndex++; loadQuestion(); }, autoAdvanceTimeout);
    } else {
        setTimeout(() => finishQuiz(), autoAdvanceTimeout);
    }
}

function nextQuestion() {
    if (currentIndex < totalQuestions - 1) {
        currentIndex++;
        loadQuestion();
    } else finishQuiz();
}

async function finishQuiz() {
    document.querySelectorAll(".answer-btn").forEach(btn => btn.disabled = true);
    document.getElementById("quizResult").style.display = "block";
    document.getElementById("resultText").textContent = `Bạn đúng ${correctCount} trên ${totalQuestions} câu.`;
    try {
        const userId = sessionStorage.getItem("userId") || null;
        await fetch("https://localhost:7290/api/Exam/SubmitQuiz", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userId,
                total: totalQuestions,
                correct: correctCount,
                details: quizQuestions.map(q => ({ id: q.id, question: q.question }))
            })
        });
    } catch (e) { console.warn("Gửi kết quả thất bại:", e); }
    document.getElementById("startQuizBtn").style.display = "inline-block";
    document.getElementById("nextBtn").style.display = "none";
}

window.startQuiz = startQuiz;
window.selectAnswer = selectAnswer;
window.nextQuestion = nextQuestion;