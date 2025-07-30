let questions = [
    {
        question: "Qual é a capital do Brasil?",
        answers: ["São Paulo", "Brasília", "Rio de Janeiro", "Salvador"],
        correctAnswer: 1
    },
    {
        question: "Quem pintou a Mona Lisa?",
        answers: ["Van Gogh", "Picasso", "Da Vinci", "Michelangelo"],
        correctAnswer: 2
    },
    {
        question: "Qual é o maior planeta do nosso sistema solar?",
        answers: ["Terra", "Júpiter", "Saturno", "Marte"],
        correctAnswer: 1
    }
];

let currentQuestionIndex = 0;
let score = 0;

function loadQuestion() {
    const question = questions[currentQuestionIndex];
    document.getElementById("question").textContent = question.question;
    
    const buttons = document.querySelectorAll(".answer-btn");
    question.answers.forEach((answer, index) => {
        buttons[index].textContent = answer;
    });
}

function checkAnswer(selectedAnswer) {
    const question = questions[currentQuestionIndex];
    if (selectedAnswer === question.correctAnswer) {
        score++;
    }
    currentQuestionIndex++;

    if (currentQuestionIndex < questions.length) {
        loadQuestion();
    } else {
        showResult();
    }
}

function showResult() {
    document.getElementById("quiz-container").style.display = "none";
    document.getElementById("result-container").style.display = "block";
    document.getElementById("result").textContent = `Você acertou ${score} de ${questions.length} perguntas!`;
}

function restartQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    document.getElementById("quiz-container").style.display = "block";
    document.getElementById("result-container").style.display = "none";
    loadQuestion();
}

// Carregar a primeira pergunta ao iniciar
loadQuestion();
