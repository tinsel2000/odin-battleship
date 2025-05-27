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
            console.error( 'Error, coordinates not valid' );
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
                    this.board[coordinate[1] + i][coordinate[0]].hasShip = true;
                    this.board[coordinate[1] + i][coordinate[0]].shipName = ship.name;
                    //console.log(`Placing ${ship.name}`);
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
            console.log(`Target hit: ${coordinate[0]}, ${coordinate[1]}`);
            return true;
        }
    }

    checkCoordsValid(coordinate, alignment, ship) {
        //console.log('Checking coords valid');
        let coordsInvalid = 0; 
        switch (alignment) {
            case 'Vertical':
                for (let i = 0; i < ship.length; i++) {
                    if (
                        (this.board[coordinate[1] + i]?.[coordinate[0]]) && 
                        (this.board[coordinate[1] + i][coordinate[0]].hasShip === false)
                    ) {
                        //console.log(`Coord valid`);
                    } else {
                        //console.log(`Coord invalid`);
                        return false;
                    }
                };
                break;
            case 'Horizontal':
                for (let i = 0; i < ship.length; i++) {
                    if (
                        (this.board[coordinate[1]]?.[coordinate[0] + i]) &&
                        (this.board[coordinate[1]][coordinate[0] + i].hasShip === false)
                    ) {
                        //console.log(`Coord valid`);
                    } else {
                        //console.log(`Coord invalid`);
                        return false;
                    }
                }
                break;
        }
        return true;
    }

};