export class ship {
    constructor(length, name) {
        this.length = length;
        this.name = name;
        this.hits = 0;
        this.sunk = false;
    }

    isSunk() {
        if (this.hits === this.length) {
            this.sunk = true
            console.log('Ship has been sunk');
            return true;
        } else {
            return false;
        }
    }

    isHit(coordinate) {
        this.hits += 1;
        console.log('Ship has been hit, hits: ' + this.hits );
        this.isSunk();
        
    }

    setCoordinates(coordinate, alignment) {
        switch (alignment) {
            case 'Horizontal':
                for (let i = 0; i < ship.length; i++) {
                    calcCoords = coordinate;
                    calcCoords[0] += i - 1;
                    coordinates.push(calcCoords);
                }
            case 'Vertical':
                for (let i = 0; i < ship.length; i++) {
                    calcCoords = coordinate;
                    calcCoords[1] += i - 1;
                    coordinates.push(calcCoords);
                }
        }
    }
};