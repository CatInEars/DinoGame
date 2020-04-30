const canvas  = document.getElementsByTagName('canvas')[0];
const ctx     = canvas.getContext('2d');
const body    = document.querySelector('body');
const linkBtn = document.querySelector('.link');

const mainImg = new Image();
mainImg.src = 'img/data_image.png';

let dinoRunPosX = 1515;
let dinoMiniPosX = 1867; // 1987

let JUMP_AUDIO = new Audio();
JUMP_AUDIO.src = 'audio/Jump.mp3';
let SCORE_AUDIO = new Audio('audio/Score.mp3');
SCORE_AUDIO.src = 'audio/Score.mp3';
let END_AUDIO = new Audio('audio/End.mp3');
END_AUDIO.src = 'audio/End.mp3';

JUMP_AUDIO.volume = 0.5;

let jumpAnimationId, dinoRunInterval, entitySpeedIntreval, fallAnimationId;

const cactusesLowArrX  = [446, 480, 514, 548, 582, 616];
const cactusesBigArrX  = [653, 702, 753];
const pointImagePositionX = [955, 976, 995, 1014, 1035, 1055, 1075, 1096, 1114, 1135];

class Game {
  constructor(ctx, dinoPosX, dinoPosY, dinoWidth, dinoHeight) {
    this.played = false;
    this.score = 0;

    this.ctx = ctx;

    this.dinoPosX = dinoPosX;
    this.dinoPosY = dinoPosY;
    this.dinoWidth = dinoWidth;
    this.dinoHeight = dinoHeight;

    this.speed = 1;

    this.point = 0;

    this.pointRecord = [['0', '0', '0', '0', '0', '0'], 0];
  }

  start() {
    this.played = true;
  }

  stop() {
    END_AUDIO.play();
    this.played = false;
    entity.speed = 1;

    dino.stopJump();
    dino.stopFall();
    entity.stopMove();
    clearInterval(dinoRunInterval);
    clearInterval(entitySpeedIntreval);
    clearInterval(pointCounterInterval);

    ctx.drawImage(mainImg, 955, 30, 383, 20, 212, 45, 175, 10); // game over
    ctx.drawImage(mainImg, 2, 2, 74, 65, 280, 75, 35, 30); // btn

    body.removeEventListener('keydown', dinoDoIt);
    body.removeEventListener('mousedown', dinoDoIt);
    body.removeEventListener('keyup', dinoFallStatus);

    body.addEventListener('keyup', dinoFallStatus);
    canvas.addEventListener('click', startGame);

    this.restarted = true;

    if ( dino.fall ) {
      dino.fall = false;
      dino.dinoWidth = 44;
      dino.dinoHeight = 46;
      ctx.clearRect(dino.dinoPosX, dino.dinoPosY, dino.dinoWidth, dino.dinoHeight + 11)
      ctx.drawImage(mainImg, 1691, 2, 87, 95, dino.dinoPosX, dino.dinoPosY, 44, 46);
    } else {
      ctx.drawImage(mainImg, 1691, 2, 87, 95, dino.dinoPosX, dino.dinoPosY, dino.dinoWidth, dino.dinoHeight);
    }

    this.point = 0;
  }

}

class Dino extends Game {

  constructor(...args) {
    super(...args);
    this.jumpStatus = false;
    this.i = 0;

    this.fall = false;
  }

  walk() {
    JUMP_AUDIO.play();
    requestAnimationFrame(this.jump.bind(dino));
    setTimeout(() => {
      let i = 0;
      if (!game.restarted) {
        this.walkInterval = setInterval(() => {
          if (i === 20) return 
  
          i++
          ctx.fillStyle = 'black';
          ctx.clearRect(this.dinoPosX, this.dinoPosY, this.dinoWidth, this.dinoHeight);
          this.dinoPosX += 1;
          ctx.drawImage(mainImg, dinoRunPosX, 2, 87, 95, this.dinoPosX, this.dinoPosY, this.dinoWidth, this.dinoHeight);
  
        }, 35);
      }
    }, 420); // end setTimeout
  }

