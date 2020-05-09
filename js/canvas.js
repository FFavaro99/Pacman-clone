

const canvas = document.querySelector('canvas');
canvas.width = 750;
canvas.height = 750;
const ctx = canvas.getContext('2d');


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
        if (Math.sqrt(Math.abs(x - this.x)*Math.abs(x - this.x) + Math.abs(y - this.y)*Math.abs(y - this.y)) < canvas.width/44){
            this.eaten = true;
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
        this.vulnerable = false;
        this.velocity = 4;
        this.direction = 'none';
    }

    draw(){
        ctx.beginPath();
        ctx.arc(this.x, this.y, 30, 0, Math.PI*2, false);
        if (!this.vulnerable)
            ctx.fillStyle = 'red';
        else ctx.fillStyle = 'blue';
        ctx.fill();
        ctx.stroke();
    }


    //TO BE THOUGHT AND IMPLEMENTED
    findPath(x, y, lastTile = coordsToTile(x, y)){
        let pacTile = coordsToTile(x, y);
        let myTile = coordsToTile(this.x, this.y);
    }

    update(){

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
        }
    }
    return foodArray;
}

const foodArray = populateFoodArray();



const pacman = new Player();

//This to be moved into the player class
function move(e){
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



function animate(){
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    printMap();
    pacman.update();
    for (food of foodArray){
        food.update(pacman.x, pacman.y);
    }
}

document.addEventListener('keydown', (e)=>(move(e)));
canvas.addEventListener('click', (e)=>{
    let x = e.x - canvas.getBoundingClientRect().left;
    let y = e.y - canvas.getBoundingClientRect().top;

    console.log(coordsToTile(x, y));
})
animate();
