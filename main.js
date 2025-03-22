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
        if (board[0][1].getValue() === board[1][1].getValue() &&  board[1][1].getValue() === board[2][2].getValue() && board[0][1].getValue() === player) {
            return true;
        }
        if (board[0][2].getValue() === board[1][1].getValue() &&  board[1][1].getValue() === board[2][0].getValue() && board[0][2].getValue() === player) {
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

    const printNewRound = () => {
        board.printBoard();
        console.log(`${activePlayer.name}'s turn.`);
    }

    const playRound = (row, column) => {
        console.log(`${activePlayer.name} attempts to place their mark on Row:${row}/Column:${column}`);
        
        const placed = board.placeMark(row, column, activePlayer.mark);

        if (placed) {
            console.log(`${activePlayer.name} successfully placed their mark on Row:${row}/Column:${column}`);

            const Won = board.isWinner(activePlayer.mark);
            if (Won){
                console.log(`${activePlayer.name} has WON the game.`);
            } else {
                 console.log(`${activePlayer.name} WON: ${Won}`);
                switchActivePlayer();
                printNewRound();
            }
           
        } else {
            console.log(`that space is already taken! ${activePlayer.name}'s turn still. Make sure to pick a available space`);
        }
    }


    printNewRound();

    return {
        playRound,
        getActivePlayer
    }
}


const game = GameController();