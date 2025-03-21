$(document).ready(function () {
  let words = [];
  let selectedWord = "";
  let hint = "";
  let guessedLetters = [];
  let wrongGuesses = 0;
  const maxWrongGuesses = 7;

  function loadWords() {
    fetch("./data/hangman.json")
      .then((response) => response.json())
      .then((data) => {
        words = data.words;
        startGame();
      });
  }

  function startGame() {
    $("#game-result").hide();
    guessedLetters = [];
    wrongGuesses = 0;
    $("#wrong-count").text(wrongGuesses);
    $("#hangman-stage").attr("src", `./images/step${wrongGuesses}.png`);
    $("#keyboard").empty();

    let randomIndex = Math.floor(Math.random() * words.length);
    selectedWord = words[randomIndex].word.toUpperCase();
    hint = words[randomIndex].hint;
    $("#hint").text(hint);

    displayWord();
    createKeyboard();
  }

  function displayWord() {
    let display = "";
    for (let letter of selectedWord) {
      if (guessedLetters.includes(letter)) {
        display += `<span class='letter fade'>${letter}</span> `;
      } else {
        display += "_ ";
      }
    }
    $("#word-display").html(display);
  }

  function createKeyboard() {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (let letter of alphabet) {
      let button = $("<button>").text(letter).addClass("letter-btn");
      button.click(() => guessLetter(letter, button));
      $("#keyboard").append(button);
    }
  }

  function guessLetter(letter, button) {
    $(button).prop("disabled", true);

    if (selectedWord.includes(letter)) {
      guessedLetters.push(letter);
      displayWord();
      $(".fade").hide().fadeIn(500); // Fade effect on correct guess
    } else {
      wrongGuesses++;
      $("#wrong-count").text(wrongGuesses);
      $("#hangman-stage").fadeOut(300, function () {
        $(this).attr("src", `./images/step${wrongGuesses}.png`).fadeIn(300);
      });
    }

    checkGameStatus();
  }

  function checkGameStatus() {
    if (!$("#word-display").text().includes("_")) {
      showGameResult("win");
    } else if (wrongGuesses >= maxWrongGuesses) {
      showGameResult("loss");
    }
  }

  function showGameResult(status) {
    $("#game-container").fadeOut(500, function () {
      $("#game-result").fadeIn(800);
      if (status === "win") {
        $("#result-text").text(
          `YOU WON! Word was '${selectedWord.toLowerCase()}'`
        );
        $("#win-img").fadeIn(500);
        $("#loss-img").hide();
      } else {
        $("#result-text").text(
          `You lost. Word was '${selectedWord.toLowerCase()}'`
        );
        $("#loss-img").fadeIn(500);
        $("#win-img").hide();
      }
    });
  }

  $("#play-again").click(function () {
    $("#game-result").fadeOut(500, function () {
      $("#game-container").fadeIn(800);
      startGame();
    });
  });

  loadWords();
});
