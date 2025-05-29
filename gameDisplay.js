import { initPlayers, initBoards, placeUserShips, placeComputerShips, turnPlayer, turnComputer, isLoser, allShipsPlaced} from './gameControl.js';

function replaceAt(string, char, index) {
  return string.substr(0, index) + char + string.substr(index + 1);
}

function addBoardTiles() {
    let divBoard = document.querySelector(".board");
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            //create 10 buttons
            let coords = ''.concat('c', j, i);
            const button = document.createElement("div")
            button.setAttribute("id", coords )
            button.classList.add("boardtile")
            button.textContent = coords;
            button.style.userSelect = 'none';
            divBoard.appendChild(button)
        } 
    }
};

function placeShip(event, shipName, shipAlignmentHorizontal){
        //get ship name and alignment
        //let targetId = event.currentTarget.id;
        //coords.push(targetId[1]);
        //coords.push(targetId[2]);
        let coords = convertCoordsBack(event);
        //console.log(`placeShip coords: ${Array.isArray(coords) }`);
        let alignment = 'Vertical'
        if (shipAlignmentHorizontal) {
            alignment = 'Horizontal'
        }
        //console.log(`placeShip alignment: ${alignment} and shipAlignmentHorizontal: ${shipAlignmentHorizontal}`);
        return placeUserShips(coords, alignment, shipName);
}


function shotTaken(event) {
    let coords = convertCoordsBack(event);
    //console.log(coords);
    if ( turnPlayer(coords) === true) {
        shotHit(event);
        if ( isLoser('player2') === true ) {
            displayWinner(playerName);
        }
    } else if (!event.currentTarget.classList.contains('hittile')) {
        shotMiss(event);
    };
}

function shotMiss(event) {
    event.currentTarget.textContent = '';
    event.currentTarget.style.backgroundColor = 'blue';
    event.currentTarget.style.borderRadius = '50%';
    addHistory('Shot missed');
}

function shotHit(event) {
    event.currentTarget.textContent = '';
    event.currentTarget.style.backgroundColor = 'red';
    event.currentTarget.style.borderRadius = '50%';
    event.currentTarget.classList.add("hittile")
    addHistory('Ship has been hit!');
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
    let divTiles = document.querySelectorAll(".boardtile");
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
    return coords
}

function convertCoordsFront(input) {
    let coords = [];
    coords.push(parseInt(input[1]));
    coords.push(parseInt(input[2]));
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
                    nextTile.classList.add('boardtileshiphov');
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

function hoverShip(event, shipLength, shipAlignmentHorizontal) {
    //console.log(`hoverShip running`);
    let boardTiles = document.querySelectorAll('.boardtile');
    let targetId = event.currentTarget.id;
    switch(shipAlignmentHorizontal) {
        case false: 
            //console.log(`shipAlignmentHorizontal: ${shipAlignmentHorizontal}. Detected as: true. Targeting: ${targetId[2]}`);
            for (let i = 0; i < shipLength; i++) {
                let nextXCoord = parseInt(targetId[2]) + i;
                if (nextXCoord <= 9) {
                    //console.log(`targetsubstring: ${targetId.substring(3, 4)}. nextXCoord: ${nextXCoord}`);
                    let nextId = replaceAt(targetId, nextXCoord, 2);
                    let nextTile = document.getElementById(nextId)
                    //console.log(`targetId: ${targetId} nextX: ${nextXCoord} nextId: ${nextId} nextTile: ${nextTile}`);
                    nextTile.classList.add('boardtileshiphov');
                }
            }
            break;
        case true: 
            //console.log(`shipAlignmentHorizontal: ${shipAlignmentHorizontal}. Detected as: false. Targeting: ${targetId[1]}`);
            for (let i = 0; i < shipLength; i++) {
                //console.log(`targetId nos: ${targetId[0]}, ${targetId[1]}, ${targetId[2]}`);
                let nextXCoord = parseInt(targetId[1]) + i
                if (nextXCoord <= 9) {
                    let nextId = replaceAt(targetId, nextXCoord, 1);
                    //console.log(`targetId: ${targetId} nextX: ${nextXCoord} nextId: ${nextId}`);
                    let nextTile = document.getElementById(nextId)
                    //console.log(`targetId: ${targetId} nextX: ${nextXCoord} nextId: ${nextId} nextTile: ${nextTile}`);
                    nextTile.classList.add('boardtileshiphov');
                }
            }
            break;
    }
}

function hoverShipLeave(event, shipLength, shipAlignmentHorizontal) {
    let boardTiles = document.querySelectorAll('.boardtile');
    let targetId = event.currentTarget.id;
    switch(shipAlignmentHorizontal) {
        case false: 
            //console.log(`shipAlignmentHorizontal: ${shipAlignmentHorizontal}. Detected as: true`);
            for (let i = 0; i < shipLength; i++) {
                let nextXCoord = parseInt(targetId[2]) + i;
                if (nextXCoord <= 9) {
                    let nextId = replaceAt(targetId, nextXCoord, 2);
                    let nextTile = document.getElementById(nextId)
                    //console.log(`targetId: ${targetId} nextX: ${nextXCoord} nextId: ${nextId} nextTile: ${nextTile}`);
                    if (nextTile && !nextTile.classList.contains('locked')) {
                        nextTile.classList.remove('boardtileshiphov');
                    }
                }
                
            }
            break;
        case true: 
            //console.log(`shipAlignmentHorizontal: ${shipAlignmentHorizontal}. Detected as: false`);
            for (let i = 0; i < shipLength; i++) {
                let nextXCoord = parseInt(targetId[1]) + i
                if (nextXCoord <= 9) {
                    let nextId = replaceAt(targetId, nextXCoord, 1);
                    let nextTile = document.getElementById(nextId)
                    //console.log(`targetId: ${targetId} nextX: ${nextXCoord} nextId: ${nextId} nextTile: ${nextTile}`);
                    if (nextTile && !nextTile.classList.contains('locked')) {
                        nextTile.classList.remove('boardtileshiphov');
                    }
                }
            }
            break;
    }
}

let shipAlignmentHorizontal = true;

function clickShip(event) {
    shipAlignmentHorizontal = shipAlignmentHorizontal ? false : true;
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
       
        
        boardTiles[i].classList.add("boardtileplacement")
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
                if (allShipsPlaced()) {
                    document.querySelector('.guide').textContent = 'All ships have been placed, the game can now begin';
                    startGame();
                }
            }
        });
    }
    //set display length
    //set direction on 2nd click
}

function addInteractivityBoats() {
    let allBoats = document.querySelectorAll(".boat")
    //console.log(`addInter detected: ${allBoats.length}`);
    for (let i = 0; i < allBoats.length; i++) {
        allBoats[i].addEventListener("click", clickShip)
        //console.log(`Adding inter to boat ${allBoats[i].id} number is: ${i}`);
    }
}

document.querySelector('#startgame').addEventListener('click', startPlacement)

addBoardTiles();
document.querySelector('.guide').textContent = 'Please enter your name above';

let playerName = 'Player 1';

function startPlacement() {
    event.preventDefault();
    playerName = document.querySelector('#name').value;
    if (!playerName) {playerName = 'Player 1'}
    const nameInput = `Welcome ${playerName}. Please place your ships to begin. Click each ship, then choose a valid location on the board`;
    document.querySelector('.guide').textContent = nameInput;
    initPlayers(playerName);
    initBoards();
    addInteractivityBoats();
}

function startGame() {
    event.preventDefault();
    addInteractivityShots();
    placeComputerShips();
    console.log('game started');
}