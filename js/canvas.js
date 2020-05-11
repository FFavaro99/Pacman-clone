

const canvas = document.querySelector('canvas');
canvas.width = 750;
canvas.height = 750;
const ctx = canvas.getContext('2d');

let vulnerable = false;
let beginning = true;


//Generating map here, by hardcoding a quarter of it and repeating it 4 times

const map =  [[1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 0], 
              [1, 3, 0, 0, 0, 0, 0, 1, 2, 1, 0],
              [1, 0, 1, 1, 0, 1, 0, 1, 2, 1, 0],
              [1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 0],
              [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
              [1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0],
              [1, 0, 1, 1, 0, 0, 0, 1, 2, 2, 2],
              [1, 0, 1, 1, 0, 1, 0, 1, 2, 1, 2],
              [1, 0, 0, 0, 0, 1, 0, 0, 2, 2, 2],
              [1, 1, 1, 1, 0, 1, 1, 1, 2, 2, 2]];
         
              
function fillMapArray(){
    for (let column of map){
        for (let i = column.length - 2; i >= 0; i--){
            column.push(column[i]);
        }
    }

    for (let col = map.length - 2; col >= 0; col--){
        map.push(map[col]);
    }
}



function printMap(){
    for (let column = 0; column < map.length; column++){
        for (let row = 0; row < map[0].length; row++){
            if (map[column][row] == 1){
                drawMapTile(column, row);
            }
        }
    }
}


function drawMapTile(column, row){
    const width = canvas.width/19;
    const height = canvas.height/21;
    let x = width*column;
    let y = height*row;
    ctx.fillStyle = 'blue';
    ctx.fillRect(x, y, width, height);
}

function findAdjacentTiles(column, row){
    const adjacentArray = [];
    if (column > 0){
        if (map[column - 1][row] != 1){
            adjacentArray.push({column: column - 1, row: row});
        }
    }
    if (column < 18 && column != 0){
        if (map[column + 1][row] != 1){
            adjacentArray.push({column: column + 1, row: row});
        }
    }
    if (row > 0 && column < 18 && column >= 0){
        if (map[column][row - 1] != 1){
            adjacentArray.push({column: column, row: row - 1});
        }
    }
    if (row < 20 && column < 18 && column >= 0){
        if (map[column][row + 1] != 1){
            adjacentArray.push({column: column, row: row + 1});
        }
    }
    return adjacentArray;
}


//Convert functions: coordinates to cell, cell to coordinate

function coordsToTile(x, y){
    const width = canvas.width/19;
    const height = canvas.height/21;

    return {column: Math.floor(x/width), row: Math.floor(y/height)};
}

function tileToCoords(col, row){
    const width = canvas.width/19;
    const height = canvas.height/21;

    x = col*width + width/2;
    y = row*height + height/2;

    return {x: x, y: y};
}

//Pacman class


class Player {
    constructor(){
        let coords = tileToCoords(9, 16);
        this.x = coords.x;
        this.y = coords.y;
        this.velocity = 3.5;
        this.direction = 'none';
        this.radius = canvas.height/44
        this.lives = 3;
    }

    draw(){
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
        ctx.fillStyle = 'yellow';
        ctx.fill();
        ctx.stroke();
    }

    checkCollision(){
        let tile;
        switch (this.direction){
            case 'right':
                tile = coordsToTile(this.x - this.radius, this.y);
                if ( tile.column < 18 && tile.column > 0 && map[tile.column + 1][tile.row] == 1){
                    this.direction = 'none';
                }
                break;
            case 'left':
                tile = coordsToTile(this.x + this.radius, this.y);
                if (tile.column > 0 && tile.column < 18 && map[tile.column - 1][tile.row] == 1){
                    this.direction = 'none';
                }
                break;
            case 'up':
                tile = coordsToTile(this.x, this.y + this.radius);
                if (map[tile.column][tile.row] == 1){
                    this.direction = 'none';
                }
                break;
            case 'down':
                tile = coordsToTile(this.x, this.y - this.radius);
                if (map[tile.column][tile.row] == 1){
                    this.direction = 'none';
                }
                break;
        }
    }

    move(e){
        let keyCode = e.keyCode;
        switch(keyCode){
            case 39:
                pacman.direction = 'right';
                break;
            case 37:
                pacman.direction = 'left';
                break;
            case 40:
                pacman.direction = 'up';
                break;
            case 38:
                pacman.direction = 'down';
                break;
        }
    }
    

    update(){
        this.checkCollision();
        switch (this.direction){
            case 'right':
                this.x += this.velocity;
                break;
            case 'left':
                this.x -= this.velocity;
                break;
            case 'up':
                this.y += this.velocity;
                break;
            case 'down':
                this.y -= this.velocity;
                break;
        }
        if (this.x > canvas.width + this.radius){
            this.x = -this.radius;
        }
        else if (this.x < -this.radius){
            this.x = canvas.width + this.radius;
        }
        else if (this.y > canvas.height + this.radius){
            this.y = -this.radius;
        }
        else if (this.y < -this.radius){
            this.y = canvas.height + this.radius;
        }
        this.draw();
    }
}

const pacman = new Player();


class Food {
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.eaten = false;
    }

    draw(){
        ctx.beginPath();
        ctx.arc(this.x, this.y, 5, 0, Math.PI*2, false);
        ctx.fillStyle = 'yellow';
        ctx.fill();
        ctx.stroke();
    }

    update(x, y){
        if (Math.sqrt(Math.abs(x - this.x)*Math.abs(x - this.x) + Math.abs(y - this.y)*Math.abs(y - this.y)) < canvas.width/44 & !this.eaten){
            this.eaten = true;
        }
        if (!this.eaten){
            this.draw();
        }
    }

}

