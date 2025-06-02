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

    markShipHit(ship) {
        let shipName = ship.name;
        console.log(ship);
        console.log(shipName);
        this.ships[shipName].isHit();
    }

    checkShipHit(coordinate) {
        if (this.water.board[coordinate[1]][coordinate[0]].hasShip === true) {
            let shipName = this.water.board[coordinate[1]][coordinate[0]].shipName;
            console.log(`shipName hit: ${shipName}. Coord checked: ${this.water.board[coordinate[1]][coordinate[0]]}`);
            this.markShipHit(shipName);
            //console.log(`checkShipHit true`);
            return 'hitShip';
        } else {
            //console.log(`checkShipHit false`);
            return 'hitWater';
        }
    }

    receiveAttack(coord) {
        //console.log(`receiveAttack coord: ${coord}`);
        //console.log(`Receiving attack to ${this.name}`);
        const hitValid = this.water.receiveAttack(coord);
        if (hitValid === 'hitValid') {
            //console.log(`receiveAttack ship has been hit`);
            return this.checkShipHit(coord)
        }
        return 'hitInvalid';
    }

    checkShipsSunk() {
        let shipsSunk = 0;
        const numOfShips = Object.keys(this.ships).length;
        const valuesOfShips = Object.values(this.ships);
        for (let i = 0; i < numOfShips; i++) {
            //console.log(`Checking if ${JSON.stringify(valuesOfShips[i])} is sunk`);
            if (valuesOfShips[i].isSunk() === true) {
                //console.log('Adding 1 to total ships sunk');
                shipsSunk += 1;
            } else {
            }
        }
        this.shipsSunk = shipsSunk;
        return this.shipsSunk
    }

    checkAllShipsSunk() {
        if (this.checkShipsSunk() === 5) {
            console.log('All ships sunk');
            return true;
        } else {
            return false;
        }
    }
}