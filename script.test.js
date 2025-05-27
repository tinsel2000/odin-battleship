import {initPlayers, initBoards, placeUserShips, placeComputerShips, turnPlayer, turnComputer} from './gameControl.js';


test('Game creation', () => {
    expect(createShip(5)).toBe(5);
    expect(newShip.hits).toBe(0)
})