class SpecialFood {
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.eaten = false;
    }

    draw(){
        ctx.beginPath();
        ctx.arc(this.x, this.y, 8, 0, Math.PI*2, false);
        ctx.fillStyle = 'yellow';
        ctx.fill();
        ctx.stroke();
    }

    update(x, y){
        if (Math.sqrt(Math.abs(x - this.x)*Math.abs(x - this.x) + Math.abs(y - this.y)*Math.abs(y - this.y)) < canvas.width/44 && !this.eaten){
            this.eaten = true;
            vulnerable = true;
            setTimeout(()=>{vulnerable = false; console.log(vulnerable)}, 5000);
        }
        if (!this.eaten){
            this.draw();
        }
    }

}

class Ghost {
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.velocity = 2.8;
        this.direction = 'none';
        this.radius = canvas.height/44;
        this.eaten = true;
        this.originalX = x;
        this.originalY = y;
    }

    draw(){
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
        if (!vulnerable && !this.eaten)
            ctx.fillStyle = 'red';
        else ctx.fillStyle = 'azure';
        ctx.fill();
        ctx.stroke();
    }


    moveToTile(myTile, tile2){
        if (myTile.column < tile2.column){
            this.direction = 'right';
        }
        else if (myTile.column > tile2.column){
            this.direction = 'left';
        }
        else if (myTile.row < tile2.row){
            this.direction = 'down';
        }
        else if (myTile.row > tile2.row){
            this.direction = 'up';
        }
    }


    findPath(target, lastTile = {column: -1, row: -1}, history = []){

        if (target.column < 18 && target.column > 0 && !vulnerable){
            let myTile = coordsToTile(this.x, this.y);
            let adjTiles = findAdjacentTiles(target.column, target.row);

            let minDistanceIndex = 0;
            let minDistance = 1000;
            let currentDistance = 0;

            for (let tile of history){
                if (target.column == tile.column && target.row == tile.row || target.column > 18 || target.column < 0){
                    this.moveToTile(myTile, findAdjacentTiles(myTile.column, myTile.row)[0]); //adjTiles[0]); was clearly incorrect
                    return 0;
                }
            }

            for (let i = 0; i < adjTiles.length; i++){
                if (adjTiles[i].column == myTile.column && adjTiles[i].row == myTile.row){
                    this.moveToTile(myTile, target);
                    return 0;
                }
                else if ((adjTiles[i].column != lastTile.column || adjTiles[i].row != lastTile.row)){
                    currentDistance = Math.abs(myTile.column - adjTiles[i].column) + Math.abs(myTile.row - adjTiles[i].row);
                    if (currentDistance < minDistance){
                        minDistance = currentDistance;
                        minDistanceIndex = i;
                    }
                }
            }
            history.push(target);
            this.findPath(adjTiles[minDistanceIndex], target, history);
        }
        else {
            this.direction = 'none';
        }
    }

    update(){
        this.findPath(coordsToTile(pacman.x, pacman.y));

        if (this.eaten){
            this.direction = 'none';
        }
        switch (this.direction){
            case 'right':
                this.x += this.velocity;
                break;
            case 'left':
                this.x -= this.velocity;
                break;
            case 'down':
                this.y += this.velocity;
                break;
            case 'up':
                this.y -= this.velocity;
                break;
        }

        this.draw();

    }
}


fillMapArray();


function populateFoodArray(){
    const width = canvas.width/19;
    const height = canvas.height/21;
    let foodArray = [];
    for (let column = 0; column < map.length; column++){
        for (let row = 0; row < map[0].length; row++){
            if (map[column][row] == 0){
                foodArray.push(new Food(column*width + width/2, row*height + height/2));
            }
            else if (map[column][row] == 3){
                let coords = tileToCoords(column, row);
                foodArray.push(new SpecialFood(coords.x, coords.y));
            }
        }
    }
    return foodArray;
}

const foodArray = populateFoodArray();


const ghostArray = [];

ghostArray.push(new Ghost(tileToCoords(8, 9).x, tileToCoords(8, 9).y));
ghostArray.push(new Ghost(tileToCoords(10, 9).x, tileToCoords(10, 9).y));
ghostArray.push(new Ghost(tileToCoords(8, 11).x, tileToCoords(8, 11).y));
ghostArray.push(new Ghost(tileToCoords(10, 11).x, tileToCoords(10, 11).y));

function contact(){
    let ghostTile;
    let pacTile = coordsToTile(pacman.x, pacman.y);
    for (let ghost of ghostArray){
        ghostTile = coordsToTile(ghost.x, ghost.y);
        if (ghostTile.column == pacTile.column && ghostTile.row == pacTile.row){
            if (vulnerable){
                ghost.x = ghost.originalX;
                ghost.y = ghost.originalY;
                ghost.eaten = true;
                setTimeout(()=> ghost.eaten = false, 8000);
            }
            else {
                let coords = tileToCoords(9, 16);
                pacman.x = coords.x;
                pacman.y = coords.y;
            }
        }
    }
}

function animate(){
    if (beginning){
        biginning = false;
        for (let ghost of ghostArray){
            setTimeout(()=>ghost.eaten = false, 2000);
        }
    }
    requestAnimationFrame(animate);
    contact();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    printMap();
    for (food of foodArray){
        food.update(pacman.x, pacman.y);
    }
    for (let ghost of ghostArray){
        ghost.update();
    }
    pacman.update();

}

document.addEventListener('keydown', (e)=>(pacman.move(e)));
canvas.addEventListener('click', (e)=>{
    let x = e.x - canvas.getBoundingClientRect().left;
    let y = e.y - canvas.getBoundingClientRect().top;
    console.log(coordsToTile(x, y));
})
animate();
