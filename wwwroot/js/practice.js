// Practice session: selecting words, exercises, retries
let practiceSession = null;
let currentPracticeWord = null;
let selectedChoice = null;
let maxAttempts = 2;
let incorrectAnswers = [];

function startPracticeBindings() {
    // Bound to UI start button somewhere
}

async function startPractice() {
    try {
        const response = await fetch('/api/FlashcardsAPI/all', { method: 'GET', credentials: 'include' });
        if (!response.ok) throw new Error('Không thể tải flashcards');
        const result = await response.json();
        let allFlashcards = [];
        if (result.success) allFlashcards = result.data;
        else throw new Error(result.message);
        if (allFlashcards.length === 0) { alert('Bạn cần có ít nhất một flashcard để bắt đầu luyện tập!'); return; }
        practiceSession = { allFlashcards, remainingWords: [], completedWords: [], currentPhase: 'InitialReview', totalWords: Math.min(10, allFlashcards.length) };
        const randomWords = [...allFlashcards].sort(() => Math.random() - 0.5).slice(0, practiceSession.totalWords);
        practiceSession.remainingWords = randomWords.map(word => ({ word, difficulty: null }));
        document.getElementById('practiceSection').style.display = 'block';
        document.getElementById('flashcardsGrid').style.display = 'none';
        const paginationContainer = document.getElementById('paginationContainer');
        if (paginationContainer) paginationContainer.style.display = 'none';
        showNextPracticeWord();
    } catch (error) {
        console.error('Error starting practice:', error);
        alert('Lỗi khi bắt đầu luyện tập: ' + error.message);
    }
}

function showNextPracticeWord() {
    if (!practiceSession) return;
    if (practiceSession.remainingWords.length === 0) {
        if (practiceSession.currentPhase === 'InitialReview') setupExercises();
        else finishPractice();
        return;
    }
    currentPracticeWord = practiceSession.remainingWords[0];
    let progress, progressText;
    if (practiceSession.currentPhase === 'InitialReview') {
        const completedInPhase = practiceSession.completedWords.length;
        progress = (completedInPhase * 100) / practiceSession.totalWords;
        progressText = `${completedInPhase} / ${practiceSession.totalWords}`;
    } else {
        const totalExercises = practiceSession.remainingWords.length + practiceSession.completedWords.filter(w => w.exerciseType).length;
        const completedExercises = practiceSession.completedWords.filter(w => w.exerciseType).length;
        progress = (completedExercises * 100) / Math.max(1, totalExercises);
        progressText = `${completedExercises} / ${totalExercises}`;
    }
    progress = Math.min(progress, 100);
    document.getElementById('practiceProgress').style.width = progress + '%';
    document.getElementById('progressText').textContent = progressText;
    if (practiceSession.currentPhase === 'InitialReview') showFlashcardReview();
    else showExercise();
}

function showFlashcardReview() {
    document.getElementById('flashcardReview').style.display = 'block';
    document.getElementById('exerciseSection').style.display = 'none';
    document.getElementById('practiceComplete').style.display = 'none';
    document.getElementById('practiceWord').textContent = currentPracticeWord.word.tu || 'No word';
    document.getElementById('practiceMeaning').textContent = currentPracticeWord.word.nghia || 'No meaning';
    document.getElementById('practiceMeaning').style.display = 'none';
    const imageEl = document.getElementById('practiceImage');
    if (currentPracticeWord.word.hinhAnh) { imageEl.src = currentPracticeWord.word.hinhAnh; imageEl.style.display = 'block'; }
    else imageEl.style.display = 'none';
}

function submitDifficulty(difficulty) {
    currentPracticeWord.difficulty = difficulty;
    practiceSession.completedWords.push(currentPracticeWord);
    practiceSession.remainingWords.shift();
    showNextPracticeWord();
}

function setupExercises() {
    practiceSession.currentPhase = 'Exercises';
    const mediumHardWords = practiceSession.completedWords.filter(w => w.difficulty === 'Medium' || w.difficulty === 'Hard').map(w => w.word);
    if (mediumHardWords.length === 0) {
        mediumHardWords.push(...practiceSession.completedWords.slice(0, Math.min(3, practiceSession.completedWords.length)).map(w => w.word));
    }
    practiceSession.remainingWords = mediumHardWords.map(word => ({
        word,
        exerciseType: word.viDu ? (Math.random() > 0.5 ? 'MultipleChoice' : 'FillInBlank') : 'MultipleChoice',
        choices: generateMultipleChoiceOptions(word, mediumHardWords),
        userAnswer: null,
        attempts: 0,
        correct: false
    }));
    incorrectAnswers = [];
    showNextPracticeWord();
}

