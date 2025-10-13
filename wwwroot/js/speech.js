// Play pronunciation, save word, audio recording, load random word, send audio
async function playAudio(word) {
    const res = await fetch(`http://localhost:5000/api/vocab/pronounce?word=${encodeURIComponent(word)}`);
    if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        new Audio(url).play();
    } else {
        alert("Không phát được âm thanh!");
    }
}

async function saveWord(word) {
    const res = await fetch("http://localhost:5000/api/vocab/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word })
    });
    if (res.ok) {
        alert("Đã lưu từ: " + word);
    } else {
        alert("Không thể lưu từ!");
    }
}

let mediaRecorder;
let audioChunks = [];

function initRecorderBindings() {
    const startBtn = document.getElementById("startRecordingBtn");
    const stopBtn = document.getElementById("stopRecordingBtn");
    const audioPlayer = document.getElementById("audioPlayer");
    const statusDiv = document.getElementById("speechStatus");
    const resultDiv = document.getElementById("speechResult");

    if (!startBtn || !stopBtn) return;

    startBtn.addEventListener("click", async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
            audioChunks = [];
            mediaRecorder.ondataavailable = e => audioChunks.push(e.data);
            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
                audioPlayer.src = URL.createObjectURL(audioBlob);
                audioPlayer.style.display = "block";
                statusDiv.textContent = "⏳ Đang gửi file lên server...";
                resultDiv.innerHTML = "";
                try {
                    await sendAudioToServer(audioBlob);
                    statusDiv.textContent = "✅ Đã chấm điểm xong!";
                } catch (err) {
                    console.error("Upload failed:", err);
                    statusDiv.textContent = "❌ Gửi thất bại!";
                }
                stopBtn.disabled = true;
                startBtn.disabled = false;
            };
            mediaRecorder.start();
            startBtn.disabled = true;
            stopBtn.disabled = false;
            statusDiv.textContent = "🎙️ Đang ghi âm...";
            resultDiv.innerHTML = "";
        } catch (err) {
            console.error("Mic error:", err);
            statusDiv.textContent = "❌ Không truy cập được micro!";
        }
    });

    stopBtn.addEventListener("click", () => {
        if (mediaRecorder && mediaRecorder.state !== "inactive") {
            mediaRecorder.stop();
            statusDiv.textContent = "⏹️ Đã dừng ghi âm, đang xử lý...";
        } else {
            statusDiv.textContent = "⚠️ Không có ghi âm nào đang chạy!";
        }
    });
}

async function loadRandomWord() {
    const randomWordDiv = document.getElementById("randomWord");
    if (randomWordDiv) randomWordDiv.textContent = "⏳ Đang tải...";
    try {
        const { ok, data } = await window.__utils.fetchJson("/Speech/Index", { method: "GET", headers: { Accept: "application/json" }});
        if (!ok) throw new Error("Không tải được từ.");
        if (randomWordDiv) randomWordDiv.textContent = data.randomWord;
        window.currentWord = data.randomWord;
    } catch (err) {
        if (randomWordDiv) randomWordDiv.textContent = "❌ Lỗi tải từ";
        console.error(err);
    }
}

async function sendAudioToServer(blob) {
    const formData = new FormData();
    formData.append("audio", blob, "recorded.webm");
    formData.append("referenceText", window.currentWord || "");
    const res = await fetch("/Speech/Check", { method: "POST", body: formData });
    const resultDiv = document.getElementById("speechResult");
    if (res.ok) {
        const html = await res.text();
        if (resultDiv) resultDiv.innerHTML = html;
    } else {
        if (resultDiv) resultDiv.textContent = "❌ Lỗi khi chấm điểm.";
    }
}

window.playAudio = playAudio;
window.saveWord = saveWord;
window.initRecorderBindings = initRecorderBindings;
window.loadRandomWord = loadRandomWord;
window.sendAudioToServer = sendAudioToServer;