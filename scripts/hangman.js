document.addEventListener("DOMContentLoaded", () => {
  let wordData, selectedWord, hint, correctGuesses, incorrectGuesses;
  const maxIncorrect = 6;

  const hangmanImage = document.getElementById("hangman");
  const wordDisplay = document.getElementById("word-display");
  const hintDisplay = document.getElementById("hint");
  const incorrectCount = document.getElementById("incorrect-count");
  const keyboard = document.getElementById("keyboard");
  const gameOverScreen = document.getElementById("game-over");
  const gameOverText = document.getElementById("game-over-text");
  const gameOverImage = document.getElementById("game-over-image");
  const playAgainButton = document.getElementById("play-again");

  function fetchWords() {
    fetch("./data/hangman.json")
      .then((response) => response.json())
      .then((data) => {
        wordData = data.words;
        startNewGame();
      })
      .catch((error) => console.error("Error loading words:", error));
  }

  function startNewGame() {
    gameOverScreen.classList.add("hidden");
    incorrectGuesses = 0;
    correctGuesses = [];

    let randomIndex = Math.floor(Math.random() * wordData.length);
    selectedWord = wordData[randomIndex].word;
    hint = wordData[randomIndex].hint;

    hintDisplay.textContent = hint;
    wordDisplay.innerHTML = "_ ".repeat(selectedWord.length).trim();
    incorrectCount.textContent = incorrectGuesses;
    hangmanImage.src = "./images/step0.png";

    keyboard.innerHTML = "";
    createKeyboard();
  }

  function createKeyboard() {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    letters.forEach((letter) => {
      let button = document.createElement("button");
      button.textContent = letter;
      button.addEventListener("click", () => guessLetter(letter, button));
      keyboard.appendChild(button);
    });
  }

  function guessLetter(letter, button) {
    button.disabled = true;
    let lowerLetter = letter.toLowerCase();

    if (selectedWord.includes(lowerLetter)) {
      correctGuesses.push(lowerLetter);
      updateWordDisplay();
    } else {
      incorrectGuesses++;
      incorrectCount.textContent = incorrectGuesses;
      if (incorrectGuesses <= maxIncorrect) {
        hangmanImage.src = `./images/step${incorrectGuesses}.png`;
      } else {
        hangmanImage.src = `./images/step7.png`;
      }
    }

    checkGameStatus();
  }

  function updateWordDisplay() {
    let displayWord = selectedWord
      .split("")
      .map((char) => (correctGuesses.includes(char) ? char : "_"))
      .join(" ");
    wordDisplay.textContent = displayWord;
  }

  function checkGameStatus() {
    if (
      incorrectGuesses <= maxIncorrect &&
      !wordDisplay.textContent.includes("_")
    ) {
      endGame(true);
    } else if (incorrectGuesses > maxIncorrect) {
      endGame(false);
    }
  }

  function endGame(win) {
    gameOverScreen.classList.remove("hidden");

    if (win) {
      gameOverImage.src = "./images/win.png";
      hangmanImage.src = "./images/beam.png";
    } else {
      gameOverImage.src = "./images/lose.png";
    }

    gameOverText.innerHTML = win
      ? `YOU WON!<br>Word was '${selectedWord}'`
      : `You lost.<br>Word was '${selectedWord}'`;
  }

  playAgainButton.addEventListener("click", startNewGame);

  fetchWords();
});
