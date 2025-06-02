import { initPlayers, initBoards, placeUserShips, placeComputerShips, turnPlayer, turnComputer, isLoser, allShipsPlaced} from './gameControl.js';
import { player } from './player.js';
import {getRandomInt, replaceAt, convertCoordsBack, convertCoordsFront} from './displayTools.js'

function parseTiles(event, shipLength, shipAlignmentHorizontal, query) {
    let boardTiles = document.querySelectorAll('.boardtile');
    let targetId = event.currentTarget.id;
    switch(shipAlignmentHorizontal) {
        case false: 
            for (let i = 0; i < shipLength; i++) {
                let nextXCoord = parseInt(targetId[2]) + i;
                if (nextXCoord <= 9) {
                    let nextId = replaceAt(targetId, nextXCoord, 2);
                    let nextTile = document.getElementById(nextId)
                    query(nextTile);
                }
            }
            break;
        case true: 
            for (let i = 0; i < shipLength; i++) {
                let nextXCoord = parseInt(targetId[1]) + i
                if (nextXCoord <= 9) {
                    let nextId = replaceAt(targetId, nextXCoord, 1);
                    let nextTile = document.getElementById(nextId)
                    query(nextTile);
                }
            }
            break;
    }
};

function addBoardTiles(board) {
    //let divBoard = document.querySelector(".board");
    while (board.firstChild) {
        console.log(`Removing child ${board.firstChild}`);
        board.removeChild(board.firstChild);
    }
    let coordSymbol = 'c'
    if (board.classList.contains('boardEnemy')) {
        coordSymbol = 'e'
    }

    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            //create 10 buttons
            let coords = ''.concat(coordSymbol, j, i);
            const button = document.createElement("div")
            button.setAttribute("id", coords )
            button.classList.add("boardtile")
            button.textContent = coords;
            button.style.userSelect = 'none';
            board.appendChild(button)
        } 
    }
};

function placeShip(event, shipName, shipAlignmentHorizontal){
        let coords = convertCoordsBack(event);
        //console.log(`placeShip coords: ${Array.isArray(coords) }`);
        let alignment = 'Vertical'
        if (shipAlignmentHorizontal) {
            alignment = 'Horizontal'
        }
        //console.log(`placeShip alignment: ${alignment} and shipAlignmentHorizontal: ${shipAlignmentHorizontal}`);
        return placeUserShips(coords, alignment, shipName);
}

function shotTakenComputer() {
    let friendly = false;
    const randomCoord = [getRandomInt(10), getRandomInt(10)];
    let computerTurnResult = turnComputer(randomCoord);
    if ( computerTurnResult === 'hitShip') {
        let shipHit = true;
        let friendly = false;
        console.log(`Computer turn taken`);
        shotHit(convertCoordsFront(randomCoord), friendly, shipHit);
    } else if (computerTurnResult === 'hitWater') {
        let shipHit = false;
        let friendly = false;
        shotHit(convertCoordsFront(randomCoord), friendly, shipHit)
        console.log(shipHit);
    } else if (computerTurnResult === 'hitInvalid') {
        shotTakenComputer();
    }
    if ( isLoser('player1') === true ) {
            displayWinner('Computer');
        }
}

function shotTaken(event) {
    let coords = convertCoordsBack(event);
    let tileAlreadyHit = event.currentTarget.classList.contains('hittile');
    if (event.currentTarget.classList.contains('hittile')) {
        console.log('Turn not taken');
        return;
    }
    let playerTurnResult = turnPlayer(coords);
    if ( playerTurnResult === 'hitShip') {
        //console.log(`turnPlayer(coords) === true)`)
        let shipHit = true;
        let friendly = true;
        shotHit(convertCoordsFront(coords), friendly, shipHit);
        if ( isLoser('player2') === true ) {
            displayWinner(playerName);
        }
        //console.log(shipHit);
    } else if ( playerTurnResult === 'hitWater' ) {
        let shipHit = false;
        let friendly = true;
        shotHit(convertCoordsFront(coords), friendly, shipHit)
        //console.log(shipHit);
    }
    shotTakenComputer()
}

