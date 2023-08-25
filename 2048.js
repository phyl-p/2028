var board;
var score = 0;
var rows = 4;
var columns = 4;

window.onload = function(){
    setGame();
}

function setGame(){
    // board = [[2,0,8182,0],
    //          [0,0,0,256],
    //          [0,128,0,0],
    //          [2048,1024,4,0]
    // ] 
    // board = [[,2,2,2],
    //          [2,2,2,2],
    //          [4,4,8,8],
    //          [4,4,8,8],
    // ] 
    board = [[0,0,0,0],
             [0,0,0,0],
             [0,0,0,0],
             [0,0,0,0],
    ];
    
    for (let r = 0; r < rows; r++){
        for (let c = 0; c < columns; c++){
            // iterate through every position on board
            // create a tile for each position
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString(); //set the id of the tile to be the right coordinates
            let num = board[r][c]; //get the number from the position on the board 
            
            //call updateTile on the tile to update tile color
            updateTile(tile, num);

            document.getElementById("board").append(tile);
        }
    }
    addNewTile(); //add two new tiles of 2 to initialize the game
    addNewTile();
}

//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
  }

//this function adds a new tile after each sliding action
function addNewTile(){
    let r = 0;
    let c = 0;
    found = 0;
    while (!found){
        r = parseInt(getRandomIntInclusive(0, 3));
        c = parseInt(getRandomIntInclusive(0, 3));
        if (board[r][c] == 0){
            found = 1;
        }
    }
    console.log(r);
    console.log(c);
    board[r][c] = 2;
    let tile = document.getElementById(r.toString() + '-' + c.toString());
    tile.id = r.toString() + "-" + c.toString(); //set the id of the tile to be the right coordinates
    updateTile(tile, 2);
}

//this function updates the tile innertext and the tile tile color to the correct color
function updateTile(tile, num){
    tile.innerText = "";
    tile.classList.value = ""; //clear the classList
    tile.classList.add("tile");
    if (num > 0){
        tile.innerText = num;

        //the logic puts the tile to the right class
        if (num <= 4096){
            tile.classList.add("t"+num.toString());
        } else{
            tile.classList.add("t8192"); //values greater than 8192 dont have their own color
        }
    }
}

//section  updates the board as the user indicates board changes
document.addEventListener("keyup",(e)=>{
    if(e.code == "ArrowLeft"){ 
        slideLeft();
        
    }else if(e.code == "ArrowRight"){
        slideRight();
    }else if(e.code == "ArrowUp"){
        slideUp();
    }else if(e.code == "ArrowDown"){
        slideDown();
    }
    addNewTile();
    document.getElementById("score").innerText = score;
})

function filterZero(row){
    return row.filter(num => num != 0); // return a new arrau without zeros
}

function slide(row){
    // eg, [0,2,2,2]
    row = filterZero(row); // step 1 gets rid of 0s -> [2,2,2]

    //step 2: check from left to right, 
    for (let i = 0; i < row.length - 1; i++){ //uncertain how many elements in row, therefore use row.length
        //check every 2 elements
        if (row[i] == row[i+1]){
            row[i] *= 2; //double row[i] if mergeable
            row[i+1] = 0; //make the next element 0, since added/slided this pair already
            score += row[i];
        } //eg, [4, 4, 4] -> [8, 0, 4]
    }
    row = filterZero(row); 
    while (row.length < columns){
        row.push(0); //append appropriate number of 0 to the back fo the row
    }

    return row;

}
function slideLeft(){
    //slide left deals with rows, iterate through rows
    for (let r = 0; r < rows; r++){
        let row = board[r];
        row = slide(row);
        board[r] = row; //update the row in the actual board
        
        //updates each tile to their relevant color
        for (let c = 0; c < columns; c++){
            let tile = document.getElementById(r.toString() + '-' + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function slideRight(){
    //slide left deals with rows, iterate through rows
    for (let r = 0; r < rows; r++){
        let row = board[r].reverse();
        row = slide(row);
        board[r] = row.reverse(); //update the row in the actual board
        
        //updates each tile to their relevant color
        for (let c = 0; c < columns; c++){
            let tile = document.getElementById(r.toString() + '-' + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function slideUp(){
    //reuse slide left for columns
    //first find each col, iterate through each row for each col
    for (let c = 0; c < columns; c++){
        let col = [];
        for (let r = 0; r < rows; r++){
            col.push(board[r][c])
        }
        
        col = slide(col);
        
        //update board
        for (let r = 0; r < rows; r++){
            board[r][c] = col[r]
        }
                
        //updates each tile to their relevant color
        for (let r = 0; r < rows; r++){
            let tile = document.getElementById(r.toString() + '-' + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function slideDown(){
    //reuse slide left for columns
    //first find each col, iterate through each row for each col
    for (let c = 0; c < columns; c++){
        let col = [];
        for (let r = 0; r < rows; r++){
            col.push(board[r][c])
        }
        
        col = slide(col.reverse()).reverse();
        
        //update board
        for (let r = 0; r < rows; r++){
            board[r][c] = col[r]
        }
                
        //updates each tile to their relevant color
        for (let r = 0; r < rows; r++){
            let tile = document.getElementById(r.toString() + '-' + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}