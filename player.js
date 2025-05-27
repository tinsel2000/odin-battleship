import { ship } from './ship.js';
import { gameboard } from './board.js';

export class player {
    constructor(name) {
        this.name = name;
        this.water = new gameboard();
        this.ships = {
            'carrier': new ship(5, 'carrier'),
            'battleship': new ship(4, 'battleship'),
            'cruiser': new ship(3, 'cruiser'),
            'submarine': new ship(3, 'submarine'),
            'destroyer': new ship(2, 'destroyer')
        };
        this.shipsSunk = 0;
    }
    checkBoard() {
        return this.water.board;
    }

    markShipHit(shipName) {
        this.ships[shipName].isHit();
    }

    checkShipHit(coordinate) {
        if (this.water.board[coordinate[1]][coordinate[0]].hasShip === true) {
            let shipName = this.water.board[coordinate[1]][coordinate[0]].shipName;
            //console.log(`shipName hit: ${shipName}`);
            this.markShipHit(shipName);
            return true;
        } else {
            return false;
        }
    }

    receiveAttack(coord) {
        const isHit = this.water.receiveAttack(coord);
        if (isHit) {
            return this.checkShipHit(coord)
        }
    }

    checkShipsSunk() {
        const shipsSunk = 0;
        for (let i = 0; i in this.ships; i++) {
            if (this.ships[i].isSunk === true) {
                shipsSunk += 1;
            }
        }
        this.shipsSunk = shipsSunk;
        return this.shipsSunk
    }

    checkAllShipsSunk() {
        if (this.checkShipsSunk() === 5) {
            return true;
        } else {
            return false;
        }
    }
}