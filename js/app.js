// TODO: add timer; add star rating logic; style winning modal; update README;

// To enhance game with more cards just add icons to this array, per icon 2 cards will be added!
const icons = ['diamond', 'anchor', 'bolt', 'bomb', 'leaf', 'bicycle', 'paper-plane-o', 'cube'];
const cards = [];

// Create 2 cards per icon
icons.forEach(function(icon) {
  cards.push(icon);
  cards.push(icon);
});

let container = document.querySelector('.container');
let moveCounterElement = document.querySelector('.moves');
let matchCounter = 0;
let clickedCardElements = null;

// Start a new game at page load
newGame();

document.querySelector('.restart').addEventListener('click', function(event) {
  newGame();
});



function newGame() {
  shuffle(cards);

  moveCounterElement.textContent = 0;
  matchCounter = 0;
  clickedCardElements = [];

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
      onCardClicked(event.target);
    }
  });
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

    delayFunctionCall(function() {
      cardPair[0].firstElementChild.className === cardPair[1].firstElementChild.className ? onCardsMatched() : onCardsNotMatched();
    });
  }
  else {
    // There is no card to check for match, so just store it
    let newCardPair = [];
    newCardPair.push(cardElement);
    clickedCardElements.push(newCardPair);
  }
}

function onCardsMatched() {
  let cardPair = clickedCardElements.shift();
  cardPair[0].classList.add('match');
  cardPair[1].classList.add('match');

  matchCounter ++;

  if(matchCounter === icons.length) {
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
  moveCounterElement.textContent = parseInt(moveCounterElement.textContent) + 1;
}

function onAllCardsMatched() {
  alert('You WIN!');
}

function delayFunctionCall(func) {
  setTimeout(func, 500);
}
