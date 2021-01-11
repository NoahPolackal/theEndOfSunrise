var trex, trex_running, trex_collided;
var ground, groundImage;
var PLAY = 1;
var END = 0;
var gamestate = PLAY;
var cloud, cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3
var gameover,gameoverImage;
var restart,restartImage;
var jumpSound , checkPointSound, dieSound;
var score;
var Trexlife = 500;
var back, backImg;
var bgImg, expol;
//camera.on();
function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud1.png");
  backImg = loadImage("Background.jpeg")
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  gameoverImage = loadImage("gameOver.png");
  restartImage = loadImage("restart.png");
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkpoint.mp3")
  bgImg= loadImage("bg3.gif")
}

function setup() {
  createCanvas(windowWidth, windowHeight);
   obstaclesGroup = createGroup();
   cloudsGroup = createGroup();
   gameover = createSprite(width-700,400);
   gameover.addImage(gameoverImage);
   gameover.scale = 3;
  expol = createSprite(width-200,200)
  expol.addImage(bgImg)
  expol.visible= false
   
   restart = createSprite(width-1000,700);
   restart.addImage(restartImage);
   restart.scale = 2;
  gameover.visible = false;
  restart.visible = false;

  trex = createSprite(0,height-102,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided" , trex_collided);
  trex.scale = 1.5;
  trex.lifetime = 10;
  //trex.debug = true;
  trex.setCollider("circle",0.5,0,40);
 
  
  ground = createSprite(width/2,height,width,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -4;
  ground.scale= 3
  
 console.log("Hello" + 5);
  
  score = 0;
}

function draw() { 
  background(backImg);
  textSize(40);
  stroke("white")
  fill("white")
  text("HI score :"+ score, trex.x,height-200);
  
  text("TrexLife = " + trex.lifetime, trex.x,height-250)
  camera.x=trex.x;
  camera.y=trex.y;
  
 gameover.x = restart.x = camera.x;
  if (gamestate === PLAY){
     ground.velocityX = -(4 + 3*score/100);
    
    if(keyDown("space")&& trex.y >= 400) {
      trex.velocityY = -13;
      jumpSound.play();    
    }
    if (keyDown("right")) {
      trex.x = trex.x+5;
      trex.mirrorX(1);
    }
   
    trex.velocityY = trex.velocityY + 0.8
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
  //spawn the clouds
    spawnClouds();
  
  //spawn obstacles on the ground
    spawnObstacles();
     score = score + Math.round(getFrameRate()/60);
     if(score % 100 === 0 && score > 0 ){
       checkPointSound.play();
     }
  if(obstaclesGroup.isTouching (trex)){
    gamestate = END;
    //trex.velocityY = -10;
    dieSound.play();
    
  }
  }
  if(trex.lifetime === 1){
    trex.lifetime =-1;
    gamestate = END;     
    dieSound.play();
  }
 else if (gamestate === END){
   ground.velocityX = 0;
   trex.velocityY = 0;
   trex.changeAnimation("collided",trex_collided)
   obstaclesGroup.setVelocityXEach(0); 
   obstaclesGroup.setLifetimeEach(-1);
   cloudsGroup.setVelocityXEach(0);
   cloudsGroup.setLifetimeEach(-1);
   gameover.visible = true;
   restart.visible = true;
   if(mousePressedOver(restart)){
     reset();
   }
  }
  
  trex.collide(ground);
  drawSprites();
}
function reset(){
  gamestate = PLAY;
  score = 0;
  trex.changeAnimation  ("running",trex_running);
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
   gameover.visible = false;
   restart.visible = false;
   trex.lifetime = 500;
   
}
function spawnObstacles(){
 if (frameCount % 500 === 0){
   var obstacle = createSprite(width-0,height-45,10,40);
   obstacle.velocityX = -(4 + 3*score/100);
   obstacle.scale =0.8
   
    // //generate random obstacles
    var rand = Math.round(random(1,3));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.lifetime = 300;
   obstaclesGroup.add(obstacle)
 }
}




function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 100 === 0) {
    cloud = createSprite(width,camera.y-100,40,10);
    cloud.y = Math.round(random(camera.y-80,camera.y-70));
    cloud.addImage(cloudImage);
    cloud.scale = 1;
    cloud.velocityX = -5;
    
     //assign lifetime to the variable
    cloud.lifetime = width/3;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    cloudsGroup.add(cloud);
    
  }
  
}