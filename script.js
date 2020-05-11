// css class for different card image
const CARD_TECHS = [
    'html5',
    'css3',
    'js',
    'sass',
    'nodejs',
    'react',
    'linkedin',
    'heroku',
    'github',
    'aws'
];

// only list out some of the properties,
// add more when needed
const game = {
    score: 0,
    level: 1,
    timer: 60,
    timerDisplay: null,
    scoreDisplay: null,
    levelDisplay: null,
    timerInterval: null,
    startButton: null,
    // and much more
    gameBoardDisplay: null,
    isGamePlaying: false,
    userSelect1: null,
    remainedCard: 0
};

setGame();

/*******************************************
/     game process
/******************************************/
function setGame() {
    // register any element in your game object
    game.gameBoardDisplay = document.querySelector('.game-board');
    game.timerDisplay = document.querySelector('.game-timer__bar');
    game.scoreDisplay = document.querySelector('.game-stats__score--value');
    game.levelDisplay = document.querySelector('.game-stats__level--value');
    game.startButton = document.querySelector('.game-stats__button');
    game.remainedCard = 4;
    bindStartButton();
    bindCardClick()
    selectCardIndex();
}

function selectCardIndex() {
    const cardNum = Math.pow(2 * game.level, 2);
    let halfCardIndex = [], cardIndex;

    // Random generate half of cards index
    for (let i = 0; i < cardNum / 2; i++) {
        let randNum = Math.floor(Math.random() * 9);
        //  level 1 & level 2: cards must be different.
        if (game.level !== 3) {
            while (halfCardIndex.includes(randNum)) {
                randNum = Math.floor(Math.random() * 9);
            }
        }
        halfCardIndex.push(randNum);
    }

    // shuffle the cardIndex using Durstenfeld shuffle
    cardIndex = halfCardIndex.concat(halfCardIndex);
    for (let i = cardIndex.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = cardIndex[i];
        cardIndex[i] = cardIndex[j];
        cardIndex[j] = temp;
    }
    return cardIndex;
}

function createCardBoard() {
    // Remove the description and set grid template
    if (game.gameBoardDisplay.querySelector('.game-instruction')) {
        game.gameBoardDisplay.removeChild(game.gameBoardDisplay.querySelector('.game-instruction'));
    }
    // let description = game.gameBoardDisplay.querySelector(".game-instruction");
    // game.gameBoardDisplay.removeChild(description);
    game.gameBoardDisplay.style.cssText = 'grid-template-columns:' + 'auto '.repeat(2 * game.level);

    //add the card into gameBoard
    const cardIndex = selectCardIndex();
    let cardNum = Math.pow(2 * game.level, 2);
    for (let i = 0; i < cardNum; i++) {
        cardBoard = document.createElement('div');
        cardBoard.className = 'card ' + CARD_TECHS[cardIndex[i]];
        game.gameBoardDisplay.appendChild(cardBoard);

        cardFront = document.createElement('div');
        cardFront.className = 'card__face card__face--front';
        cardBoard.appendChild(cardFront);

        cardBack = document.createElement('div');
        cardBack.className = 'card__face card__face--back';
        cardBoard.appendChild(cardBack);
    }
}

function startGame() {
    game.isGamePlaying = true;
    game.startButton.innerHTML = 'End Game';
    game.levelDisplay.innerHTML = game.level;
    game.timerInterval = setInterval(updateTimerDisplay, 1000);
    createCardBoard();
}

function handleCardFlip(e) {
    let clickedCard = e.target.parentNode;
    // add card-flip class and initialise first select 
    if (game.isGamePlaying &&
        clickedCard.classList.contains('card')) {
        clickedCard.classList.add('card--flipped');
        if (!game.userSelect1) {
            game.userSelect1 = clickedCard.classList;
            return;
        }
    }

    // handle match and unmatch
    if (game.userSelect1[1] === clickedCard.classList[1]) {
        game.userSelect1.remove('card__face--front');
        clickedCard.classList.remove('card__face--front');
        game.userSelect1 = null;
        game.remainedCard -= 2;
        game.score += Math.pow(game.level, 2) * game.timer;
        updateScore();
    } else {
        unBindCardClick();
        setTimeout(() => {
            game.userSelect1.remove('card--flipped');
            clickedCard.classList.remove('card--flipped');
            game.userSelect1 = null;
            bindCardClick();
        }, 1500);
    }

    // handle next level
    if (game.remainedCard === 0) {
        setTimeout(() => {
            nextLevel();
        }, 1500);
    }
}

function nextLevel() {
    game.level++;
    game.remainedCard = Math.pow(2 * game.level, 2);
    // remove the game board, restart the time 
    while (game.gameBoardDisplay.firstChild) {
        game.gameBoardDisplay.removeChild(game.gameBoardDisplay.firstChild);
    }
    clearInterval(game.timerInterval);
    game.timer = game.level * 60;
    startGame();
}

function handleGameOver() {
    game.isGamePlaying = false;
    game.startButton.innerHTML = 'New Game';
    clearInterval(game.timerInterval);
    alert(`Game over, your score is ${game.score}`);
}

/*******************************************
/     UI update
/******************************************/
function updateScore() {
    game.scoreDisplay.innerHTML = game.score;
}

function updateTimerDisplay() {
    game.timer--;
    game.timerDisplay.innerHTML = `${game.timer}s`;
    if (game.timer == 0) {
        handleGameOver();
    }
}
/*******************************************
/     bindings
/******************************************/
function bindStartButton() {
    game.startButton.addEventListener('click', () => {
        game.isGamePlaying ? handleGameOver() : startGame();
    }, false);
}

function unBindCardClick(card) {
    game.gameBoardDisplay.removeEventListener('click', handleCardFlip, false);
}

function bindCardClick() {
    game.gameBoardDisplay.addEventListener('click', handleCardFlip, false);
}