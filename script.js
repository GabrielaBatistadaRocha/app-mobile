const questionBank = {
  matematica: [
    {
      question: "Qual é o valor de x na equação 2x + 3 = 7?",
      answers: ["1", "2", "3", "4"],
      correctAnswer: "2",
      explanation: "Subtraindo 3 de ambos os lados: 2x = 4 → x = 2.",
      topic: "Álgebra",
      difficulty: "easy",
      exam: ["enem", "uel"]
    },
    {
      question: "Qual é a derivada de x²?",
      answers: ["2x", "x", "x²", "1"],
      correctAnswer: "2x",
      explanation: "A derivada de x² em relação a x é 2x, pela regra do poder.",
      topic: "Cálculo",
      difficulty: "medium",
      exam: ["uel"]
    },
    {
      question: "Um carro percorre 120 km em 2 horas. Qual a sua velocidade média em km/h?",
      answers: ["40", "50", "60", "70"],
      correctAnswer: "60",
      explanation: "Velocidade média é a distância percorrida dividida pelo tempo. 120 km / 2 h = 60 km/h.",
      topic: "Física",
      difficulty: "easy",
      exam: ["enem", "uel"]
    }
  ],
  ciencias: [
    {
      question: "Qual é a função da mitocôndria?",
      answers: ["Produzir energia", "Digestão celular", "Síntese de proteínas", "Transporte de nutrientes"],
      correctAnswer: "Produzir energia",
      explanation: "A mitocôndria é responsável pela respiração celular e produção de ATP.",
      topic: "Biologia",
      difficulty: "easy",
      exam: ["enem"]
    },
    {
      question: "O que é o processo de fotossíntese?",
      answers: ["Produção de energia pela queima de glicose", "Transformação de luz solar em energia química", "Troca de gases entre o organismo e o ambiente", "Divisão celular"],
      correctAnswer: "Transformação de luz solar em energia química",
      explanation: "Fotossíntese é o processo pelo qual plantas e outros organismos convertem energia luminosa em energia química.",
      topic: "Biologia",
      difficulty: "medium",
      exam: ["enem", "uel"]
    }
  ],
  humanas: [
    {
      question: "Quem foi o autor do contrato social?",
      answers: ["Rousseau", "Marx", "Locke", "Hobbes"],
      correctAnswer: "Rousseau",
      explanation: "Jean-Jacques Rousseau escreveu 'O Contrato Social' em 1762.",
      topic: "Filosofia",
      difficulty: "medium",
      exam: ["uel"]
    },
    {
      question: "A Crise de 1929 teve início em qual país?",
      answers: ["Reino Unido", "Alemanha", "Estados Unidos", "França"],
      correctAnswer: "Estados Unidos",
      explanation: "A Grande Depressão teve início com a quebra da Bolsa de Valores de Nova York, nos Estados Unidos.",
      topic: "História",
      difficulty: "easy",
      exam: ["enem", "uel"]
    }
  ],
  linguagens: [
    {
      question: "Qual figura de linguagem está presente em 'Ela chorava rios de lágrimas'?",
      answers: ["Metáfora", "Hipérbole", "Ironia", "Antítese"],
      correctAnswer: "Hipérbole",
      explanation: "Hipérbole é o exagero proposital para enfatizar uma ideia.",
      topic: "Literatura",
      difficulty: "easy",
      exam: ["enem"]
    },
    {
      question: "Qual o principal objetivo de um texto dissertativo-argumentativo?",
      answers: ["Narrar uma história", "Descrever um lugar", "Defender um ponto de vista", "Expor informações"],
      correctAnswer: "Defender um ponto de vista",
      explanation: "O texto dissertativo-argumentativo busca convencer o leitor sobre uma ideia, usando argumentos.",
      topic: "Redação",
      difficulty: "medium",
      exam: ["enem", "uel"]
    }
  ]
};