  jump() {
    this.jumpStatus = true;

    if (this.i >= 33) {
      this.jumpStatus = false;
      this.i = 0;
      return;
    }

    if (this.i < 14) {
      ctx.clearRect(this.dinoPosX, this.dinoPosY - 1, this.dinoWidth, this.dinoHeight + 2);
      this.dinoPosY -= 7; // 85 105
      ctx.drawImage(mainImg, 1339, 2, 87, 95, this.dinoPosX, this.dinoPosY, this.dinoWidth, this.dinoHeight);
    } else if (this.i >= 14 && this.i <= 16) {
      ctx.clearRect(this.dinoPosX, this.dinoPosY - 1, this.dinoWidth, this.dinoHeight + 2);
      ctx.drawImage(mainImg, 1339, 2, 87, 95, this.dinoPosX, this.dinoPosY, this.dinoWidth, this.dinoHeight);
    } else {
      ctx.clearRect(this.dinoPosX, this.dinoPosY - 1, this.dinoWidth, this.dinoHeight + 2);
      this.dinoPosY += 6.125;
      ctx.drawImage(mainImg, 1339, 2, 87, 95  , this.dinoPosX, this.dinoPosY, this.dinoWidth, this.dinoHeight);
    }

    // скорость падения = 12.250

    this.i++;

    jumpAnimationId = requestAnimationFrame(this.jump.bind(dino));

  } // end jump();

  fallBoost() {
    if (this.fall) {
      this.i = 0;
      cancelAnimationFrame(jumpAnimationId);
      ctx.clearRect(this.dinoPosX, this.dinoPosY, this.dinoWidth, this.dinoHeight);
      this.dinoWidth = 62;
      this.dinoHeight = 35;

      if (this.dinoPosY <= 96) {
        this.dinoPosY += 12.25;
        console.log('faaaal')
      } else {
        this.dinoPosY = 102;
        ctx.clearRect(0, 148, canvas.width, 2);
      }

      this.jumpStatus = false;
      ctx.drawImage(mainImg, dinoMiniPosX, 30, 119, 62, this.dinoPosX, this.dinoPosY + 11, this.dinoWidth, this.dinoHeight);
      fallAnimationId = requestAnimationFrame(this.fallBoost.bind(dino));
    } else {
      ctx.clearRect(this.dinoPosX, this.dinoPosY, this.dinoWidth, this.dinoHeight + 11);
      this.dinoWidth = 44;
      this.dinoHeight = 46;
      ctx.drawImage(mainImg, 1339, 2, 87, 95, this.dinoPosX, this.dinoPosY, this.dinoWidth, this.dinoHeight);
    }
  }
 
  stopJump() {
    cancelAnimationFrame(jumpAnimationId);
  }

  stopFall() {
    cancelAnimationFrame(fallAnimationId);
  }
}

class Entity extends Game {
  constructor(...args) {
    super(...args);

    this.bigHeight = 49;
    this.lowHeight = 31;
    this.cactusWidthLow = 15;
    this.cactusWidthBig = 24;

    this.turn = [];

    this.width = 0;
    this.height = 0;

    this.j = 0;
    this.frame = 0;

    this.x = canvas.width;
    this.y = canvas.height - 2;

    this.randomFrame = Math.floor(Math.random() * (120 - 60)) + 60;
  }

  generateEntity() {
    const count = Math.floor(Math.random() * (4 - 1)) + 1;
    const size = Math.floor(Math.random() * (3 - 1)) + 1;
    const y = size === 1 ? canvas.height - 2 - this.lowHeight : canvas.height - 2 - this.bigHeight;
    const height = size === 1 ? this.lowHeight : this.bigHeight;
    const width = (size === 1 ? this.cactusWidthLow : this.cactusWidthBig) * count;
    const imagePosX = (size === 1) ? cactusesLowArrX[(Math.floor(Math.random() * (5 - 0)) + 0)] : cactusesBigArrX[(Math.floor(Math.random() * (2 - 0)) + 0)];

    return {count, size, y, width, height, imagePosX}
  }

