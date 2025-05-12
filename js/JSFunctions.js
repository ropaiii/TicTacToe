"use strict";



let oGameData = {
    
};

oGameData.initGlobalObject = function() {
    //Datastruktur för vilka platser som är lediga respektive har brickor
    oGameData.gameField = Array('', '', '',
                                '', '', '',
                                '', '', '');
    
    /* Testdata för att testa rättningslösning */
    //oGameData.gameField = Array('X', 'X', 'X', '', '', '', '', '', '');
    //oGameData.gameField = Array('X', '', '', 'X', '', '', 'X', '', '');
    //oGameData.gameField = Array('X', '', '', '', 'X', '', '', '', 'X');
    //oGameData.gameField = Array('', '', 'X', '', 'X', '', 'X', '', '');
    //oGameData.gameField = Array('X', 'O', 'X', '0', 'X', 'O', 'O', 'X', 'O');

    //Indikerar tecknet som skall användas för spelare ett.
    oGameData.playerOne = "X";

    //Indikerar tecknet som skall användas för spelare två.
    oGameData.playerTwo = "O";

    //Kan anta värdet X eller O och indikerar vilken spelare som för tillfället skall lägga sin "bricka".
    oGameData.currentPlayer = "";

    //Nickname för spelare ett som tilldelas från ett formulärelement,
    oGameData.nickNamePlayerOne = "";

    //Nickname för spelare två som tilldelas från ett formulärelement.
    oGameData.nickNamePlayerTwo = "";

    //Färg för spelare ett som tilldelas från ett formulärelement.
    oGameData.colorPlayerOne = "";

    //Färg för spelare två som tilldelas från ett formulärelement.
    oGameData.colorPlayerTwo = "";

    //"Flagga" som indikerar om användaren klickat för checkboken.
    oGameData.timerEnabled = false;

    //Timerid om användaren har klickat för checkboxen. 
    oGameData.timerId = null;

    console.log(oGameData.checkForGameOver);
}


window.addEventListener('load', function(){

    oGameData.initGlobalObject();

    let gameArea = document.querySelector('#game-area');
    gameArea.classList.add("d-none");

    /**
     * Hämtar "Starta" knappen och kollar om man klickar på den eller inte
     * Om den klickas på så hämtas en rad DOMs genom querySelector(#)
     * Sedan kollas det om namnet och färgerna stämmer överens med uppgiften
     * Om de gör det så anropas metoden initiateGame
     * Annars så loggas det error som skedde.
     */
    let newGame = document.querySelector('#newGame');
    newGame.addEventListener('click', function validateForm(){
        let errorTextField = document.querySelector('#errorMsg');
        let tempPlayer1 = document.querySelector('#nick1');
        let tempPlayer2 = document.querySelector('#nick2');
        let tempPlayerColor1 = document.querySelector('#color1');
        let tempPlayerColor2 = document.querySelector('#color2');
        try{
            if(validateNameLength() && validateName() && validateColor()){
                initiateGame.call();
            }
        } catch(error){
            console.log("ERROR: ", error);
        }

        function validateNameLength(){
            if(tempPlayer1.value.length <= 20 && tempPlayer2.value.length <= 20){
                if(tempPlayer1.value.length > 0 && tempPlayer2.value.length > 0){
                    return true;
                }
            } else {
                errorTextField.textContent = "errorMsg";
            }
        }

        function validateName(){
            if(tempPlayer1.value != tempPlayer2.value){
                return true;
            } else {
                errorTextField.textContent = "errorMsg";
            }
        }

        function validateColor(){
            if(tempPlayerColor1.value != tempPlayerColor2.value){
                if(!isBlack() && !isWhite()){
                    return true;
                } else {
                    errorTextField.textContent = "errorMsg";
                }
            } else {
                errorTextField.textContent = "errorMsg";
            }

            function isBlack(){
                let c_black = "#000000";
                if(tempPlayerColor1.value != c_black && tempPlayerColor2.value != c_black){
                    return false;
                }
            }
            function isWhite(){
                let c_white = "#FFFFFF";
                if(tempPlayerColor1.value != c_white && tempPlayerColor2.value != c_white){
                    return false;
                }
            }
        }
    });
});

