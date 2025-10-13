// OCR upload & recognize
async function uploadAndRecognize() {
    const fileInput = document.getElementById("ocrFile");
    const preview = document.getElementById("previewImage");
    const resultEl = document.getElementById("ocrResult");
    const status = document.getElementById("ocrStatus");

    const file = fileInput?.files[0];
    if (!file) {
        alert("Vui lòng chọn ảnh để nhận diện.");
        return;
    }

    const url = URL.createObjectURL(file);
    if (preview) { preview.src = url; preview.style.display = "block"; }
    if (resultEl) resultEl.textContent = "";
    if (status) { status.textContent = "⏳ Đang gửi ảnh lên và chờ AI đánh giá..."; status.style.color = ""; }

    try {
        const formData = new FormData();
        formData.append("file", file);
        const response = await fetch("/Ocr/RecognizeAndEvaluate", { method: "POST", body: formData });
        if (!response.ok) {
            const errText = await response.text();
            throw new Error(errText);
        }
        const data = await response.json();
        if (data.evaluation) {
            if (resultEl) resultEl.textContent = data.evaluation;
            if (status) { status.textContent = "✅ Hoàn tất!"; status.style.color = "green"; }
        } else {
            if (status) status.textContent = "⚠️ Không nhận được đánh giá.";
            if (resultEl) resultEl.textContent = JSON.stringify(data, null, 2);
        }
    } catch (err) {
        console.error(err);
        if (status) { status.textContent = "❌ Lỗi khi đánh giá: " + err.message; status.style.color = "red"; }
    } finally {
        URL.revokeObjectURL(url);
    }
}

window.uploadAndRecognize = uploadAndRecognize;