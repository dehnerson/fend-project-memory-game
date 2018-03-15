// To enhance game with more cards just add icons to this array, per icon 2 cards will be added!
const icons = ['diamond', 'anchor', 'bolt', 'bomb', 'leaf', 'bicycle', 'paper-plane-o', 'cube'];
const cards = [];

// Create 2 cards per icon
icons.forEach(function(icon) {
  cards.push(icon);
  cards.push(icon);
});

let container = document.querySelector('.container');
let moveCounterElement = document.querySelector('.score-panel .moves-counter');
let moveCounterDescrElement = document.querySelector('.score-panel .moves-descr');
let starsElement = document.querySelector('.score-panel .stars');
let timerMinElement = document.querySelector('.score-panel .timer-minutes');
let timerSecElement = document.querySelector('.score-panel .timer-seconds');
let timerInterval = null;
let matchCounter = 0;
let clickedCardElements = null;
let winningModalElement = document.querySelector('.modal');
let modalTimeMinElement = document.querySelector('.modal .timer-minutes');
let modalTimeSecElement = document.querySelector('.modal .timer-seconds');
let modalCounterElement = document.querySelector('.modal .moves-counter');
let modalCounterDescrElement = document.querySelector('.modal .moves-descr');
let modalStarsElement = document.querySelector('.modal .stars');

// Start a new game at page load
newGame();

document.querySelectorAll('.restart').forEach(function(each) {
  each.addEventListener('click', function(event) {
    newGame();
  });
});

winningModalElement.addEventListener('click', function(event) {
  winningModalElement.style.display = 'none';
});



function newGame() {
  shuffle(cards);

  clearTimer();
  resetMoveCounter();
  timerMinElement.textContent = '00';
  timerSecElement.textContent = '00';
  matchCounter = 0;
  clickedCardElements = [];

  showHiddenStars();

  let newDeckElement = document.createElement('ul');
  newDeckElement.className = 'deck';

  cards.forEach(function(card) {
    let newCardElement = document.createElement('li');
    newCardElement.className = 'card';

    let newIconElement = document.createElement('i');
    newIconElement.className = 'fa fa-' + card;

    newCardElement.appendChild(newIconElement);
    newDeckElement.appendChild(newCardElement);
  });

  let oldDeck = document.querySelector('.deck');
  if(oldDeck != null) {
    oldDeck.remove();
  }

  container.appendChild(newDeckElement);

  newDeckElement.addEventListener('click', function(event) {
    if (event.target.nodeName === 'LI') {
      startTimer();

      onCardClicked(event.target);
    }
  });
}

function startTimer() {
  if(timerInterval == null) {
    timerInterval = setInterval(updateTimer, 1000);
  }
}

function updateTimer() {
  if(parseInt(timerSecElement.textContent) === 59) {
    timerSecElement.textContent = '00';
    timerMinElement.textContent = ('0' + (parseInt(timerMinElement.textContent) + 1)).slice(-2);
  }
  else {
    timerSecElement.textContent = ('0' + (parseInt(timerSecElement.textContent) + 1)).slice(-2);
  }
}

function clearTimer() {
  if(timerInterval != null) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function onCardClicked(cardElement) {
  if(!cardElement.classList.contains('open')) {
    cardElement.classList.add('open');
    onCardOpened(event.target);
  }
}

function onCardOpened(cardElement) {
  let cardPair = clickedCardElements[clickedCardElements.length-1];

  if(cardPair != null && cardPair.length === 1) {
    // One card was opened already, add the newly clicked card and compare them for match
    cardPair[1] = cardElement;
    clickedCardElements[clickedCardElements.length-1] = cardPair;

    incrementMoveCounter();

    checkMatch(cardPair);
  }
  else {
    // There is no card to check for match, so just store it
    let newCardPair = [];
    newCardPair.push(cardElement);
    clickedCardElements.push(newCardPair);
  }
}

function checkMatch(cardPair) {
  delayFunctionCall(function() {
    cardPair[0].firstElementChild.className === cardPair[1].firstElementChild.className ? onCardsMatched() : onCardsNotMatched();
  });
}

function onCardsMatched() {
  let cardPair = clickedCardElements.shift();
  cardPair[0].classList.add('match');
  cardPair[1].classList.add('match');

  matchCounter ++;

  if(matchCounter === icons.length) {
    clearTimer();

    delayFunctionCall(onAllCardsMatched);
  }
}

function onCardsNotMatched() {
  clickedCardElements[0][0].classList.add('no-match');
  clickedCardElements[0][1].classList.add('no-match');

  delayFunctionCall(function() {
    let cardPair = clickedCardElements.shift();

    cardPair[0].classList.remove('no-match');
    cardPair[1].classList.remove('no-match');

    cardPair[0].classList.remove('open');
    cardPair[1].classList.remove('open');
  });
}

function incrementMoveCounter() {
  let moves = parseInt(moveCounterElement.textContent) + 1;

  moveCounterElement.textContent = moves;
  moves === 1 ? moveCounterDescrElement.textContent = 'Move' : moveCounterDescrElement.textContent = 'Moves';

  if(moves === 12 || moves === 20) {
    hideStar();
  }
}

function resetMoveCounter() {
  moveCounterElement.textContent = 0;
  moveCounterDescrElement.textContent = 'Moves';
}

function hideStar() {
  let star = starsElement.querySelector('li :not(.hidden)');

  if(star != null) {
    star.classList.add('hidden');
  }
}

function showHiddenStars() {
  let hiddenStars = starsElement.querySelectorAll('li .hidden');

  if(hiddenStars != null) {
    hiddenStars.forEach(function(each) {
      each.classList.remove('hidden');
    });
  }
}

function onAllCardsMatched() {
  modalTimeMinElement.textContent = timerMinElement.textContent;
  modalTimeSecElement.textContent = timerSecElement.textContent;

  modalCounterElement.textContent = moveCounterElement.textContent;
  modalCounterDescrElement.textContent = moveCounterDescrElement.textContent;

  let hiddenStarsLength = starsElement.querySelectorAll('li .hidden').length;

  for(let i=0; i<modalStarsElement.children.length; i++) {
    if(i<hiddenStarsLength) {
      modalStarsElement.children[i].classList.add('hidden');
    }
    else {
      modalStarsElement.children[i].classList.remove('hidden');
    }
  }

  winningModalElement.style.display = 'block';
}

function delayFunctionCall(func) {
  setTimeout(func, 500);
}
