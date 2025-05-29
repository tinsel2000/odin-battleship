export class gameboard {
    static activeShips = [];
    constructor() {
        this.board = []
        this.activeShips = []
    }

    createBoard() {
        this.board = [];
        for (let y = 0; y < 10; y++) {
            let row = [];
            for (let x = 0; x < 10; x++) {
                row.push({
                    x: x,
                    y: y,
                    hasShip: false,
                    shipName: null,
                    isHit: false
                });
            }
            this.board.push(row);
        };
    }

    placeShip(coordinate, alignment, ship){
        console.log(`placeShip ${ship.name} ${alignment} coords x: ${coordinate[0]}, coords y: ${coordinate[1]}`);
        if (this.checkCoordsValid(coordinate, alignment, ship) === false) {
            console.log( 'Error, coordinates not valid, retrying');
            return false;
        }
        if (!this.board) {
            console.error( 'Error, board does not exist yet' );
            return false;
        }
        switch (alignment) {
            case 'Vertical':
                //console.log('Vertically aligning ship');
                for (let i = 0; i < ship.length; i++) {
                    //console.log(`placeShip Placing ship coords: ${coordinate[0]} and ${[coordinate[1] + i]}`);
                    this.board[coordinate[1] + i][coordinate[0]].hasShip = true;
                    this.board[coordinate[1] + i][coordinate[0]].shipName = ship.name;
                    //console.log(`placeShip Placing ${ship.name} here: ${[coordinate[1] + i][coordinate[0]]}`);
                }
                break;
            case 'Horizontal':
                //console.log('Horizontally aligning ship');
                for (let i = 0; i < ship.length; i++) {
                    this.board[coordinate[1]][coordinate[0] + i].hasShip = true;
                    this.board[coordinate[1]][coordinate[0] + i].shipName = ship.name;
                }
                break;
        }
        this.activeShips.push(ship);
        return true;
    }
    
    receiveAttack(coordinate) {
        if (this.board[coordinate[1]][coordinate[0]].isHit === true) {
            console.log ('Target already chosen');
            return false;
        } else {
            this.board[coordinate[1]][coordinate[0]].isHit = true;
            //console.log(`Target hit: ${coordinate[0]}, ${coordinate[1]}`);
            return true;
        }
    }

    checkCoordsValid(coordinate, alignment, ship) {
        //console.log('Checking coords valid');
        let coordsInvalid = 0; 
        //console.log(`checkCoordsValid shipLength: ${ship[length]}. Ship is: ${ship}`);
        switch (alignment) {
            case 'Vertical':
                //console.log('case vertical');
                for (let i = 0; i < ship.length; i++) {
                    //console.log(`Checking coordinate x: ${coordinate[0]} and coordinate y: ${coordinate[1] + i}`);
                    if (coordinate[1] + i >= 0 && coordinate[1] + i <= 9) {
                        if (this.board[coordinate[1] + i][coordinate[0]].hasShip === false) {
                        } else {return false;}
                        //console.log(`Coord valid`);
                    } else {return false;}
                };
                break;
            case 'Horizontal':
                //console.log('case horizontal');
                for (let i = 0; i < ship.length; i++) {
                    //console.log(`Checking this thing: ${this.board[coordinate[1]][coordinate[0] + i]}`);
                    //console.log(`Checking coordinate x: ${coordinate[0] + i} and coordinate y: ${coordinate[1]}`);
                    if (coordinate[0] + i >= 0 && coordinate[0] + i <= 9) {
                        if (this.board[coordinate[1]][coordinate[0] + i].hasShip === false) {
                        } else {return false;}
                        //console.log(`Coord valid`);
                    } else {return false;}
                }
                break;
        }
        return true;
    }

};