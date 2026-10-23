// Quiz Questions Bank
const questions = [
    {
        question: "What does HTML stand for?",
        options: [
            "Hyper Text Markup Language",
            "High Tech Multi Language",
            "Hyper Transfer Machine Language",
            "Home Tool Markup Language"
        ],
        answer: 0
    },
    {
        question: "Which language runs in a web browser?",
        options: ["Java", "C", "Python", "JavaScript"],
        answer: 3
    },
    {
        question: "What does CSS stand for?",
        options: [
            "Central Style Sheets",
            "Cascading Style Sheets",
            "Cascading Simple Sheets",
            "Cars SUVs Sailboats"
        ],
        answer: 1
    },
    {
        question: "Inside which HTML element do we put the JavaScript?",
        options: ["<script>", "<js>", "<javascript>", "<scripting>"],
        answer: 0
    },
    {
        question: "How do you write 'Hello World' in an alert box?",
        options: [
            "msg('Hello World');",
            "alertBox('Hello World');",
            "alert('Hello World');",
            "msgBox('Hello World');"
        ],
        answer: 2
    }
];

let currentUser = "";
let currentQuestionIndex = 0;
let userAnswers = [];

// DOM Elements
const loginSection = document.getElementById("login-section");
const quizSection = document.getElementById("quiz-section");
const resultSection = document.getElementById("result-section");
const leaderboardSection = document.getElementById("leaderboard-section");

const usernameInput = document.getElementById("username-input");
const loginBtn = document.getElementById("login-btn");
const loginError = document.getElementById("login-error");
const viewSystemFromLogin = document.getElementById("view-system-from-login");

const questionCount = document.getElementById("question-count");
const userDisplay = document.getElementById("user-display");
const questionText = document.getElementById("question-text");
const optionsContainer = document.getElementById("options-container");
const nextBtn = document.getElementById("next-btn");

const scoreSummary = document.getElementById("score-summary");
const reviewContainer = document.getElementById("review-container");
const viewSystemBtn = document.getElementById("view-system-btn");
const backHomeBtn = document.getElementById("back-home-btn");
const leaderboardBody = document.getElementById("leaderboard-body");

// Event Listeners
loginBtn.addEventListener("click", handleLogin);
viewSystemFromLogin.addEventListener("click", showLeaderboard);
nextBtn.addEventListener("click", handleNextQuestion);
viewSystemBtn.addEventListener("click", showLeaderboard);
backHomeBtn.addEventListener("click", resetToLogin);

function getSubmissions() {
    return JSON.parse(localStorage.getItem("quiz_submissions") || "[]");
}

function saveSubmissions(submissions) {
    localStorage.setItem("quiz_submissions", JSON.stringify(submissions));
}

function handleLogin() {
    const name = usernameInput.value.trim();
    if (!name) {
        loginError.textContent = "Please enter your name to proceed.";
        return;
    }

    const submissions = getSubmissions();
    const existingUser = submissions.find(s => s.name.toLowerCase() === name.toLowerCase());

    if (existingUser) {
        loginError.textContent = `Access Denied: '${name}' has already completed the quiz. No retakes allowed!`;
        return;
    }

    currentUser = name;
    loginError.textContent = "";
    usernameInput.value = "";
    
    currentQuestionIndex = 0;
    userAnswers = [];
    
    loginSection.classList.add("hidden");
    quizSection.classList.remove("hidden");
    userDisplay.textContent = `User: ${currentUser}`;
    loadQuestion();
}

function loadQuestion() {
    nextBtn.classList.add("hidden");
    const q = questions[currentQuestionIndex];
    questionCount.textContent = `Question ${currentQuestionIndex + 1} of ${questions.length}`;
    questionText.textContent = q.question;
    optionsContainer.innerHTML = "";

    q.options.forEach((option, index) => {
        const btn = document.createElement("button");
        btn.className = "option-btn";
        btn.textContent = option;
        btn.addEventListener("click", () => selectOption(index, btn));
        optionsContainer.appendChild(btn);
    });
}

function selectOption(selectedIndex, selectedBtn) {
    const buttons = optionsContainer.querySelectorAll(".option-btn");
    buttons.forEach(b => b.disabled = true);
    selectedBtn.classList.add("selected");

    userAnswers.push(selectedIndex);
    nextBtn.classList.remove("hidden");
}

function handleNextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        loadQuestion();
    } else {
        finishQuiz();
    }
}

function finishQuiz() {
    quizSection.classList.add("hidden");
    resultSection.classList.remove("hidden");

    let score = 0;
    questions.forEach((q, idx) => {
        if (userAnswers[idx] === q.answer) {
            score++;
        }
    });

    const submissions = getSubmissions();
    submissions.push({
        name: currentUser,
        score: score,
        total: questions.length,
        answers: userAnswers
    });
    saveSubmissions(submissions);

    scoreSummary.innerHTML = `<h3 style="color: #ad1457; text-align: center; margin-bottom: 10px;">Great job, ${currentUser}! 💕<br>Score: <strong>${score} / ${questions.length}</strong></h3>`;

    let reviewHtml = `<h4 style="color: #880e4f; margin-bottom: 8px;">Detailed Review:</h4>`;
    questions.forEach((q, idx) => {
        const userChoice = userAnswers[idx];
        const isCorrect = userChoice === q.answer;
        const statusClass = isCorrect ? "correct" : "incorrect";
        const userChoiceText = q.options[userChoice];
        const correctAnswerText = q.options[q.answer];

        reviewHtml += `
            <div class="review-item ${statusClass}">
                <div class="review-question">Q${idx + 1}: ${q.question}</div>
                <div class="review-details">
                    Your Answer: <strong>${userChoiceText}</strong> ${isCorrect ? "✅" : "❌"}<br>
                    ${!isCorrect ? `Correct Answer: <strong style="color: #2e7d32;">${correctAnswerText}</strong>` : ""}
                </div>
            </div>
        `;
    });
    reviewContainer.innerHTML = reviewHtml;
}

function showLeaderboard() {
    loginSection.classList.add("hidden");
    resultSection.classList.add("hidden");
    leaderboardSection.classList.remove("hidden");

    const submissions = getSubmissions();
    submissions.sort((a, b) => b.score - a.score);

    leaderboardBody.innerHTML = "";
    if (submissions.length === 0) {
        leaderboardBody.innerHTML = `<tr><td colspan="3" style="text-align: center;">No quiz submissions recorded yet.</td></tr>`;
        return;
    }

    submissions.forEach((sub, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>#${index + 1}</td>
            <td>${sub.name}</td>
            <td>${sub.score} / ${sub.total}</td>
        `;
        leaderboardBody.appendChild(row);
    });
}

function resetToLogin() {
    leaderboardSection.classList.add("hidden");
    loginSection.classList.remove("hidden");
    currentUser = "";
}