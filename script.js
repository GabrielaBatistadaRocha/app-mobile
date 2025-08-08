const questionBank = {
    matematica: [
        {
            question: "Qual é o valor de x na equação 2x + 3 = 7?",
            answers: ["1", "2", "3", "4"],
            correctAnswer: "2"
        },
        {
            question: "Qual é a derivada de x²?",
            answers: ["2x", "x", "x²", "1"],
            correctAnswer: "2x"
        }
    ],
    ciencias: [
        {
            question: "Qual é a função da mitocôndria?",
            answers: ["Produzir energia", "Digestão celular", "Síntese de proteínas", "Transporte de nutrientes"],
            correctAnswer: "Produzir energia"
        }
    ],
    humanas: [
        {
            question: "Quem foi o autor do contrato social?",
            answers: ["Rousseau", "Marx", "Locke", "Hobbes"],
            correctAnswer: "Rousseau"
        }
    ],
    linguagens: [
        {
            question: "Qual figura de linguagem está presente em 'Ela chorava rios de lágrimas'?",
            answers: ["Metáfora", "Hipérbole", "Ironia", "Antítese"],
            correctAnswer: "Hipérbole"
        }
    ]
};

let selectedQuestions = [];
let currentQuestionIndex = 0;
let score = 0;

function startQuiz() {
    const subject = document.getElementById("subject-select").value;
    if (!subject) return;

    selectedQuestions = questionBank[subject];
    currentQuestionIndex = 0;
    score = 0;

    document.getElementById("quiz-container").style.display = "block";
    document.getElementById("result-container").style.display = "none";

    displayQuestion();
}

function displayQuestion() {
    const currentQuestion = selectedQuestions[currentQuestionIndex];
    document.getElementById("question-text").textContent = `(${currentQuestionIndex + 1}/${selectedQuestions.length}) ${currentQuestion.question}`;

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
    const currentQuestion = selectedQuestions[currentQuestionIndex];
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

    if (currentQuestionIndex < selectedQuestions.length) {
        displayQuestion();
    } else {
        showFinalScore();
    }
}

function showFinalScore() {
    document.getElementById("quiz-container").style.display = "none";
    document.getElementById("result-container").style.display = "block";

    let message = "";
    if (score === selectedQuestions.length) {
        message = "Parabéns! Você acertou todas!";
    } else if (score > 0) {
        message = "Bom trabalho! Mas ainda dá pra melhorar.";
    } else {
        message = "Ops! Nenhuma resposta correta. Tente novamente!";
    }

    document.getElementById("final-score").textContent = `${message} Sua pontuação final: ${score} de ${selectedQuestions.length}`;
}

function restartQuiz() {
    startQuiz();
}
