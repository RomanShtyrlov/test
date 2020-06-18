let input, button, name; //ввод имени
let start_button, restart_button, highscore_button, top_3_button, exit_button, exit_game_button;
// let names = [];
let cnv;
let rocket;
let bullet;
let bulletGroup;
let comet;
let cometGroup;
let ufo;
let ufoGroup;
let catcher; //для подсчета пропущенных НЛО
let score = 0;
let x1 = 0; //положение первого изображения фона
let x2; //положение второго изображения фона
let scrollSpeed; //скорость движения фона
let acceleration_bg = 0; //для ускорения с течением времени
let acceleration = 0;
let gameStatus = "login";
let timeInGame = 0;


function preload() {
  //картинки
  bgImg = loadImage('assets/bg.png');
  rocketImg = loadImage('assets/rocket.svg');
  bulletImg = loadImage('assets/bullet.svg');
  ufoImg = loadImage('assets/ufo.svg');
  asteroidImg1 = loadImage('assets/asteroid-01.png');
  asteroidImg2 = loadImage('assets/asteroid-02.png');
  asteroidImg3 = loadImage('assets/asteroid-03.png');
  asteroidImg4 = loadImage('assets/asteroid-04.png');

  //шрифты
  pixFont = loadFont('assets/PressStart2P-Regular.ttf');

  //звуки
  shotSound = loadSound('assets/blaster.mp3');
  failSound = loadSound('assets/fail.mp3');

}

function setup() {

  cnv = createCanvas(windowWidth, windowHeight);
  x2 = width;
  input = createInput();
  input.position(width / 2 - 240, height / 2 - 100);
  input.size(500, 50);
  input.style('font-size', '60px');
  input.hide();

  button = createButton('login');
  button.size(150, 80);
  button.position(input.x - button.width/2 + input.width/2, input.y + 200);
  button.mousePressed(goToStartScreen);
  bColor = color(240, 200, 0);
  button.style('background-color', bColor);
  button.style('border-color', bColor);
  button.style('font-size', '60px');
  button.hide();
  
  highscore_button = createButton('highscores');
  highscore_button.size(170, 40);
  highscore_button.position(width - 200, 20);
  highscore_button.mousePressed(showResults);
  bColor = color(240, 200, 0);
  highscore_button.style('background-color', bColor);
  highscore_button.style('border-color', bColor);
  highscore_button.style('font-size', '30px');
  highscore_button.hide();

  top_3_button = createButton('Top 3');
  top_3_button.size(170, 40);
  top_3_button.position(width - 200, 70);
  top_3_button.mousePressed(showTop);
  bColor = color(240, 200, 0);
  top_3_button.style('background-color', bColor);
  top_3_button.style('border-color', bColor);
  top_3_button.style('font-size', '30px');
  top_3_button.hide();
  
  exit_button = createButton('exit');
  exit_button.size(170, 40);
  exit_button.position(width - 200, 20);
  exit_button.mousePressed(goToStartScreen);
  bColor = color(240, 200, 0);
  exit_button.style('background-color', bColor);
  exit_button.style('border-color', bColor);
  exit_button.style('font-size', '30px');
  exit_button.hide();
  
  exit_game_button = createButton('exit game');
  exit_game_button.size(170, 40);
  exit_game_button.position(width - 200, height - 50);
  exit_game_button.mousePressed(relogin);
  bColor = color(240, 200, 0);
  exit_game_button.style('background-color', bColor);
  exit_game_button.style('border-color', bColor);
  exit_game_button.style('font-size', '30px');
  exit_game_button.hide();

  start_button = createButton('');
  start_button.position(width / 2 - 300, height / 2 - 230);
  start_button.size(570, 50);
  start_button.mousePressed(runGame);
  buttonColor = color(0, 0, 0);
  buttonColor.setAlpha(0);
  start_button.style('background-color', buttonColor);
  start_button.style('border-color', buttonColor);
  start_button.hide();
  
  restart_button = createButton('');
  restart_button.position(width / 2 - 300, height / 2 + 180);
  restart_button.size(570, 50);
  restart_button.mousePressed(runGame);
  restart_button.style('background-color', buttonColor);
  restart_button.style('border-color', buttonColor);
  restart_button.hide();
  
  // localStorage.clear();
  if (localStorage.getItem(1) == null){
    for (let i = 1; i <=10; i++)
    {
        localStorage.setItem(i, "0  ");
        // names[i-1] = '';
    }
  }


}

