import { player } from './player.js'
import { ship } from './ship.js';

const gameControl = (function gameControl() {
    
    let player1;
    let player2;

    function initPlayers(playerName) {
        player1 = new player(playerName);
        player2 = new player('Computer');
    }

    function initBoards() {
        player1.water.createBoard();
        player2.water.createBoard();
        //console.log(`initBoards output: ${player2.water.board[0][1]}`);
    }

    function placeUserShips(coord, alignment, shipName) {
        player1.water.board.placeShip(coord, alignment, shipName);
    }

    function turnPlayer(coord) {
        if ( player2.receiveAttack(coord) === true ) {
            return isLoser('player2');
        }
    }

    function placeComputerShips() {

        function getRandomInt(max) {
            return Math.floor(Math.random() * max);
        }

        const numShips = Object.keys(player2.ships).length;
        console.log(numShips);

        for (let i = 0; i < numShips; i++) {
            let randomCoord = [];
            let randomAlignment = ''
            if (getRandomInt(1) === 0){
                 randomAlignment = 'Vertical'
            } else {
                randomAlignment = 'Horizontal'
            } 
            //console.log(`Current ship: ${Object.values(player2.ships)[i]}`);
            let shipPlaced = false
            let shipPlacedAttempts = 0
            while (shipPlaced === false) {
                randomCoord = [getRandomInt(9), getRandomInt(9)]
                shipPlaced = player2.water.placeShip(randomCoord, randomAlignment, Object.values(player2.ships)[i]);
                shipPlacedAttempts += 1;
                if (shipPlacedAttempts === 10) { break }
            } 
        }
    }

    function turnComputer() {
         function getRandomInt(max) {
            return Math.floor(Math.random() * max);
        };
        const randomCoord = [getRandomInt(9), getRandomInt(9)];
        player1.receiveAttack(coord)
    }

    function isLoser(input) {
        if (input === 'player2') {
            return player2.checkAllShipsSunk();
        } else {
            return player1.checkAllShipsSunk();
        }
    }

    return {
        initPlayers,
        initBoards,
        placeUserShips,
        placeComputerShips,
        turnPlayer,
        turnComputer,
        isLoser
    }

})();

const {initPlayers, initBoards, placeUserShips, placeComputerShips, turnPlayer, turnComputer, isLoser} = gameControl;

export {initPlayers, initBoards, placeUserShips, placeComputerShips, turnPlayer, turnComputer, isLoser};