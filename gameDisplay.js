import { initPlayers, initBoards, placeUserShips, placeComputerShips, turnPlayer, turnComputer, isLoser} from './gameControl.js';


let divBoard = document.querySelector(".board");

function addBoardTiles() {
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            //create 10 buttons
            let coords = ''.concat(j, i);
            const button = document.createElement("button")
            button.setAttribute("id", coords )
            button.classList.add("boardtile")
            button.textContent = coords;
            divBoard.appendChild(button)
        } 
    }
};

function startGame(name) {
    initPlayers(name);
    initBoards();
    placeComputerShips();
}

function turnTaken(event) {
    let targetId = event.currentTarget.id;
    let coords = [];
    coords.push(parseInt(targetId[0]));
    coords.push(parseInt(targetId[1])); 
    console.log(coords);
    return turnPlayer(coords);
}

function placeShip(event){
        //get ship name and alignment
        let targetId = event.currentTarget.id;
        let coords = [];
        coords.push(targetId[0]);
        coords.push(targetId[1]);
        return placeUserShips(coords, alignment, shipName);
}


addBoardTiles();

let divTiles = document.querySelectorAll(".boardtile");
for (let i = 0; i < divTiles.length; i++) {
    divTiles[i].addEventListener("click", turnTaken)
}

startGame('Test')