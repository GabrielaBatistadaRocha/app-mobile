let currentQuestionIndex = 0; // Índice da pergunta atual
let score = 0; // Pontuação inicial

// Perguntas do quiz
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

// Exibe a pergunta e as opções
function displayQuestion() {
    const currentQuestion = questions[currentQuestionIndex];
    document.getElementById("question-text").textContent = currentQuestion.question;

    // Limpar opções de resposta antigas
    const answersContainer = document.getElementById("answers-container");
    answersContainer.innerHTML = "";

    // Criar botões de respostas
    currentQuestion.answers.forEach(answer => {
        const button = document.createElement("button");
        button.textContent = answer;
        button.onclick = () => checkAnswer(answer);
        answersContainer.appendChild(button);
    });
}

// Verifica a resposta do usuário
function checkAnswer(answer) {
    const currentQuestion = questions[currentQuestionIndex];

    if (answer === currentQuestion.correctAnswer) {
        score++;
    }

    document.getElementById("next-button").style.display = "block"; // Exibe o botão "Próxima Pergunta"
}

// Avança para a próxima pergunta
function nextQuestion() {
    currentQuestionIndex++;

    // Se ainda houver perguntas
    if (currentQuestionIndex < questions.length) {
        displayQuestion();
        document.getElementById("next-button").style.display = "none"; // Esconde o botão até a próxima resposta
    } else {
        showFinalScore();
    }
}

// Exibe a pontuação final
function showFinalScore() {
    document.getElementById("quiz-container").style.display = "none"; // Esconde o quiz
    document.getElementById("result-container").style.display = "block"; // Mostra o resultado
    document.getElementById("final-score").textContent = `Sua pontuação final: ${score} de ${questions.length}`;
}

// Reinicia o quiz
function restartQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    document.getElementById("quiz-container").style.display = "block";
    document.getElementById("result-container").style.display = "none";
    displayQuestion();
    document.getElementById("next-button").style.display = "none"; // Esconde o botão de próxima
}

// Inicializa o quiz
displayQuestion();
