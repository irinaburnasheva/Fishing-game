var cvs = document.getElementById("canvas");
var ctx = cvs.getContext("2d");

var hook = new Image();
var bg = new Image();
var fg = new Image();
var bomb = new Image();
var smallFish = new Image();
var middleFish = new Image();
var bigFish = new Image();

hook.src = "img/hook.png";
bg.src = "img/bg.png";
fg.src = "img/fg.png";
bomb.src = "img/bomb.png";
smallFish.src = "img/fish_1.png";
middleFish.src = "img/fish_2.png";
bigFish.src = "img/fish_3.png";

// Звуковые файлы
var moving = new Audio();
var score_audio = new Audio();
var detonation = new Audio();

moving.src = "audio/fly.mp3";
score_audio.src = "audio/score.mp3";
detonation.src = "audio/detonation.mp3";

// При нажатии на какую-либо кнопку
document.addEventListener("keydown", moveHook);

/* Функция для перемещения крючка:
если нажимается клавишу со стрелкой вверх, то крючок перемещается вверх;
если нажимается клавиша со стрелкой вниз, то крючок перещается вниз;
 */
function moveHook() {
    if (window.event.keyCode === 38 && yPos > 0) {
        yPos -= 50;
        moving.play();
    } else if (window.event.keyCode === 40 && yPos < 350) {
        yPos += 50;
        moving.play();
    }
}

// Позиция крючка
var xPos = 10;
var yPos = 150;

// Создание блоков
var fishList = [];

fishList[0] = {
    x: cvs.width,
    y: 15,
    size: randomFishImg()
};

var score = 0;


function gameOver() {
    let oldData = window.localStorage.getItem('fish_score')
    let newData;
    if (oldData == null) {
        newData = [score];
    } else {
        newData = [oldData, score];
    }

    localStorage.setItem('fish_score', newData);
    window.location.href = "GameOver.html";
}

function draw() {

    ctx.drawImage(bg, 0, 0);
    createRandomFish();
    deleteFishWhoWentOutScreen();

    for (let i = 0; i < fishList.length; i++) {
        ctx.drawImage(fishList[i].size, fishList[i].x, fishList[i].y + smallFish.height);
        fishList[i].x--;
        if (fishList[i].x === 125) {
            newFish();
        }
        // Отслеживание прикосновений
        if (xPos + 10 > fishList[i].x && (fishList[i].y < yPos + hook.height - 30 && fishList[i].y > yPos - hook.height - 30)) {
            if (fishList[i].size.width === 61) {
                detonation.play();
                setTimeout(gameOver, 1000);
            }
            score += calculateCount(fishList[i].size.width);
            fishList.splice(i, 1)
            score_audio.play();
        }
    }
    ctx.drawImage(fg, 0, cvs.height - fg.height);
    ctx.drawImage(hook, xPos, yPos);
    ctx.fillStyle = "#000";
    ctx.font = "24px Verdana";
    ctx.fillText("Счет: " + score, 10, cvs.height - 20);
    requestAnimationFrame(draw);
}

//выбор рандомной картинки для рыбок
function randomFishImg() {
    let number = Math.floor(Math.random() * 4)
    if (number === 0) {
        return smallFish;
    } else if (number === 1) {
        return middleFish;
    } else if (number === 2) {
        return bigFish;
    } else return bomb;
}

//Удаляем рыбок, которые пропадают с экрана
function deleteFishWhoWentOutScreen() {
    fishList.filter(function (value, index) {
        if (value.x < 0) {
            fishList.splice(index, 1)
        }
    });
}

//создаем новую рыбку в рандомном месте
function newFish() {
    fishList.push({
        x: cvs.width,
        y: Math.floor(Math.random() * 350) + 1,
        size: randomFishImg()
    });
}

//расчет количества очков в зависимости от типа рыбы
function calculateCount(height) {
    let count;
    if (height === 57) {
        count = 10;
    } else if (height === 58) {
        count = 20;
    } else if (height === 61) {
        count = 0;
    } else {
        count = 30;
    }
    return count;
}

//генерация рандомной рыбки
function createRandomFish() {
    if (new Date().getSeconds() % 6 === 0 && new Date().getMilliseconds() === 500) {
        newFish();
    }
}

console.log(hook.height);
bigFish.onload = draw;