function shotHit(coords, friendly, shipHit) {
    let coordSignifier = 'c';
    let friendSignifier = 'Friendly';
    let textUpdate = 'Shot has missed';
    if (friendly === true){
        coordSignifier = 'e';
        friendSignifier = 'Enemy';
        //addHistory('Enemy ship has been hit!');
    } else {
        //addHistory('Friendly ship has been hit!');
    }
    let tile = document.getElementById(coordSignifier + coords);
    if (shipHit === true){
        textUpdate = friendSignifier + ' ship has been hit!';
        addHistory(textUpdate);
        tile.style.backgroundColor = 'red';
    } else {
        tile.style.backgroundColor = 'blue';
    }
    //console.log(coordSignifier + coords);
    tile.textContent = '';
    tile.style.borderRadius = '50%';
    tile.classList.add("hittile")
    //addHistory(friendSignifier + ' ship has been hit!');
}

function addHistory(input) {
    let parentDiv = document.querySelector(".infopanel");
    let mostRecentDiv = parentDiv.lastElementChild.textContent;
    //console.log(`mostRecentDiv: ${mostRecentDiv}. Input: ${input}`);
    if (input === 'Shot missed' && mostRecentDiv === input) {
    } else {
        const newDiv = document.createElement("div")
        newDiv.classList.add("historyline")
        newDiv.textContent = input;
        parentDiv.appendChild(newDiv)
    }
    let histDivs = document.querySelectorAll(".historyline");
    if (histDivs.length >= 6) {
        parentDiv.firstElementChild.remove();
    }
}

function displayWinner(input) {
    //Modify display to show player as winner, block further input
    let infoPanel = document.querySelector(".infopanel")
    // create new line of history. Best way?
    const historyLine = document.createElement("div");
    historyLine.classList.add("historyline");
    historyLine.textContent = input + ' is the Winner!';
    infoPanel.appendChild(historyLine)
    removeInteractivity();
}

function addInteractivityShots() {
    let divTiles = document.querySelectorAll(".boardEnemy > .boardtile");
    for (let i = 0; i < divTiles.length; i++) {
        divTiles[i].addEventListener("click", shotTaken)
    }
}

function removeInteractivity() {
    console.log(`removeInteractivity run`);
    let divTiles = document.querySelectorAll(".boardtile");
    for (let i = 0; i < divTiles.length; i++) {
        divTiles[i].replaceWith(divTiles[i].cloneNode(true));
    //    divTiles[i].removeEventListener("click", shotTaken)
    //    
    }
}

function mouseOver(input) { input.classList.add('boardtileshiphov') }
function mouseOut(input) { 
    if (!input.classList.contains('locked')) {
        input.classList.remove('boardtileshiphov');
    }
}
function mouseLock(input) { input.classList.add('locked') }

let shipAlignmentHorizontal = false;
function clickShip(event) {
    if(!event.currentTarget.classList.contains('unclicked')) {
        shipAlignmentHorizontal = shipAlignmentHorizontal ? false : true;
    }
    event.currentTarget.classList.remove('unclicked');
    if (shipAlignmentHorizontal === true) {
        document.querySelector('.alignment').textContent = 'Current Alignment: Horizontal'
    } else {
        document.querySelector('.alignment').textContent = 'Current Alignment: Vertical'
    }
    let targetId = event.currentTarget.id;
    console.log(`clickShip detected ${targetId}`);
    let shipLength = 2;
    switch(targetId) {
        case 'carrier': shipLength = 5
        break;
        case 'battleship': shipLength = 4
        break;
        case 'cruiser': shipLength = 3
        break;
        case 'submarine': shipLength = 3
        break;
        case 'destroyer': shipLength = 2
        break;
    }
    //console.log(`shipLength is now: ${shipLength}`);
    let boardTiles = document.querySelectorAll('.boardtile');
    for (let i = 0; i < boardTiles.length; i++) {
        boardTiles[i].replaceWith(boardTiles[i].cloneNode(true));
    }
    boardTiles = document.querySelectorAll('.boardtile');
    for (let i = 0; i < boardTiles.length; i++) {
        //console.log(`Adding class to ${i}`);
        //boardTiles[i].classList.add("boardtileplacement")
        boardTiles[i].addEventListener('mouseover', function(event) {
            parseTiles(event, shipLength, shipAlignmentHorizontal, mouseOver) 
        })
        boardTiles[i].addEventListener('mouseout', function(event) {
            parseTiles(event, shipLength, shipAlignmentHorizontal, mouseOut);
        })
        boardTiles[i].addEventListener('click', function(event) {
            if ( placeShip(event, targetId, shipAlignmentHorizontal) ){
                let shipDiv = document.getElementById(targetId);
                shipDiv.remove();
                parseTiles(event, shipLength, shipAlignmentHorizontal, mouseLock);
                boardTiles[i].removeEventListener('mouseover', function(event) {
                    parseTiles(event, shipLength, shipAlignmentHorizontal, mouseOver) 
                })
                for (let i = 0; i < boardTiles.length; i++) {
                    boardTiles[i].replaceWith(boardTiles[i].cloneNode(true));
                }
                if (allShipsPlaced()) {
                    document.querySelector('.guide').textContent = 'All ships have been placed, the game can now begin. Click any tile in Enemy Waters to attack';
                    startGame();
                }
                event.placementResult = true;
                return true;
            } else {
                event.placementResult = false;
                return false;
            }
        });
    }
}

