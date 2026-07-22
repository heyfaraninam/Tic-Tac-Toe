(function () {
  const boardEl = document.getElementById('board');
  const statusLine = document.getElementById('statusLine');
  const scoreXEl = document.getElementById('scoreX');
  const scoreOEl = document.getElementById('scoreO');
  const scoreDEl = document.getElementById('scoreD');
  const modeGroup = document.getElementById('modeGroup');
  const difficultyGroup = document.getElementById('difficultyGroup');
  const difficultyRow = document.getElementById('difficultyRow');
  const markGroup = document.getElementById('markGroup');
  const markRow = document.getElementById('markRow');
  const themeGroup = document.getElementById('themeGroup');

  const BOARD_GAP = 10; // must match .board { gap: 10px } in style.css

  let cells, board, humanMark, aiMark, difficulty, gameOver, locked, mode, currentTurn;
  let scores = { X: 0, O: 0, D: 0 };

  const WIN_LINES = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];

  mode = 'ai';
  humanMark = 'X';
  aiMark = 'O';
  difficulty = 'easy';

  function buildBoard() {
    boardEl.innerHTML = '';
    cells = [];
    for (let i = 0; i < 9; i++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.dataset.index = i;
      cell.style.animationDelay = (i * 0.04) + 's';
      cell.addEventListener('click', () => onCellClick(i));
      boardEl.appendChild(cell);
      cells.push(cell);
    }
    const winLine = document.createElement('div');
    winLine.className = 'win-line';
    winLine.id = 'winLine';
    boardEl.appendChild(winLine);

    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.id = 'overlay';
    overlay.innerHTML = `
      <div class="overlay-content">
        <h2 id="overlayTitle">Result</h2>
        <p id="overlaySub"></p>
        <button id="overlayBtn">Play Again</button>
      </div>
    `;
    boardEl.appendChild(overlay);
    document.getElementById('overlayBtn').addEventListener('click', newRound);
  }

  function newRound() {
    board = Array(9).fill(null);
    gameOver = false;
    locked = false;
    currentTurn = 'X';
    document.getElementById('overlay').classList.remove('show');
    const winLineEl = document.getElementById('winLine');
    winLineEl.classList.remove('show');
    winLineEl.style.animation = 'none';
    cells.forEach(c => {
      c.classList.remove('win-cell', 'filled', 'locked');
      c.innerHTML = '';
    });

    if (mode === 'pvp') {
      setStatus(turnLabel());
      return;
    }

    if (humanMark === 'X') {
      setStatus(`<span class="turn-x">Your</span> move`);
    } else {
      setStatus(`AI is thinking…`);
      locked = true;
      setTimeout(aiMove, 450);
    }
  }

  function turnLabel() {
    return currentTurn === 'X'
      ? `<span class="turn-x">X's</span> turn`
      : `<span class="turn-o">O's</span> turn`;
  }

  function setStatus(html) {
    statusLine.innerHTML = html;
  }

  function onCellClick(i) {
    if (gameOver || locked || board[i]) return;

    if (mode === 'pvp') {
      playMove(i, currentTurn);
      if (checkEnd()) return;
      currentTurn = currentTurn === 'X' ? 'O' : 'X';
      setStatus(turnLabel());
      return;
    }

    playMove(i, humanMark);
    if (checkEnd()) return;
    locked = true;
    setStatus(`AI is thinking…`);
    setTimeout(aiMove, 400);
  }

  function playMove(i, mark) {
    board[i] = mark;
    const el = cells[i];
    el.classList.add('filled');
    const span = document.createElement('span');
    span.className = 'mark ' + mark.toLowerCase() + ' enter';
    span.textContent = mark;
    el.innerHTML = '';
    el.appendChild(span);
  }

  function aiMove() {
    if (gameOver) return;
    let move;
    const empties = board.map((v, i) => v ? -1 : i).filter(i => i !== -1);

    // Random-move probability by difficulty. Insane never plays randomly.
    const randomChance = difficulty === 'easy' ? 0.7 : difficulty === 'medium' ? 0.35 : 0;

    if (Math.random() < randomChance) {
      move = empties[Math.floor(Math.random() * empties.length)];
    } else {
      move = bestMove();
    }

    playMove(move, aiMark);
    locked = false;
    checkEnd();
    if (!gameOver) setStatus(`<span class="turn-x">Your</span> move`);
  }

  function bestMove() {
    let bestScore = -Infinity;
    let move = null;
    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        board[i] = aiMark;
        const score = minimax(board, 0, false);
        board[i] = null;
        if (score > bestScore) {
          bestScore = score;
          move = i;
        }
      }
    }
    return move;
  }

  function minimax(b, depth, isMaximizing) {
    const winner = getWinner(b);
    if (winner === aiMark) return 10 - depth;
    if (winner === humanMark) return depth - 10;
    if (b.every(x => x)) return 0;

    if (isMaximizing) {
      let best = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (!b[i]) {
          b[i] = aiMark;
          best = Math.max(best, minimax(b, depth + 1, false));
          b[i] = null;
        }
      }
      return best;
    } else {
      let best = Infinity;
      for (let i = 0; i < 9; i++) {
        if (!b[i]) {
          b[i] = humanMark;
          best = Math.min(best, minimax(b, depth + 1, true));
          b[i] = null;
        }
      }
      return best;
    }
  }

  function getWinner(b) {
    for (const [a, c, d] of WIN_LINES) {
      if (b[a] && b[a] === b[c] && b[a] === b[d]) return b[a];
    }
    return null;
  }

  function getWinningLine(b) {
    for (const line of WIN_LINES) {
      const [a, c, d] = line;
      if (b[a] && b[a] === b[c] && b[a] === b[d]) return line;
    }
    return null;
  }

  function checkEnd() {
    const winner = getWinner(board);
    if (winner) {
      gameOver = true;
      const line = getWinningLine(board);
      line.forEach(i => cells[i].classList.add('win-cell'));
      drawWinLine(line);
      scores[winner]++;
      updateScores(winner);

      if (mode === 'pvp') {
        showOverlay(`${winner} Wins! ✦`, 'Nicely played.');
      } else {
        const isHuman = winner === humanMark;
        showOverlay(
          isHuman ? 'You Win! ✦' : 'AI Wins',
          isHuman ? 'Nicely played.' : 'The glass outsmarted you this time.'
        );
      }
      return true;
    }
    if (board.every(x => x)) {
      gameOver = true;
      scores.D++;
      updateScores('D');
      showOverlay('Draw', 'Perfectly balanced.');
      return true;
    }
    return false;
  }

  // Fixed alignment: compute cell centers from grid math (board width, 3
  // columns, fixed gap) instead of measuring each cell's DOM rect. Mixing
  // rects from two different elements can be off by sub-pixel rounding,
  // which is what made diagonal / edge lines look slightly skewed.
  function getCellCenter(index) {
    const boardRect = boardEl.getBoundingClientRect();
    const cellSize = (boardRect.width - BOARD_GAP * 2) / 3;
    const row = Math.floor(index / 3);
    const col = index % 3;
    return {
      x: col * (cellSize + BOARD_GAP) + cellSize / 2,
      y: row * (cellSize + BOARD_GAP) + cellSize / 2
    };
  }

  function drawWinLine(line) {
    const winLineEl = document.getElementById('winLine');
    const p1 = getCellCenter(line[0]);
    const p2 = getCellCenter(line[2]);

    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const length = Math.sqrt(dx * dx + dy * dy) + 28;
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);

    winLineEl.classList.remove('show');
    winLineEl.style.animation = 'none';
    winLineEl.style.width = length + 'px';
    winLineEl.style.left = (p1.x - 14) + 'px';
    winLineEl.style.top = (p1.y - 3) + 'px';
    winLineEl.style.setProperty('--line-angle', angle + 'deg');

    // force reflow so the animation restarts cleanly, then apply the
    // reveal animation (defined in CSS) which reads --line-angle in its
    // own keyframes so the rotation survives the animation.
    void winLineEl.offsetWidth;
    winLineEl.style.animation = '';
    requestAnimationFrame(() => {
      winLineEl.classList.add('show');
    });
  }

  function updateScores(justWon) {
    scoreXEl.textContent = scores.X;
    scoreOEl.textContent = scores.O;
    scoreDEl.textContent = scores.D;

    const boxes = document.querySelectorAll('.score-box');
    const target = justWon === 'X' ? boxes[0] : justWon === 'O' ? boxes[2] : boxes[1];
    if (target) {
      target.classList.remove('bump');
      void target.offsetWidth;
      target.classList.add('bump');
    }
  }

  function showOverlay(title, sub) {
    document.getElementById('overlayTitle').textContent = title;
    document.getElementById('overlaySub').textContent = sub;
    document.getElementById('overlay').classList.add('show');
  }

  function updateModeUI() {
    if (mode === 'pvp') {
      difficultyRow.classList.add('fade-out');
      markRow.classList.add('fade-out');
    } else {
      difficultyRow.classList.remove('fade-out');
      markRow.classList.remove('fade-out');
    }
  }

  modeGroup.addEventListener('click', (e) => {
    const btn = e.target.closest('.pill');
    if (!btn) return;
    modeGroup.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    mode = btn.dataset.mode;
    updateModeUI();
    newRound();
  });

  difficultyGroup.addEventListener('click', (e) => {
    const btn = e.target.closest('.pill');
    if (!btn) return;
    difficultyGroup.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    difficulty = btn.dataset.diff;
    newRound();
  });

  markGroup.addEventListener('click', (e) => {
    const btn = e.target.closest('.pill');
    if (!btn) return;
    markGroup.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    humanMark = btn.dataset.mark;
    aiMark = humanMark === 'X' ? 'O' : 'X';
    newRound();
  });

  themeGroup.addEventListener('click', (e) => {
    const swatch = e.target.closest('.swatch');
    if (!swatch) return;
    themeGroup.querySelectorAll('.swatch').forEach(s => s.classList.remove('active'));
    swatch.classList.add('active');
    document.body.dataset.theme = swatch.dataset.themeSwatch;
  });

  window.addEventListener('resize', () => {
    if (gameOver) {
      const line = getWinningLine(board);
      if (line) drawWinLine(line);
    }
  });

  buildBoard();
  newRound();
})();
