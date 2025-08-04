let currentQuestionIndex = 0;
let score = 0;

const questions = [
    {
        question: "Qual é a capital do Brasil?",
        answers: ["Rio de Janeiro", "Brasília", "São Paulo", "Salvador"],
        correctAnswer: "Brasília"
    },
    {
        question: "Qual é o maior planeta do Sistema Solar?",
        answers: ["Terra", "Marte", "Júpiter", "Saturno"],
        correctAnswer: "Júpiter"
    },
    {
        question: "Quem escreveu 'Dom Casmurro'?",
        answers: ["Machado de Assis", "Carlos Drummond", "Clarice Lispector", "Monteiro Lobato"],
        correctAnswer: "Machado de Assis"
    }
];

function displayQuestion() {
    const currentQuestion = questions[currentQuestionIndex];
    document.getElementById("question-text").textContent = `(${currentQuestionIndex + 1}/${questions.length}) ${currentQuestion.question}`;

    const answersContainer = document.getElementById("answers-container");
    answersContainer.innerHTML = "";

    currentQuestion.answers.forEach(answer => {
        const button = document.createElement("button");
        button.textContent = answer;
        button.onclick = () => checkAnswer(button, answer);
        answersContainer.appendChild(button);
    });

    document.getElementById("next-button").style.display = "none";
}

function checkAnswer(buttonClicked, answer) {
    const currentQuestion = questions[currentQuestionIndex];
    const buttons = document.querySelectorAll("#answers-container button");

    buttons.forEach(btn => {
        btn.disabled = true;
        if (btn.textContent === currentQuestion.correctAnswer) {
            btn.classList.add("correct");
        } else if (btn === buttonClicked) {
            btn.classList.add("incorrect");
        }
    });

    if (answer === currentQuestion.correctAnswer) {
        score++;
    }

    document.getElementById("next-button").style.display = "block";
}

function nextQuestion() {
    currentQuestionIndex++;

    if (currentQuestionIndex < questions.length) {
        displayQuestion();
    } else {
        showFinalScore();
    }
}

function showFinalScore() {
    document.getElementById("quiz-container").style.display = "none";
    document.getElementById("result-container").style.display = "block";

    let message = "";
    if (score === questions.length) {
        message = "Parabéns! Você acertou todas!";
    } else if (score > 0) {
        message = "Bom trabalho! Mas ainda dá pra melhorar.";
    } else {
        message = "Ops! Nenhuma resposta correta. Tente novamente!";
    }

    document.getElementById("final-score").textContent = `${message} Sua pontuação final: ${score} de ${questions.length}`;
}

function restartQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    document.getElementById("quiz-container").style.display = "block";
    document.getElementById("result-container").style.display = "none";
    displayQuestion();
}

displayQuestion();