function addInteractivityBoats() {
    let allBoats = document.querySelectorAll(".boat")
    //console.log(`addInter detected: ${allBoats.length}`);
    for (let i = 0; i < allBoats.length; i++) {
        allBoats[i].addEventListener("click", clickShip)
        //console.log(`Adding inter to boat ${allBoats[i].id} number is: ${i}`);
    }
}

function startPlacement() {
    playerName = document.querySelector('#name').value;
    if (!playerName) {playerName = 'Player 1'}
        console.log(playerName);
    const nameInput = `Welcome ${playerName}. Please place your ships to begin. Click each ship, then choose a valid location on the board`;
    document.querySelector('.guide').textContent = nameInput;
    initPlayers(playerName);
    initBoards();
    addInteractivityBoats();
}

function startGame() {
    //event.preventDefault();
    placeComputerShips();
    console.log('game started');
    addBoardTiles(divBoardEnemy)
    addInteractivityShots();
}

function resetGame() {
    console.log('game reset');
    addBoardTiles(divBoardEnemy)
    addBoardTiles(divBoardFriendly)
    placeComputerShips();
    removeInteractivity();
}

function testPlaceShips() {
    placeUserShips([2, 2], 'Vertical', 'carrier')
    placeUserShips([3, 2], 'Vertical', 'battleship')
    placeUserShips([4, 2], 'Vertical', 'cruiser')
    placeUserShips([5, 2], 'Vertical', 'submarine')
    placeUserShips([6, 2], 'Vertical', 'destroyer')
}

function testClickAll() {
    console.log(`testClickAll running`);
    let board = document.querySelectorAll('.boardEnemy .boardtile')
    for (let i = 0; i < 90; i++) {
        setTimeout(function(){
            console.log(`Clicking this thing ${board[i].id}`);
            board[i].click();
        }, 2000)
    }
}

function placeUserShipsAuto() {
    let boatDock = document.querySelectorAll('.boatdock .boat');
    console.log(`boatDock: ${boatDock} and boatDock.length: ${boatDock.length}`);
    for (let i = 0; i < boatDock.length; i++) {
        console.log(`AutoPlacing ship: ${boatDock}`);
        let randomInt = getRandomInt(2);
        console.log(`randomInt: ${randomInt}`);
        for (let k = -1; k < randomInt; k++) {
            console.log(`Clicking a ship`);
            boatDock[i].dispatchEvent(new MouseEvent('click', { bubbles: true }));
        }
        let shipPlaced = false;
        let j = 0;
        while (shipPlaced === false && j <= 10) {
            console.log(`Attempting ship placement`);
            j++;
            let randomCoord = [getRandomInt(10), getRandomInt(10)];
            let randomCoordId = convertCoordsFront(randomCoord);
            const tile = document.getElementById('c' + randomCoordId);
            tile.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
            const clickEvent = new MouseEvent('click', { bubbles: true });
            tile.dispatchEvent(clickEvent);
            console.log('Did ship place correctly?' + clickEvent.placementResult); // true or false
            shipPlaced = clickEvent.placementResult;
            if (j > 9) {
                alert("Infinite Loop");
             break;
            }
            tile.dispatchEvent(new MouseEvent('mouseout', { bubbles: true }));
        }
    }
    //const tile = document.getElementById('c00'); // or any valid tile id
}

function testProcedure() {
    //startGame();
    //testPlaceShips()
    placeUserShipsAuto()
}

let playerName = 'Player 1';
document.querySelector('#startgame').addEventListener('click', startPlacement)
document.querySelector('.guide').textContent = 'Please enter your name above';
let divBoardFriendly = document.querySelector(".boardFriendly");
let divBoardEnemy = document.querySelector(".boardEnemy");
addBoardTiles(divBoardFriendly)
//setTimeout(startPlacement, 1000);
startPlacement()
document.querySelector('#resetGame').addEventListener('click', resetGame)
document.querySelector('#testing').addEventListener('click', testProcedure)
document.querySelector('#autoplace').addEventListener('click', placeUserShipsAuto)