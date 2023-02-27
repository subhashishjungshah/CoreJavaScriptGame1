window.addEventListener("load", function () {
  const canvas = document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");
  canvas.width = 1280;
  canvas.height = 720;
  ctx.fillStyle = "white";
  ctx.strokeStyle = "white";

  // player class chaincha yah
  class Player {
    constructor(game) {
      this.game = game;
      this.collisionX = this.game.width * 0.5;
      this.collisionY = this.game.height * 0.5;
      this.collisionRadius = 30;
      this.speedX = 0;
      this.speedY = 0;
      this.dx = 0;
      this.dy = 0;
      this.speedModifier = 5;
      this.image = document.getElementById("player");
      this.spriteWidth = 255;
      this.spriteHeigth = 255;
      this.width = this.spriteWidth;
      this.height = this.spriteHeigth;
      this.spriteX;
      this.spriteY;
      this.FrameX = 0;
      this.FrameY = 0;
    }
    draw(context) {
      context.drawImage(
        this.image,
        this.FrameX * this.spriteWidth,
        this.FrameY * this.spriteHeigth,
        this.spriteWidth,
        this.spriteHeigth,
        this.spriteX,
        this.spriteY,
        this.width,
        this.height
      );
      if (this.game.debug) {
        context.beginPath();
        context.arc(
          this.collisionX,
          this.collisionY,
          this.collisionRadius,
          0,
          Math.PI * 2
        );
        context.save();
        context.globalAlpha = 0.5;
        context.fill();
        context.restore();
        context.stroke();
        context.beginPath();
        context.moveTo(this.collisionX, this.collisionY);
        context.lineTo(this.game.mouse.x, this.game.mouse.y);
        context.stroke();
      }
    }
    update() {
      this.dx = this.game.mouse.x - this.collisionX;
      this.dy = this.game.mouse.y - this.collisionY;
      const angle = Math.atan2(this.dy, this.dx);
      if (angle < -2.74 || angle > 2.74) this.FrameY = 6;
      else if (angle < -1.96) this.FrameY = 7;
      else if (angle < -1.17) this.FrameY = 0;
      else if (angle < -0.39) this.FrameY = 1;
      else if (angle < 0.39) this.FrameY = 2;
      else if (angle < 1.17) this.FrameY = 3;
      else if (angle < 1.96) this.FrameY = 4;
      else if (angle < 2.74) this.FrameY = 5;
      // calcuting hypothesis for constant speed
      const distance = Math.hypot(this.dy, this.dx);
      if (distance > this.speedModifier) {
        this.speedX = this.dx / distance || 0;
        this.speedY = this.dy / distance || 0;
      } else {
        this.speedX = 0;
        this.speedY = 0;
      }
      this.collisionX += this.speedX * this.speedModifier;
      this.collisionY += this.speedY * this.speedModifier;
      this.spriteX = this.collisionX - this.width * 0.5;
      this.spriteY = this.collisionY - this.height * 0.5 - 50;
      // horizontal boundaries
      // handling left collision
      if (this.collisionX < this.collisionRadius)
        this.collisionX = this.collisionRadius;
      else if (this.game.width - this.collisionRadius < this.collisionX)
        this.collisionX = this.game.width - this.collisionRadius;

      //vertical Boundaries
      if (this.collisionY < 260 + this.collisionRadius)
        this.collisionY = 260 + this.collisionRadius;
      else if (this.collisionY > this.game.height - this.collisionRadius)
        this.collisionY = this.game.height - this.collisionRadius;
      // checking for collision
      this.game.obstacles.forEach((obstacle) => {
        let [collision, dx, dy, distance, sumofRadii] =
          this.game.collisionDetector(this, obstacle);

        if (collision) {
          const unit_x = dx / distance;
          const unit_y = dy / distance;
          this.collisionX = obstacle.collisionX + (sumofRadii + 1) * unit_x;
          this.collisionY = obstacle.collisionY + (sumofRadii + 1) * unit_y;
        }
      });
      this.game.eggs.forEach((egg) => {
        let [collision, dx, dy, distance, sumofRadii] =
          this.game.collisionDetector(this, egg);

        if (collision) {
          console.log("Collided with eggs");
        }
      });
    }
  }

  class Obstacle {
    constructor(game) {
      this.game = game;
      this.collisionX = this.game.width * Math.random();
      this.collisionY = this.game.height * Math.random();
      this.collisionRadius = 60;
      this.image = document.getElementById("obstacles");
      this.spriteWidth = 250;
      this.spriteHeight = 250;
      this.width = this.spriteWidth;
      this.height = this.spriteHeight;
      this.spriteX = this.collisionX - this.width * 0.5;
      this.spriteY = this.collisionY - this.height * 0.5 - 70;
      this.FrameX = Math.floor(Math.random() * 4);
      this.FrameY = Math.floor(Math.random() * 3);
    }
    draw(context) {
      context.drawImage(
        this.image,
        this.FrameX * this.spriteWidth,
        this.FrameY * this.spriteHeight,
        this.spriteWidth,
        this.spriteHeight,
        this.spriteX,
        this.spriteY,
        this.width,
        this.height
      );
      if (this.game.debug) {
        context.beginPath();
        context.arc(
          this.collisionX,
          this.collisionY,
          this.collisionRadius,
          0,
          Math.PI * 2
        );
        context.save();
        context.globalAlpha = 0.5;
        context.fill();
        context.restore();
        context.stroke();
      }
    }
  }
  class Eggs {
    constructor(game) {
      this.game = game;
      this.collisionX = Math.random() * this.game.width;
      this.collisionY = Math.random() * this.game.height;
      this.collisionRadius = 40;
      this.image = document.getElementById("eggs");
      this.spriteWidth = 110;
      this.spriteHeight = 135;
      this.width = this.spriteWidth;
      this.height = this.spriteHeight;
      this.spriteX = this.collisionX - this.width * 0.5;
      this.spriteY = this.collisionY - this.height * 0.5;
    }

    draw(context) {
      context.drawImage(this.image, this.spriteX, this.spriteY);
      if (this.game.debug) {
        context.beginPath();
        context.arc(
          this.collisionX,
          this.collisionY,
          this.collisionRadius,
          0,
          Math.PI * 2
        );
        context.save();
        context.globalAlpha = 0.5;
        context.fill();
        context.restore();
        context.stroke();
      }
    }
  }

  // game class chaincha
  class Game {
    constructor(canvas) {
      this.canvas = canvas;
      this.width = this.canvas.width;
      this.height = this.canvas.height;
      this.player = new Player(this);
      this.numberofObstacle = 20;
      this.maxEggs = 10;
      this.eggs = [];
      this.obstacles = [];
      this.mouse = {
        x: this.width * 0.5,
        y: this.height * 0.5,
        pressed: false,
      };
      this.debug = true;
      canvas.addEventListener("mousedown", (e) => {
        this.mouse.x = e.offsetX;
        this.mouse.y = e.offsetY;
        this.mouse.pressed = true;
      });
      canvas.addEventListener("mouseup", (e) => {
        this.mouse.x = e.offsetX;
        this.mouse.y = e.offsetY;
        this.mouse.pressed = false;
      });
      canvas.addEventListener("mousemove", (e) => {
        // move only when clicked
        if (this.mouse.pressed) {
          this.mouse.x = e.offsetX;
          this.mouse.y = e.offsetY;
        }
      });
      window.addEventListener("keydown", (e) => {
        if (e.key == "d") this.debug = !this.debug;
      });
    }
    render(context) {
      this.player.draw(context);
      this.player.update();
      this.obstacles.forEach((obstacle) => obstacle.draw(context));
      this.eggs.forEach((egg) => egg.draw(context));
      if (this.eggs.length < this.maxEggs) {
        this.addEggs();
      }
    }
    collisionDetector(a, b) {
      const dx = a.collisionX - b.collisionX;
      const dy = a.collisionY - b.collisionY;
      const distance = Math.hypot(dy, dx);
      const sumofRadii = a.collisionRadius + b.collisionRadius;
      return [distance < sumofRadii, dx, dy, distance, sumofRadii];
    }
    addEggs() {
      let attempts = 0;
      let overlap = false;
      while (attempts < 500) {
        let eggObj = new Eggs(this);
        this.eggs.forEach((egg) => {
          const dx = eggObj.collisionX - egg.collisionX;
          const dy = eggObj.collisionY - egg.collisionY;
          const distance = Math.hypot(dy, dx);
          const sumofRadius =
            eggObj.collisionRadius + egg.collisionRadius + 100;
          if (distance < sumofRadius) {
            overlap = true;
          }
        });
        const margin = eggObj.collisionRadius * 2;
        if (
          !overlap &&
          eggObj.spriteX > 0 &&
          eggObj.spriteX < this.width - eggObj.width &&
          eggObj.collisionY > 260 + margin &&
          eggObj.collisionY < this.height
        ) {
          this.eggs.push(new Eggs(this));
        }
        attempts++;
      }
    }
    initializeObstacles() {
      // obstacles dont overlap or circle packing algorithm brute force algorithm
      let attempts = 0;
      let overlap = false;
      while (this.obstacles.length < this.numberofObstacle && attempts < 500) {
        let testObs = new Obstacle(this);
        this.obstacles.forEach((obstacle) => {
          const dx = testObs.collisionX - obstacle.collisionX;
          const dy = testObs.collisionY - obstacle.collisionY;
          const distance = Math.hypot(dy, dx);
          const distanceBuffer = 150;
          const sumofRadius =
            testObs.collisionRadius + obstacle.collisionRadius + distanceBuffer;
          if (distance < sumofRadius) {
            overlap = true;
          }
        });
        const margin = testObs.collisionRadius * 2;
        if (
          !overlap &&
          testObs.spriteX > 0 &&
          testObs.spriteX < this.width - testObs.width &&
          testObs.collisionY > 260 + margin &&
          testObs.collisionY < this.height
        ) {
          this.obstacles.push(testObs);
        }
        attempts++;
      }
    }
  }
  // creating instance for the game
  game = new Game(canvas);
  game.initializeObstacles();
  // creating an animation loop
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.render(ctx);
    window.requestAnimationFrame(animate);
  }
  animate();
});