function generateMultipleChoiceOptions(correctWord, allWords) {
    const options = [correctWord.nghia];
    const otherWords = allWords.filter(w => w.maTu !== correctWord.maTu);
    const usedMeanings = new Set([correctWord.nghia]);
    while (options.length < 4 && otherWords.length > 0) {
        const randomWord = otherWords[Math.floor(Math.random() * otherWords.length)];
        if (!usedMeanings.has(randomWord.nghia)) { options.push(randomWord.nghia); usedMeanings.add(randomWord.nghia); }
    }
    const genericOptions = ['không biết', 'cần tra cứu', 'chưa học'];
    while (options.length < 4) {
        const genericOption = genericOptions[options.length - 1];
        if (!usedMeanings.has(genericOption)) { options.push(genericOption); usedMeanings.add(genericOption); }
    }
    return options.sort(() => Math.random() - 0.5);
}

function showExercise() {
    document.getElementById('flashcardReview').style.display = 'none';
    document.getElementById('exerciseSection').style.display = 'block';
    document.getElementById('practiceComplete').style.display = 'none';
    selectedChoice = null;
    if (currentPracticeWord.exerciseType === 'MultipleChoice') showMultipleChoiceExercise();
    else showFillInBlankExercise();
}

function showMultipleChoiceExercise() {
    document.getElementById('multipleChoiceExercise').style.display = 'block';
    document.getElementById('fillBlankExercise').style.display = 'none';
    document.getElementById('mcWord').textContent = currentPracticeWord.word.tu;
    const choicesContainer = document.getElementById('choicesContainer');
    choicesContainer.innerHTML = currentPracticeWord.choices.map((choice, index) => `
        <div class="choice-item" onclick="selectChoice(this, '${choice}')">
            ${String.fromCharCode(65 + index)}. ${choice}
        </div>
    `).join('');
}

function showFillInBlankExercise() {
    document.getElementById('multipleChoiceExercise').style.display = 'none';
    document.getElementById('fillBlankExercise').style.display = 'block';
    document.getElementById('fillMeaning').textContent = currentPracticeWord.word.nghia;
    const example = currentPracticeWord.word.viDu || '';
    const word = currentPracticeWord.word.tu;
    const blankExample = example.replace(new RegExp(word, 'gi'), '__________');
    document.getElementById('fillExample').textContent = blankExample;
    document.getElementById('fillAnswer').value = '';
}

function selectChoice(element, choice) {
    document.querySelectorAll('.choice-item').forEach(item => item.classList.remove('selected'));
    element.classList.add('selected');
    selectedChoice = choice;
}

function submitExerciseAnswer() {
    if (!selectedChoice) { alert('Vui lòng chọn một đáp án!'); return; }
    const correctAnswer = currentPracticeWord.word.nghia;
    const isCorrect = selectedChoice === correctAnswer;
    currentPracticeWord.userAnswer = selectedChoice;
    currentPracticeWord.attempts++;
    currentPracticeWord.correct = isCorrect;
    showExerciseFeedback(isCorrect, correctAnswer);
}

function submitFillAnswer() {
    const answer = document.getElementById('fillAnswer').value.trim();
    if (!answer) { alert('Vui lòng điền từ vào chỗ trống!'); return; }
    const correctAnswer = currentPracticeWord.word.tu;
    const isCorrect = answer.toLowerCase() === correctAnswer.toLowerCase();
    currentPracticeWord.userAnswer = answer;
    currentPracticeWord.attempts++;
    currentPracticeWord.correct = isCorrect;
    showExerciseFeedback(isCorrect, correctAnswer);
}

function showExerciseFeedback(isCorrect, correctAnswer) {
    const feedbackEl = document.getElementById('exerciseFeedback');
    const feedbackMessage = document.getElementById('feedbackMessage');
    const nextBtn = document.getElementById('nextExerciseBtn');
    const retryBtn = document.getElementById('retryExerciseBtn');
    feedbackEl.style.display = 'block';
    if (isCorrect) {
        feedbackEl.style.backgroundColor = '#d4edda';
        feedbackEl.style.border = '1px solid #c3e6cb';
        feedbackMessage.innerHTML = `<div style="color: #155724;"><strong>✅ Chính xác!</strong><br>"${currentPracticeWord.word.tu}" có nghĩa là "${correctAnswer}"</div>`;
        nextBtn.style.display = 'inline-block'; retryBtn.style.display = 'none';
    } else {
        feedbackEl.style.backgroundColor = '#f8d7da';
        feedbackEl.style.border = '1px solid #f5c6cb';
        feedbackMessage.innerHTML = `<div style="color: #721c24;"><strong>❌ Chưa chính xác!</strong><br>Đáp án đúng: "${correctAnswer}"<br>Bạn đã trả lời: "${currentPracticeWord.userAnswer}"</div>`;
        if (currentPracticeWord.attempts < maxAttempts) { retryBtn.style.display = 'inline-block'; nextBtn.style.display = 'none'; }
        else { feedbackMessage.innerHTML += `<br><em>Bạn đã hết lượt thử cho từ này.</em>`; nextBtn.style.display = 'inline-block'; retryBtn.style.display = 'none'; incorrectAnswers.push(currentPracticeWord); }
    }
}

