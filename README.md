<div align="center">

# ✦ Tic·Tac·Toe Glass ✦

### A glassmorphic take on the oldest game in the book — an unbeatable AI, local co-op, five themes, and a board that actually feels good to play on.

[![Made with](https://img.shields.io/badge/made%20with-HTML%20%C2%B7%20CSS%20%C2%B7%20JS-b98cff?style=for-the-badge)](#)
[![Dependencies](https://img.shields.io/badge/dependencies-none-7ee8fa?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-ff8cd9?style=for-the-badge)](#-license)

<br>

<img src="https://img.shields.io/badge/AI-Minimax%20Powered-b98cff?style=flat-square" />
<img src="https://img.shields.io/badge/Themes-5-ff8cd9?style=flat-square" />
<img src="https://img.shields.io/badge/Difficulty-3%20Levels-7ee8fa?style=flat-square" />
<img src="https://img.shields.io/badge/Multiplayer-Local%202P-c9f27e?style=flat-square" />

</div>

<br>

> *You vs. the glass — or you vs. a friend on the same screen. Either way, every mark lands with a little pop, and every win draws its own line of light through the board.*

<br>

## ✦ Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Themes](#-themes)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [How the AI Works](#-how-the-ai-works)
- [Part of a Series](#-part-of-a-series)
- [License](#-license)

<br>

## ✦ Overview

**Tic·Tac·Toe — Glass** takes the simplest game there is and gives it a soft, frosted-glass finish — translucent panels, ambient drifting light, and animations tuned so every move feels intentional. Underneath the glass sits a real **minimax search**, so the "Insane" difficulty isn't just fast — it's mathematically unbeatable. Drop the difficulty down and the AI starts making real mistakes you can exploit, or skip the AI entirely and hand the device to a friend for local two-player.

No installs, no build tools, no frameworks — open the file and play.

<br>

## ✦ Features

| | |
|---|---|
| 🤖 **Unbeatable AI** | Full minimax search — at "Insane" difficulty, the best you can ever force is a draw |
| 🎚️ **3 difficulty levels** | Easy, Medium, and Insane — tuned by how often the AI plays optimally vs. randomly |
| 👥 **vs Player mode** | Local 2-player on one device, turns alternate automatically |
| 🎨 **5 color themes** | Nebula, Ocean, Sunset, Forest, Mono — swap instantly, no reload |
| ✨ **Considered animations** | Staggered board entrance, springy mark pop-ins, an animated win-line that sweeps through the winning row in real time, score bump effects |
| 📱 **Fully responsive** | Comfortable on desktop, tablet, and mobile |
| 🪶 **Zero dependencies** | Pure HTML, CSS, and vanilla JavaScript — nothing to install |

<br>

## ✦ Themes

<div align="center">

| Nebula | Ocean | Sunset | Forest | Mono |
|:---:|:---:|:---:|:---:|:---:|
| 🟣 | 🔵 | 🟠 | 🟢 | ⚪ |
| violet · pink · cyan | teal · sky · mint | amber · gold · rose | green · lime · jade | grayscale |

</div>

<br>

## ✦ Tech Stack

```
HTML5      →  semantic structure
CSS3       →  glassmorphism (backdrop-filter, layered gradients), custom-property theming, keyframe animation
JavaScript →  game state, minimax AI, DOM rendering — no libraries, no build step
```

<br>

## ✦ Project Structure

```
tic-tac-toe/
├── index.html     → structure & markup
├── style.css      → glass styling, 5 themes, all animations
└── script.js      → game logic, minimax AI, win-line rendering
```

<br>

## ✦ Getting Started

No dependencies, no build process — just clone and open.

```bash
git clone https://github.com/heyfaraninam/Tic-Tac-Toe.git
cd Tic-Tac-Toe
open index.html
```

That's it. Works in any modern browser.

<br>

## ✦ How the AI Works

The AI evaluates the game tree using [**minimax**](https://en.wikipedia.org/wiki/Minimax): for every possible move, it recursively simulates the rest of the game assuming both players play perfectly, then picks the move that guarantees its best possible outcome.

```
minimax(board, isMaximizing):
    if board has a winner → return score
    if board is full     → return 0 (draw)

    for each empty cell:
        simulate move
        score = minimax(new board, !isMaximizing)
        undo move
        track the best score found

    return best score
```

- **Insane** always plays the minimax-optimal move → unbeatable.
- **Medium** plays optimally most of the time, with a chance of a random move.
- **Easy** plays randomly most of the time, with an occasional optimal move — so it still puts up a fight, but you can win.

<br>

## ✦ Part of a Series

This is one of ten apps in a personal series exploring the same idea — **pure HTML/CSS/JS, no frameworks, no dependencies** — dressed in a consistent glassmorphic look. Other entries include a Calculator, Weather app, Calendar, QR Code Generator, and Sketch Pad.

<br>

## ✦ License

MIT — do whatever you'd like with it.

<div align="center">
<br>

*Crafted with care · pure HTML · CSS · JS*

</div>
