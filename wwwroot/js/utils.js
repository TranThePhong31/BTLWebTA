// Lightweight helpers used by other modules
function toJsonSafe(res) {
    return res.text().then(text => {
        try { return JSON.parse(text || "{}"); }
        catch { return { raw: text }; }
    });
}

async function fetchJson(url, options) {
    const res = await fetch(url, options);
    const data = await toJsonSafe(res);
    return { ok: res.ok, status: res.status, data, res };
}

function showAlert(message) {
    // small abstraction — replace with custom UI if needed
    alert(message);
}

window.__utils = { fetchJson, showAlert };  