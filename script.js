const board = document.querySelector(".board");
const StartButton = document.querySelector(".btn-start");
const Modal = document.querySelector(".modal");
const StartGameModal = document.querySelector(".start-game");
const GameOverModal = document.querySelector(".game-over");
const restartButton = document.querySelector(".btn-restart");

const HighScoreElement = document.querySelector("#High-Score");
const ScoreElement = document.querySelector("#Score");
const TimeElement = document.querySelector("#Time");

const blockHeight = 50;
const blockWidth = 50;
let IntervalId = null;
let TimerIntevalId = null;

let HighScore = localStorage.getItem("HighScore") || 0;
let Score = 0;
let Time = `00-00`;

HighScoreElement.innerText = HighScore;


const cols = Math.floor(board.clientWidth / blockWidth);
const rows = Math.floor(board.clientHeight / blockHeight);

let food = {x: (Math.floor(Math.random()*rows)),
            y: (Math.floor(Math.random()*cols))
}

const blocks = [];

let snake = [{
    x:1, y:3
}];

let direction = "down";

for(row = 0; row<rows; row++){
    for(col = 0; col<cols; col++){
        const block = document.createElement("div");
        block.classList.add("block");
        board.appendChild(block);
        // block.textContent = `${row} x ${col}`;
        blocks[`${row}-${col}`] = block;
    }
}

function render(){

    let head = null;

    blocks[`${food.x}-${food.y}`].classList.add("food");

    if(direction === "left"){
        head = {x:snake[0].x, y:snake[0].y - 1}
    }else if(direction === "right"){
        head = {x:snake[0].x, y:snake[0].y + 1}
    }else if(direction === "down"){
        head = {x:snake[0].x + 1, y:snake[0].y}
    }else if(direction === "up"){
        head = {x:snake[0].x - 1, y:snake[0].y}
    }

    // wall colission
    if(head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols){
        clearInterval(IntervalId);

        Modal.style.display = "flex";
        StartGameModal.style.display = "none";
        GameOverModal.style.display = "flex";

        return;
    }

    // food 
    if(head.x === food.x && head.y === food.y){
            blocks[`${food.x}-${food.y}`].classList.remove("food");
            food = {x: (Math.floor(Math.random()*rows)), y: (Math.floor(Math.random()*cols)) }
            blocks[`${food.x}-${food.y}`].classList.add("food");

            snake.unshift(head);
            Score += 10;
            ScoreElement.innerText = Score;

            if(Score > HighScore){
                HighScore = Score;
                localStorage.setItem("HighScore", HighScore.toString()
                );
            }
    }

    snake.forEach((segment)=>{
        blocks[`${segment.x}-${segment.y}`].classList.remove("fill");
    });

    snake.unshift(head);
    snake.pop();

    snake.forEach((segment)=>{
        blocks[`${segment.x}-${segment.y}`].classList.add("fill");
    });
}

StartButton.addEventListener("click", () => {
    Modal.style.display = "none";
    IntervalId = setInterval(() => {render() }, 300);
    TimerIntevalId = setInterval(() => {
        let [min,sec] = Time.split("-").map(Number);

        if(sec == 59){
            min+=1;
            sec = 0;
        }
        else{
            sec+=1
        }

        Time = `${min}-${sec}`;
        TimeElement.innerText = Time;

    }, 1000);
});

restartButton.addEventListener("click", restartGame);

function restartGame(){

    blocks[`${food.x}-${food.y}`].classList.remove("food");
    snake.forEach(segment => {
        blocks[`${segment.x}-${segment.y}`].classList.remove("fill");
    });

    Score = 0;
    Time = `00-00`;

    ScoreElement.innerText = Score;
    TimeElement.innerText = Time;
    HighScoreElement.innerText = HighScore;

    Modal.style.display = "none";
    direction = "down";
    snake = [{x:1, y:3}];
    food = {x: (Math.floor(Math.random()*rows)),y: (Math.floor(Math.random()*cols)) }
    IntervalId = setInterval(() => {render() }, 300);
}

addEventListener("keydown", (event) => {
    if(event.key === "w"){
        direction = "up";
    }else if(event.key === "s"){
        direction = "down";
    }else if(event.key === "d"){
        direction = "right";
    }else if(event.key === "a"){
        direction = "left";
    }
});