const questionBank = {
  matematica: [
    { question: "Qual é o valor de x na equação 2x + 3 = 7?", answers: ["1", "2", "3", "4"], correctAnswer: "2", explanation: "Subtraindo 3 de ambos os lados: 2x = 4 → x = 2.", topic: "Álgebra", difficulty: "easy", exam: ["enem", "uel"] },
    { question: "Qual é a derivada de x²?", answers: ["2x", "x", "x²", "1"], correctAnswer: "2x", explanation: "A derivada de x² em relação a x é 2x, pela regra do poder.", topic: "Cálculo", difficulty: "medium", exam: ["uel"] },
    { question: "Um carro percorre 120 km em 2 horas. Qual a sua velocidade média em km/h?", answers: ["40", "50", "60", "70"], correctAnswer: "60", explanation: "Velocidade média é a distância percorrida dividida pelo tempo. 120 km / 2 h = 60 km/h.", topic: "Física", difficulty: "easy", exam: ["enem", "uel"] }
  ],
  ciencias: [
    { question: "Qual é a função da mitocôndria?", answers: ["Produzir energia", "Digestão celular", "Síntese de proteínas", "Transporte de nutrientes"], correctAnswer: "Produzir energia", explanation: "A mitocôndria é responsável pela respiração celular e produção de ATP.", topic: "Biologia", difficulty: "easy", exam: ["enem"] },
    { question: "O que é o processo de fotossíntese?", answers: ["Produção de energia pela queima de glicose", "Transformação de luz solar em energia química", "Troca de gases entre o organismo e o ambiente", "Divisão celular"], correctAnswer: "Transformação de luz solar em energia química", explanation: "Fotossíntese é o processo pelo qual plantas e outros organismos convertem energia luminosa em energia química.", topic: "Biologia", difficulty: "medium", exam: ["enem", "uel"] }
  ],
  humanas: [
    { question: "Quem foi o autor do contrato social?", answers: ["Rousseau", "Marx", "Locke", "Hobbes"], correctAnswer: "Rousseau", explanation: "Jean-Jacques Rousseau escreveu 'O Contrato Social' em 1762.", topic: "Filosofia", difficulty: "medium", exam: ["uel"] },
    { question: "A Crise de 1929 teve início em qual país?", answers: ["Reino Unido", "Alemanha", "Estados Unidos", "França"], correctAnswer: "Estados Unidos", explanation: "A Grande Depressão teve início com a quebra da Bolsa de Valores de Nova York, nos Estados Unidos.", topic: "História", difficulty: "easy", exam: ["enem", "uel"] }
  ],
  linguagens: [
    { question: "Qual figura de linguagem está presente em 'Ela chorava rios de lágrimas'?", answers: ["Metáfora", "Hipérbole", "Ironia", "Antítese"], correctAnswer: "Hipérbole", explanation: "Hipérbole é o exagero proposital para enfatizar uma ideia.", topic: "Literatura", difficulty: "easy", exam: ["enem"] },
    { question: "Qual é a função do sujeito na oração?", answers: ["Indicar ação", "Ser o termo sobre o qual se declara algo", "Complementar o verbo", "Modificar o substantivo"], correctAnswer: "Ser o termo sobre o qual se declara algo", explanation: "O sujeito é o termo da oração sobre o qual se faz uma declaração.", topic: "Gramática", difficulty: "medium", exam: ["uel"] }
  ]
};

const quizState = {
  currentSubject: '',
  selectedQuestions: [],
  currentQuestionIndex: 0,
  score: 0,
  userAnswers: [],
  timerInterval: null,
  isStudyMode: true,
  isPaused: false,
  timeRemaining: 0,
  userProfile: {
    quizHistory: []
  },
  
  saveQuizResult(subject, score, total, duration) {
    const result = {
      timestamp: new Date().toLocaleDateString('pt-BR'),
      subject: subject,
      score: score,
      total: total,
      duration: duration
    };
    this.userProfile.quizHistory.push(result);
    this.saveToLocalStorage();
  },
  
  saveToLocalStorage() {
    localStorage.setItem('quizUserProfile', JSON.stringify(this.userProfile));
  },
  
  loadFromLocalStorage() {
    const saved = localStorage.getItem('quizUserProfile');
    if (saved) {
      this.userProfile = JSON.parse(saved);
    }
  },
  
  showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    toastContainer.appendChild(toast);
    
    setTimeout(() => {
      toast.classList.remove('hidden');
    }, 100);
    
    setTimeout(() => {
      toast.classList.add('hidden');
      setTimeout(() => {
        if (toast.parentNode === toastContainer) {
            toastContainer.removeChild(toast);
        }
      }, 300);
    }, 3000);
  }
};

