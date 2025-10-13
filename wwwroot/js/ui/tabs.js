// Tab UI controls
function openTab(tabId, evt) {
    document.querySelectorAll(".tab").forEach(tab => tab.classList.remove("active"));
    const el = document.getElementById(tabId);
    if (el) el.classList.add("active");
    document.querySelectorAll("nav button").forEach(btn => btn.classList.remove("active"));
    if (evt && evt.target) evt.target.classList.add("active");
}

// expose for inline onclicks
window.openTab = openTab;