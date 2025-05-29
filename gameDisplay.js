import { initPlayers, initBoards, placeUserShips, placeComputerShips, turnPlayer, turnComputer, isLoser, allShipsPlaced} from './gameControl.js';
import { player } from './player.js';

function replaceAt(string, char, index) {
  return string.substr(0, index) + char + string.substr(index + 1);
}

function addBoardTiles(board) {
    //let divBoard = document.querySelector(".board");
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

function getRandomInt(max) {
            return Math.floor(Math.random() * max);
        };

function shotTaken(event) {
    let coords = convertCoordsBack(event);
    let tileAlreadyHit = event.currentTarget.classList.contains('hittile');
    if (event.currentTarget.classList.contains('hittile')) {
        console.log('Turn not taken');
        return;
    }
    if ( turnPlayer(coords) === true) {
        //console.log(`turnPlayer(coords) === true)`)
        let targetHit = true;
        let friendly = true;
        shotHit(convertCoordsFront(coords), friendly, targetHit);
        if ( isLoser('player2') === true ) {
            displayWinner(playerName);
        }
        //console.log(targetHit);
    } else {
        let targetHit = false;
        let friendly = true;
        shotHit(convertCoordsFront(coords), friendly, targetHit)
        //console.log(targetHit);
    }
    //console.log(`shotTaken shot miss`)
    //shotMiss(event);
    let friendly = false;
    const randomCoord = [getRandomInt(9), getRandomInt(9)];
    if ( turnComputer(randomCoord) === true) {
        let targetHit = true;
        let friendly = false;
        console.log(`Computer turn taken`);
        shotHit(convertCoordsFront(randomCoord), friendly, targetHit);
    } else {
        let targetHit = false;
        let friendly = false;
        shotHit(convertCoordsFront(randomCoord), friendly, targetHit)
        console.log(targetHit);
    }
}

function shotMiss(event) {
    event.currentTarget.textContent = '';
    event.currentTarget.style.borderRadius = '50%';
    event.currentTarget.classList.add("hittile")
    event.currentTarget.style.backgroundColor = 'blue';
    addHistory('Shot missed');
}

function unusedshotHit(event) {
    event.currentTarget.textContent = '';
    event.currentTarget.style.borderRadius = '50%';
    event.currentTarget.classList.add("hittile")
    event.currentTarget.style.backgroundColor = 'red';
    addHistory('Ship has been hit!');
}

function shotHit(coords, friendly, targetHit) {
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
    if (targetHit === true){
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
    let divTiles = document.querySelectorAll(".boardtile");
    for (let i = 0; i < divTiles.length; i++) {
        divTiles[i].removeEventListener("click", shotTaken)
    }
}

function convertCoordsBack(event) {
    let targetId = event.currentTarget.id;
    let coords = [];
    coords.push(parseInt(targetId[1]));
    coords.push(parseInt(targetId[2]));
    return coords;
}

function convertCoordsFront(input) {
    let string = '';
    string += input[0];
    string += input[1];
    return string;
}

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
                    document.querySelector('.guide').textContent = 'All ships have been placed, the game can now begin';
                    startGame();
                }
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

let playerName = 'Player 1';
document.querySelector('#startgame').addEventListener('click', startPlacement)
document.querySelector('.guide').textContent = 'Please enter your name above';
let divBoardFriendly = document.querySelector(".boardFriendly");
let divBoardEnemy = document.querySelector(".boardEnemy");
addBoardTiles(divBoardFriendly)
startPlacement()

//remove later
//addBoardTiles(divBoardEnemy);
//addInteractivityShots();
//startGame();