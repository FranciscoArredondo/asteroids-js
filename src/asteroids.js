let canvas;
let ctx;
let canvasWidth = 1400;
let canvasHeight = 1080;
let ship;
let keys = [];
let bullets = [];
let asteroids = [];
let score = 0;
let lives = 3;

class Bullet {
  constructor(angle) {
    this.visible = true;
    this.x = ship.noseX;
    this.y = ship.noseY;
    this.angle = angle;
    this.height = 4;
    this.width = 4;
    this.speed = 5;
    this.velocity = 0;
    this.velX = 0;
    this.velY = 0;
  }

  update() {
    let radians = (this.angle / Math.PI) * 180;
    this.x -= Math.cos(radians) * this.speed;
    this.y -= Math.sin(radians) * this.speed;

    if (this.x > canvas.width || this.x < 0) {
      this.visible = false;
    }

    if (this.y > canvas.height || this.y < 0) {
      this.visible = false;
    }
  }

  draw() {
    ctx.fillStyle = 'white';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

class Asteroid {
  constructor(x, y, radius, level, collisonRadius) {
    this.visible = true;
    this.x = x || Math.floor(Math.random() * canvasWidth);
    this.y = y || Math.floor(Math.random() * canvasHeight);
    this.speed = 3;
    this.radius = radius || 50;
    this.angle = Math.floor(Math.random() * 359);
    this.strokeColor = 'white';
    this.collisonRadius = collisonRadius || 46;
    this.level = level || 1;
  }

  update() {
    let radians = (this.angle / Math.PI) * 180;
    this.x += Math.cos(radians) * this.speed;
    this.y += Math.sin(radians) * this.speed;
    if (this.x < this.radius) {
      this.x = canvas.width;
    }

    if (this.x > canvas.width) {
      this.x = this.radius;
    }

    if (this.y < this.radius) {
      this.y = canvas.height;
    }

    if (this.y > canvas.height) {
      this.y = this.radius;
    }
  }

  draw() {
    ctx.beginPath();
    let vertAngle = (Math.PI * 2) / 6;
    let radians = (this.angle / Math.PI) * 180;
    for (let i = 0; i < 6; i++) {
      ctx.lineTo(
        this.x - this.radius * Math.cos(vertAngle * i + radians),
        this.y - this.radius * Math.sin(vertAngle * i + radians)
      );
    }
    ctx.closePath();
    ctx.stroke();
  }
}

const circleCollision = (p1x, p1y, r1, p2x, p2y, r2) => {
  let radiusSum, xDiff, yDiff;
  radiusSum = r1 + r2;
  xDiff = p1x - p2x;
  yDiff = p1y - p2y;
  if (radiusSum > Math.sqrt(xDiff * xDiff + yDiff * yDiff)) {
    return true;
  } else {
    return false;
  }
};

const drawLifeShips = () => {
  let startX = 1350;
  let startY = 10;
  let points = [[9, 9], [-9, 9]];
  ctx.strokeStyle = 'white';
  for (let i = 0; i < lives; i++) {
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    for (let j = 0; j < points.length; j++) {
      ctx.lineTo(startX, points[j][0], startY + points[j][1]);
    }
    ctx.closePath();
    ctx.stroke();
    startX -= 30;
  }
};

class Ship {
  constructor() {
    this.visible = true;
    this.x = canvasWidth / 2;
    this.y = canvasHeight / 2;
    this.movingForward = false;
    this.speed = 0.1;
    this.velX = 0;
    this.velY = 0;
    this.rotationSpeed = 0.001;
    this.radius = 15;
    this.angle = 0;
    this.strokeColor = 'white';
    this.noseX = canvas.width / 2 + 15;
    this.noseY = canvasHeight;
  }

  rotate(dir) {
    this.angle += this.rotationSpeed * dir;
  }

  update() {
    let radians = (this.angle / Math.PI) * 180;
    // oldX + cos(radians) * distance
    if (this.movingForward) {
      this.velX += Math.cos(radians) * this.speed;
      this.velY += Math.sin(radians) * this.speed;
    }
    if (this.x < this.radius) {
      this.x = canvas.width;
    }

    if (this.x > canvas.width) {
      this.x = this.radius;
    }

    if (this.y < this.radius) {
      this.y = canvas.height;
    }

    if (this.y > canvas.height) {
      this.y = this.radius;
    }

    this.velX *= 0.99;
    this.velY *= 0.99;

    this.x -= this.velX;
    this.y -= this.velY;
  }

  draw() {
    ctx.strokeStyle = this.strokeColor;
    ctx.beginPath();
    let vertAngle = (Math.PI * 2) / 3;
    let radians = (this.angle / Math.PI) * 180;
    this.noseX = this.x - this.radius * Math.cos(radians);
    this.noseY = this.y - this.radius * Math.sin(radians);
    for (let i = 0; i < 3; i++) {
      ctx.lineTo(
        this.x - this.radius * Math.cos(vertAngle * i + radians),
        this.y - this.radius * Math.sin(vertAngle * i + radians)
      );
    }
    ctx.closePath();
    ctx.stroke();
  }
}

const render = () => {
  console.log(ship);
  ship.movingForward = keys[87];
  if (keys[68]) {
    ship.rotate(1);
  }
  if (keys[65]) {
    ship.rotate(-1);
  }
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  ctx.fillStyle = 'white';
  ctx.font = '21px Arial';
  ctx.fillText('SCORE: ' + score.toString(), 20, 35);
  if (lives <= 0) {
    ship.visible = false;
    ctx.fillStyle = 'white';
    ctx.font = '50px Arial';
    ctx.fillText('GAME OVER', canvasWidth / 2 - 150, canvasHeight / 2);
  }
  drawLifeShips();

  if (asteroids.length !== 0) {
    for (let k = 0; k < asteroids.length; k++) {
      if (
        circleCollision(
          ship.x,
          ship.y,
          11,
          asteroids[k].x,
          asteroids[k].y,
          asteroids[k].collisonRadius
        )
      ) {
        ship.x = canvasWidth / 2;
        ship.y = canvasHeight / 2;
        ship.velX = 0;
        ship.velY = 0;
        lives -= 1;
      }
    }
  }

  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  if (asteroids.length !== 0 && bullets.length !== 0) {
    loop1: for (let l = 0; l < asteroids.length; l++) {
      for (let m = 0; m < bullets.length; m++) {
        if (
          circleCollision(
            bullets[m].x,
            bullets[m].y,
            3,
            asteroids[l].x,
            asteroids[l].y,
            asteroids[l].collisonRadius
          )
        ) {
          if (asteroids[l].level === 1) {
            asteroids.push(
              new Asteroid(asteroids[l].x - 5, asteroids[l].y - 5, 25, 2, 22)
            );
            asteroids.push(
              new Asteroid(asteroids[l].x + 5, asteroids[l].y - 5, 25, 2, 22)
            );
          } else if (asteroids[l].level === 2) {
            asteroids.push(
              new Asteroid(asteroids[l].x - 5, asteroids[l].y - 5, 15, 3, 12)
            );
            asteroids.push(
              new Asteroid(asteroids[l].x + 5, asteroids[l].y - 5, 15, 3, 12)
            );
          }
          asteroids.splice(l, 1);
          bullets.splice(m, 1);
          score += 20;
          break loop1;
        }
      }
    }
  }

  if (ship.visible) {
    ship.update();
    ship.draw();
  }

  bullets = bullets.filter(bullet => bullet.visible);
  if (bullets.length !== 0) {
    for (let i = 0; i < bullets.length; i++) {
      if (bullets[i].visible) {
        bullets[i].update();
        bullets[i].draw();
      }
    }
  }

  if (asteroids.length !== 0) {
    for (let j = 0; j < asteroids.length; j++) {
      asteroids[j].update();
      asteroids[j].draw(j);
    }
  }

  requestAnimationFrame(render);
};

const setupCanvas = () => {
  canvas = document.getElementById('my-canvas');
  ctx = canvas.getContext('2d');
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ship = new Ship();

  for (let i = 0; i < 8; i++) {
    asteroids.push(new Asteroid());
  }

  document.body.addEventListener('keydown', e => {
    keys[e.keyCode] = true;
  });
  document.body.addEventListener('keyup', e => {
    keys[e.keyCode] = false;
    if (e.keyCode === 32) {
      bullets.push(new Bullet(ship.angle));
    }
  });
  render();
};

document.addEventListener('DOMContentLoaded', setupCanvas);
