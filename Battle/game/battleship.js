let view = {
    displayMessage: function (msg) {
        let mes = document.getElementById("messageArea");
        mes.innerHTML = msg;
    },
    displayHit: function (id) {
        let el = document.getElementById(id);
        el.setAttribute("class", "hit");
    },
    displayMiss: function (id) {
        let el = document.getElementById(id);
        el.setAttribute("class", "miss");
    }
};

let sea = new Array(7);
for (let i = 0; i < sea.length; i++) {
    sea[i] = new Array(7);
    for (let j = 0; j < sea[i].length; j++) {
        sea[i][j] = String(i) + String(j);
    }
}

let model = {
    boardSize: 7,
    numShips: 3,
    shipLength: 3,
    shipsDestroyed: 0,
    ships: [{locations: [0, 0, 0], hits: ["", "", ""]},
        {locations: [0, 0, 0], hits: ["", "", ""]},
        {locations: [0, 0, 0], hits: ["", "", ""]}],
    fire: function (guess) {
        for (let i = 0; i < this.numShips; i++) {
            let ship = this.ships[i];
            let index = ship.locations.indexOf(guess);
            if (index >= 0) {
                if (guess !== ship.hits[index]) {
                    ship.hits[index] = ship.locations[index];
                    view.displayHit(guess);
                    view.displayMessage("!-Hit-!");
                    if (this.isSunk(ship)) {
                        view.displayMessage("You DESTROYED my ship!");
                        this.shipsDestroyed++;
                    }
                    return true;
                } else {
                    alert("You already hit in this place!");
                    return true;
                }
            }
        }
        view.displayMiss(guess);
        view.displayMessage("!-Miss-!");
        return false;
    },
    isSunk: function (ship) {
        for (let i = 0; i < this.shipLength; i++) {
            if (ship.hits[i] !== ship.locations[i]) {
                return false;
            }
        }
        return true;
    },
    locationOnSea: function (center, navigate) {
        if (center === sea[0][0] || center === sea[0][this.boardSize - 1] || center === sea[this.boardSize - 1][0] || center === sea[this.boardSize - 1][this.boardSize - 1]) {
            return false;
        } else {
            let second = center.charAt(1);
            let mas0 = [];
            let masx = [];
            for (let i = 0; i < this.boardSize; i++) {
                mas0.push(sea[i][0]);
                masx.push(sea[i][this.boardSize-1]);
            }
            // console.log(mas0);
            // console.log(masx);
            if (navigate === 1 && (second == sea[0].indexOf(center) || second == sea[this.boardSize-1].indexOf(center))) {
                return false;
            } else if (navigate === 0 && (mas0.includes(center) || masx.includes(center))) {
                return false;
            } else {
                return true;
            }
        }
    },
    shipLocation: function () {
        let locations = [];
        let x, y, navigate;
        let center;
        let loc1, loc3;
        let bol = true;
        while (bol) {
            x = Math.floor(Math.random() * this.boardSize);
            y = Math.floor(Math.random() * this.boardSize);
            navigate = Math.floor(Math.random() * 2);
            center = sea[x][y];
            if (this.locationOnSea(center, navigate)) {
                if (navigate === 1) {
                    loc1 = sea[x - 1][y];
                    loc3 = sea[x + 1][y];
                    locations = [loc1, center, loc3];
                    return locations;
                    bol = false;
                } else if (navigate === 0) {
                    loc1 = sea[x][y - 1];
                    loc3 = sea[x][y + 1];
                    locations = [loc1, center, loc3];
                    return locations;
                    bol = false;
                }
            }
        }
    },
    locationWithShips: function (locations) {
        for (let i = 0; i < this.numShips; i++) {
            let ship = this.ships[i];
            for (let j = 0; j < locations.length; j++) {
                if (ship.locations.indexOf(locations[j]) >= 0) {
                    return true;
                }
            }
        }
        return false;
    },
    generateTrueLocation: function () {
        let locations;
        for (let i = 0; i < this.numShips; i++) {
            do {
                locations = this.shipLocation();
            } while (this.locationWithShips(locations));
            this.ships[i].locations = locations;
            console.log(this.locationWithShips(locations));
            console.log(this.ships[i].locations);
        }
    }
};
let control = {
    guesses: 0,
    processGuess: function (guess) {
        let loc = this.parseGuess(guess);
        if (loc) {
            this.guesses++;
            let hit = model.fire(loc);
            if (hit && model.shipsDestroyed === model.numShips) {
                view.displayMessage("You destroyed all ships and spent " + this.guesses + " guesses.");
            }
        }
    },
    parseGuess: function (guess) {
        let word = ["A", "B", "C", "D", "E", "F", "G"];
        if (guess.length !== 2 || guess === null) {
            alert("Ops, incorrect coordinates!");
        } else {
            let firstChar = guess.charAt(0);
            let row = word.indexOf(firstChar);
            let col = guess.charAt(1);
            if (isNaN(row) || isNaN(col)) {
                alert("Oops, that isn't on the sea.");
            } else if (row < 0 || row >= model.boardSize || col < 0 || col >= model.boardSize) {
                alert("Oops, that's off the board!");
            } else {
                return row + col;
            }
        }
        return null;
    }
};

function init() {
    let fireButton = document.getElementById("fire");
    fireButton.onclick = handleKeyPress;
    let guessInput = document.getElementById("coordinates");
    guessInput.onkeypress = keyPress;
    let newGame = document.getElementById("new");
    newGame.onclick = clear;
    model.generateTrueLocation();
}

function keyPress(e) {
    let fireButton = document.getElementById("fire");
    if (e.keyCode === 13) {
        fireButton.click();
        return false;
    }
}

//работает внизу
function handleKeyPress() {
    let guessInput = document.getElementById("coordinates");
    let guess = guessInput.value;
    control.processGuess(guess);
    guessInput.value = "";
}

function clear() {
    location.reload();
}

window.onload = init;
