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

    function allShipsPlaced(){
        if (player1.water.activeShips.length === 5){
            console.log('All ships placed, game can begin');
            return true;
        } else {
            return false;
        }
    }

    function placeUserShips(coord, alignment, inputName) {
        console.log(`placeUserShips inputname: ${inputName}. ships: ${Object.values(player1.ships[inputName])}`);
        const shipName = Object.values(player1.ships[inputName])
        //console.log(`placeUserShips ship found: ${shipName} from ${inputName}`);
        return player1.water.placeShip(coord, alignment, shipName);
    }

    function turnPlayer(coord) {
        return player2.receiveAttack(coord)
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
            if (getRandomInt(2) === 0){
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
            console.log(`Checking player2 ships sunk`);
            return player2.checkAllShipsSunk();
        } else {
            console.log(`checking player1 ships sunk`);
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
        isLoser,
        allShipsPlaced
    }

})();

const {initPlayers, initBoards, placeUserShips, placeComputerShips, turnPlayer, turnComputer, isLoser, allShipsPlaced} = gameControl;

export {initPlayers, initBoards, placeUserShips, placeComputerShips, turnPlayer, turnComputer, isLoser, allShipsPlaced};