// Referências DOM - Centralizadas no topo
const welcomeScreen = document.getElementById("welcome-screen");
const subjectCards = document.querySelectorAll(".subject-card");
const modeSelection = document.getElementById("mode-selection");
const modeButtons = document.querySelectorAll(".mode-button");
const quizContainer = document.getElementById("quiz-container");
const questionText = document.getElementById("question-text");
const answersContainer = document.getElementById("answers-container");
const explanationText = document.getElementById("explanation-text");
const nextButton = document.getElementById("next-button");
const timerFill = document.getElementById("timer-fill");
const aside = document.getElementById("aside-container");
const main = document.querySelector("main");
const resultContainer = document.getElementById("result-container");
const reviewContainer = document.getElementById("review-container");
const historyContainer = document.getElementById("history-container");
const scoreChartElement = document.getElementById("scoreChart");
const quizResultChartElement = document.getElementById("quiz-result-chart");
const darkModeToggle = document.getElementById("dark-mode-toggle");
const finalScoreDisplay = document.getElementById("final-score");
const reviewButton = document.getElementById("review-button");
const restartButton = document.getElementById("restart-button");
const exportCsvButton = document.getElementById("export-csv-button");
const toggleHistoryButton = document.getElementById("toggle-history-button");
const toggleChartButton = document.getElementById("toggle-chart-button");
const backToHomeFromReview = document.getElementById("back-to-home-from-review");
const backToHomeFromHistory = document.getElementById("back-to-home-from-history");

// Gerenciamento de Estado - Centralizado em um objeto
const quizState = {
  selectedQuestions: [],
  currentQuestionIndex: 0,
  score: 0,
  timerInterval: null,
  currentSubject: "",
  isSimuladoMode: false,
  userAnswers: []
};

// Funções de inicialização
document.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('dark-mode') === 'true') {
    document.body.classList.add('dark-mode');
  }
  setupEventListeners();
});

// Setup de Eventos - Separado do resto da lógica
function setupEventListeners() {
  darkModeToggle.addEventListener('click', toggleDarkMode);
  subjectCards.forEach(card => card.addEventListener('click', selectSubject));
  modeButtons.forEach(button => button.addEventListener('click', selectMode));
  nextButton.addEventListener('click', nextQuestion);
  reviewButton.addEventListener('click', displayReviewScreen);
  restartButton.addEventListener('click', restartQuiz);
  exportCsvButton.addEventListener('click', exportCSV);
  toggleHistoryButton.addEventListener('click', toggleHistory);
  toggleChartButton.addEventListener('click', toggleChart);
  
  if (backToHomeFromReview) backToHomeFromReview.addEventListener('click', restartQuiz);
  if (backToHomeFromHistory) backToHomeFromHistory.addEventListener('click', restartQuiz);
}

function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  const isDarkMode = document.body.classList.contains('dark-mode');
  localStorage.setItem('dark-mode', isDarkMode);
}

function selectSubject(event) {
  quizState.currentSubject = event.currentTarget.dataset.subject;
  welcomeScreen.classList.add("hidden");
  modeSelection.classList.remove("hidden");
}

function selectMode(event) {
  startQuiz(event.currentTarget.dataset.mode);
}

// Lógica principal do quiz
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function startQuiz(mode) {
  if (!quizState.currentSubject) {
    console.error("Nenhuma matéria selecionada.");
    return;
  }
  
  quizState.isSimuladoMode = mode === 'simulado';
  quizState.selectedQuestions = [...questionBank[quizState.currentSubject]];
  shuffleArray(quizState.selectedQuestions);
  quizState.currentQuestionIndex = 0;
  quizState.score = 0;
  quizState.userAnswers = [];

  // Transições de tela
  welcomeScreen.classList.add("hidden");
  modeSelection.classList.add("hidden");
  quizContainer.classList.remove("hidden");
  [resultContainer, historyContainer, scoreChartElement, reviewContainer, aside, quizResultChartElement].forEach(el => el.classList.add("hidden"));
  main.classList.add("full-width");

  if (quizState.isSimuladoMode) {
    timerFill.style.backgroundColor = '#FFC107';
    nextButton.classList.add("hidden");
  } else {
    timerFill.style.backgroundColor = 'var(--accent-color)';
  }

  displayQuestion();
}

