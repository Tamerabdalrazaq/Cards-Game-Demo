// HTML ELEMENTS
let boardHTML = document.querySelector('.board');
let menuHTML = document.querySelector('.menu');
let startBtn = document.querySelector('#btnStart');
let input1 = document.getElementById('input1');
let input2 = document.getElementById('input2');
let tries = document.getElementById('tries');
menuHTML.style = `top: 40%; left:35%; visibility:visible; opacity:1;`;

let numOfCards;
const cardsValues = ['A','2','3','4','5','6','7','8','9','J','Q','K'];
const cardsTypes = ['H','D','C','S'];
let gameCards, board;
let firstTwin,firstGuessedCard, firstGuess, freeze, numOfTries;
let guessedCards;

startBtn.addEventListener('click', function(){
    numOfCards = input1.value*input2.value;
    menuHTML.style = `top: -1rem; left:0; visibility:hidden; opacity:0;`;
    boardHTML.style = `grid-template-columns: repeat(${input1.value},5rem);`
    startGame();
});

function startGame(){
    gameCards = [];
    board = [];
    firstTwin = null,firstGuessedCard = null, firstGuess = true, freeze = false, numOfTries = 10;
    guessedCards = 0
    for(let x = 0; x<numOfCards; x++){
        board.push({
        cardType: null,
        twin: null,
        position: x,
        elementHTML: null,
        });
    }
    createBoard(numOfCards);
    appendCards();
    console.log((board));
    setTimeout(stopGame ,60000);
    board.forEach(c => c.elementHTML.addEventListener('click', cardClick));
}

function stopGame(){
    board.forEach(c => c.elementHTML.removeEventListener('click', cardClick));
    menuHTML.style = `top: 40%; left:35%; visibility:visible; opacity:1;`
}

function cardClick(e){
    console.log('clic')
    if(!freeze){
        let clickedCard = (e.target.parentElement);
        let index = clickedCard.dataset.index;
        clickedCard.firstChild.style = 'opacity: 0;'
        if(firstGuess){
            firstGuessedCard = clickedCard;
            firstGuess = false;
        }

        else{
            if(board[firstGuessedCard.dataset.index].twin == index){
                console.log('true');
                guessedCards += 2;
                if(guessedCards == numOfCards){
                    alert('finished')
                    stopGame();
                }
                firstGuessedCard.removeEventListener('click',cardClick);
                clickedCard.removeEventListener('click',cardClick);
            }
            else{
                freeze = true;
                tries.innerHTML = --numOfTries
                
                setTimeout(() => {
                    clickedCard.firstChild.style = 'opacity: 1;';
                    firstGuessedCard.firstChild.style = 'opacity: 1;';
                    freeze = false;
                }, 1000);
                if(!numOfTries){
                    stopGame();
                }
            }
            
            firstGuess = true; 
        }
    }
}


function createBoard(n){
    for(let x = 0; x< n; x++){
        let freeSlots = board.filter(c => c.cardType==null);
        let randomPlace = freeSlots[generateRandom(0, freeSlots.length-1)].position;
        let cardType;
        if(firstTwin == null){
            do{
                cardType = (cardsValues[generateRandom(0,cardsValues.length -1)]+cardsTypes[generateRandom(0,cardsTypes.length -1)]);
            }
            while((gameCards.includes(cardType)))   
            gameCards.push(cardType)
            firstTwin = randomPlace;
        }
        else{
            cardType = board[firstTwin].cardType;
            board[firstTwin].twin = randomPlace;
            board[randomPlace].twin = firstTwin;
            firstTwin = null;
        }
        board[randomPlace].cardType = cardType;
        createHTMLCard(randomPlace);
    }
}


function createHTMLCard(index){
    let card = document.createElement('div');
    card.classList.add('card');
    card.dataset.index = index;
    card.style = 
    `background: url('https://deckofcardsapi.com/static/img/${board[index].cardType}.png') no-repeat center center/cover;`;
    card.innerHTML = `<div class = "hidden"></div>`
    board[index].elementHTML = card;
}

function appendCards(){
    boardHTML.innerHTML = '';
    board.forEach(el => {
        boardHTML.appendChild(el.elementHTML);
    });
}



function generateRandom(a,b){
    return Math.floor(a + Math.random()* (b-a+1));
}