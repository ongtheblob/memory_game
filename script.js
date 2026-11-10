
// ========================================
// TWO PLAYER MEMORY MATCHING GAME
// ========================================

// Game settings
const symbols = [
    "🍎", "🍌", "🍇", "🍉",
    "🍓", "🍒", "🍍", "🥝"
];

let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let currentPlayer = 1;
let scores = [0, 0];
let locked = false;
let gameFinished = false;

// HTML elements
const gameBoard = document.getElementById("gameBoard");
const score1 = document.getElementById("score1");
const score2 = document.getElementById("score2");
const player1 = document.getElementById("player1");
const player2 = document.getElementById("player2");

const turnIndicator = document.getElementById("turnIndicator");
const gameMessage = document.getElementById("gameMessage");

const winnerMessage = document.getElementById("winnerMessage");
const winnerText = document.getElementById("winnerText");
const finalScore = document.getElementById("finalScore");

const restartButton = document.getElementById("restartButton");
const playAgainButton = document.getElementById("playAgainButton");

// ========================================
// START NEW GAME
// ========================================

function startGame() {

    cards = [...symbols, ...symbols];

    // Shuffle cards randomly
    cards.sort(() => Math.random() - 0.5);

    flippedCards = [];
    matchedPairs = 0;
    currentPlayer = 1;
    scores = [0, 0];

    locked = false;
    gameFinished = false;

    score1.textContent = "0";
    score2.textContent = "0";

    winnerMessage.hidden = true;

    gameMessage.textContent =
        "Flip two cards to find a matching pair!";

    gameBoard.innerHTML = "";

    updateTurn();

    // Create cards
    cards.forEach((symbol, index) => {

        const card = document.createElement("button");

        card.classList.add("card");
        card.type = "button";
        card.textContent = "❓";

        card.dataset.symbol = symbol;
        card.dataset.index = index;

        card.setAttribute("aria-label", "Hidden card");

        card.addEventListener("click", () => {
            flipCard(card);
        });

        gameBoard.appendChild(card);

    });
}

// ========================================
// FLIP CARD
// ========================================

function flipCard(card) {

    if (locked) return;
    if (gameFinished) return;
    if (card.classList.contains("flipped")) return;
    if (card.classList.contains("matched")) return;

    // Reveal card
    card.textContent = card.dataset.symbol;
    card.classList.add("flipped");
    card.setAttribute("aria-label", card.dataset.symbol);

    flippedCards.push(card);

    // Check when two cards are flipped
    if (flippedCards.length === 2) {
        checkMatch();
    }
}

// ========================================
// CHECK MATCHING CARDS
// ========================================

function checkMatch() {

    const [card1, card2] = flippedCards;

    if (card1.dataset.symbol === card2.dataset.symbol) {

        // Successful match
        card1.classList.add("matched");
        card2.classList.add("matched");

        card1.disabled = true;
        card2.disabled = true;

        matchedPairs++;

        // Give point to current player
        scores[currentPlayer - 1]++;

        updateScores();

        flippedCards = [];

        gameMessage.textContent =
            `Great job! Player ${currentPlayer} found a pair!`;

        // Check if game is finished
        if (matchedPairs === symbols.length) {
            endGame();
        }

    } else {

        // No match
        locked = true;

        gameMessage.textContent =
            "No match! Switching players...";

        setTimeout(() => {

            card1.textContent = "❓";
            card2.textContent = "❓";

            card1.classList.remove("flipped");
            card2.classList.remove("flipped");

            card1.setAttribute("aria-label", "Hidden card");
            card2.setAttribute("aria-label", "Hidden card");

            flippedCards = [];

            // Change player
            currentPlayer = currentPlayer === 1 ? 2 : 1;

            locked = false;

            updateTurn();

            gameMessage.textContent =
                "Find the matching pair!";

        }, 1000);

    }
}

// ========================================
// UPDATE SCORES
// ========================================

function updateScores() {

    score1.textContent = scores[0];
    score2.textContent = scores[1];

}

// ========================================
// UPDATE PLAYER TURN
// ========================================

function updateTurn() {

    turnIndicator.textContent =
        `Player ${currentPlayer}'s Turn`;

    player1.classList.toggle(
        "active",
        currentPlayer === 1
    );

    player2.classList.toggle(
        "active",
        currentPlayer === 2
    );

}

// ========================================
// END GAME
// ========================================

function endGame() {

    gameFinished = true;

    winnerMessage.hidden = false;

    if (scores[0] > scores[1]) {

        winnerText.textContent = "🏆 Player 1 Wins!";

    } else if (scores[1] > scores[0]) {

        winnerText.textContent = "🏆 Player 2 Wins!";

    } else {

        winnerText.textContent = "🤝 It's a Tie!";

    }

    finalScore.textContent =
        `Player 1: ${scores[0]} pairs | Player 2: ${scores[1]} pairs`;

    turnIndicator.textContent = "Game Over!";

    gameMessage.textContent =
        "Well played! Thanks for playing.";

    player1.classList.remove("active");
    player2.classList.remove("active");

}

// ========================================
// RESTART GAME
// ========================================

restartButton.addEventListener("click", startGame);

playAgainButton.addEventListener("click", startGame);

// ========================================
// INITIALISE GAME
// ========================================

startGame();
