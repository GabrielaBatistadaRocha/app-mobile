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

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function startQuiz() {
  const subject = document.getElementById("subject-select").value;
  if (!subject) return;

  selectedQuestions = [...questionBank[subject]]; // Cria uma cópia para não alterar o original
  shuffleArray(selectedQuestions); // Embaralha as perguntas
  currentQuestionIndex = 0;
  score = 0;

  document.getElementById("quiz-container").classList.remove("hidden");
  document.getElementById("result-container").classList.add("hidden");
  document.getElementById("history-container").classList.add("hidden");
  document.getElementById("scoreChart").classList.add("hidden");

  displayQuestion();
}

function displayQuestion() {
  const currentQuestion = selectedQuestions[currentQuestionIndex];
  document.getElementById("question-text").textContent = `(${currentQuestionIndex + 1}/${selectedQuestions.length}) ${currentQuestion.question}`;

  const answersContainer = document.getElementById("answers-container");
  answersContainer.innerHTML = "";

  const shuffledAnswers = [...currentQuestion.answers]; // Cria uma cópia das respostas
  shuffleArray(shuffledAnswers); // Embaralha as respostas

  shuffledAnswers.forEach(answer => {
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
  const total = selectedQuestions.length;
  const timestamp = new Date().toLocaleString();

  saveScore(subject, score, total, timestamp);
  loadHistory();

  let message = "";
  if (score === total) {
    message = "Parabéns! Você acertou todas!";
  } else if (score > 0) {
    message = "Bom trabalho! Mas ainda dá pra melhorar.";
  } else {
    message = "Ops! Nenhuma resposta correta. Tente novamente!";
  }

  document.getElementById("final-score").textContent = `${message} Sua pontuação final: ${score} de ${total}`;
}

function saveScore(subject, score, total, timestamp) {
  const history = JSON.parse(localStorage.getItem("quizHistory")) || [];
  history.push({ subject, score, total, timestamp });
  localStorage.setItem("quizHistory", JSON.stringify(history));
}

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
  
  const scoreChartElement = document.getElementById("scoreChart");
  if (scoreChartElement) {
    renderChart(history);
  }
}

function renderChart(history) {
  const ctx = document.getElementById("scoreChart").getContext("2d");
  const labels = history.map(entry => entry.timestamp);
  const data = history.map(entry => (entry.score / entry.total) * 100);

  // Destrua a instância do gráfico anterior se ela existir
  if (window.myChart instanceof Chart) {
    window.myChart.destroy();
  }

  window.myChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [{
        label: "Desempenho (%)",
        data: data,
        borderColor: "#4CAF50",
        backgroundColor: "rgba(76, 175, 80, 0.2)",
        fill: true,
        tension: 0.3
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          max: 100
        }
      }
    }
  });
}

function exportCSV() {
  const history = JSON.parse(localStorage.getItem("quizHistory")) || [];
  if (history.length === 0) return alert("Nenhum dado para exportar.");

  let csv = "Data,Assunto,Pontuação,Total\n";
  history.forEach(entry => {
    csv += `${entry.timestamp},${entry.subject},${entry.score},${entry.total}\n`;
  });

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "historico_quiz.csv";
  link.click();
}

function restartQuiz() {
  startQuiz();
}

function toggleHistory() {
  const historyContainer = document.getElementById("history-container");
  const scoreChart = document.getElementById("scoreChart");
  historyContainer.classList.toggle("hidden");
  scoreChart.classList.add("hidden"); // Garante que o gráfico não aparece junto
}

function toggleChart() {
  const scoreChart = document.getElementById("scoreChart");
  const historyContainer = document.getElementById("history-container");
  scoreChart.classList.toggle("hidden");
  historyContainer.classList.add("hidden"); // Garante que o histórico não aparece junto
}