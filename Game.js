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
let levelON = 0;
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
            player.reset();
        }
        if (this.bounds.x >= canvas.width) {
            score += 1;
            player.reset();
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
        this.d = d
        this.x = x
        this.y = y
        this.coinFlip = Math.floor(Math.random() * 2)
        this.direction = d;
        this.y = y
        this.speed = 2;
        this.bounds = new Rect(x,y,10,125)
        this.ran = false;
        this.fired = false
        this.fireRATE = 5;
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
            },this.fireRATE*1000)
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
    reset() {
        this.coinFlip = Math.floor(Math.random() * 2)
        this.direction = this.d;
        this.speed = 2;
        this.bounds.x = this.x
        this.bounds.y = this.y
        this.bounds.h = 125
        this.ran = false;
        this.fired = false
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
let bloom = 20
function DrawWalls() {
    ctx.fillStyle = "gold"
    ctx.shadowColor = "pink";
    ctx.shadowBlur = bloom;
    ctx.fillRect(-6,0,10,canvas.height)
    ctx.fillRect(canvas.width-5,0,10,canvas.height)

}
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
        if (levelON === 0) {
            levelON = 1
            alert("Collect 3 Points to move on to the next level")
        }
        if (levelON === 2) {
            for (let i = 0; i < padels.length; i++) {
                padels[i].fireRATE -= 1;
            }
            levelON = 3;
            score = 0;
            alert("Collect 5 Points to move on to the next level")
            mode = "reset"
        }
        if (levelON === 4) {
            levelON = 5;
            score = 0;
            alert("Collect 10 Points to move on to the next level")
            mode = "reset"
        }
        if (score >= 3) {
            levelON = 2;
        }
        if (score >= 5) {
            levelON = 4
        }

        scoreElement.style.visibility = "visible"
        document.getElementById("menu").style.visibility = "hidden"
        for (let i = 0; i < bullets.length; i++) {
            bullets[i].draw()
            bullets[i].update();
        }
        scoreElement.innerHTML = ""+score
        for (let i = 0; i < padels.length; i++) {
            padels[i].speed = (score/4)+1
            padels[i].draw();
            padels[i].update()
        }
        DrawWalls();
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
        bullets = []
        currentKey.clear();
        for (let i = 0; i < padels.length; i++) {
            padels[i].reset();
        }
        mode = "game"
        console.log(bullets  )
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