function draw() {
  if (gameStatus == "login") {
    clear();
    login();
  } else if (gameStatus == "start") {
    clear();
    startGame();
  } else if (gameStatus == "scores") {
    clear();
    showResults();
  } else if (gameStatus == "running") {
    clear();
    drawBackground();
    drawSprites();
    rocket.position.x = mouseX;
    rocket.position.y = mouseY;
    rocket.collide(cometGroup, gameOver);
    rocket.collide(ufoGroup, gameOver);
    bulletGroup.overlap(ufoGroup, removeUfo);
    ufoGroup.displace(cometGroup);
    ufoGroup.overlap(catcher, removeLostUfo);
    if (gameStatus == "running") {
      textFont(pixFont, 30);
      fill(240, 200, 0);
      text(score, 30, 50);
      text(name, 80, 50);
      text(timeInGame/1000, width - 200, 50);
    }
    if (score < 0) {
      gameOver();
    }
    scrollSpeed += acceleration_bg; //ускорение движения фона
    acceleration_bg += 0.000001;
    acceleration += 0.01; //ускорение движения объектов
    cnv.mouseClicked(shot);
  } else if (gameStatus == "over") {
    if (mouseIsPressed) {
      gameStatus = "running";
      runGame();
    }
  }
}

function shot() {
  if (gameStatus == "running") {
    bullet = createSprite(rocket.position.x, rocket.position.y);
    bullet.velocity.x = 15;
    bullet.addImage(bulletImg);
    bullet.scale = 0.3;
    bullet.setCollider('rectangle', 0, 0, 120, 30);
    bullet.depth = 0;
    if (bullet.position.x > windowWidth) {
      bullet.remove()
    }
    bulletGroup.add(bullet);
    shotSound.setVolume(0.2);
    shotSound.play();
  }
}

function drawBackground() { //отрисовка движения бесшовного фона

  x1 -= scrollSpeed;
  x2 -= scrollSpeed;
  if (x1 <= -width) {
    x1 = width;
  }
  if (x2 < -width) {
    x2 = width;
  }
  image(bgImg, x1, 0, width + scrollSpeed, height);
  image(bgImg, x2, 0, width + scrollSpeed, height);
}

function generateComets() { //встречные кометы
  comet = createSprite(windowWidth + 200, random(50, height - 50));
  let sc = random(0.1, 0.4)
  comet.scale = sc;
  comet.setCollider('circle', 0, 0, 150);
  imgNum = Math.floor(random(1, 5));
  switch (imgNum) {
    case 1:
      asteroidImg = asteroidImg1;
      break;
    case 2:
      asteroidImg = asteroidImg2;
      break;
    case 3:
      asteroidImg = asteroidImg3;
      break;
    default:
      asteroidImg = asteroidImg4;
      break;
  }
  comet.addImage(asteroidImg);
  comet.velocity.x = random(-10 - acceleration, -5 - acceleration);
  comet.life = 1000;
  cometGroup.add(comet);
  //comet.debug = true;
}

function generateUfo() { //встречные НЛО
  ufo = createSprite(windowWidth + 200, random(100, height - 100));
  let sc = random(0.4, 1.2);
  ufo.scale = sc;
  ufo.setCollider('circle', 0, 0, 70);
  ufo.addImage(ufoImg);
  ufo.velocity.x = random(-10 - acceleration, -5 - acceleration);
  ufoGroup.add(ufo);
}

function removeUfo(ufo, bullet) {
  ufo.remove();
  bullet.remove();
  score++;
}

function removeLostUfo(ufo) {
  ufo.remove();
  score--;
}

function login() {
  if (gameStatus == "login") {
    push();
    image(bgImg, 0, 0, width, height);
    pop();

    textFont(pixFont, 40);
    fill(240, 200, 0);
    text("Introduce yourself", width / 2 - 360, height / 2 - 250);
    button.show();
    input.show();
    exit_game_button.hide();
  }
}

function relogin(){
  gameStatus = "login";
  login();
}

function goToStartScreen() {
  if (gameStatus == "scores"){
      exit_button.hide();
      start_button.show();
      gameStatus = "start";
      startGame();
  }
  else {
  name = input.value();
  if (name != ''){
      input.hide();
      button.hide();
      start_button.show();
      gameStatus = "start";
      startGame();
    }
  }
}

function startGame() {
  if (gameStatus == "start") {
    push();
    image(bgImg, 0, 0, width, height);
    pop();
    
    textFont(pixFont, 50);
    fill(240, 200, 0);
    text("Hi, " + name, width / 2 - 300, height / 2 - 300);

    textFont(pixFont, 30);
    fill(240, 200, 0);
    text("Click here to start", width / 2 - 300, height / 2 - 190);


    textFont(pixFont, 20);
    text("- Avoid any collisions", width / 2 - 360, height / 2 - 100);
    text("- Every killed UFO gives 1 point", width / 2 - 360, height / 2 + 0);
    text("- Every lost UFO takes away 1 point", width / 2 - 360, height / 2 + 100);
    fill(250, 10, 10);
    text("TRY NOT TO GO NEGATIVE", width / 2 - 225, height / 2 + 250);
    text("AND HOLD OUT AS LONG AS POSSIBLE", width / 2 - 310, height / 2 + 300);
    highscore_button.show();
    top_3_button.show();
    exit_game_button.show();
    exit_button.hide();
  
  }
}