function displayQuestion() {
  const currentQuestion = quizState.selectedQuestions[quizState.currentQuestionIndex];
  questionText.textContent = `(${quizState.currentQuestionIndex + 1}/${quizState.selectedQuestions.length}) ${currentQuestion.question}`;
  answersContainer.innerHTML = "";

  const shuffledAnswers = [...currentQuestion.answers];
  shuffleArray(shuffledAnswers);

  shuffledAnswers.forEach(answer => {
    const button = document.createElement("button");
    button.textContent = answer;
    button.addEventListener('click', () => checkAnswer(button, answer));
    answersContainer.appendChild(button);
  });

  explanationText.classList.add("hidden");
  nextButton.classList.add("hidden");

  startTimer(quizState.isSimuladoMode ? 180 : 15);
}

function startTimer(duration) {
  let timeLeft = duration;
  timerFill.style.width = '100%';

  clearInterval(quizState.timerInterval);
  quizState.timerInterval = setInterval(() => {
    timeLeft--;
    const percentage = (timeLeft / duration) * 100;
    timerFill.style.width = `${percentage}%`;

    if (timeLeft <= 0) {
      clearInterval(quizState.timerInterval);
      checkAnswer(null, 'timeout');
    }
  }, 1000);
}

function checkAnswer(buttonClicked, answer) {
  clearInterval(quizState.timerInterval);
  const currentQuestion = quizState.selectedQuestions[quizState.currentQuestionIndex];
  const buttons = document.querySelectorAll("#answers-container button");
  const isCorrect = answer === currentQuestion.correctAnswer;

  quizState.userAnswers.push({
    question: currentQuestion.question,
    userAnswer: answer,
    correctAnswer: currentQuestion.correctAnswer,
    explanation: currentQuestion.explanation,
    isCorrect: isCorrect
  });

  if (!quizState.isSimuladoMode) {
    buttons.forEach(btn => {
      btn.disabled = true;
      if (btn.textContent === currentQuestion.correctAnswer) {
        btn.classList.add("correct");
      } else if (btn === buttonClicked) {
        btn.classList.add("incorrect");
      }
    });

    if (isCorrect) {
      quizState.score++;
    }

    explanationText.textContent = currentQuestion.explanation;
    explanationText.classList.remove("hidden");
  }

  nextButton.classList.remove("hidden");
}

function nextQuestion() {
  quizState.currentQuestionIndex++;
  if (quizState.currentQuestionIndex < quizState.selectedQuestions.length) {
    displayQuestion();
  } else {
    showFinalScore();
  }
}

function showFinalScore() {
  [quizContainer, historyContainer, scoreChartElement, reviewContainer].forEach(el => el.classList.add("hidden"));
  resultContainer.classList.remove("hidden");
  aside.classList.remove("hidden");
  main.classList.remove("full-width");

  const finalScore = quizState.isSimuladoMode ? quizState.userAnswers.filter(ans => ans.isCorrect).length : quizState.score;
  const total = quizState.selectedQuestions.length;
  const timestamp = new Date().toLocaleString();

  saveScore(quizState.currentSubject, finalScore, total, timestamp);
  loadHistory();

  let message = "";
  if (finalScore === total) {
    message = "Parabéns! Você acertou todas!";
  } else if (finalScore > 0) {
    message = "Bom trabalho! Mas ainda dá para melhorar.";
  } else {
    message = "Ops! Nenhuma resposta correta. Tente novamente!";
  }

  finalScoreDisplay.textContent = `${message} Sua pontuação final: ${finalScore} de ${total}`;
  
  if (quizState.isSimuladoMode) {
    reviewButton.classList.remove("hidden");
  } else {
    reviewButton.classList.add("hidden");
  }

  // A função renderQuizResultChart é chamada aqui!
  renderQuizResultChart();
}

// NOVO: Função para renderizar o gráfico do quiz atual
function renderQuizResultChart() {
  if (window.quizResultChart instanceof Chart) {
    window.quizResultChart.destroy();
  }

  const correctAnswers = quizState.userAnswers.filter(answer => answer.isCorrect).length;
  const incorrectAnswers = quizState.userAnswers.length - correctAnswers;

  const ctx = quizResultChartElement.getContext("2d");
  quizResultChartElement.classList.remove("hidden");
  
  window.quizResultChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Corretas', 'Incorretas'],
      datasets: [{
        data: [correctAnswers, incorrectAnswers],
        backgroundColor: ['#4CAF50', '#F44336'],
        hoverOffset: 4
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Seu Desempenho Neste Quiz'
        }
      }
    }
  });
}

