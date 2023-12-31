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
let Explode = new Audio();
Explode.src = "./explosion.wav"
let shoot = new Audio();
shoot.src = "./laserShoot.wav"
let powerUp = new Audio();
powerUp.src = "./powerUP.wav"
music.addEventListener("canplay", () => {
    music.volume = 0.2
    music.play();
});
const textElement = document.getElementById('flip');
let change = -1;
let ran = false;
function changeText() {
  textElement.innerHTML = 'Ball Pong';
  change *= -1
}
function changeBack() {
    textElement.innerHTML = 'gnoP llaB';
    change *= -1
}
function CHECK() {
    if (change === -1) {
        changeText();
    } else if (change === 1) {
        changeBack();
    }
    console.log(change)

}
function START() {
    setTimeout(() => {
        CHECK();
        START();
    }, 2500);
}
START();
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
        this.direction = Math.floor(Math.random() * 4) - 1;
        this.angle = 0;
        this.moving = false;
        this.fired = false;
        this.savedSpeed = -100;
        this.ran = false;
    }
    draw() {
        ctx.shadowColor = "gray";
        ctx.shadowBlur = bloom/4;
        ctx.fillStyle = "black"
        ctx.fillRect(this.bounds.x,this.bounds.y,this.bounds.w,this.bounds.h)
    }   
    update() {
        if (this.direction === 0) {
            this.direction = -1
        }
        if (this.direction === 3) {
            this.direction = 1
        }
        if (this.bounds.x <= 0) {
            score += 1;
            player.reset();
            RANDOM_PowerUp();
        }
        if (this.bounds.x >= canvas.width) {
            score += 1;
            player.reset();
            RANDOM_PowerUp();
        }
        if (currentKey.get(" ")) {
            if (this.ran === false) {
                this.savedSpeed = this.speed
                this.ran = true;
                this.speed /= 2;
            }
            if (this.fired === false) {
                bullets.push(new Bullet(player));
                shoot.play();
                this.fired = true
                this.timeoutHandle = setTimeout(()=>{
                    this.fired = false
                },200)
        }
        } else {
            if (this.ran === true) {
                if (this.savedSpeed > -10) {
                    this.speed = this.savedSpeed
                    console.log("RAj")
                }
            }
            this.ran = false;
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
                    return;
                } else {
                    Explode.play();
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
        this.speed = player.speed*5;
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
let Power2RandomNum = 0;
let Power1RandomNum = Math.floor(Math.random() * 2) + 1;

if (Power1RandomNum === 1) {
    Power2RandomNum = 2
}
if (Power1RandomNum === 2) {
    Power2RandomNum = 1
}
let RandomMATCH = Math.floor(Math.random() * 3) + 1
function RANDOM_PowerUp() {
    powerUp.play();
    console.log("Ranmdom Match" + RandomMATCH)
    if (RandomMATCH === Power1RandomNum) {
        let savedSpeed = player.speed;
        player.speed *= 1.5
        console.log("SPEED")

        setTimeout(() => {
            player.speed = savedSpeed
        }, 2000);
        RandomMATCH = Math.floor(Math.random() * 3) + 1
    }
    if (RandomMATCH === 3) {
        let savedSlowSpeed = player.speed;
        player.speed /= 2.5
        console.log("SLOW DIOWN")
        setTimeout(() => {
            player.speed = savedSlowSpeed
        }, 4000);
        RandomMATCH = Math.floor(Math.random() * 3) + 1
    }
    if (RandomMATCH === Power2RandomNum) {
        let savedW = player.bounds.w
        let savedH = player.bounds.h
        player.bounds.w *= 1.5
        player.bounds.h *= 1.5
        console.log("SIZE")
        setTimeout(() => {
            player.bounds.w = savedW
            player.bounds.h = savedH
        }, 2000);
        RandomMATCH = Math.floor(Math.random() * 3) + 1
    }
}

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
            alert("Collect 5 Points to move on to the next level")
        }
        if (levelON === 2) {
            for (let i = 0; i < padels.length; i++) {
                padels[i].fireRATE -= 1;
            }
            levelON = 3;
            score = 0;
            alert("Collect 10 Points to move on to the next level")
            mode = "reset"
        }
        if (levelON === 4) {
            levelON = 5;
            score = 0;
            alert("Collect 15 Points to move on to the next level")
            mode = "reset"
        }
        if (score >= 5) {
            levelON = 2;
        }
        if (score >= 10) {
            levelON = 4
        }

        scoreElement.style.visibility = "visible"
        scoreElement.innerHTML = ""+score
        document.getElementById("menu").style.visibility = "hidden"
        for (let i = 0; i < bullets.length; i++) {
            bullets[i].draw()
            bullets[i].update();
        }
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