function initiateGame(){
    document.querySelector('#div-in-form').classList.add("d-none");
    document.querySelector('#game-area').classList.remove("d-none");
    document.querySelector('#errorMsg').textContent = "";
    oGameData.nickNamePlayerOne = document.querySelector('#nick1');
    oGameData.nickNamePlayerTwo = document.querySelector('#nick2');
    oGameData.colorPlayerOne = document.querySelector('#color1');
    oGameData.colorPlayerTwo = document.querySelector('#color2');

    /**
     * Hämtar alla rutor genom querySelectorAll och loopar sedan igenom dom för att ändra
     * alla deras värden på ett enkelt vis.
     * 
     * Därefter så randomiserar jag ett värde mellan 0 och 1.
     * Beroende på värdet så sätts playerOne eller playerTwo att börja. De överförs till
     * lokala variabler från oGameData.
     */

    resetGameBoard();

    let dice = Math.random();
    let playerChar = [oGameData.playerOne, oGameData.playerTwo];
    let playerName = [oGameData.nickNamePlayerOne, oGameData.nickNamePlayerTwo];
    let currplayerName = "";
    let starter = 0;
    if(dice < 0.5){
        starter = 0;
        oGameData.currentPlayer = playerChar[0];
        currplayerName = playerName[0];
        
    } else {
        starter = 1;
        oGameData.currentPlayer = playerChar[1];
        currplayerName = playerName[1];
    }

    let title = document.querySelector('.jumbotron');
    let h1 = title.querySelector('h1');
    let squares = document.querySelectorAll('td');
    h1.textContent = "Välkommen! Gör ditt första drag för att påbörja spelet. Det är " + currplayerName.value + " (" + oGameData.currentPlayer + " ) tur";

    let table = document.querySelector('.ml-auto');
    table.addEventListener('click', function executeMove(event){
        if(event.target.tagName != 'TD'){
            return;
        }
        let tdID = event.target.getAttribute('data-id');

        if(oGameData.gameField[tdID] == ''){

            oGameData.gameField[tdID] = oGameData.currentPlayer;
            event.target.textContent = oGameData.currentPlayer;

            if (oGameData.gameField[tdID] == oGameData.playerOne){
                squares[tdID].textContent = oGameData.playerOne;
                squares[tdID].style.backgroundColor = oGameData.colorPlayerOne.value;
            } else {
                squares[tdID].textContent = oGameData.playerTwo;
                squares[tdID].style.backgroundColor = oGameData.colorPlayerTwo.value;
            }
            currplayerName = playerName[getCurrentPlayerNumber(oGameData.currentPlayer)];
            oGameData.currentPlayer = playerChar[getCurrentPlayerNumber(oGameData.currentPlayer)];

            h1.textContent = "Det är " + currplayerName.value + " (" + oGameData.currentPlayer + ") tur";
            
            if(oGameData.checkForGameOver() == 1 || oGameData.checkForGameOver() == 2 || oGameData.checkForGameOver() == 3){
                table.removeEventListener('click', executeMove);
                document.querySelector('#div-in-form').classList.remove("d-none");
                //document.querySelector('#game-area').classList.add('d-none');
                
                if(oGameData.checkForGameOver() == 1){
                    h1.textContent = "Vinnare är: " + oGameData.nickNamePlayerOne.value + " (" + oGameData.playerOne + ")! Spela igen?";
                } else if(oGameData.checkForGameOver() == 2){
                    h1.textContent = "Vinnare är: " + oGameData.nickNamePlayerTwo.value + " (" + oGameData.playerTwo + ")! Spela igen?";
                } else if(oGameData.checkForGameOver() == 3) {
                    h1.textContent = "Oavgjort!";
                }
                oGameData.initGlobalObject();
            }
        }
    });



}

