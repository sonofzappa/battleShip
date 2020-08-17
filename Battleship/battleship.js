var model = {
    boardSize: 7,
    numShips: 3,
    shipLength: 3,
    shipsSunk: 0,

    ships: [{ locations: [0, 0, 0], hits: ["", "", ""]},
            { locations: [0, 0, 0], hits: ["", "", ""]},
            { locations: [0, 0, 0], hits: ["", "", ""]}],

    fire: function(guess) {
        for (var i = 0; i < this.numShips; i++) {
            var ship = this.ships[i];
            var index = ships.locations.indexOf(guess);
                if (index >= 0) {
                    ship.hits[index] = "hit";
                    view.displayHit(guess);
                    view.displayMessage("Hit!!!");
                    if (this.isSunk(ship)) {
                        this.shipsSunk++;
                        view.displayMessage("You sunk my battle ship!");
                    }
                    return true;
                }
            }
            view.displayMiss(guess);
            view.displayMessage("You missed.");
            return false;
    },
    fire: function(guess) {
		for (var i = 0; i < this.numShips; i++) {
			var ship = this.ships[i];
			var index = ship.locations.indexOf(guess);

			// here's an improvement! Check to see if the ship
			// has already been hit, message the user, and return true.
			if (ship.hits[index] === "hit") {
				view.displayMessage("Oops, you already hit that location!");
				return true;
			} else if (index >= 0) {
				ship.hits[index] = "hit";
				view.displayHit(guess);
				view.displayMessage("HIT!");

				if (this.isSunk(ship)) {
					view.displayMessage("You sank my battleship!");
					this.shipsSunk++;
				}
				return true;
			}
		}
		view.displayMiss(guess);
		view.displayMessage("You missed.");
		return false;
	},

    isSunk: function(ship) {
        for (var i = 0; i < this.shipLength; i++) {
            if (ship.hits[i] !=="hit") {
                return false;
            }
        }
        return true;
    },
    
    generateShipLocations: function() {
		var locations;
		for (var i = 0; i < this.numShips; i++) {
			do {
				locations = this.generateShip();
			} while (this.collision(locations));
			this.ships[i].locations = locations;
		}
		console.log("Ships array: ");
		console.log(this.ships);
	},
    
    generateShip: function() {
		var direction = Math.floor(Math.random() * 2);
		var row, col;

		if (direction === 1) { // horizontal
			row = Math.floor(Math.random() * this.boardSize);
			col = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1));
		} else { // vertical
			row = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1));
			col = Math.floor(Math.random() * this.boardSize);
		}

		var newShipLocations = [];
		for (var i = 0; i < this.shipLength; i++) {
			if (direction === 1) {
				newShipLocations.push(row + "" + (col + i));
			} else {
				newShipLocations.push((row + i) + "" + col);
			}
		}
		return newShipLocations;
    },
      

    collision: function(locations) {
        for (var i = 0; i < this.numShips; i++) {
            var ship = this.ships[i];
            for (var j; j < this.shipLength; i++) {
                if (ship.locations.indexOf(locations[j]) >=0) {
                    return true;
                }
            }
        }
        return false;
    }
};

var view = {
    displayMessage: function(msg) {
        var messageArea = document.getElementById("messageArea");
        messageArea.innerHTML = msg;
    },
    displayHit: function(location) {
        var cell = document.getElementById(location);
        cell.setAttribute("class", "hit");
    },
    displayMiss: function(location) {
        var cell = document.getElementById(location);
        cell.setAttribute("class", "miss");
    }
};

var controller = {
    guesses: 0,

    processGuess: function(guess) {
        var location = parseGuess(guess);
        if (location) {
            this.guesses++;
            var hit = model.fire(location);
            if (hit && model.shipsSunk === model.numShips) {
                view.displayMessage("Baby!!! You sank all my battleships! It too you" + this.guesses + "guesses.");
            }
        }
    }  
}

function parseGuess(guess) {
    var alphabet= ["A", "B", "C", "D", "E", "F", "G"];

    if (guess === null || guess.length !==2) {
        alert("Ooops, that doesn't seem to be on the board honey!");
    } else {
        var firstChar = guess.charAt(0);
        var row = alphabet.indexOf(firstChar);
        var column = guess.charAt(1);

        if(isNaN(row) || isNaN(column)) {
            alert("That isn't on the board Harry Potter");
        } else if (row < 0 || row >=model.boardSize || column >=model.boardSize) {
        alert ("Sorry hun, that isn't on the board.")
        } else {
            return row + column;
        }

    }
    return null;
    
}

//Event Handlers

function handleFireButton() {
    var guessInput = document.getElementById("guessInput");
    var guess = guessInput.value.toUpperCase();
    
    controller.processGuess(guess);
    
    guessInput.value = "";
}

function handleKeyPress(e) {
    e = e || window.event;

    if (e.keyCode === 13) {
        fireButton.click();
        return false;
    }
}

window.onload = init;

function init() {
    var fireButton = document.getElementById("fireButton");
    fireButton.onclick = handleFireButton;

    var guessInput = document.getElementById("guessInput");
    guessInput.onkeypress = handleKeyPress;

    model.generateShipLocations();
}