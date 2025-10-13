// Flashcards list + pagination + delete
let flashcards = [];
let currentPage = 1;
let pageSize = 10;
let totalPages = 1;
let totalCount = 0;

async function loadFlashcards(page = 1) {
    try {
        currentPage = page;
        const response = await fetch(`/api/FlashcardsAPI?page=${page}&pageSize=${pageSize}`, { method: 'GET', credentials: 'include' });
        if (!response.ok) throw new Error('Không thể tải flashcards');
        const result = await response.json();
        if (result.success && result.data) {
            flashcards = result.data.items || [];
            totalCount = result.data.totalCount || 0;
            totalPages = result.data.totalPages || 1;
            currentPage = result.data.page || 1;
            pageSize = result.data.pageSize || pageSize;
            displayFlashcards();
            renderPagination();
        } else throw new Error(result.message || 'Dữ liệu không hợp lệ');
    } catch (error) {
        console.error('Error loading flashcards:', error);
        alert('Lỗi khi tải flashcards: ' + error.message);
    }
}

function displayFlashcards() {
    const grid = document.getElementById('flashcardsGrid');
    const emptyState = document.getElementById('emptyFlashcards');
    if (!grid) return;
    if (!flashcards || flashcards.length === 0) {
        grid.style.display = 'none';
        if (emptyState) emptyState.style.display = 'block';
        return;
    }
    grid.style.display = 'grid';
    if (emptyState) emptyState.style.display = 'none';
    grid.innerHTML = flashcards.map((card, index) => {
        const word = card.tu || 'Không có từ';
        const meaning = card.nghia || 'Không có nghĩa';
        const image = card.hinhAnh || '';
        const example = card.viDu || '';
        const id = card.maTu || index;
        return `
            <div class="flashcard-item">
                <div class="flashcard-content">
                    <h3>${word}</h3>
                    <p class="meaning">${meaning}</p>
                    ${image ? `<img src="${image}" alt="${word}" class="flashcard-image" />` : ''}
                    ${example ? `<p class="example"><small>VD: ${example}</small></p>` : ''}
                </div>
                <div class="flashcard-actions">
                    <button class="action" onclick="removeFlashcard(${id})">🗑️ Xóa</button>
                </div>
            </div>
        `;
    }).join('');
}

function createPaginationHTML() {
    if (totalPages <= 1) return '';
    let paginationHTML = '';
    if (currentPage > 1) paginationHTML += `<button class="pagination-btn" onclick="loadFlashcards(${currentPage - 1})">‹ Trước</button>`;
    else paginationHTML += `<button class="pagination-btn disabled" disabled>‹ Trước</button>`;
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    if (endPage - startPage + 1 < maxVisiblePages) startPage = Math.max(1, endPage - maxVisiblePages + 1);
    if (startPage > 1) {
        paginationHTML += `<button class="pagination-btn" onclick="loadFlashcards(1)">1</button>`;
        if (startPage > 2) paginationHTML += `<span class="pagination-ellipsis">...</span>`;
    }
    for (let i = startPage; i <= endPage; i++) {
        if (i === currentPage) paginationHTML += `<button class="pagination-btn active">${i}</button>`;
        else paginationHTML += `<button class="pagination-btn" onclick="loadFlashcards(${i})">${i}</button>`;
    }
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) paginationHTML += `<span class="pagination-ellipsis">...</span>`;
        paginationHTML += `<button class="pagination-btn" onclick="loadFlashcards(${totalPages})">${totalPages}</button>`;
    }
    if (currentPage < totalPages) paginationHTML += `<button class="pagination-btn" onclick="loadFlashcards(${currentPage + 1})">Tiếp ›</button>`;
    else paginationHTML += `<button class="pagination-btn disabled" disabled>Tiếp ›</button>`;
    return paginationHTML;
}

function renderPagination() {
    let paginationContainer = document.getElementById('paginationContainer');
    if (!paginationContainer) {
        const grid = document.getElementById('flashcardsGrid');
        const paginationHTML = `
            <div id="paginationContainer" class="pagination-container">
                <div class="pagination-info">
                    Hiển thị ${flashcards.length} trên tổng số ${totalCount} flashcards
                </div>
                <div class="pagination-controls">
                    ${createPaginationHTML()}
                </div>
            </div>
        `;
        grid.insertAdjacentHTML('afterend', paginationHTML);
    } else {
        paginationContainer.innerHTML = `
            <div class="pagination-info">
                Hiển thị ${flashcards.length} trên tổng số ${totalCount} flashcards
            </div>
            <div class="pagination-controls">
                ${createPaginationHTML()}
            </div>
        `;
    }
}

function changePageSize(newSize) {
    pageSize = parseInt(newSize);
    currentPage = 1;
    loadFlashcards(currentPage);
}

async function removeFlashcard(tuVungId) {
    if (!confirm('Bạn có chắc chắc muốn xóa flashcard này?')) return;
    try {
        const response = await fetch(`/api/FlashcardsAPI/${tuVungId}`, { method: 'DELETE', credentials: 'include' });
        if (response.ok) await loadFlashcards(currentPage);
        else throw new Error('Xóa thất bại');
    } catch (error) {
        console.error('Error removing flashcard:', error);
        alert('Lỗi khi xóa flashcard: ' + error.message);
    }
}

window.loadFlashcards = loadFlashcards;
window.changePageSize = changePageSize;
window.removeFlashcard = removeFlashcard;