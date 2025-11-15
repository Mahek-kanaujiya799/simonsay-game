const buttonColors = ["red", "blue", "green", "yellow"];
let gamePattern = [];
let userClickedPattern = [];

let level = 0;
let started = false;
let highScore = localStorage.getItem("simonHighScore") || 0;

const title = document.getElementById("level-title");
const scoreDisplay = document.getElementById("score");
scoreDisplay.textContent = "High Score: " + highScore;

const startBtn = document.getElementById("start-btn");

// Function to play sound
function playSound(name) {
  const colorIndex = buttonColors.indexOf(name) + 1;
  const audio = new Audio(
    `https://s3.amazonaws.com/freecodecamp/simonSound${colorIndex}.mp3`
  );
  audio.play();
}

// Handle button presses
document.querySelectorAll(".btn").forEach((button) => {
  button.addEventListener("click", function () {
    if (!started) return;

    const userColor = this.id;
    userClickedPattern.push(userColor);
    playSound(userColor);
    animatePress(userColor);

    checkAnswer(userClickedPattern.length - 1);
  });
});

// Start the game on button click
startBtn.addEventListener("click", () => {
  if (!started) {
    startGame();
  }
});

function startGame() {
  level = 0;
  gamePattern = [];
  started = true;
  title.textContent = "Level " + level;
  nextSequence();
  startBtn.disabled = true;
  startBtn.style.opacity = 0.6;
}

// Generate next step
function nextSequence() {
  userClickedPattern = [];
  level++;
  title.textContent = "Level " + level;

  const randomColor =
    buttonColors[Math.floor(Math.random() * buttonColors.length)];
  gamePattern.push(randomColor);

  // Animate pattern
  setTimeout(() => {
    const btn = document.getElementById(randomColor);
    animatePress(randomColor);
    playSound(randomColor);
  }, 500);
}

// Animate button press
function animatePress(color) {
  const btn = document.getElementById(color);
  btn.classList.add("pressed");
  setTimeout(() => btn.classList.remove("pressed"), 200);
}

// Check user input
function checkAnswer(currentLevel) {
  if (gamePattern[currentLevel] === userClickedPattern[currentLevel]) {
    if (userClickedPattern.length === gamePattern.length) {
      setTimeout(() => nextSequence(), 1000);
    }
  } else {
    gameOver();
  }
}

// Game over sequence
function gameOver() {
  playSound("wrong");
  document.body.classList.add("game-over");
  title.textContent = "Game Over! You reached Level " + level;

  // Update high score
  if (level - 1 > highScore) {
    highScore = level - 1;
    localStorage.setItem("simonHighScore", highScore);
  }
  scoreDisplay.textContent = "High Score: " + highScore;

  setTimeout(() => {
    document.body.classList.remove("game-over");
  }, 300);

  // Reset
  started = false;
  startBtn.textContent = "Restart";
  startBtn.disabled = false;
  startBtn.style.opacity = 1;
}
