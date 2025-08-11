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

let selectedQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let timerInterval;
let currentSubject = "";
let isSimuladoMode = false; // Novo: Variável para controlar o modo de quiz
let userAnswers = []; // Novo: Array para armazenar as respostas do usuário

const welcomeScreen = document.getElementById("welcome-screen");
const quizContainer = document.getElementById("quiz-container");
const resultContainer = document.getElementById("result-container");
const reviewContainer = document.getElementById("review-container"); // Novo: Container para a revisão
const historyContainer = document.getElementById("history-container");
const scoreChartElement = document.getElementById("scoreChart");
const darkModeToggle = document.getElementById("dark-mode-toggle");
const aside = document.getElementById("aside-container");
const main = document.querySelector("main");

darkModeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  const isDarkMode = document.body.classList.contains('dark-mode');
  localStorage.setItem('dark-mode', isDarkMode);
});

if (localStorage.getItem('dark-mode') === 'true') {
  document.body.classList.add('dark-mode');
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function startQuiz(subject, mode) {
  if (!subject) return;

  isSimuladoMode = mode === 'simulado'; // Define o modo do quiz
  currentSubject = subject;
  selectedQuestions = [...questionBank[subject]];
  shuffleArray(selectedQuestions);
  currentQuestionIndex = 0;
  score = 0;
  userAnswers = []; // Limpa o histórico de respostas

  welcomeScreen.classList.add("hidden");
  quizContainer.classList.remove("hidden");
  resultContainer.classList.add("hidden");
  historyContainer.classList.add("hidden");
  scoreChartElement.classList.add("hidden");
  reviewContainer.classList.add("hidden"); // Oculta a tela de revisão
  aside.classList.add("hidden");
  main.classList.add("full-width");

  // Ajusta a interface para o modo simulado
  if (isSimuladoMode) {
    document.getElementById("timer-fill").style.backgroundColor = '#FFC107'; // Cor de alerta
    document.getElementById("next-button").textContent = 'Próxima Questão';
    document.getElementById("next-button").classList.add("hidden");
  } else {
    document.getElementById("timer-fill").style.backgroundColor = 'var(--secondary-color)';
    document.getElementById("next-button").textContent = 'Próxima Questão';
  }

  displayQuestion();
}

function displayQuestion() {
  const currentQuestion = selectedQuestions[currentQuestionIndex];
  document.getElementById("question-text").textContent = `(${currentQuestionIndex + 1}/${selectedQuestions.length}) ${currentQuestion.question}`;

  const answersContainer = document.getElementById("answers-container");
  answersContainer.innerHTML = "";

  const shuffledAnswers = [...currentQuestion.answers];
  shuffleArray(shuffledAnswers);

  shuffledAnswers.forEach(answer => {
    const button = document.createElement("button");
    button.textContent = answer;
    button.onclick = () => checkAnswer(button, answer);
    answersContainer.appendChild(button);
  });

  document.getElementById("next-button").classList.add("hidden");
  document.getElementById("explanation-text").classList.add("hidden");

  // Inicia o timer, com 3 minutos para o modo simulado
  startTimer(isSimuladoMode ? 180 : 15);
}

function startTimer(duration) {
  let timeLeft = duration;
  const timerFill = document.getElementById("timer-fill");
  timerFill.style.width = '100%';

  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timeLeft--;
    const percentage = (timeLeft / duration) * 100;
    timerFill.style.width = `${percentage}%`;

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      checkAnswer(null, 'timeout');
    }
  }, 1000);
}

