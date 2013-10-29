var Player = {
  pairCount: 0,
  gaveCards: false,

  setName: function(name) {
    this.playerName = name;
  },

  createHand: function() {
    this.hand = [];
    this.matchList = [];
  },

  addToHand: function(cards) {
    this.hand = this.hand.concat(cards);
    this.findPairs(cards);
  },

  findPairs: function(cards) {
    var rank = cards[0].slice(-1);
    var matches = 0;
    for (var i = 0; i < this.hand.length; i++) {
      if (this.hand[i].slice(-1) === rank) {
        matches++;
      }
    }

    if (matches === 4) {
      this.pairCount++;
      this.matchList.push(rankNames[rank]);
      for (var i = 0; i < this.hand.length; i) {
        if (this.hand[i].slice(-1) === rank) {
          this.hand.splice(i, 1);
        } else {
          i++;
        }
      }
    }
  },

  searchHand: function(rank) {
    var cardsToGive = [];
    for (var i = 0; i < this.hand.length; i) {
      if (this.hand[i].slice(-1) === rank) {
        cardsToGive.push(this.hand[i]);
        this.hand.splice(i, 1);
      } else {
        i++;
      }
    }

    if (cardsToGive.length > 0) {
      this.gaveCards = true;
      return cardsToGive;
    } else {
      this.gaveCards = false;
      return false;
    }
  },

  randomCard: function() {
    return this.hand[Math.floor(Math.random() * this.hand.length)].slice(-1);
  }
}

var Deck = {
  cards : ['sA', 's2', 's3', 's4', 's5', 's6', 's7', 's8', 's9', 's0', 'sJ', 'sQ', 'sK',
           'dA', 'd2', 'd3', 'd4', 'd5', 'd6', 'd7', 'd8', 'd9', 'd0', 'dJ', 'dQ', 'dK',
           'hA', 'h2', 'h3', 'h4', 'h5', 'h6', 'h7', 'h8', 'h9', 'h0', 'hJ', 'hQ', 'hK',
           'cA', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'c9', 'c0', 'cJ', 'cQ', 'cK'],

  shuffle: function() {
    var unshuffled = this.cards.length, temporaryValue, randomIndex;
    while (unshuffled) {
      randomIndex = Math.floor(Math.random() * unshuffled--);
      temporaryValue = this.cards[unshuffled];
      this.cards[unshuffled] = this.cards[randomIndex];
      this.cards[randomIndex] = temporaryValue;
    }
    return this.cards;
  },

  drawCard: function() {
    return [this.cards.pop()];
  }
}

var Game = {
  currentPlayer: 0,

  makeDeck: function() {
    this.deck = Object.create(Deck);
    this.deck.shuffle();
  },

  makePlayers: function(names) {
    this.players = [];
    thisGame = this;

    names.forEach(function(name) {
      thisGame.players.push(Object.create(Player));
      thisGame.players[thisGame.players.length-1].setName(name);
    });
  },

  dealHands: function() {
    thisGame = this;
    thisGame.players.forEach(function(player) {
      player.createHand();
      for (var i = 7; i > 0; i--) {
        player.addToHand(thisGame.deck.drawCard());
      }
    });
  },

  nextPlayer: function() {
    if (this.currentPlayer < this.players.length - 1) {
      this.currentPlayer++;
    } else {
      this.currentPlayer = 0;
    }
  },

  gameOver: function() {
    return this.deck.cards.length === 0;
  },

  findWinner: function() {
    thisGame = this;
    var highest = 0;
    var index = 0;
    thisGame.players.forEach(function(player){
      if (player.pairCount > highest) {
        highest = player.pairCount;
        index = thisGame.players.indexOf(player);
      } else if (player.pairCount === highest) {
        index = -1;
        return false;
      }
    });
    return index;
  },

  startGame: function(names) {
    this.makePlayers(names);
    this.makeDeck();
    this.dealHands();
  },

  playTurn: function(rank) {
    var hasCard = this.players[1 - this.currentPlayer].searchHand(rank);
    if (!hasCard) {
      hasCard = this.deck.drawCard();
    }

    this.players[this.currentPlayer].addToHand(hasCard);
    if (!this.gameOver()) {
      this.nextPlayer();
    } else {
      alert(this.players[this.findWinner()].playerName + " won!");
    }
  }
}

var rankNames = {
  '2': 'twos',
  '3': 'threes',
  '4': 'fours',
  '5': 'fives',
  '6': 'sixes',
  '7': 'sevens',
  '8': 'eights',
  '9': 'nines',
  '0': 'tens',
  'J': 'jacks',
  'Q': 'queens',
  'K': 'kings',
  'A': 'aces'
}


$(function() {

  function doYouHaveAny(game) {
    $("select#rank").empty();
    var ranks = [];
    for (var i = 0; i < game.players[0].hand.length; i++) {
      var rankCard = game.players[0].hand[i].slice(-1);
      if ($.inArray(rankCard, ranks) === -1) {
        ranks.push(rankCard);
        var label = "<option value='" + rankCard + "'>" + rankNames[rankCard] + "</option>";
        $("select#rank").append(label);
      }
    }
  }

  function displayCards(game) {
    $('#cards').empty();
    for (var i = 0; i < game.players[0].hand.length; i++) {
      var playerCard = game.players[0].hand[i];
      var cardImage = "<span class='card " + playerCard + "'></span>";
      $("#cards").append(cardImage);
    }
  }

  function updateScoreboard() {
    $('div#player-scoreboard div.match-count').empty().append("You have " + game.players[0].pairCount + " pairs.");
    $('div#computer-scoreboard div.match-count').empty().append("Steve has " + game.players[1].pairCount + " pairs.");
    $('div#player-scoreboard div.match-list').empty().append(game.players[0].matchList.join(', '));
    $('div#computer-scoreboard div.match-list').empty().append(game.players[1].matchList.join(', '));
  }

  $('#player-turn').hide(); // put in css
  var game = Object.create(Game);

  $('form#name-input').submit(function() {
    var playerName = $('input#player-name').val();
    $('form#name-input').hide();
    $('#player-turn').show();
    game.startGame([playerName, 'Steve Foo']);

    doYouHaveAny(game);
    displayCards(game);
    updateScoreboard();

    $('div#player-scoreboard div.player-name').empty().append(game.players[0].playerName);
    $('div#computer-scoreboard div.player-name').empty().append(game.players[1].playerName);

    return false;
  });

  var computerWants;
  var computerResponse;
  $('form#player-turn').submit(function() {
    doYouHaveAny(game);
    var rankWanted = $('select#rank').val();
    game.playTurn(rankWanted);

    if (game.players[1].gaveCards) {
      computerResponse = "Yes.";
    } else {
      computerResponse = "Go fish!";
    }

    displayCards(game);
    updateScoreboard();

    computerWants = game.players[1].randomCard();
    $('span#have-any').hide();
    $('span#computer-wants').empty().append('Steve says, "' + computerResponse + ' Do you have any ' + rankNames[computerWants] + '?"');
    $('form#computer-turn').show();

    return false;
  });

  $('form#computer-turn').submit(function() {
    game.playTurn(computerWants);
    displayCards(game);
    doYouHaveAny(game);
    $('span#have-any').show();
    $('form#computer-turn').hide();
    updateScoreboard();
    return false;
  });
  return false;
});
