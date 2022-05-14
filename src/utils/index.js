import dictionary from '../word-src/dictonary.json';
import targetWords from '../word-src/words.json';

const WORD_LENGTH = 5;
const DANCE_ANIMATION_DURATION = 500;
const FLIP_ANIMATION_DURATION = 500;
const offsetFromDate = new Date(2022, 0, 1);
const msOffset = Date.now() - offsetFromDate;
const dayOffset = msOffset / 1000 / 60 / 60 / 24;

const targetWord = targetWords[Math.floor(dayOffset)];

const showAlert = (message, duration = 1000) => {
  const alert = document.createElement("div");
  const alertContainer = document.querySelector("[data-alert-container]");

  alert.textContent = message;
  alert.classList.add("alert");
  alertContainer.prepend(alert);
  if (duration == null) {
    return;
  }

  setTimeout(() => {
    alert.classList.add("hide")
    alert.addEventListener("transitionend", () => {
      alert.remove();
    });
  }, duration);
}

const shakeTiles = (tiles) => {
  tiles.forEach(tile => {
    tile.classList.add("shake");
    tile.addEventListener(
      "animationend",
      () => {
        tile.classList.remove("shake");
      },
      { once: true }
    )
  })
}

const danceTiles = (tiles) => {
  tiles.forEach((tile, index) => {
    setTimeout(() => {
      tile.classList.add("dance");
      tile.addEventListener(
        "animationend",
        () => {
          tile.classList.remove("dance");
        },
        { once: true }
      )
    }, (index * DANCE_ANIMATION_DURATION) / 5)
  })
}

const stopInteraction = () => {
    document.removeEventListener("click", handleKeyDown);
    document.removeEventListener("keydown", handleMouseClick);

    // document.addEventListener('keydown', handleKeyDown);
    // document.addEventListener('click', handleMouseClick);
    console.log('🚀 stopInteraction 🚀');
}

const checkWinLose = (guess, tiles) => {
  if (guess === targetWord) {
    showAlert("You Win!", 5000);
    danceTiles(tiles);
    stopInteraction();

    return;
  }

  const guessGrid = document.querySelector("[data-guess-grid]");
  const remainingTiles = guessGrid.querySelectorAll(":not([data-letter])");

  if (remainingTiles.length === 0) {
    showAlert(targetWord.toUpperCase(), null);
    stopInteraction();
  }
}

const flipTile = (tile, index, array, guess) => {
  const letter = tile.dataset.letter;
  const keyboard = document.querySelector("[data-keyboard]");
  const key = keyboard.querySelector(`[data-key="${letter}"i]`);

  setTimeout(() => {
    tile.classList.add("flip")
  }, (index * FLIP_ANIMATION_DURATION) / 2)

  tile.addEventListener(
    "transitionend",
    () => {
      tile.classList.remove("flip")
      if (targetWord[index] === letter) {
        tile.dataset.state = "correct"
        key.classList.add("correct")
      } else if (targetWord.includes(letter)) {
        tile.dataset.state = "wrong-location"
        key.classList.add("wrong-location")
      } else {
        tile.dataset.state = "wrong"
        key.classList.add("wrong")
      }

      if (index === array.length - 1) {
        tile.addEventListener(
          "transitionend",
          () => {
            startInteraction();
            // document.addEventListener('keydown', handleKeyDown);
            // document.addEventListener('click', handleMouseClick);
            checkWinLose(guess, array);
          },
          { once: true }
        )
      }
    },
    { once: true }
  )
};

const submitGuess = () => {
  console.log('🚀 SUBMIT: Enter Pressed: 🚀');

  const activeTiles = [...getActiveTiles()];

  if (activeTiles.length !== WORD_LENGTH) {
    showAlert("Not enough letters");
    shakeTiles(activeTiles);

    return;
  }

  const guess = activeTiles.reduce((word, tile) => {
    return word + tile.dataset.letter
  }, "");

  if (!dictionary.includes(guess)) {
    showAlert(`${guess} is not a word.`);
    shakeTiles(activeTiles);
    return;
  }

  console.log('🚀 guess 🚀', guess);
  stopInteraction();

  activeTiles.forEach((...params) => flipTile(...params, guess));
}

const getActiveTiles = () => {
  const guessGrid = document.querySelector("[data-guess-grid]");
  return guessGrid.querySelectorAll('[data-state="active"]')
}

const handleDelete = () => {
  // console.log('🚀 Delete Pressed: 🚀', key);
  const guessGrid = document.querySelector("[data-guess-grid]");

  const activeTiles = getActiveTiles(guessGrid);
  const lastTile = activeTiles[activeTiles.length - 1];

  if (lastTile == null) {
    return;
  };

  lastTile.textContent = "";
  delete lastTile.dataset.state;
  delete lastTile.dataset.letter;
}

// Handle letters from click or typing.
const handleLetters = (key) => {
  const guessGrid = document.querySelector("[data-guess-grid]");
  const activeTiles = getActiveTiles(guessGrid);

  if (activeTiles.length >= WORD_LENGTH) {
    return;
  }

  const nextTile = guessGrid.querySelector(":not([data-letter])");

  nextTile.dataset.letter = key.toLowerCase()
  nextTile.textContent = key
  nextTile.dataset.state = "active"
}

// Mouse Click on letters.
export const handleMouseClick = (e) => {
  const { target } = e;

  if (target.matches("[data-key]")) {
    handleLetters(target.dataset.key)
    return
  }

  if (target.matches("[data-enter]")) {
    submitGuess();
    return;
  }

  if (target.matches("[data-delete]")) {
    handleDelete();
    return;
  }
}

// Keyboard typing.
export const handleKeyDown = (e) => {
  const { key } = e;
  if (key === 'Enter') {
    submitGuess();
    return;
  }
  if (key === 'Backspace' || key === 'Delete') {
    handleDelete();
    return;
  }

  // Only letters.
  if (e.key.match(/^[a-z]$/)) {
    console.log('🚀 key ----> 🚀', key);

    handleLetters(key);
    return;
  }
}

export const startInteraction = () => {
  document.addEventListener('keydown', handleKeyDown);
  document.addEventListener('click', handleMouseClick);
  // window.addEventListener("click", handleKeyDown)
  // window.addEventListener("keydown", handleMouseClick)
}