function displayReviewScreen() {
  resultContainer.classList.add("hidden");
  reviewContainer.classList.remove("hidden");
  reviewContainer.innerHTML = "<h3>Revisão do Quiz</h3>";

  const backToHomeButton = document.createElement('button');
  backToHomeButton.textContent = "Voltar ao Início";
  backToHomeButton.classList.add("back-to-home");
  backToHomeButton.addEventListener('click', restartQuiz);
  reviewContainer.appendChild(backToHomeButton);

  quizState.userAnswers.forEach((answer, index) => {
    const questionDiv = document.createElement("div");
    questionDiv.classList.add("review-item");
    questionDiv.innerHTML = `
      <h4>Questão ${index + 1}: ${answer.question}</h4>
      <p>Sua resposta: ${answer.userAnswer}</p>
      <p>Resposta correta: ${answer.correctAnswer}</p>
      <p>Explicação: ${answer.explanation}</p>
    `;
    questionDiv.style.backgroundColor = answer.isCorrect ? 'var(--review-correct-bg)' : 'var(--review-incorrect-bg)';
    questionDiv.style.padding = '15px';
    questionDiv.style.borderRadius = '8px';
    questionDiv.style.marginBottom = '10px';
    reviewContainer.appendChild(questionDiv);
  });
}

function saveScore(subject, score, total, timestamp) {
  const quizHistory = JSON.parse(localStorage.getItem("quizHistory")) || [];
  quizHistory.push({ subject, score, total, timestamp });
  localStorage.setItem("quizHistory", JSON.stringify(quizHistory));
}

function loadHistory() {
  const quizHistory = JSON.parse(localStorage.getItem("quizHistory")) || [];
  historyContainer.innerHTML = "<h3>Histórico de Pontuação:</h3>";

  if (quizHistory.length === 0) {
    historyContainer.innerHTML += "<p>Nenhum histórico disponível.</p>";
    return;
  }

  const list = document.createElement("ul");
  quizHistory.forEach(entry => {
    const item = document.createElement("li");
    item.textContent = `${entry.timestamp.split(',')[0]} - ${entry.subject} - ${entry.score}/${entry.total}`;
    list.appendChild(item);
  });

  historyContainer.appendChild(list);
  renderChart(quizHistory);
}

function renderChart(history) {
  const ctx = scoreChartElement.getContext("2d");
  const labels = history.map(entry => entry.timestamp.split(',')[0]);
  const data = history.map(entry => (entry.score / entry.total) * 100);

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
  const quizHistory = JSON.parse(localStorage.getItem("quizHistory")) || [];
  if (quizHistory.length === 0) return alert("Nenhum dado para exportar.");

  let csv = "Data,Assunto,Pontuação,Total\n";
  quizHistory.forEach(entry => {
    csv += `${entry.timestamp},${entry.subject},${entry.score},${entry.total}\n`;
  });

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "historico_quiz.csv";
  link.click();
}

function restartQuiz() {
  [quizContainer, resultContainer, historyContainer, scoreChartElement, reviewContainer, aside, quizResultChartElement].forEach(el => el.classList.add("hidden"));
  main.classList.add("full-width");
  welcomeScreen.classList.remove("hidden");
  modeSelection.classList.add("hidden");
  quizState.userAnswers = [];
}

function toggleHistory() {
  historyContainer.classList.toggle("hidden");
  scoreChartElement.classList.add("hidden");
  quizResultChartElement.classList.add("hidden"); // Esconder o gráfico do quiz atual
  loadHistory();
}

function toggleChart() {
  scoreChartElement.classList.toggle("hidden");
  historyContainer.classList.add("hidden");
  quizResultChartElement.classList.add("hidden"); // Esconder o gráfico do quiz atual
  loadHistory();
}