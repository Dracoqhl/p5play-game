let sprite1, sprite2;
let button;
let gui;
let playerWins = 0;
let duduWins = 0;
let totalGames = 0;
let gameEnded = false;
let gif; // 添加GIF变量

function setup() {
  new Canvas(250, 1000);
  gui = createGui();
  monster = new Sprite();
  monster.diameter = 70;
  monster.image = 'assets/monster.png';
  monster.image.offset.y = 6;

  // 设置背景颜色
  background("gray");

  // 设置文字大小
  textSize(50);

  // 设置文字颜色
  fill("white");
  text("今天天气真不错", 0, 100);

  // 骰子部分
  bias_tou_x = 0;
  bias_tou_y = 120;
  button1 = createButton("开始游戏", 40 + bias_tou_x, 350 + bias_tou_y);

  let painting = new Sprite();
  painting.x = 200 + bias_tou_x;
  painting.y = 365 + bias_tou_y;
  painting.width = 40;
  painting.height = 40;
  painting.image = '🎲';

  // 骰子1
  c = color(245, 226, 212);
  square1 = new Sprite();
  bias_x = 0;
  bias_y = 20;
  square1.width = 80;
  square1.height = 80;
  square1.x = 70 + bias_x;
  square1.y = 390 + bias_y;
  square1.collider = 'static';
  square1.rotation = 0;
  square1.text = '0';
  square1.color = c;
  square1.stroke = 'black';

  // 骰子2
  square2 = new Sprite();
  square2.width = 80;
  square2.height = 80;
  square2.x = 170 + bias_x;
  square2.y = 390 + bias_y;
  square2.collider = 'static';
  square2.rotation = 0;
  square2.text = '0';
  square2.color = 'white';
  square2.stroke = 'black';

  // dudu
  monster = new Sprite();
  monster.diameter = 100;
  monster.scale = 0.09;
  monster.y = 150 + bias_y + 30;
  monster.image = 'assets/begin.jpg';
  monster.image.offset.y = 40;

  // 初始化计数器
  snt = 0;

  // 加载GIF动画
  gif = createImg('assets/gif.gif', 'win animation');
  gif.position(30, 200); // 设置GIF动画的位置
  gif.size(200, 200); // 设置GIF动画的大小
  gif.hide(); // 隐藏GIF动画，初始时不显示
  // gif.show(); // 显示GIF动画
}

function draw() {
  // 每帧重绘GUI
  clear();
  monster.debug = mouse.pressing();

  // 设置背景颜色
  background("white");

  // 设置文字大小
  textSize(14);

  // 设置文字颜色
  fill("black");
  text("Player", 170, 335 + bias_y);
  text("Dudu", 70, 335 + bias_y);
  text("总进行9局，胜场多的获胜！", 120, 505 + bias_y);

  // 还原设置
  textSize(50);

  if (!gameEnded && button1.isPressed) { // 仅在游戏未结束时处理按钮按下事件
    snt++;
    if (snt == 1) {
      button1.label = "投掷骰子";
    } else {
      let random_num1 = parseInt(random(1, 6));
      square1.text = (random_num1).toFixed(0);

      let random_num2 = parseInt(random(1, 6));
      square2.text = (random_num2).toFixed(0);

      if (random_num2 > random_num1) {
        monster.image = 'assets/player_win.jpg';
        monster.scale = 0.05;
        playerWins++;
        totalGames++;
      } else if (random_num2 === random_num1) {
        monster.image = 'assets/eql.jpg';
        monster.scale = 0.05;
      } else if (random_num2 < random_num1) {
        monster.image = 'assets/dudu_win.jpg';
        monster.scale = 0.05;
        duduWins++;
        totalGames++;
      }
    }
    if (totalGames == 9) {
      // 显示最终结果GIF动画
      // alert("游戏结束");
      // gif.show(); // 显示GIF动画
      if (duduWins > playerWins){
        monster.image = 'assets/game_lose.jpg';
        monster.scale = 0.09;
      }else{
        monster.image = 'assets/game_win.jpg';
        monster.scale = 0.09;
      }

      gameEnded = true; // 标记游戏结束
      alert("游戏结束");
      // totalGames++
      // button1.setDisabled(true); // 禁用按钮
      
    }
  }

  // 绘制进度条
  drawProgressBar(20, 25, 200, 20, playerWins, duduWins, totalGames);

  drawGui();
  // if (gameEnded == true & totalGames == 10){
  //   alert("游戏结束");
  //   totalGames++
  // }
}

function drawProgressBar(x, y, width, height, playerWins, duduWins, totalGames) {
  let playerRatio = totalGames === 0 ? 0 : playerWins / totalGames;
  let duduRatio = totalGames === 0 ? 0 : duduWins / totalGames;

  // 绘制圆角矩形
  noStroke();
  fill(245, 226, 212); // Dudu's color
  rect(x, y, width * duduRatio, height, 10);

  fill('red'); // Player's color
  rect(x + width * duduRatio, y, width * playerRatio, height, 10);

  // 边框
  noFill();
  stroke(0);
  rect(x, y, width, height, 10);

  // 文字显示
  fill(0);
  textSize(12);
  textAlign(CENTER, CENTER);
  if (playerWins > 0) {
    text(`Player: ${playerWins}`, x + width * duduRatio + width * playerRatio / 2, y + height / 2);
  }
  if (duduWins > 0) {
    text(`Dudu: ${duduWins}`, x + width * duduRatio / 2, y + height / 2);
  }
}
