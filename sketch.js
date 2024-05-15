let sprite1, sprite2;
let button;
let gui;
function setup() {
	new Canvas(250, 800);
  gui = createGui();
	monster = new Sprite();
	monster.diameter = 70;
	monster.image = 'assets/monster.png';
	monster.image.offset.y = 6;

  
  //  文字部分
  // 设置背景颜色
  background("gray");

  // 设置文字大小
  textSize(50);

  // 设置文字颜色
  fill("white");
  text("今天天气真不错", 0, 100);

  // 骰子部分
  bias_tou_x = 0
  bias_tou_y = 100
  button1 = createButton("开始游戏", 40+bias_tou_x, 350+bias_tou_y);
  // button2 = createButton("开始游戏", 40+bias_tou_x, 350+bias_tou_y);
  let painting = new Sprite();
  painting.x = 200+bias_tou_x
  painting.y = 365+bias_tou_y
  painting.width = 40;
	painting.height = 40;
	painting.image = '🎲';

  // 骰子1
  c = color(245, 226, 212)
  square1 = new Sprite();
  bias_x = 0
  bias_y = 0
  square1.width = 80;
  square1.height = 80;
  square1.x = 70
  square1.y = 390
  square1.collider= 'static'
  square1.rotation = 0;
  
  square1.text = '0'
  square1.color = c;
  square1.stroke = 'black';

  // 骰子2
  
  square2 = new Sprite();
  bias_x = 0
  bias_y = 0
  square2.width = 80;
  square2.height = 80;
  square2.x = 170
  square2.y = 390
  square2.collider= 'static'
  square2.rotation = 0;
  random_num1 = random(6)
  // text("R: "+(r ).toFixed(0), 30, 148);
  square2.text = '0'
  square2.color = 'white';
  square2.stroke = 'black';

  //dudu 
  monster = new Sprite();
	monster.diameter = 100;
  monster.scale = 0.1
  monster.y = 150
	monster.image = 'assets/begin.jpg';
	monster.image.offset.y = 40;
  // 初始化计数器
  snt = 0
}

function draw() {
  // 每帧重绘GUI
  clear();
  // monster.image = 'assets/begin.jpg';
  monster.debug = mouse.pressing();
	//  文字部分
  // 设置背景颜色
  background("white");

  // 设置文字大小
  textSize(14);

  // 设置文字颜色
  fill("black");
  text("Player", 150, 335);
  text("Dudu", 50, 335);
  // 还原设置
  textSize(50);
  if (button1.isPressed) {
    snt++
    if(snt == 1){
    button1.label = "投掷骰子"
      // 输出信息到控制台
    
    }else{
      random_num1 = parseInt(random(1,6)) 
    // text("R: "+(r ).toFixed(0), 30, 148);
    square1.text = (random_num1).toFixed(0)

      random_num2 = parseInt(random(1,6)) 
    // text("R: "+(r ).toFixed(0), 30, 148);
    square2.text = (random_num2).toFixed(0)
    if (random_num2 > random_num1){
      monster.image = 'assets/player_win.jpg';
      monster.scale = 0.05
      // monster.debug = mouse.pressing();
    }else if(random_num2 === random_num1){
      monster.image = 'assets/eql.jpg';
      monster.scale = 0.05
      // monster.debug = mouse.pressing();
    }else if(random_num2 < random_num1){
      monster.image = 'assets/dudu_win.jpg';
      monster.scale = 0.05
      // monster.debug = mouse.pressing();
    }

    
    }
    
  }
  
	drawGui();
  
}