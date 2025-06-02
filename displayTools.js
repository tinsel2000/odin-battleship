
function replaceAt(string, char, index) {
  return string.substr(0, index) + char + string.substr(index + 1);
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
};

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

export {getRandomInt, replaceAt, convertCoordsBack, convertCoordsFront};