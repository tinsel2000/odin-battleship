import { player } from './player.js'
import { gameboard } from './board.js';

import { initPlayers, initBoards, placeUserShips, placeComputerShips, turnPlayer, turnComputer, isLoser} from './gameControl.js';

/*

const player1 = new player('Test')

player1.water.createBoard();

//console.log(player1.water[0]);

player1.water.placeShip([3, 4], 'Horizontal', player1.ships.destroyer)

player1.receiveAttack([3, 4]);
player1.receiveAttack([4, 4]);

//console.log(player1.water[0]);

//console.log(player1.checkBoard());
//player1.water.checkWinner();
/*

checkWinner() {
        for (let i = 0; i < this.activeShips.length; i++) {
            console.log(this.activeShips[i]);
            console.log(`Check ship is sunk: ${this.activeShips[i].sunk}`);
        }
    }


/*

functions still to write:

DONE Check all ships sunk

*/


initPlayers('Test')
initBoards()
placeComputerShips();
turnPlayer([3, 4])
turnPlayer([3, 5])
turnPlayer([3, 6])
turnPlayer([3, 7])


console.log( isLoser('player2') );