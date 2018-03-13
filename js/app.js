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
let firstClickedCardElement = null;
let secondClickedCardElement = null;

// Start a new game at page load
newGame();

document.querySelector('.restart').addEventListener('click', function(event) {
  newGame();
});



function newGame() {
  shuffle(cards);

  moveCounterElement.textContent = 0;
  matchCounter = 0;
  firstClickedCardElement = null;
  secondClickedCardElement = null;

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
  if(firstClickedCardElement == null) {
      firstClickedCardElement = cardElement;
  } else {
    secondClickedCardElement = cardElement;

    incrementMoveCounter();

    delayFunctionCall(function() {
      firstClickedCardElement.firstElementChild.className === secondClickedCardElement.firstElementChild.className
        ? onCardsMatched() : onCardsNotMatched();
    });
  }
}

function onCardsMatched() {
  firstClickedCardElement.classList.add('match');
  secondClickedCardElement.classList.add('match');

  clearClickedCardElements();

  matchCounter ++;

  if(matchCounter === icons.length) {
    delayFunctionCall(onAllCardsMatched);
  }
}

function onCardsNotMatched() {
  firstClickedCardElement.classList.add('no-match');
  secondClickedCardElement.classList.add('no-match');

  delayFunctionCall(function() {
    firstClickedCardElement.classList.remove('no-match');
    secondClickedCardElement.classList.remove('no-match');

    firstClickedCardElement.classList.remove('open');
    secondClickedCardElement.classList.remove('open');

    clearClickedCardElements();
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

function clearClickedCardElements() {
  firstClickedCardElement = null;
  secondClickedCardElement = null;
}



/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
