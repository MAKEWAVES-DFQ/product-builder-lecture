document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('theme-toggle');
  const drawBtn = document.getElementById('draw-btn');
  const bonusToggle = document.getElementById('bonus-toggle');
  const animationContainer = document.getElementById('animation-container');
  const resultsContainer = document.getElementById('results-container');

  // --- Theme Management ---
  const getPreferredTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  const setTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  };

  setTheme(getPreferredTheme());

  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || getPreferredTheme();
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  });

  // --- Lotto Logic ---
  const generateLottoNumbers = (includeBonus) => {
    const numbers = Array.from({ length: 45 }, (_, i) => i + 1);
    
    // Fisher-Yates Shuffle for better randomness
    for (let i = numbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }

    const selected = numbers.slice(0, includeBonus ? 7 : 6);
    const mainNumbers = selected.slice(0, 6).sort((a, b) => a - b);
    const bonusNumber = includeBonus ? selected[6] : null;

    return { mainNumbers, bonusNumber };
  };

  const getBallColorClass = (num) => {
    if (num <= 10) return 'ball-yellow';
    if (num <= 20) return 'ball-blue';
    if (num <= 30) return 'ball-red';
    if (num <= 40) return 'ball-gray';
    return 'ball-green';
  };

  const createBallElement = (num) => {
    const ball = document.createElement('div');
    ball.className = `lotto-ball ${getBallColorClass(num)}`;
    ball.textContent = num;
    return ball;
  };

  const renderResultRow = (result) => {
    const row = document.createElement('div');
    row.className = 'result-row';

    result.mainNumbers.forEach(num => {
      row.appendChild(createBallElement(num));
    });

    if (result.bonusNumber !== null) {
      const plus = document.createElement('span');
      plus.className = 'bonus-plus';
      plus.textContent = '+';
      row.appendChild(plus);
      row.appendChild(createBallElement(result.bonusNumber));
    }

    return row;
  };

  // --- Draw Sequence ---
  drawBtn.addEventListener('click', () => {
    // UI Feedback
    drawBtn.disabled = true;
    resultsContainer.innerHTML = '';
    animationContainer.classList.remove('hidden');

    // Simulate drawing time
    setTimeout(() => {
      animationContainer.classList.add('hidden');
      
      // Generate 5 sets
      for (let i = 0; i < 5; i++) {
        const result = generateLottoNumbers(bonusToggle.checked);
        const row = renderResultRow(result);
        resultsContainer.appendChild(row);
      }

      drawBtn.disabled = false;
    }, 2000);
  });
});