  entityMove() {
    
        //правый нижний угол в зоне высоты кактуса
    if ((((dino.dinoPosY + dino.dinoHeight) <= this.y + this.height) && ((dino.dinoPosY + dino.dinoHeight) >= this.y + 15)
       && // правый нижний угол в зоне ширины кактуса
       ((dino.dinoPosX + dino.dinoWidth) >= this.x - 10 ) && ((dino.dinoPosX + dino.dinoWidth) <= (this.x + this.width)))
       || // левый нижний угол в зоне ширины кактуса
       ((dino.dinoPosX >= this.x - 15 ) && (dino.dinoPosX <= this.x + this.width - 30)
       && // левый нижний угол в зоне высоты кактуса
       ((dino.dinoPosY + dino.dinoHeight) <= (this.y + this.height)) && ((dino.dinoPosY + dino.dinoHeight) >= this.y + 2))
       )
    {
      // логи для дебага столкновений 
      console.log(((dino.dinoPosX + dino.dinoWidth) >= this.x - 12 ) && ((dino.dinoPosX + dino.dinoWidth) <= (this.x + this.width)), 'правый нижний угол в зоне ширины кактуса');
      console.log(((dino.dinoPosY + dino.dinoHeight) <= this.y + this.height) && ((dino.dinoPosY + dino.dinoHeight) >= this.y + 1), 'правый нижний угол в зоне высоты');
      console.log((dino.dinoPosX >= this.x - 15 ) && (dino.dinoPosX <= this.x + this.width - 30), 'левый нижний угол в зоне ширины кактуса');
      console.log(((dino.dinoPosY + dino.dinoHeight) <= (this.y + this.height)) && ((dino.dinoPosY + dino.dinoHeight) >= this.y + 1), 'левый нижний угол в зоне высоты кактуса');
      
      game.stop()
    }

    this.turn.forEach((entityEl, index) => {
      if ( index === 0 ) {
        this.x = entityEl.x;
        this.y = entityEl.y;
        this.width = entityEl.width;
        this.height = entityEl.height;
      }

      if ( entityEl.x < -100 ) {
        this.turn.shift();
        let newEntity = this.generateEntity();
        newEntity.x = this.turn[this.turn.length-1].x + Math.floor(Math.random() * (800 - 300)) + 300;
        this.turn.push(newEntity)
      }

      ctx.clearRect(entityEl.x, entityEl.y, entityEl.width + 2, entityEl.height);
      entityEl.x -= 8 + this.speed;
      if (entityEl.size === 1) {
        for (let k = 0; k < entityEl.count; k++) {
          ctx.drawImage(mainImg, entityEl.imagePosX, 2, 34, 72, (entityEl.x + 16 * k), entityEl.y, this.cactusWidthLow, this.lowHeight);
        }
      } else {
        for (let k = 0; k < entityEl.count; k++) {
          ctx.drawImage(mainImg, entityEl.imagePosX, 2, 50, 101, (entityEl.x + 25 * k), entityEl.y, this.cactusWidthBig, this.bigHeight);
        }
      }
    });

    requestAnimationFrame(this.entityMove.bind(entity));
  }

  stopMove() {
    this.turn = null;
  }
}

const game = new Game(ctx, 2, 102, 44, 46);
const dino = new Dino(ctx, 2, 102, 44, 46);
const entity = new Entity(ctx, 2, 102, 44, 46);

mainImg.onload = () => {
  ctx.drawImage(mainImg, 76, 6, 87, 93, 2, 102, 44, 46);
}