function checkAnswer(buttonClicked, answer) {
  clearInterval(timerInterval);
  const currentQuestion = selectedQuestions[currentQuestionIndex];
  const buttons = document.querySelectorAll("#answers-container button");

  // Salva a resposta do usuário
  userAnswers.push({
    question: currentQuestion.question,
    userAnswer: answer,
    correctAnswer: currentQuestion.correctAnswer,
    explanation: currentQuestion.explanation,
    isCorrect: answer === currentQuestion.correctAnswer
  });

  if (isSimuladoMode) {
    buttons.forEach(btn => btn.disabled = true);
    document.getElementById("next-button").classList.remove("hidden");
    return; // Não mostra feedback visual no modo simulado
  }

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
  quizContainer.classList.add("hidden");
  resultContainer.classList.remove("hidden");
  historyContainer.classList.add("hidden");
  scoreChartElement.classList.add("hidden");
  reviewContainer.classList.add("hidden");

  aside.classList.remove("hidden");
  main.classList.remove("full-width");

  if (isSimuladoMode) {
    // Calcula a pontuação total do modo simulado
    score = userAnswers.filter(ans => ans.isCorrect).length;
    document.getElementById("review-button").classList.remove("hidden");
  } else {
    document.getElementById("review-button").classList.add("hidden");
  }

  const total = selectedQuestions.length;
  const timestamp = new Date().toLocaleString();

  saveScore(currentSubject, score, total, timestamp);
  loadHistory();

  let message = "";
  if (score === total) {
    message = "Parabéns! Você acertou todas!";
  } else if (score > 0) {
    message = "Bom trabalho! Mas ainda dá para melhorar.";
  } else {
    message = "Ops! Nenhuma resposta correta. Tente novamente!";
  }

  document.getElementById("final-score").textContent = `${message} Sua pontuação final: ${score} de ${total}`;
}

function displayReviewScreen() {
  resultContainer.classList.add("hidden");
  reviewContainer.classList.remove("hidden");
  reviewContainer.innerHTML = "<h3>Revisão do Quiz</h3>";

  userAnswers.forEach((answer, index) => {
    const questionDiv = document.createElement("div");
    questionDiv.classList.add("review-item");
    questionDiv.innerHTML = `
      <h4>Questão ${index + 1}: ${answer.question}</h4>
      <p>Sua resposta: ${answer.userAnswer}</p>
      <p>Resposta correta: ${answer.correctAnswer}</p>
      <p>Explicação: ${answer.explanation}</p>
    `;
    questionDiv.style.backgroundColor = answer.isCorrect ? '#d4edda' : '#f8d7da';
    questionDiv.style.padding = '15px';
    questionDiv.style.borderRadius = '8px';
    questionDiv.style.marginBottom = '10px';
    reviewContainer.appendChild(questionDiv);
  });
}

function saveScore(subject, score, total, timestamp) {
  const history = JSON.parse(localStorage.getItem("quizHistory")) || [];
  history.push({ subject, score, total, timestamp });
  localStorage.setItem("quizHistory", JSON.stringify(history));
}

function loadHistory() {
  const history = JSON.parse(localStorage.getItem("quizHistory")) || [];
  historyContainer.innerHTML = "<h3>Histórico de Pontuação:</h3>";

  if (history.length === 0) {
    historyContainer.innerHTML += "<p>Nenhum histórico disponível.</p>";
    return;
  }

  const list = document.createElement("ul");
  history.forEach(entry => {
    const item = document.createElement("li");
    item.textContent = `${entry.timestamp.split(' ')[0]} - ${entry.subject} - ${entry.score}/${entry.total}`;
    list.appendChild(item);
  });

  historyContainer.appendChild(list);
  renderChart(history);
}

function renderChart(history) {
  const ctx = scoreChartElement.getContext("2d");
  const labels = history.map(entry => entry.timestamp.split(' ')[0]);
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
  quizContainer.classList.add("hidden");
  resultContainer.classList.add("hidden");
  historyContainer.classList.add("hidden");
  scoreChartElement.classList.add("hidden");
  reviewContainer.classList.add("hidden");
  aside.classList.add("hidden");
  main.classList.add("full-width");
  welcomeScreen.classList.remove("hidden");
}

function toggleHistory() {
  historyContainer.classList.toggle("hidden");
  scoreChartElement.classList.add("hidden");
  loadHistory();
}

function toggleChart() {
  scoreChartElement.classList.toggle("hidden");
  historyContainer.classList.add("hidden");
  loadHistory();
}

// Adiciona um evento para garantir que a matéria seja salva no histórico
Object.keys(questionBank).forEach(subject => {
  questionBank[subject].forEach(q => q.subject = subject);
});
