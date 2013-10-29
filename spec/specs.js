describe('Go Fish', function() {
  describe('Player', function() {

    it('starts with zero pairs', function() {
      var player = Object.create(Player);
      player.pairCount.should.equal(0);
    });

    describe('createHand', function() {
      it('creates an empty hand for the player', function() {
        var player = Object.create(Player);
        player.createHand();
        player.hand.should.eql([]);
      })
    })

    it('sets player name', function() {
      var player = Object.create(Player);
      player.setName('Steve Foo');
      player.playerName.should.equal('Steve Foo');
    });

    describe('addToHand', function() {
      it('adds cards to the player\'s hand', function() {
        var player = Object.create(Player);
        player.createHand();
        player.addToHand(['s2', 'sK', 'hJ', 'h2', 'd5']);
        player.hand.should.eql(['s2', 'sK', 'hJ', 'h2', 'd5']);
      });

      it('finds pairs and increments points if found', function() {
        var player = Object.create(Player);
        player.createHand();
        player.addToHand(['s2', 'sJ', 'h2', 'd2', 'c2']);
        player.pairCount.should.equal(1);
      });
    });

    describe('findPairs', function() {
      it('finds pairs of four for search term and increments pair count if found', function() {
        var player = Object.create(Player);
        player.createHand();
        player.addToHand(['s2', 'sJ', 'h2', 'd2', 'c2']);
        player.findPairs(['s2']);
        player.pairCount.should.equal(1);
      });

      it('removes pairs from player\'s hand', function() {
        var player = Object.create(Player);
        player.createHand();
        player.addToHand(['s2', 'sJ', 'h2', 'd2', 'c2']);
        player.findPairs(['s2']);
        player.hand.should.eql(['sJ']);
      });
    });

    describe('searchHand', function() {
      it('returns all matches for a given string', function() {
        var player = Object.create(Player);
        player.createHand();
        player.addToHand(['s2', 'sK', 'hJ', 'h2', 'd5']);
        player.searchHand('2').should.eql(['s2', 'h2']);
      });

      it('removes the cards given from the player\'s hand', function() {
        var player = Object.create(Player);
        player.createHand();
        player.addToHand(['s2', 'sK', 'hJ', 'h2', 'd5']);
        player.searchHand('2');
        player.hand.should.eql(['sK', 'hJ', 'd5']);
      });

      it('returns \'false\' if there are no matches', function() {
        var player = Object.create(Player);
        player.createHand();
        player.addToHand(['s2', 'sK', 'hJ', 'h2', 'd5']);
        player.searchHand('3').should.be.false;
      });
    });

    describe('randomCard', function() {
      it('returns a random card from the player\'s hand', function() {
        var player = Object.create(Player);
        player.createHand();
        player.addToHand(['s2', 'h2', 'K2']);
        player.randomCard().should.equal('2');
      });
    });
  });





  describe('Deck', function() {
    it('initiates a deck of 52 cards', function() {
      var deck = Object.create(Deck);
      deck.cards.length.should.equal(52);
    });

    describe('shuffle', function() {
      it('mutates \'cards\' into a random order', function() {
        var deck = Object.create(Deck);
        var newCards = ['sA', 's2', 's3', 's4', 's5', 's6', 's7', 's8', 's9', 's0', 'sJ', 'sQ', 'sK',
          'dA', 'd2', 'd3', 'd4', 'd5', 'd6', 'd7', 'd8', 'd9', 'd0', 'dJ', 'dQ', 'dK',
          'hA', 'h2', 'h3', 'h4', 'h5', 'h6', 'h7', 'h8', 'h9', 'h0', 'hJ', 'hQ', 'hK',
          'cA', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'c9', 'c0', 'cJ', 'cQ', 'cK'];
        deck.shuffle();
        deck.cards.should.not.eql(newCards);
      });
    });

    describe('drawCard', function() {
      it('removes the last card from the deck', function() {
        var deck = Object.create(Deck);
        deck.drawCard();
        deck.cards.length.should.equal(51);
      });

      it('returns the card that was removed from the deck', function() {
        var deck = Object.create(Deck);
        deck.drawCard().length.should.equal(1);
      });
    });
  });




  
  describe('Game', function() {
    it('initiates a current player at 0', function() {
      var game = Object.create(Game);
      game.currentPlayer.should.equal(0);
    });

    describe('makeDeck', function() {
      it('creates an instance of the Deck object', function() {
        var game = Object.create(Game);
        game.makeDeck();
        game.deck.should.exist;
      });

      it('shuffles the deck', function() {
        var game = Object.create(Game);
        var mock = sinon.mock(Deck);
        mock.expects('shuffle');
        game.makeDeck();
        mock.verify();
        mock.restore();
      });
    });

    describe('makePlayers', function() {
      it('creates an array of player objects', function() {
        var game = Object.create(Game);
        game.makePlayers(['Steve Foo', 'Computer']);
        game.players.length.should.equal(2);
      });

      it('sets the new player\'s name', function() {
        var game = Object.create(Game);
        game.makePlayers(['Steve Foo']);
        game.players[game.players.length-1].playerName.should.equal('Steve Foo');
      });
    });

    describe('dealHands', function() {
      it('deals 7 cards to each player', function() {
        var game = Object.create(Game);
        game.makePlayers(['Steve Foo', 'Computer']);
        game.makeDeck();
        game.dealHands();
        game.players[0].hand.length.should.equal(7);
      });

      it('adds to a player\'s counter if they are dealt a pair', function() {
        var cardsToGive = [['sJ'], ['s2'], ['h2'], ['d2'], ['c2'], ['c5'], ['c4'], ['sJ'], ['s2'], ['h2'], ['d2'], ['c2'], ['c5'], ['c4']];
        function giveCards() {
          return cardsToGive.pop();
        }

        var game = Object.create(Game);
        sinon.stub(Deck, 'drawCard', giveCards);
        game.startGame(['Steve Foo', 'Computer']);
        Deck.drawCard.restore();
        game.players[0].pairCount.should.equal(1);
      });

      it('removes pairs from the player\'s hand', function() {
        var cardsToGive = [['sJ'], ['s2'], ['h2'], ['d2'], ['c2'], ['c5'], ['c4'], ['sJ'], ['s2'], ['h2'], ['d2'], ['c2'], ['c5'], ['c4']];
        function giveCards() {
          return cardsToGive.pop();
        }

        var game = Object.create(Game);
        sinon.stub(Deck, 'drawCard', giveCards);
        game.startGame(['Steve Foo', 'Computer']);
        Deck.drawCard.restore();
        game.players[0].hand.length.should.equal(3);
      });
    });

    describe('nextPlayer', function() {
      it('sets the current player to the next player in the array', function() {
        var game = Object.create(Game);
        game.makePlayers(['Steve Foo', 'Computer']);
        game.nextPlayer();
        game.currentPlayer.should.equal(1);
      });

      it('sets the current player to 0 if it is at the last player', function() {
        var game = Object.create(Game);
        game.makePlayers(['Steve Foo', 'Computer']);
        game.nextPlayer();
        game.nextPlayer();
        game.currentPlayer.should.equal(0);
      });
    });

    describe('gameOver', function() {
      it('returns true if there are no cards left in the deck', function() {
        var game = Object.create(Game);
        game.makeDeck();

        if (game.deck.cards.length > 0) {
          game.deck.drawCard();
        } //uh-oh

        game.gameOver.should.equal.true; //over
      });
    });

    describe('findWinner', function() {
      it('returns the index of the person with the most points', function() {
        var game = Object.create(Game);
        game.makePlayers(['Steve Foo', 'Computer']);
        game.players[0].createHand();
        game.players[1].createHand();
        game.players[0].addToHand(['s2', 'd2', 'h2', 'c2']);
        game.players[1].addToHand(['s3', 's4', 's5', 's6']);
        game.players[0].findPairs(['s2']);
        game.players[1].findPairs(['s3']);
        game.findWinner().should.equal(0);
      });

      it('returns -1 for a tie', function() {
        var game = Object.create(Game);
        game.makePlayers(['Steve Foo', 'Computer']);
        game.players[0].createHand();
        game.players[1].createHand();
        game.players[0].addToHand(['sA', 'd2', 'h2', 'c2']);
        game.players[1].addToHand(['s3', 's4', 's5', 's6']);
        game.players[0].findPairs(['s2']);
        game.players[1].findPairs(['s3']);
        game.findWinner().should.equal(-1);
      });
    });

    describe('startGame', function() {
      it('creates players', function() {
        var game = Object.create(Game);
        game.startGame(['michael', 'macaroni']);
        game.players.every(function(player) {
          return player.playerName === 'michael' || player.playerName === 'macaroni';
        }).should.be.true;
      });

      it('deals hands', function() {
        var game = Object.create(Game);
        game.startGame(["Foo", "Bar"]);
        game.players[1].hand.length.should.equal(7);
      });

      it('makes a deck', function() {
        var game = Object.create(Game);
        game.startGame(["Foo"]);
        game.deck.cards.length.should.exist;
      });
    });
  });
});



  