const elements = {
  loadingScreen: document.getElementById('loading-screen'),
  welcomeScreen: document.getElementById('welcome-screen'),
  quizContainer: document.getElementById('quiz-container'),
  modeSelection: document.getElementById('mode-selection'),
  asideContainer: document.getElementById('aside-container'),
  resultContainer: document.getElementById('result-container'),
  historyContainer: document.getElementById('history-container'),
  reviewContainer: document.getElementById('review-container'),
  statsContainer: document.getElementById('stats-container'),
  
  questionText: document.getElementById('question-text'),
  questionMeta: document.getElementById('question-meta'),
  questionTopic: document.getElementById('question-topic'),
  questionDifficulty: document.getElementById('question-difficulty'),
  questionExam: document.getElementById('question-exam'),
  answersContainer: document.getElementById('answers-container'),
  explanationContainer: document.getElementById('explanation-container'),
  explanationText: document.getElementById('explanation-text'),
  nextButton: document.getElementById('next-button'),
  
  quizProgressFill: document.getElementById('quiz-progress-fill'),
  questionCounter: document.getElementById('question-counter'),
  timerContainer: document.getElementById('timer-container'),
  timerText: document.getElementById('timer-text'),
  timerFill: document.getElementById('timer-fill'),
  
  resultEmoji: document.getElementById('result-emoji'),
  finalScore: document.getElementById('final-score'),
  
  historyContent: document.getElementById('history-content'),
  reviewContent: document.getElementById('review-content'),
  quizContent: document.getElementById('quiz-content'),
  
  pauseButton: document.getElementById('pause-button'),
  backToSubjectsButton: document.getElementById('back-to-subjects-button'),
  
  menuToggle: document.getElementById('menu-toggle'),
  menuDropdown: document.getElementById('menu-dropdown'),
  menuHistory: document.getElementById('menu-history'),
  menuStats: document.getElementById('menu-stats'),
  menuExport: document.getElementById('menu-export'),
  menuRestart: document.getElementById('menu-restart'),
};

const subjects = {
  matematica: { name: 'Matemática' },
  ciencias: { name: 'Ciências' },
  humanas: { name: 'Humanas' },
  linguagens: { name: 'Linguagens' }
};

document.addEventListener('DOMContentLoaded', function() {
  quizState.loadFromLocalStorage();
  
  setTimeout(() => {
    if(elements.loadingScreen) elements.loadingScreen.classList.add('hidden');
  }, 1000);
  
  setupEventListeners();
  setupThemeToggle();
});

function setupEventListeners() {
  document.querySelectorAll('.subject-card').forEach(card => {
    card.addEventListener('click', () => selectSubject(card.dataset.subject));
    card.addEventListener('keypress', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectSubject(card.dataset.subject); } });
  });
  
  document.querySelectorAll('.mode-card').forEach(card => {
    card.addEventListener('click', () => selectMode(card.dataset.mode));
    card.addEventListener('keypress', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectMode(card.dataset.mode); } });
  });
  
  elements.nextButton?.addEventListener('click', nextQuestion);
  
  document.getElementById('restart-button')?.addEventListener('click', restartQuiz);
  document.getElementById('toggle-quiz-chart-button')?.addEventListener('click', () => {
      const chart = document.getElementById('quiz-result-chart');
      chart.classList.toggle('hidden');
      if (!chart.classList.contains('hidden')) {
          renderQuizResultChart();
      }
  });
  document.getElementById('export-csv-button')?.addEventListener('click', exportCSV);
  document.getElementById('review-button')?.addEventListener('click', toggleReview);
  
  document.getElementById('back-to-home-from-review')?.addEventListener('click', restartQuiz);
  document.getElementById('back-to-home-from-history')?.addEventListener('click', restartQuiz);
  document.getElementById('back-to-home-from-stats')?.addEventListener('click', restartQuiz);

  elements.backToSubjectsButton?.addEventListener('click', backToSubjects);
  elements.pauseButton?.addEventListener('click', togglePause);
  
  elements.menuToggle?.addEventListener('click', toggleMenu);
  
  elements.menuHistory?.addEventListener('click', (e) => { e.preventDefault(); toggleHistory(); toggleMenu(); });
  elements.menuStats?.addEventListener('click', (e) => { e.preventDefault(); toggleStats(); toggleMenu(); });
  elements.menuExport?.addEventListener('click', (e) => { e.preventDefault(); exportCSV(); toggleMenu(); });
  elements.menuRestart?.addEventListener('click', (e) => { e.preventDefault(); restartQuiz(); toggleMenu(); });
}

