// Chatbot logic
let chatSession = { username: '', gender: '', messages: [] };

function initializeChatbot() {
    const savedSession = localStorage.getItem('chatSession');
    if (savedSession) { chatSession = JSON.parse(savedSession); updateChatDisplay(); }
}

function updateUserInfo() {
    const username = document.getElementById('username').value.trim();
    const gender = document.getElementById('gender').value;
    if (!username || !gender) { alert('Vui lòng điền đầy đủ thông tin!'); return; }
    chatSession.username = username; chatSession.gender = gender; saveChatSession(); alert('Thông tin đã được cập nhật!');
}

async function sendChatMessage() {
    const input = document.getElementById('chatInput'); const message = input.value.trim();
    if (!message) { alert('Vui lòng nhập tin nhắn!'); return; }
    if (!chatSession.username || !chatSession.gender) { alert('Vui lòng cập nhật thông tin người dùng trước!'); return; }
    addMessageToChat('user', chatSession.username, message);
    input.value = '';
    const typingIndicator = addMessageToChat('bot', 'English Assistant', 'Đang trả lời...');
    try {
        const formData = new URLSearchParams({ userQuestion: message, username: chatSession.username, gender: chatSession.gender });
        const response = await fetch('/Chatbot/Index', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: formData });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const responseText = await response.text();
        typingIndicator.remove();
        if (responseText.includes('Xin lỗi') || responseText.includes('lỗi') || responseText.includes('error')) {
            const fallbackResponse = getFallbackResponse(message); addMessageToChat('bot', 'English Assistant', fallbackResponse);
        } else {
            const parser = new DOMParser(); const doc = parser.parseFromString(responseText, 'text/html');
            const botMessage = extractBotMessage(doc) || getFallbackResponse(message);
            addMessageToChat('bot', 'English Assistant', botMessage);
        }
    } catch (error) {
        console.error('Chat error:', error);
        typingIndicator.remove();
        const fallbackResponse = getFallbackResponse(message);
        addMessageToChat('bot', 'English Assistant', fallbackResponse);
    }
}

function extractBotMessage(doc) {
    const botMessages = doc.querySelectorAll('.bot-message .message-text');
    if (botMessages.length > 0) return botMessages[botMessages.length - 1].textContent;
    return null;
}

function getFallbackResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    if (lowerMessage.includes('hiện tại đơn') || lowerMessage.includes('present simple')) {
        return `Thì hiện tại đơn (Present Simple) được dùng để:<br><br>• Diễn tả thói quen...`;
    } else if (lowerMessage.includes('phát âm') || lowerMessage.includes('pronunciation')) {
        return `Để cải thiện phát âm, bạn có thể:...`;
    } else if (lowerMessage.includes('make') && lowerMessage.includes('do')) {
        return `Phân biệt "make" và "do":...`;
    } else if (lowerMessage.includes('giao tiếp') || lowerMessage.includes('conversation')) {
        return `Để luyện tập giao tiếp:...`;
    } else {
        return `Xin lỗi, hiện tại tôi đang gặp sự cố kỹ thuật. Tuy nhiên, tôi có thể giúp bạn với:...`;
    }
}

function addMessageToChat(messageType, sender, message) {
    const chatMessages = document.getElementById('chatMessages');
    const emptyChat = chatMessages.querySelector('.empty-chat');
    if (emptyChat) emptyChat.remove();
    const messageElement = document.createElement('div');
    messageElement.className = `message ${messageType === 'user' ? 'user-message' : 'bot-message'}`;
    messageElement.innerHTML = `
            <div class="message-avatar">
                ${messageType === 'user' ? '👤' : '🤖'}
            </div>
            <div class="message-content">
                <div class="message-sender">${sender}</div>
                <div class="message-text">${message}</div>
                <div class="message-time">${new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</div>
            </div>
        `;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    chatSession.messages.push({ Sender: sender, Message: message, Timestamp: new Date().toISOString(), MessageType: messageType });
    saveChatSession(); updateMessageCount();
    return messageElement;
}

function clearChat() {
    if (!confirm('Bạn có chắc chắn muốn xóa toàn bộ tin nhắn?')) return;
    chatSession.messages = [];
    document.getElementById('chatMessages').innerHTML = `<div class="empty-chat" style="text-align: center; color: #666;"><div style="font-size: 48px;">💬</div><h4>Chưa có tin nhắn nào</h4><p>Gửi tin nhắn để bắt đầu trò chuyện!</p></div>`;
    saveChatSession(); updateMessageCount();
}

function exportChat() {
    if (chatSession.messages.length === 0) { alert('Không có tin nhắn để xuất!'); return; }
    let exportContent = `English Assistant Chatbot - Conversation Export\n==============================================\nExport Date: ${new Date().toLocaleString('vi-VN')}\nUser: ${chatSession.username}\nGender: ${chatSession.gender}\n\nConversation History:\n-------------------\n\n`;
    chatSession.messages.forEach(message => {
        const senderLabel = message.MessageType === 'user' ? 'User' : 'Assistant';
        const time = new Date(message.Timestamp).toLocaleTimeString('vi-VN');
        exportContent += `[${senderLabel} - ${time}]\n${message.Message}\n\n`;
    });
    const blob = new Blob([exportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url;
    a.download = `English_Chat_Export_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.txt`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
}

function useSuggestion(question) { document.getElementById('chatInput').value = question; }
function saveChatSession() { localStorage.setItem('chatSession', JSON.stringify(chatSession)); }
function updateMessageCount() { document.getElementById('messageCount').textContent = `💬 ${chatSession.messages.length} tin nhắn`; }

function updateChatDisplay() {
    const chatMessages = document.getElementById('chatMessages');
    chatMessages.innerHTML = '';
    if (chatSession.messages.length === 0) {
        chatMessages.innerHTML = `<div class="empty-chat" style="text-align: center; color: #666;"><div style="font-size: 48px;">💬</div><h4>Chưa có tin nhắn nào</h4><p>Gửi tin nhắn để bắt đầu trò chuyện!</p></div>`;
    } else {
        chatSession.messages.forEach(message => {
            const messageElement = document.createElement('div');
            messageElement.className = `message ${message.MessageType === 'user' ? 'user-message' : 'bot-message'}`;
            messageElement.innerHTML = `
                    <div class="message-avatar">${message.MessageType === 'user' ? '👤' : '🤖'}</div>
                    <div class="message-content">
                        <div class="message-sender">${message.Sender}</div>
                        <div class="message-text">${message.Message}</div>
                        <div class="message-time">${new Date(message.Timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</div>
                    </div>
                `;
            chatMessages.appendChild(messageElement);
        });
    }
    chatMessages.scrollTop = chatMessages.scrollHeight;
    updateMessageCount();
    document.getElementById('username').value = chatSession.username || '';
    document.getElementById('gender').value = chatSession.gender || '';
}

window.initializeChatbot = initializeChatbot;
window.updateUserInfo = updateUserInfo;
window.sendChatMessage = sendChatMessage;
window.clearChat = clearChat;
window.exportChat = exportChat;
window.useSuggestion = useSuggestion;