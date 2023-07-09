import {Rect} from "./RectUtils.js"
import {ParticleSource} from "./Particals.js"
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d")
let currentKey = new Map();
let particleSource = new ParticleSource;
let scoreElement = document.getElementById("score")
let score = 0;
let KeyboardEnabled = true
let mode = "menu"
let coinFlip = false;
const music = new Audio();
music.src = "./Music.mp3";
music.addEventListener("canplay", () => {
    music.volume = 0.2
    music.play();
});
music.addEventListener("ended", function() {
    // Restart the playback from the beginning
    music.volume = 0.2
    music.currentTime = 0;
    music.play();
  });
class Ball {
    constructor() {
        this.BallBullet = true;
        this.bounds = new Rect(canvas.width/2,canvas.height/2,20,20)
        this.speed = 3;
        this.direction = 1;
        this.angle = 0;
        this.moving = false;
        this.fired = false;
        this.savedSpeed = 3;
        this.ran = false;
    }
    draw() {
        ctx.shadowColor = "gray";
        ctx.shadowBlur = bloom;
        ctx.fillStyle = "black"
        ctx.fillRect(this.bounds.x,this.bounds.y,this.bounds.w,this.bounds.h)
    }   
    update() {
        if (currentKey.get(" ")) {
            if (this.ran === false) {
                this.savedSpeed = this.speed
                this.ran = true;
                this.speed /= 2;

            }
            if (this.fired === false) {
                bullets.push(new Bullet(player));
                this.fired = true
                this.timeoutHandle = setTimeout(()=>{
                    this.fired = false
                },200)
            }
        }else {
            this.speed = this.savedSpeed
            this.ran = false;

        }
        if (this.bounds.x <= 0) {
            score += 1;
            mode = "reset"
        }
        if (this.bounds.x >= canvas.width) {
            score += 1;
            mode = "reset"
        }
        this.bounds.y += this.angle
        this.bounds.x -= this.direction*this.speed;
        if (KeyboardEnabled) {
            if (currentKey.get("ArrowUp") || currentKey.get("w")) {
                this.angle = 0
                this.bounds.y -= this.speed;
                this.moving = true;
            } else if (currentKey.get("ArrowDown") || currentKey.get("s")) {
                this.angle = 0;
                this.bounds.y += this.speed
                this.moving = true
            } else {
                this.moving = false
            }
        }
        if (this.bounds.y >= canvas.height-20) {
            this.angle = -2
            KeyboardEnabled = false;
            setTimeout(() => {
                KeyboardEnabled = true;
            }, 100);
              
        }
        if (this.bounds.y <= 0) {
            this.angle = 2
            KeyboardEnabled = false;
            setTimeout(() => {
                KeyboardEnabled = true;
            }, 100);
              
        }
        for (let i = 0; i < bullets.length; i++) {
            if (this.bounds.intersects(bullets[i].bounds) || bullets[i].bounds.intersects(this.bounds)) {
                if (bullets[i].player.BallBullet) {
                    console.log("Your own Bullet")
                    return;
                } else {
                    alert("You Died")
                    location.reload()
                }
            }
         }
    }
    reset() {
        this.bounds.x = canvas.width/2
        this.bounds.y = canvas.height/2
        this.speed = 3;
        this.angle = 0;
    }
}
class Padel {
    constructor(x,y,d) {
        this.coinFlip = Math.floor(Math.random() * 2)
        this.direction = d;
        this.y = y
        this.speed = 2;
        this.bounds = new Rect(x,y,10,125)
        this.ran = false;
        this.fired = false
    }
    draw() {
        ctx.fillStyle = "black"
        ctx.shadowColor = "gray";
        ctx.shadowBlur = bloom;
        ctx.fillRect(this.bounds.x,this.bounds.y,this.bounds.w,this.bounds.h)
    }
    update() {
        if (this.fired === false) {
            bullets.push(new Bullet(this));
            this.fired = true
            this.timeoutHandle = setTimeout(()=>{
                this.fired = false
            },2000)
        }
        if (player.bounds.y >= this.bounds.y+this.bounds.w/2) {
            this.bounds.y += this.speed
        }
        if (player.bounds.y <= this.bounds.y+this.bounds.w/2) {
            this.bounds.y -= this.speed
        }
        if (this.bounds.intersects(player.bounds) || player.bounds.intersects(this.bounds)) {
            particleSource.start_particles(player.bounds.x,player.bounds.y)
            player.direction *= -1
        }
    }
}
class Coin {
    constructor() {
        this.visable = true;
        this.bounds = new Rect(Math.floor(Math.random() * canvas.width-200)+200, Math.floor(Math.random() * canvas.height-200)+200,20,20)
    }
    draw() {

        if (this.visable) {
            ctx.shadowColor = "yellow";
            ctx.shadowBlur = 0;
            ctx.fillStyle = "gold";
            ctx.fillRect(this.bounds.x, this.bounds.y, this.bounds.w, this.bounds.h);
        }
    }
    update() {
        if (this.visable) {
            if (this.bounds.intersects(player.bounds) || player.bounds.intersects(this.bounds)) {
                this.visable = false;
            }
        }
    }
}
class Bullet {
    constructor(player) {
        this.player = player
        this.bounds = new Rect(player.bounds.x,player.bounds.y,15,15)
        this.speed = 10;
        this.firedDirection = player.direction;
    }
    draw() {
        ctx.fillStyle = "red"
        ctx.shadowColor = "pink";
        ctx.shadowBlur = bloom;
        ctx.fillRect(this.bounds.x,this.bounds.y,this.bounds.w,this.bounds.h)
    }
    update() {
        this.bounds.x -= this.firedDirection * this.speed;
        for (let i = 0; i < padels.length; i++) {
            if (this.bounds.intersects(padels[i].bounds) || padels[i].bounds.intersects(this.bounds)) {
                if (padels[i].bounds.h > 0) {
                    padels[i].bounds.h -= 1
                }
            }
        }

    }
}
let bullets = []
let CoinSpawnRate = 400
let CoinNum = Math.floor(Math.random() * CoinSpawnRate)+1
let CoinNumToMatch = Math.floor(Math.random() * CoinSpawnRate)+1
let bloom = 20
function GenerateCoins() {
    if (CoinNum === CoinNumToMatch) {
        coins.push(new Coin);
        CoinNum = Math.floor(Math.random() * CoinSpawnRate)+1
    } else {
        CoinNumToMatch = Math.floor(Math.random() * CoinSpawnRate)+1
    }

}
function DrawWalls() {
    ctx.fillStyle = "gold"
    ctx.shadowColor = "pink";
    ctx.shadowBlur = bloom;
    ctx.fillRect(-6,0,10,canvas.height)
    ctx.fillRect(canvas.width-5,0,10,canvas.height)

}
let coin = new Coin();
let coins = [coin]
let AI1 = new Padel(10,100,-1);
let AI2 = new Padel(canvas.width-20,500,1);
let player = new Ball();
let padels = [AI1,AI2]
function keyboardInit() {
    window.addEventListener("keydown", function (event) {
        currentKey.set(event.key, true);
    });
    window.addEventListener("keyup", function (event) {
        currentKey.set(event.key, false);
    });
}
function Loop() {
    ctx.clearRect(0,0,canvas.width,canvas.height)
    if (mode === "menu") {
        scoreElement.style.visibility = "hiden"
        document.getElementById("menu").style.visibility = "visible"
    }
    if (mode === "game") {
        scoreElement.style.visibility = "visible"
        document.getElementById("menu").style.visibility = "hidden"
        for (let i = 0; i < bullets.length; i++) {
            bullets[i].draw()
            bullets[i].update();
        }
        scoreElement.innerHTML = ""+score
        for (let i = 0; i < coins.length; i++) {
            coins[i].draw();
            coins[i].update();
        }
        for (let i = 0; i < padels.length; i++) {
            padels[i].speed = (score/4)+1
            padels[i].draw();
            padels[i].update()
        }
        DrawWalls();
        GenerateCoins();
        player.draw();
        player.update();
        particleSource.draw_particles(ctx,238, 134, 149)
        particleSource.update_particles();
    
    }
    if (mode === "reset") {
        if (coinFlip === false) {
            player.direction = -1
            coinFlip = true
        } else if (coinFlip === true) {
            player.direction = 1
            coinFlip = false
        }
        player.reset();
        mode = "game"
    }
    requestAnimationFrame(Loop)
}
function init() {
    document.getElementById("fullscreen").addEventListener("click", function() {
        mode = "game"
    });    
    keyboardInit();
    Loop();
}
init();
