// Initialization — run after all modules loaded
document.addEventListener('DOMContentLoaded', function () {
    // expose username from session storage
    const userName = sessionStorage.getItem("userName");
    if (userName) {
        const el = document.getElementById("userNameDisplay");
        if (el) el.textContent = userName;
    }

    // Initialize chatbot
    if (window.initializeChatbot) window.initializeChatbot();

    // Bind nav click to load vocab first page
    document.querySelector('nav button[onclick*="vocab"]')?.addEventListener('click', function () {
        setTimeout(() => window.loadFlashcards?.(1), 100);
    });

    // default page size
    const pageSizeEl = document.getElementById('pageSize');
    if (pageSizeEl && typeof pageSizeEl.value === 'string' && window.changePageSize) {
        pageSizeEl.value = (window.pageSize || 10).toString();
    }

    // Bind new random word button for speech
    document.getElementById("newWordBtn")?.addEventListener("click", () => window.loadRandomWord?.());
    // init recorder bindings
    window.initRecorderBindings?.();
    // init OCR button
    document.getElementById("btnOcr")?.addEventListener("click", () => window.uploadAndRecognize?.());
    // load first page of flashcards on start to improve UX
    window.loadFlashcards?.(1);
});