const domBoard = document.querySelector(".spaces");
const status = document.querySelector(".status");
const cols = document.querySelectorAll(".col");
const playeroneinput = document.querySelector("#playeronename");
const playertwoinput = document.querySelector("#playertwoname");


function Gameboard() {
    const rows = 3;
    const columns = 3;
    const board = [];
    let turns = 0;

    /*
        [     (0, 1)  (1, 1)  (2, 2)
               (0, 2) ( 1, 1) (2, 0) 
            [Space(),Space(),Space()],
            [Space(),Space(),Space()],
            [Space(),Space(),Space()],
        ]
    */

    for (let i = 0; i < rows; i++){
        board[i] = [];
        for (let j = 0; j < columns; j++){
            board[i].push(Space());
        }
    }

    const getBoard = () => board;

    const placeMark = (row, column, player) => {
        const availableSpace = () => board[row][column].getValue == 0;
        
        if (availableSpace) {
            board[row][column].addMark(player);
            turns++;
            return true;
        } 
        return false;
    }

    const isWinner = (player) => {
        if (turns < 5) return false;
        for (let row = 0; row < rows; row++){
            if (board[row][0].getValue() === board[row][1].getValue() 
            && board[row][1].getValue() === board[row][2].getValue() && board[row][0].getValue() === player){
                return true;
            }
        }
        for (let col = 0; col < columns; col++){
            if (board[0][col].getValue() === board[1][col].getValue() 
            && board[1][col].getValue() === board[2][col].getValue() && board[0][col].getValue() === player){
                return true;
            }
        }

        //  (0, 1)  (1, 1)  (2, 2)
        //  (0, 2) ( 1, 1) (2, 0) 
        if (
            (board[0][0].getValue() === player && board[1][1].getValue() === player && board[2][2].getValue() === player) ||
            (board[0][2].getValue() === player && board[1][1].getValue() === player && board[2][0].getValue() === player)
        ) {
            return true;
        }


        return false;
    }
    const printBoard = () => {
        const boardWithCellValues = board.map((row) => row.map((space) => space.getValue()))
        console.log(boardWithCellValues);
    }

    return {
        getBoard,
        printBoard,
        placeMark,
        isWinner
    }
}

function Space() {
    let value = 0;

    const addMark = (player) => {
        value = player;
    }

    const getValue = () => value;
    
    return {
        addMark,
        getValue
    };
}


function GameController(playerOneName = "Player One", playerTwoName = "Player Two"){
    const board = Gameboard();
    let hasWinner = false;
    let winner = null;
    const players = [
        {
          name: playerOneName,
          mark: 1
        },

        {
           name: playerTwoName,
           mark: 2
        }
    ]

    let activePlayer = players[0];

    const switchActivePlayer = () =>  {
        activePlayer = activePlayer === players[0] ? players[1] : players[0]; 
    };
    const getActivePlayer = () => activePlayer;
    const getHasWinner = () => hasWinner;
    const getWinner = () => winner;

    const printNewRound = () => {
        board.printBoard();
        console.log(`${activePlayer.name}'s turn.`);
    }


    const playRound = (row, column) => {
        if (hasWinner) return;
        console.log(`${activePlayer.name} attempts to place their mark on Row:${row}/Column:${column}`);
        
        const placed = board.placeMark(row, column, activePlayer.mark);

        if (placed) {
            console.log(`${activePlayer.name} successfully placed their mark on Row:${row}/Column:${column}`);

            if (board.isWinner(activePlayer.mark)) {
                console.log(`${activePlayer.name} has WON the game.`);
                hasWinner = true;
                winner = activePlayer.name;
            } else {
                switchActivePlayer();
            }
           
        } else {
            console.log(`that space is already taken! ${activePlayer.name}'s turn still. Make sure to pick a available space`);
        }
    }


    printNewRound();

    return {
        playRound,
        getActivePlayer,
        getBoard: board.getBoard,
        getHasWinner,
        getWinner
    }
}


function ScreenController(game){
    const clearDomBoard = () => {
        for (const row of domBoard.children) {
            for (const col of row.children){
                col.textContent = '';
            }
          }
    }

    const updateDisplay = (text) => {
        status.textContent = text;
    }

    const renderBoard = () => {
        const currentBoard = game.getBoard();
        for (let row = 0; row < currentBoard.length; row++){
            for (let col = 0; col < currentBoard[row].length; col++){
               const rowcol = domBoard.querySelector(`#row-${row}`).querySelector(`#col-${col}`);
               rowcol.textContent = currentBoard[row][col].getValue() === 0  ? '' : currentBoard[row][col].getValue() === 1  ? 'X' : 'O';
            }
        }
    }
    const updateScreen = () => {
        const activePlayer = game.getActivePlayer();
        clearDomBoard();
        renderBoard();   
        if (game.getHasWinner()) {
            updateDisplay(`${game.getWinner()} has WON the game! 🎉`);
        } else {
            updateDisplay(`${activePlayer.name}'s turn`);
        }
    }

    const clickHandlerBoard = (button) => {
        console.log(game.getHasWinner()) 
        const row = button.parentElement.dataset.row;
        const col = button.dataset.col;
        game.playRound(row, col);
        updateScreen();
    }
    return {
        clickHandlerBoard,
        clearDomBoard
    }
}


function newGame(){
    const input1 = playeroneinput.value;
    const input2 = playertwoinput.value;
    
    if (input1 === '' || input2 === '') {
        // The input is empty
        status.textContent = 'Empty names';
        return null;
      } else {
        const game = GameController(input1, input2);
        return game;
      }

}

let game = null;
let uiHandler = ScreenController(game);


cols.forEach((col) => {
    col.addEventListener('click', () => {
        if (game === null) {
            game = newGame();
            uiHandler = ScreenController(game); 
            uiHandler.clickHandlerBoard(col);
        } else if(game.getHasWinner()) {
            game = newGame();
            uiHandler = ScreenController(game); 
            uiHandler.clearDomBoard();
            uiHandler.clickHandlerBoard(col);
        } else {
            uiHandler.clickHandlerBoard(col);
        }
    })
})



/*

This here is the meat and potatoes of our screen controller. Here is what this method does, in order:

Clear the DOM of the current board display by simply setting the .board div's text content to an empty string.
Get the most up-to-date board from the game controller.
Get the most up-to-date active player from the game controller.
Render the player's turn in the .turn div.
Render each grid square on the DOM
I make sure to give each cell a data-attribute of column and set that value to the index of the cell in its row, so that when we click them in the future, we already have access to what column that cell is in.
The cells are buttons, not divs. Why? In most cases, anything clickable should be a button or link. This enables those with accessability issues to still be able to use our site easily be tabbing and selecting with the keyboard.
The purpose of this method is to refresh our screen whenever a change happens in our game. It will be called whenever the user interacts with the game, like to play a round.
*/