function setupThemeToggle() {
  const themeToggle = document.querySelector('button.theme-toggle');
  const body = document.body;
  
  const savedTheme = localStorage.getItem('theme') || 'light';
  body.classList.toggle('dark-mode', savedTheme === 'dark');
  updateThemeIcon(savedTheme);
  
  themeToggle?.addEventListener('click', () => {
    const isDarkMode = body.classList.toggle('dark-mode');
    const newTheme = isDarkMode ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
  });
}

function updateThemeIcon(theme) {
  const icon = document.querySelector('.theme-toggle i');
  if (icon) {
    icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
  }
}

function toggleMenu() {
  const menu = elements.menuDropdown;
  if (menu) {
    menu.classList.toggle('visible');
  }
}

function selectSubject(subject) {
  quizState.currentSubject = subject;
  elements.welcomeScreen?.classList.add('hidden');
  elements.modeSelection?.classList.remove('hidden');
}

function backToSubjects() {
    elements.modeSelection?.classList.add('hidden');
    elements.welcomeScreen?.classList.remove('hidden');
}

function selectMode(mode) {
  quizState.isStudyMode = mode === 'normal';
  
  const questions = questionBank[quizState.currentSubject];
  if (!questions || questions.length === 0) {
    quizState.showToast('Nenhuma questão disponível para esta matéria.', 'error');
    return;
  }
  
  quizState.selectedQuestions = shuffleArray([...questions]);
  quizState.currentQuestionIndex = 0;
  quizState.score = 0;
  quizState.userAnswers = [];
  
  startQuiz();
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function startQuiz() {
  elements.modeSelection?.classList.add('hidden');
  elements.quizContainer?.classList.remove('hidden');
  
  if (!quizState.isStudyMode) {
    elements.timerContainer?.classList.remove('hidden');
    elements.pauseButton?.classList.remove('hidden');
    startTimer(180);
  } else {
    elements.timerContainer?.classList.add('hidden');
    elements.pauseButton?.classList.add('hidden');
  }
  
  showQuestion();
}

function togglePause() {
    quizState.isPaused = !quizState.isPaused;
    const icon = elements.pauseButton.querySelector('i');
    const text = elements.pauseButton.querySelector('span');

    if (quizState.isPaused) {
        clearInterval(quizState.timerInterval);
        elements.quizContent.classList.add('hidden');
        if (icon) icon.className = 'fas fa-play';
        if (text) text.textContent = 'Continuar';
    } else {
        startTimer(quizState.timeRemaining);
        elements.quizContent.classList.remove('hidden');
        if (icon) icon.className = 'fas fa-pause';
        if (text) text.textContent = 'Pausar';
    }
}

function startTimer(seconds) {
  quizState.timeRemaining = seconds;
  const timerBar = document.getElementById('timer-fill');

  quizState.timerInterval = setInterval(() => {
    const minutes = Math.floor(quizState.timeRemaining / 60);
    const secs = quizState.timeRemaining % 60;
    
    if (elements.timerText) elements.timerText.textContent = `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    if (timerBar) timerBar.style.width = `${(quizState.timeRemaining / 180) * 100}%`;
    
    if (quizState.timeRemaining <= 0) {
      clearInterval(quizState.timerInterval);
      finishQuiz();
    }
    
    quizState.timeRemaining--;
  }, 1000);
}

function showQuestion() {
  const question = quizState.selectedQuestions[quizState.currentQuestionIndex];
  if (!question) return;
  
  updateProgress();
  
  if(elements.questionText) elements.questionText.textContent = question.question;
  if(elements.questionTopic) elements.questionTopic.textContent = question.topic;
  if(elements.questionDifficulty) elements.questionDifficulty.textContent = question.difficulty;
  if(elements.questionExam) elements.questionExam.textContent = question.exam.join(', ').toUpperCase();
  
  if(elements.answersContainer) elements.answersContainer.innerHTML = '';
  
  question.answers.forEach(answer => {
    const button = document.createElement('button');
    button.className = 'answer-button';
    button.textContent = answer;
    button.setAttribute('data-answer', answer);
    button.addEventListener('click', () => selectAnswer(answer, button));
    elements.answersContainer?.appendChild(button);
  });
  
  elements.explanationContainer?.classList.add('hidden');
  elements.nextButton?.classList.add('hidden');
}

function updateProgress() {
  const current = quizState.currentQuestionIndex + 1;
  const total = quizState.selectedQuestions.length;
  const percentage = (current / total) * 100;
  
  if (elements.quizProgressFill) elements.quizProgressFill.style.width = `${percentage}%`;
  if (elements.questionCounter) elements.questionCounter.textContent = `${current} de ${total}`;
}

function selectAnswer(selectedAnswer, buttonElement) {
  const question = quizState.selectedQuestions[quizState.currentQuestionIndex];
  const isCorrect = selectedAnswer === question.correctAnswer;
  
  quizState.userAnswers.push({
    question: question.question,
    selectedAnswer: selectedAnswer,
    correctAnswer: question.correctAnswer,
    isCorrect: isCorrect,
    explanation: question.explanation
  });
  
  if (isCorrect) quizState.score++;
  
  document.querySelectorAll('.answer-button').forEach(btn => {
    btn.disabled = true;
    if (btn.getAttribute('data-answer') === question.correctAnswer) {
      btn.classList.add('correct');
    } else if (btn === buttonElement && !isCorrect) {
      btn.classList.add('incorrect');
    }
  });
  
  if (quizState.isStudyMode) {
    if(elements.explanationText) elements.explanationText.textContent = question.explanation;
    elements.explanationContainer?.classList.remove('hidden');
  }
  
  elements.nextButton?.classList.remove('hidden');
  
  if (quizState.currentQuestionIndex === quizState.selectedQuestions.length - 1) {
    if(elements.nextButton) elements.nextButton.innerHTML = '<span>Finalizar</span><i class="fas fa-check"></i>';
  }
}

function nextQuestion() {
  quizState.currentQuestionIndex++;
  if (quizState.currentQuestionIndex >= quizState.selectedQuestions.length) {
    finishQuiz();
  } else {
    showQuestion();
  }
}

function finishQuiz() {
  clearInterval(quizState.timerInterval);
  elements.pauseButton?.classList.add('hidden');
  
  const total = quizState.selectedQuestions.length;
  const correctAnswers = quizState.score;
  const percentage = Math.round((correctAnswers / total) * 100);
  
  const duration = quizState.isStudyMode ? 'Sem limite' : '3 minutos';
  quizState.saveQuizResult(subjects[quizState.currentSubject].name, correctAnswers, total, duration);
  
  showResults(correctAnswers, total, percentage);
}

function showResults(correctAnswers, total, percentage) {
  [elements.quizContainer, elements.historyContainer, elements.reviewContainer, elements.statsContainer].forEach(el => el.classList.add('hidden'));
  elements.asideContainer?.classList.remove('hidden');
  elements.resultContainer?.classList.remove('hidden');
  
  let message = "";
  let emoji = "fas fa-trophy";
  
  if (percentage === 100) { message = "Perfeito!"; emoji = "fas fa-crown"; }
  else if (percentage >= 80) { message = "Excelente!"; emoji = "fas fa-star"; }
  else if (percentage >= 60) { message = "Bom trabalho!"; emoji = "fas fa-thumbs-up"; }
  else if (percentage >= 40) { message = "Continue estudando!"; emoji = "fas fa-book"; }
  else { message = "Não desista!"; emoji = "fas fa-dumbbell"; }
  
  if(elements.resultEmoji) elements.resultEmoji.className = emoji;
  if(elements.finalScore) elements.finalScore.innerHTML = `
    <div style="font-size: 1.5rem; margin-bottom: 1rem;">${message}</div>
    <div style="font-size: 1.25rem;"><strong>${correctAnswers}/${total}</strong> corretas</div>`;

  const reviewButton = document.getElementById('review-button');
  if(reviewButton) reviewButton.classList.remove('hidden');
}

function renderQuizResultChart() {
    const ctx = document.getElementById('quiz-result-chart').getContext('2d');
    const total = quizState.selectedQuestions.length;
    const correct = quizState.score;
    const incorrect = total - correct;
    
    if (window.quizChart) {
        window.quizChart.destroy();
    }

    const data = {
        labels: ['Corretas', 'Incorretas'],
        datasets: [{
            data: [correct, incorrect],
            backgroundColor: ['#28a745', '#dc3545'],
            hoverOffset: 4
        }]
    };

    const config = {
        type: 'doughnut',
        data: data,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Resultados do Quiz'
                }
            }
        }
    };
    
    window.quizChart = new Chart(ctx, config);
}

function renderHistoryChart() {
    const ctx = document.getElementById('scoreChart').getContext('2d');
    const history = quizState.userProfile.quizHistory;
    
    if (history.length === 0) {
        document.getElementById('scoreChart').classList.add('hidden');
        return;
    }

    const labels = history.map((_, index) => `Quiz ${index + 1}`);
    const dataPoints = history.map(entry => (entry.score / entry.total) * 100);
    
    if (window.historyChart) {
        window.historyChart.destroy();
    }

    const data = {
        labels: labels,
        datasets: [{
            label: 'Pontuação (%)',
            data: dataPoints,
            borderColor: '#667eea',
            backgroundColor: 'rgba(102, 126, 234, 0.2)',
            fill: true,
            tension: 0.4
        }]
    };

    const config = {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Progresso Histórico'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: true,
                        text: 'Pontuação (%)'
                    }
                }
            }
        }
    };

    window.historyChart = new Chart(ctx, config);
}

function exportCSV() {
  const history = quizState.userProfile.quizHistory;
  if (history.length === 0) {
    quizState.showToast('Nenhum dado para exportar.', 'warning');
    return;
  }
  
  let csv = 'Data,Matéria,Pontuação,Total,Porcentagem\n';
  history.forEach(entry => {
    const percentage = ((entry.score / entry.total) * 100).toFixed(1);
    csv += `${entry.timestamp},${entry.subject},${entry.score},${entry.total},${percentage}%\n`;
  });
  
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'quiz_historico.csv';
  link.click();
  URL.revokeObjectURL(link.href);
  
  quizState.showToast('Dados exportados!', 'success');
}

function restartQuiz() {
  [elements.resultContainer, elements.historyContainer,
   elements.reviewContainer, elements.asideContainer,
   elements.quizContainer, elements.modeSelection, elements.statsContainer].forEach(el => {
    if(el) el.classList.add('hidden');
  });
  
  elements.welcomeScreen?.classList.remove('hidden');
  clearInterval(quizState.timerInterval);
  
  quizState.currentSubject = '';
  quizState.selectedQuestions = [];
  quizState.currentQuestionIndex = 0;
  quizState.score = 0;
  quizState.userAnswers = [];
  quizState.isPaused = false;
}

function toggleHistory() {
    [elements.resultContainer, elements.reviewContainer, elements.statsContainer].forEach(el => el.classList.add('hidden'));
    elements.asideContainer?.classList.remove('hidden');
    elements.historyContainer?.classList.remove('hidden');
    loadHistory();
}

function toggleStats() {
    [elements.resultContainer, elements.reviewContainer, elements.historyContainer].forEach(el => el.classList.add('hidden'));
    elements.asideContainer?.classList.remove('hidden');
    elements.statsContainer?.classList.remove('hidden');
    renderHistoryChart();
}

function toggleReview() {
    [elements.resultContainer, elements.historyContainer, elements.statsContainer].forEach(el => el.classList.add('hidden'));
    elements.asideContainer?.classList.remove('hidden');
    elements.reviewContainer?.classList.remove('hidden');
    loadReview();
}

function loadHistory() {
  const history = quizState.userProfile.quizHistory;
  if (!elements.historyContent) return;
  
  if (history.length === 0) {
    elements.historyContent.innerHTML = '<p style="text-align: center; padding: 1rem;">Nenhum quiz realizado ainda.</p>';
    return;
  }
  
  elements.historyContent.innerHTML = history.map(entry => `
    <div class="history-item">
      <div class="history-info">
        <span class="history-subject">${entry.subject}</span>
        <span class="history-date">${entry.timestamp}</span>
      </div>
      <span class="history-score">${entry.score}/${entry.total}</span>
    </div>
  `).join('');
}

function loadReview() {
    if (!elements.reviewContent) return;
    elements.reviewContent.innerHTML = quizState.userAnswers.map(answer => `
        <div class="review-item ${answer.isCorrect ? 'correct' : 'incorrect'}">
            <h4>${answer.question}</h4>
            <p>Sua resposta: <strong>${answer.selectedAnswer}</strong></p>
            ${!answer.isCorrect ? `<p>Resposta correta: <strong>${answer.correctAnswer}</strong></p>` : ''}
            <p><em>Explicação: ${answer.explanation}</em></p>
        </div>
    `).join('');
}