function runGame() {
  x1 = 0;
  x2 = width;

  rocket = createSprite(mouseX, mouseY, 200);
  rocket.addImage(rocketImg);
  rocket.scale = 0.7;
  rocket.setCollider('rectangle', 0, 0, 130, 70);

  cometGroup = new Group();
  bulletGroup = new Group();
  ufoGroup = new Group();
  comet = createSprite(windowWidth + 200, random(50, width - 50));
  cometGroup.add(comet);
  bullet = createSprite(rocket.position.x - 1000, rocket.position.y);
  bullet.scale = 0;
  bullet.life = 1;
  bulletGroup.add(bullet);
  ufo = createSprite(windowWidth + 200, random(50, width - 50));
  ufoGroup.add(ufo);
  catcher = createSprite(-200, windowHeight / 2, 10, windowHeight);

  score = 0;
  scrollSpeed = 3;
  acceleration_bg = 0;
  acceleration = 0;
  timeInGame = 0;

  intervalComets = setInterval(generateComets, 1000);
  intervalUfo = setInterval(generateUfo, 800);
  intervalTimer = setInterval(addTime, 10);
  gameStatus = "running";
  start_button.hide();
  restart_button.hide();
  top_3_button.hide();
  highscore_button.hide();
  top_3_button.hide();
  exit_game_button.hide();
  
} //без демонстрации стартового экрана

function gameOver() {
  cometGroup.removeSprites();
  bulletGroup.removeSprites();
  ufoGroup.removeSprites();
  rocket.remove();
  clearInterval(intervalComets);
  clearInterval(intervalUfo);
  clearInterval(intervalTimer);
  gameStatus = "over";

  failSound.play();

  image(bgImg, x1, 0, width, height);
  image(bgImg, x2, 0, width, height);
  fill(250, 10, 10);
  textFont(pixFont, 50);
  text("GAME OVER", width / 2 - 230, height / 2 - 150);

  let t = timeInGame / 1000;

  fill(240, 200, 0);
  textFont(pixFont, 35);
  text("Your time in game:" + t.toString(), width / 2 - 350, height / 2 + 50);
  textFont(pixFont, 20);
  text("(Score:" + score.toString() + ')', width / 2 - 90, height / 2 + 130);
  text("Click here to restart", width / 2 - 200, height / 2 + 200);
  
  highscore_button.show();
  top_3_button.show();
  exit_game_button.show();
  restart_button.show();

  let highest_score;

    fetch('/save', {
      method: 'POST',      
      body: JSON.stringify({name: name, score: timeInGame}),
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
    },  
    })
    .then(resp => resp.json())
    .then(data => {
            console.log(data);
    })
    .catch(e => console.log(e));


  for (let i = 1; i <=10; i++)
  {
    let s = localStorage.getItem(i).split(" ")[0];
    if (t > s){
      for (let m = 10; m > i; m--){
        localStorage.setItem(m, localStorage.getItem(m-1));
        // names[m-1] = names[m-2];
      }
      localStorage.setItem(i, t + " " + name);
      // names[i-1] = name;
      i = 10;
    }
  }
}

function showResults(){
  button.hide();
  input.hide();
  highscore_button.hide();
  top_3_button.hide();
  restart_button.hide();
  exit_button.show();
  exit_game_button.show();
  gameStatus = "scores";

  image(bgImg, x1, 0, width, height);
  image(bgImg, x2, 0, width, height);
  fill(250, 10, 10);
  textFont(pixFont, 30);
  text("Highscores", width / 2 - 150, height / 2 - 380);
  text("Place     Name    Time", width / 2 - 350, height / 2 - 330);
  let interval = 20;
  fill(240, 200, 0);
  for (var i = 1; i <= 10; i++){
    h = -280 + interval;
    text(i, width / 2 - 300, height / 2 + h);
    text(localStorage.getItem(i).split(" ")[1], width / 2 - 80, height / 2 + h);
    text(localStorage.getItem(i).split(" ")[0], width / 2 + 180, height / 2 + h);
    interval+=60;
  }
}

function showTop(){
  button.hide();
  input.hide();
  highscore_button.hide();
  top_3_button.hide();
  restart_button.hide();
  exit_button.show();
  exit_game_button.show();
  gameStatus = "top";

  image(bgImg, x1, 0, width, height);
  image(bgImg, x2, 0, width, height);
  fill(250, 10, 10);
  textFont(pixFont, 30);
  text("Top 3", width / 2 - 100, height / 2 - 400);
  text("Place     Name    Time", width / 2 - 350, height / 2 - 330);
  let interval = 20;
  fill(240, 200, 0);

    fetch('/top')
    .then(resp => resp.json())
    .then(data => {
      let jd = JSON.parse(data.top);
      print(jd);
      for (var i = 0; i <= 2; i++) {
        h = -280 + interval;
        text(i+1, width / 2 - 300, height / 2 + h);
        text(jd[i].username, width / 2 - 80, height / 2 + h);
        text(jd[i].score/1000, width / 2 + 180, height / 2 + h);
        interval+=60;
      }
  })
  .catch(e => console.log(e));
}

function addTime() {
  timeInGame += 10;
}