function retryExercise() {
    document.getElementById('exerciseFeedback').style.display = 'none';
    if (currentPracticeWord.exerciseType === 'MultipleChoice') {
        document.querySelectorAll('.choice-item').forEach(item => item.classList.remove('selected'));
        selectedChoice = null;
    } else {
        const input = document.getElementById('fillAnswer');
        input.value = '';
        input.focus();
    }
}

function nextAfterFeedback() {
    document.getElementById('exerciseFeedback').style.display = 'none';
    practiceSession.completedWords.push(currentPracticeWord);
    practiceSession.remainingWords.shift();
    showNextPracticeWord();
}

function showRetrySection() {
    if (incorrectAnswers.length > 0) {
        const retrySection = document.getElementById('retrySection');
        const retryWordsList = document.getElementById('retryWordsList');
        retryWordsList.innerHTML = `<p>Có <strong>${incorrectAnswers.length}</strong> từ bạn cần ôn tập lại:</p><ul>${incorrectAnswers.map(word => `<li><strong>${word.word.tu}</strong> - ${word.word.nghia}</li>`).join('')}</ul>`;
        retrySection.style.display = 'block';
    } else finishPractice();
}

function startRetrySession() {
    practiceSession.remainingWords = incorrectAnswers.map(incorrectWord => ({ ...incorrectWord, attempts: 0, userAnswer: null, correct: false }));
    incorrectAnswers = [];
    document.getElementById('retrySection').style.display = 'none';
    document.getElementById('exerciseSection').style.display = 'block';
    document.getElementById('practiceComplete').style.display = 'none';
    showNextPracticeWord();
}

function finishPractice() {
    document.getElementById('flashcardReview').style.display = 'none';
    document.getElementById('exerciseSection').style.display = 'none';
    document.getElementById('practiceComplete').style.display = 'block';
    const easyCount = practiceSession.completedWords.filter(w => w.difficulty === 'Easy').length;
    const mediumCount = practiceSession.completedWords.filter(w => w.difficulty === 'Medium').length;
    const hardCount = practiceSession.completedWords.filter(w => w.difficulty === 'Hard').length;
    const exerciseWords = practiceSession.completedWords.filter(w => w.exerciseType);
    const correctExercises = exerciseWords.filter(w => w.correct).length;
    const totalExercises = exerciseWords.length;
    const accuracy = totalExercises > 0 ? Math.round((correctExercises / totalExercises) * 100) : 0;
    document.getElementById('practiceSummary').innerHTML = `
        <div style="display: flex; justify-content: center; gap: 20px; margin: 20px 0; flex-wrap: wrap;">
            <div class="stat"><span class="stat-number">${easyCount}</span><span class="stat-label">Dễ</span></div>
            <div class="stat"><span class="stat-number">${mediumCount}</span><span class="stat-label">Trung bình</span></div>
            <div class="stat"><span class="stat-number">${hardCount}</span><span class="stat-label">Khó</span></div>
            <div class="stat"><span class="stat-number">${accuracy}%</span><span class="stat-label">Độ chính xác</span></div>
        </div>
        <p>Tổng số từ đã ôn tập: ${practiceSession.completedWords.length}</p>
        ${totalExercises > 0 ? `<p>Bài tập: ${correctExercises}/${totalExercises} đúng</p>` : ''}
    `;
    if (incorrectAnswers.length > 0) showRetrySection();
}

function resetPractice() {
    document.getElementById('practiceSection').style.display = 'none';
    document.getElementById('retrySection').style.display = 'none';
    document.getElementById('flashcardsGrid').style.display = 'grid';
    const paginationContainer = document.getElementById('paginationContainer');
    if (paginationContainer) paginationContainer.style.display = 'block';
    practiceSession = null; currentPracticeWord = null; incorrectAnswers = [];
}

window.startPractice = startPractice;
window.submitDifficulty = submitDifficulty;
window.selectChoice = selectChoice;
window.submitExerciseAnswer = submitExerciseAnswer;
window.submitFillAnswer = submitFillAnswer;
window.retryExercise = retryExercise;
window.nextAfterFeedback = nextAfterFeedback;
window.startRetrySession = startRetrySession;
window.resetPractice = resetPractice;