function resetGameBoard(){
    let squares = document.querySelectorAll('td');
    for(let i = 0; i < squares.length; i++){
        if(oGameData.gameField[i] == oGameData.playerOne){
            squares[i].textContent = oGameData.playerOne;
            squares[i].style.backgroundColor = oGameData.colorPlayerOne.value;
        } else if (oGameData.gameField[i] == oGameData.playerTwo){
            squares[i].textContent = oGameData.playerTwo;
            squares[i].style.backgroundColor = oGameData.colorPlayerTwo.value;
        } else {
            squares[i].textContent = "";
            squares[i].style.backgroundColor = 'white';
        }
    }
}

function getCurrentPlayerNumber(currP){
    if(currP == 'X'){
        return 1;
    } else if(currP == 'O'){
        return 0;
    } else {
        return -1;
    }
}

/**
 * Kontrollerar för tre i rad.
 * returnerar 0 om det inte finns någon vinnare
 * returnerar 1 om spelaren med ett kryss (X) är vinnare,
 * returnerar 2 om spelaren med en cirkel (O) är vinnare eller
 * returnerar 3 om det är oavgjort.
 * Funktionen tar inte emot några värden.
 */
oGameData.checkForGameOver = function() {
    let winner = 0;
    checkHorizontal.call();
    checkVertical.call();
    checkDiagonalLeftToRight.call();
    checkDiagonalRightToLeft.call();

    //Om ingen vinnare har satts ännu, kolla om det är lika.
    if(winner == 0){
        checkTie.call();
    }


    function checkHorizontal(){
        for(let i = 0; i < oGameData.gameField.length; i++){
            if(i == 0 || i == 3 || i == 6){
                if(oGameData.gameField[i] == oGameData.playerOne && oGameData.gameField[i+1] == oGameData.playerOne && oGameData.gameField[i+2] == oGameData.playerOne){
                    winner = 1;
                } else if(oGameData.gameField[i] == oGameData.playerTwo && oGameData.gameField[i+1] == oGameData.playerTwo && oGameData.gameField[i+2] == oGameData.playerTwo){
                    winner = 2;
                }
            }
        }
    }
   
    function checkVertical(){
        for(let i = 0; i < oGameData.gameField.length; i++){
            if(i == 0 || i == 1 || i == 2){
                if(oGameData.gameField[i] == oGameData.playerOne && oGameData.gameField[i+3] == oGameData.playerOne && oGameData.gameField[i+6] == oGameData.playerOne){
                    winner = 1;
                } else if(oGameData.gameField[i] == oGameData.playerTwo && oGameData.gameField[i+3] == oGameData.playerTwo && oGameData.gameField[i+6] == oGameData.playerTwo){
                    winner = 2;
                }
            }
        }
    }
   
    function checkDiagonalLeftToRight(){
        let pattern = Array('P','','','','P','','','','P');
        let countPlayerOne = 0;
        let countPlayerTwo = 0;

        for(let i = 0; i < pattern.length; i++){
            if(pattern[i] == 'P'){
                if(oGameData.gameField[i] == oGameData.playerOne){
                    countPlayerOne++;
                } else if(oGameData.gameField[i] == oGameData.playerTwo){
                    countPlayerTwo++;
                }
            }
        }
        
        if(countPlayerOne == 3){
            winner = 1;
        } else if(countPlayerTwo == 3){
            winner = 2;
        }
    }

    function checkDiagonalRightToLeft(){
        let pattern = Array('','','P','','P','','P','','');
        let countPlayerOne = 0;
        let countPlayerTwo = 0;

        for(let i = 0; i < pattern.length; i++){
            if(pattern[i] == 'P'){
                if(oGameData.gameField[i] == oGameData.playerOne){
                    countPlayerOne++;
                } else if(oGameData.gameField[i] == oGameData.playerTwo){
                    countPlayerTwo++;
                }
            }
        }

        if(countPlayerOne == 3){
            winner = 1;
        } else if(countPlayerTwo == 3){
            winner = 2;
        }
    }

    function checkTie(){
        let count = 0;
        for(let i = 0; i < oGameData.gameField.length; i++){
            if(oGameData.gameField[i] == oGameData.playerOne || oGameData.gameField[i] == oGameData.playerTwo){
                count++;
            }

            if(count == 9){
                winner = 3;
            }
        }
    }

    return winner;
}

oGameData.load = function(){
    
}

