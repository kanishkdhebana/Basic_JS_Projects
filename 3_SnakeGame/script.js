const gameCanvas = document.getElementById('gameCanvas') ;
const ctx = gameCanvas.getContext('2d') ;
const scoreElement = document.getElementById('score') ;
const gameOverScreen = document.getElementById('gameOverScreen') ;
const playAgainButton = document.getElementById('playAgainButton') ;

const GRID_SIZE = 20 ;
const CANVAS_WIDTH = gameCanvas.width ;
const CANVAS_HEIGHT = gameCanvas.height ;

let snake = [], apple = {}, dx = 0, dy = 0, score = 0 ;
let changingDirection = false, gameOver = false, gameInterval ;


function clearCanvas() {    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)' ; 
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT) ;
}

function drawSnakePart(snakePart) {
    ctx.fillStyle = '#2ecc71' ;   
    ctx.strokeStyle = '#ecf0f1' ; 
    ctx.shadowColor = '#2ecc71' ; 
    ctx.shadowBlur = 8 ;          
    ctx.lineWidth = 3 ;           
    ctx.beginPath() ;
    ctx.roundRect(snakePart.x * GRID_SIZE, snakePart.y * GRID_SIZE, GRID_SIZE, GRID_SIZE, 6) ;
    ctx.fill() ;
    ctx.stroke() ;
    ctx.shadowBlur = 0 ;
}


function drawApple() {
    ctx.fillStyle = '#e74c3c' ;   
    ctx.strokeStyle = '#f0f0f1' ; 
    ctx.shadowColor = '#e74c3c' ; 
    ctx.shadowBlur = 12 ;
    ctx.lineWidth = 3 ;
    ctx.beginPath() ;

    const radius = GRID_SIZE / 2 ;
    const appleX = apple.x * GRID_SIZE + radius ;
    const appleY = apple.y * GRID_SIZE + radius ;

    ctx.arc(appleX, appleY, radius - 2, 0, 2 * Math.PI) ;
    ctx.fill() ;
    ctx.stroke() ;
    ctx.shadowBlur = 0 ; 
}


function drawSnake() { 
    snake.forEach(drawSnakePart) ; 
}


function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy } ;
    snake.unshift(head) ;
    if (snake[0].x === apple.x && snake[0].y === apple.y) {
        score += 10 ;
        scoreElement.textContent = score ;
        generateApple() ;

    } else {
        snake.pop() ;
    }
}


function generateApple() {
    let newAppleX, newAppleY ;
    do {
        newAppleX = Math.floor(Math.random() * (CANVAS_WIDTH / GRID_SIZE)) ;
        newAppleY = Math.floor(Math.random() * (CANVAS_HEIGHT / GRID_SIZE)) ;

    } while (snake.some(part => part.x === newAppleX && part.y === newAppleY)) ;

    apple = { x: newAppleX, y: newAppleY } ;
}


function changeDirection(event) {
    if (changingDirection || gameOver) return ;

    changingDirection = true ;
    const keyPressed = event.key ;
    const goingUp = dy === -1, goingDown = dy === 1, goingRight = dx === 1, goingLeft = dx === -1 ;

    if ((keyPressed === 'ArrowLeft' || keyPressed.toLowerCase() === 'a') && !goingRight) { dx = -1 ; dy = 0 ; }
    else if ((keyPressed === 'ArrowUp' || keyPressed.toLowerCase() === 'w') && !goingDown) { dx = 0 ; dy = -1 ; }
    else if ((keyPressed === 'ArrowRight' || keyPressed.toLowerCase() === 'd') && !goingLeft) { dx = 1 ; dy = 0 ; }
    else if ((keyPressed === 'ArrowDown' || keyPressed.toLowerCase() === 's') && !goingUp) { dx = 0 ; dy = 1 ; }
}


function checkGameOver() {
    for (let i = 4 ; i < snake.length ; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) { 
            gameOver = true ; 
            score = document.getElementById('finalScore').textContent = `Final Score: ${score}` ;

            return ; 
        }
    }
    if (snake[0].x < 0 || snake[0].x >= CANVAS_WIDTH / GRID_SIZE || snake[0].y < 0 || snake[0].y >= CANVAS_HEIGHT / GRID_SIZE) {
        score = document.getElementById('finalScore').textContent = `Final Score: ${score}` ;

        gameOver = true ;
    }
}


function initGame() {
    snake = [ { x: 12, y: 12 }, { x: 11, y: 12 }, { x: 10, y: 12 } ] ;
    dx = 1 ; dy = 0 ; score = 0 ;
    
    scoreElement.textContent = score ;
    changingDirection = false ; gameOver = false ;
    gameOverScreen.style.display = 'none' ;

    generateApple() ;

    if (gameInterval) clearInterval(gameInterval) ;
    gameInterval = setInterval(main, 100) ;
}

function main() {
    if (gameOver) {
        clearInterval(gameInterval) ;
        gameOverScreen.style.display = 'flex' ;
        return ;
    }

    changingDirection = false ;
    clearCanvas() ;
    drawApple() ;
    moveSnake() ;
    drawSnake() ;
    checkGameOver() ;
}


document.addEventListener('keydown', changeDirection) ;
playAgainButton.addEventListener('click', initGame) ;
initGame() ;