const dinoDoIt = e => {
  if (!dino.jumpStatus && (e.code === 'Space' || e.type === 'mousedown' || e.code === 'ArrowUp')) {
    JUMP_AUDIO.play();
    jumpAnimationId = requestAnimationFrame(dino.jump.bind(dino));
  }

  if (e.code === 'ArrowDown') {
    dino.fall = true;
    requestAnimationFrame(dino.fallBoost.bind(dino));
  }
}


const startGame = e => {
  if (!game.played && (e.code === 'Space' || e.type === 'click' )) {

    console.clear();

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    entity.turn = [];
    dino.dinoPosX = 2;
    entity.x = null;
    entity.y = null;
    entity.width = null;
    entity.height = null;
    
    canvas.removeEventListener('click', startGame)
    
    for (let i = 0; i < 10; i++) {
      const entityEl = entity.generateEntity();
      
      if ( i === 0 ) {
        entityEl.x = canvas.width;
      } else {
        entityEl.x = entity.turn[i-1].x + Math.floor(Math.random() * (800 - 300)) + 300;
      }
    
      entity.turn.push(entityEl);
    }

    game.played = true;
    dino.walk();
    

    setTimeout(() => {
      const field = document.querySelector('.game-runner');
      field.style.transition = '1s';
      field.style.width = '600px';
      field.style.marginRight = '-42px';
 
      setTimeout(() => {requestAnimationFrame(entity.entityMove.bind(entity))}, 1500);
    },  530);

    ctx.drawImage(mainImg, 1153, 2, 38, 25, 385, 14, 21, 15);

    body.addEventListener('keydown', dinoDoIt);
    body.addEventListener('mousedown', dinoDoIt);
    
    dinoRunInterval = setInterval(() => {
      if (!dino.jumpStatus && !dino.fall) {
        console.log(dino.dinoPosY + dino.dinoHeight)
        dinoRunPosX = dinoRunPosX === 1515 ? 1603 : 1515;
        ctx.clearRect(dino.dinoPosX, dino.dinoPosY, dino.dinoWidth, dino.dinoHeight);
        ctx.drawImage(mainImg, dinoRunPosX, 2, 87, 95, dino.dinoPosX, dino.dinoPosY, dino.dinoWidth, dino.dinoHeight);
      } else if (dino.fall && !dino.jumpStatus) {}
    }, 100);

    entitySpeedIntreval = setInterval(() => {
      if (entity.speed < 6 && game.played) {
        entity.speed++;
      }
    }, 10000);

    pointCounterInterval = setInterval(() => {
      
      game.point++;
      const arrPoint = game.point.toString().split('');
      while (arrPoint.length <= 5) {
        arrPoint.unshift('0');
      }

      if (game.point === 100) {
        SCORE_AUDIO.play();
      }

      arrPoint.forEach( (num, index) => {
          ctx.clearRect(520 + 12 * index, 15, 11, 13);
          ctx.drawImage(mainImg, pointImagePositionX[+num], 2, 17, 22, 520 + 12 * index, 15, 10, 12)
      });
      
      if (game.point > game.pointRecord[1]) {
        game.pointRecord[1] = game.point;
        game.pointRecord[0] = arrPoint;
        game.pointRecord[0].forEach( (num, index) => {
          ctx.clearRect(430 + 12 * index, 15, 11, 13);
          ctx.drawImage(mainImg, pointImagePositionX[+num], 2, 17, 22, 430 + 12 * index, 15, 10, 12)
        });
      } else {
        game.pointRecord[0].forEach( (num, index) => {
          ctx.clearRect(430 + 12 * index, 15, 11, 13);
          ctx.drawImage(mainImg, pointImagePositionX[+num], 2, 17, 22, 430 + 12 * index, 15, 10, 12)
        });
      }
      
      
    }, 100);
  }
}


body.addEventListener('keydown', startGame);
linkBtn.addEventListener('click', startGame);

const dinoFallStatus = e => {
  if (e.code === 'ArrowDown') {
    dino.fall = false;
    console.log('cancel');
  }
}
body.addEventListener('keyup', dinoFallStatus);
