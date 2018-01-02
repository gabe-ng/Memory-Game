
let cardList = ["fa-diamond", "fa-paper-plane-o", "fa-anchor", "fa-bolt", "fa-cube", "fa-leaf", "fa-bicycle", "fa-bomb"]; //card list
let moves = 0;
let stars = 3;
let openedCards = []; //array for holding open cards
let matchesFound = 0; //total matches found
let gameStarted = false; //indiciates when game starts

// game timer
var timer = new Timer();
timer.addEventListener('secondsUpdated', function(e) {
  $('#timer').html(timer.getTimeValues().toString());
});

// function to add animations
$.fn.extend({
  animateCss: function(animationName) {
    var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
    this.addClass(animationName).one(animationEnd, function() {
      $(this).removeClass(animationName);
    });
    return this;
  }
});

// shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

//create cards and append to the html
function createCard(card) {
  $('#deck').append('<li class="card animated"><i class="fa ' + card + '"</i></li>');
}

//generate random cards
function generateCards() {
  for (let i = 0; i < 2; i++) {
    cardList = shuffle(cardList);
    cardList.forEach(createCard);
  }
}

//toggling cards
function cardToggle() {
  //starts game
  if (gameStarted == false) {
    gameStarted = true;
    timer.start();
  }
  //check if there is a card already opened or not
  if (openedCards.length === 0) {
    $(this).toggleClass('open show').animateCss('flipInY');
    openedCards.push($(this));
    clickOff();
  } else if (openedCards.length === 1) {
    updateMoves();
    $(this).toggleClass('open show').animateCss('flipInY');
    openedCards.push($(this));
    setTimeout(checkMatch, 1000);
  }
}

//turn card click off
function clickOff() {
  openedCards.forEach(function(card) {
    card.off('click');
  });
}

//turn card click on
function clickOn() {
  openedCards[0].click(cardToggle);
}

//check for matching cards
function checkMatch() {
  if (openedCards[0][0].firstChild.className == openedCards[1][0].firstChild.className) {
    console.log('This is a match!');
    openedCards[0].addClass('match');
    openedCards[1].addClass('match');
    clickOff();
    clearOpenCards();
    setTimeout(checkForWin, 900);
  } else {
    openedCards[0].toggleClass('open show').animateCss('flipInY');
    setTimeout(flipDelay, 600); //2nd card closes after the first
    clickOn();
  }
}

//2nd card flip delay
function flipDelay() {
  openedCards[1].toggleClass('open show').animateCss('flipInY');
  clearOpenCards();
}

//empty open cards array
function clearOpenCards() {
  openedCards = [];
}

//update move counter
function updateMoves() {
  moves += 1;
  $('#moves').html(`${moves}`);
  if (moves == 18) {
    removeStar();
  } else if (moves == 13) {
    removeStar();
  }

}

//check if player wins
function checkForWin() {
  matchesFound += 1;
  if (matchesFound == 8) {
    showResults();
  }
}

//removing stars
function removeStar() {
  $('#stars').children()[0].remove();
  $('#stars').append('<li><i class="fa fa-star-o"></i></li>');

}

//initial stars
function addStars() {
  for (let s = 0; s < 3; s++) {
    $('#stars').append('<li><i class="fa fa-star"></i></li>');
  }
}

//show results
function showResults() {

  timer.pause();

  $('#results-popup').css('display', 'block').animateCss('fadeIn');
  // append final results to the popup
  $('#end-time').append(timer.getTimeValues().toString());
  $('#total-moves').append(moves + ' moves!');

  if (moves >= 13 && moves < 18) {
    stars = 2;
  } else if (moves >= 18) {
    stars = 1;
  }

  $('#total-stars').append(stars);

  // click on x to close the modal
  $('span.close').click(function() {
    $('#results-popup').css('display', 'none');
  });

  $("#play-again-btn").on("click", function() {
    $('#results-popup').css('display', 'none');
    gameReset();
  });

}

//reset game
function gameReset() {
  moves = 0;
  stars = 0;
  gameStarted = false;
  $('#deck').empty();
  $('#stars').empty();
  $('#deck').empty();
  $('#total-stars').empty();
  $('#total-moves').empty();
  $('#end-time').empty();
  timer.stop();
  $('#timer').html("00:00:00");
  startGame();
}

//restart button
$('#restart').click(gameReset);

//start game - initial function
function startGame() {
  generateCards();
  addStars();
  $('#moves').html('0');
  $('.card').click(cardToggle);
}

//start game
startGame();
