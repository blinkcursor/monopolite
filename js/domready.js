(function(){

	this.monopolite = {

		init: function() {
			// setup board
			this.board = new Array( 'GO', 'SALE', 'SALE', 'SALE', 'SALE',
								'CHANCE', 'SALE', 'SALE', 'SALE', 'SALE',
								'JAIL', 'SALE', 'SALE', 'SALE', 'SALE',
								'CHANCE', 'SALE', 'SALE', 'SALE', 'SALE');
			this.players = [
			{
				name: "Human",
				position: 0,
				cash: 250,
				owns: []				
			},
			{
				name: "Machine",
				position: 0,
				cash: 250,
				owns: []
			}];

			this.turn = 0;

			this.cacheDom();

			this.bindEvents();

			this.render();
		},

		cacheDom: function() {
			this.boardDom = document.querySelector('.board');
			this.cashHuman = document.querySelector('.player--0 .js-cash');
			this.cashMachine = document.querySelector('.player--1 .js-cash');
		},

		bindEvents: function() {
			window.addEventListener('keyup', this.triggerMove.bind(this), false);
		},

		triggerMove: function(e) {
			e.preventDefault();
			this.move(this.turn);
		},

		roll: function() {
			var die = Math.floor(Math.random() * 6) + 1;
			return die;
		},

		move: function(player) {

			var die = this.roll(),
				currentPos = this.players[player].position,
				newPos = currentPos + die;

			console.log(this.players[player].name + " rolls a " + die);

			// already in Jail?
			if ( this.board[currentPos] === 'JAIL' ) {
				if ( die > 3 ) {
					console.log("Got out of jail!");
				} else {
					console.log("Stuck in jail!");
					// update turn then bail
					this.turn = this.turn ? 0 : 1;
					return;
				}
			}

			// pass GO?
			if ( newPos > 19 ) {
				newPos -= 20;
				this.players[this.turn].cash += 200;
				console.log(this.players[player].name + " passed Go and earned $200");
				this.gameOver(this.players[this.turn]);
			}
			this.players[player].position = newPos;

			// what did they land on?
			var action = this.board[this.players[player].position];

			switch (action) {
				case "SALE":
					this.sale(this.players[player]);
					break;
				case "CHANCE":
					this.chance(this.players[player]);
					break;
				case "JAIL":
					console.log(this.players[player].name + " landed in Jail!");
					break;
				case "OWNED":
					this.owned(this.players[player]);
			}

			// update the board
			this.render()

			//update turn
			this.turn = this.turn ? 0 : 1;
		},

		sale: function(player) {
			// do we have enough money to buy?
			if (player.cash >= 100) {
				console.log(player.name + " buys the square");
				player.owns.push(player.position);
				player.cash -= 100;
				this.board[player.position] = "OWNED";
				ownedClass = (player.name == 'Human') ? 'sq__human' : 'sq__machine';
				this.boardDom.querySelector('div:nth-child(' + (player.position + 1) + ')').classList.add(ownedClass);
			} else {
				console.log(player.name + " has insufficient funds!");
			}
		},

		chance: function(player) {
			// heads or tails
			if ( Math.random() > 0.5 ) {
				console.log(player.name + " is lucky and wins $50");
				player.cash += 50;
			} else {
				console.log(player.name + " is unlucky and loses $50");
				player.cash -= 50;
				this.gameOver(this.players[this.turn]);
			}
			this.gameOver(this.players[this.turn]);
		},

		owned: function(player) {
			// does other player own it?
			if ( player.owns.indexOf(player.position) === -1 ) {
				console.log(player.name + " landed on opponents square, pay rent of $50");
				player.cash -= 50;
				this.gameOver(this.players[this.turn]);
				this.players[Math.abs(this.turn - 1)].cash +=50;
				this.gameOver(this.players[Math.abs(this.turn - 1)]);
			} else {
				console.log("Safe! Already owned by " + player.name);
			}
		},

		gameOver: function(player) {
			if ( player.cash >= 1000 ) {
				alert(player.name + " WINS!");
				console.log("GAME OVER");
			} else if ( player.cash < 0 ) {
				alert(player.name + " LOSES!");
				console.log("GAME OVER");
			}
		},

		render: function() {
			// update cash
			this.cashHuman.innerHTML = this.players[0].cash;
			this.cashMachine.innerHTML = this.players[1].cash;

			// update position of current player
			var human = document.querySelector('.piece.human'),
				humanPos = this.players[0].position,
				machine = document.querySelector('.piece.machine'),
				machinePos = this.players[1].position;

			this.boardDom.querySelector('div:nth-child(' + (humanPos + 1) + ')').appendChild(human);
			this.boardDom.querySelector('div:nth-child(' + (machinePos + 1) + ')').appendChild(machine);

		}
	}
	monopolite.init();

}())