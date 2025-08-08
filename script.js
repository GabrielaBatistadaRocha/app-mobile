const questionBank = {
  matematica: [
    {
      question: "Qual é o valor de x na equação 2x + 3 = 7?",
      answers: ["1", "2", "3", "4"],
      correctAnswer: "2",
      explanation: "Subtraindo 3 de ambos os lados: 2x = 4 → x = 2."
    },
    {
      question: "Qual é a derivada de x²?",
      answers: ["2x", "x", "x²", "1"],
      correctAnswer: "2x",
      explanation: "A derivada de x² em relação a x é 2x, pela regra do poder."
    }
  ],
  ciencias: [
    {
      question: "Qual é a função da mitocôndria?",
      answers: ["Produzir energia", "Digestão celular", "Síntese de proteínas", "Transporte de nutrientes"],
      correctAnswer: "Produzir energia",
      explanation: "A mitocôndria é responsável pela respiração celular e produção de ATP."
    }
  ],
  humanas: [
    {
      question: "Quem foi o autor do contrato social?",
      answers: ["Rousseau", "Marx", "Locke", "Hobbes"],
      correctAnswer: "Rousseau",
      explanation: "Jean-Jacques Rousseau escreveu 'O Contrato Social' em 1762."
    }
  ],
  linguagens: [
    {
      question: "Qual figura de linguagem está presente em 'Ela chorava rios de lágrimas'?",
      answers: ["Metáfora", "Hipérbole", "Ironia", "Antítese"],
      correctAnswer: "Hipérbole",
      explanation: "Hipérbole é o exagero proposital para enfatizar uma ideia."
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

  document.getElementById("quiz-container").classList.remove("hidden");
  document.getElementById("result-container").classList.add("hidden");
  document.getElementById("history-container").classList.add("hidden");

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

  document.getElementById("next-button").classList.add("hidden");
  document.getElementById("explanation-text").classList.add("hidden");
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

  document.getElementById("explanation-text").textContent = currentQuestion.explanation;
  document.getElementById("explanation-text").classList.remove("hidden");
  document.getElementById("next-button").classList.remove("hidden");
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
  document.getElementById("quiz-container").classList.add("hidden");
  document.getElementById("result-container").classList.remove("hidden");

  const subject = document.getElementById("subject-select").value;
  saveScore(subject, score, selectedQuestions.length);
  loadHistory();
  document.getElementById("history-container").classList.remove("hidden");

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

  history.push({ subject, score, total, timestamp });
  localStorage.setItem("quizHistory", JSON.stringify(history));

function loadHistory() {
  const history = JSON.parse(localStorage.getItem("quizHistory")) || [];
  const historyContainer = document.getElementById("history-container");
  historyContainer.innerHTML = "<h3>Histórico de Pontuação:</h3>";

  if (history.length === 0) {
    historyContainer.innerHTML += "<p>Nenhum histórico disponível.</p>";
    return;
  }

  const list = document.createElement("ul");
  history.forEach(entry => {
    const item = document.createElement("li");
    item.textContent = `${entry.timestamp} - ${entry.subject} - ${entry.score}/${entry.total}`;
    list.appendChild(item);
  });

  historyContainer.appendChild(list);
}
