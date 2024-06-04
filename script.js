const play = document.getElementById("playButton");
const reset = document.getElementById("resetButton");
const metrics = document.querySelector(".playerMetrics");
const difficultyDrop = document.querySelector(".difficulty");
const gridDrop = document.querySelector(".grid");
const gameMetrics = document.querySelector(".gameMetrics");
const modal = document.getElementById("modal");
const audio = new Audio();
audio.src = "assets/click.wav";
let timerInterval;
let startTime;
let elapsedTime = 0;
let isTimerRunning = false;
let open = false;
let completed = 0;
let moves = 0;
let minutes, seconds;
let span = document.getElementsByClassName("close")[0];
span.onclick = function () {
  modal.style.display = "none";
};
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

function startTimer() {
  startTime = Date.now() - elapsedTime;
  timerInterval = setInterval(updateTimer, 100);
  isTimerRunning = true;
}
function displayTimer(time) {
  minutes = Math.floor(time / 60000);
  seconds = ((time % 60000) / 1000).toFixed(2);
  if (seconds < 10) {
    document.getElementById("timer").innerText = `${minutes}:0${seconds}`;
  } else {
    document.getElementById("timer").innerText = `${minutes}:${seconds}`;
  }
}
function updateTimer() {
  const currentTime = Date.now();
  elapsedTime = currentTime - startTime;
  displayTimer(elapsedTime);
}
function stopTimer() {
  clearInterval(timerInterval);
  isTimerRunning = false;
}
document.getElementById("playButton").addEventListener("click", function () {
  if (!isTimerRunning) {
    startTimer();
  }
  const difficulty = document.getElementById("dropdown1").value;
  const gridSize = document.getElementById("dropdown2").value;
  if (difficulty === "" || gridSize === "") {
    alert("Please select Difficulty and Grid Size");
    return;
  }
  const diff = difficulty === "easy" ? 4 : 2;
  metrics.classList.remove("hidden");
  difficultyDrop.classList.add("hidden1");
  gridDrop.classList.add("hidden1");
  gameMetrics.classList.add("hidden1");
  play.classList.add("hidden1");
  play.disabled = true;
  reset.classList.remove("hidden1");
  reset.disabled = false;
  initializeGame(gridSize, diff);
});

document.getElementById("resetButton").addEventListener("click", function () {
  location.reload(true);
});

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[j], array[i]] = [array[i], array[j]];
  }
  return array;
}
function handleClick(element, grid) {
  audio.play();
  if (open == false) {
    element.classList.add("flipped");
    card1_id = parseInt(element.getAttribute("data-id"));
    pos1 = element.getAttribute("pos");
  } else if (open == true) {
    pos2 = element.getAttribute("pos");
    if (pos1 === pos2) {
      return;
    }
    element.classList.add("flipped");
    setTimeout(() => {
      card2_id = parseInt(element.getAttribute("data-id"));
      if (card1_id === card2_id) {
        const cardInner10 = document.querySelectorAll(
          `.card__inner_${grid}[data-id="${card1_id}"] `
        );
        cardInner10.forEach((cardInner) => {
          if (
            cardInner.classList.contains("flipped") &&
            cardInner.classList.contains("active")
          ) {
            cardInner.classList.remove("active");
          }
        });
        const cardInner20 = document.querySelectorAll(
          `.card__inner_${grid}[data-id="${card2_id}"]`
        );
        cardInner20.forEach((cardInner) => {
          if (
            cardInner.classList.contains("flipped") &&
            cardInner.classList.contains("active")
          ) {
            cardInner.classList.remove("active");
          }
        });

        completed++;

        if (completed == (grid * grid) / 2) {
          stopTimer();
          const score = document.querySelector(".modal-content");
          const min = parseInt(minutes);
          const sec = parseInt(seconds);
          const total = 10000 - moves * (min * 60 + sec);
          const html = `<p>Your score was ${total > 0 ? total : 0}</p>`;
          score.insertAdjacentHTML("beforeend", html);
          modal.style.display = "block";
        }
      } else {
        const cardInner1 = document.querySelectorAll(
          `.card__inner_${grid}[data-id="${card1_id}"] `
        );
        cardInner1.forEach((cardInner) => {
          if (
            cardInner.classList.contains("flipped") &&
            cardInner.classList.contains("active")
          ) {
            cardInner.classList.remove("flipped");
          }
        });
        const cardInner2 = document.querySelectorAll(
          `.card__inner_${grid}[data-id="${card2_id}"]`
        );
        cardInner2.forEach((cardInner) => {
          if (
            cardInner.classList.contains("flipped") &&
            cardInner.classList.contains("active")
          ) {
            cardInner.classList.remove("flipped");
          }
        });
      }
      card1_id = 0;
      card2_id = 0;
    }, 500);
  }
  console.log(open);
  open = !open;
  if (open == false) {
    moves++;
    document.getElementById("playerMoves").innerText = `${moves}`;
  }
}

function initializeGame(grid, diff) {
  const images = document.querySelector(".container");

  const cards = [];
  const totalCards = grid * grid;
  for (let i = 0; i < totalCards; i++) {
    cards.push(i);
  }
  const shuffledcards = shuffle(cards);
  let variation = 1;
  if (diff == 4) {
    variation = Math.floor(Math.random() * 8 + 1);
  }
  for (let index = 0; index < totalCards; index++) {
    const html = `<div class="card_${grid}" >
    <div class="card__inner_${grid} clickcard active" data-id="${
      Math.floor(shuffledcards[index] / diff) + variation
    }" pos="${index}">
      <div class="front face"></div>
      <div class="back face" style="background: url(assets/${
        Math.floor(shuffledcards[index] / diff) + variation
      }.png); background-size:contain"></div>
    </div>
  </div>`;
    images.insertAdjacentHTML("beforeend", html);
  }
  document.querySelectorAll(".clickcard").forEach(function (element) {
    element.addEventListener("click", function () {
      handleClick(element, grid);
    });
  });
}
