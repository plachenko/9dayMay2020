import Phaser, { Game } from 'phaser'
import gsap from 'gsap'
import BaseScene from '~/BaseScene';
import Character from '~/intern/Character';
import Cookie from '~/intern/Cookie';
import Paddle from '~/intern/Paddle';
import Enemy from '~/intern/Enemy';
import Wall from '~/intern/Wall';

export default class MainGame extends BaseScene
{
    public player: Character;
    public cookies: Cookie[] = [];
    public dim: any = {w: 0, h: 0};

    private UI: any;
    private paddle: Paddle;
    private timer: Phaser.Time.TimerEvent;
    private timerInt: number;
    private score: number;
    private bGameOver: boolean;
    private bPaused: boolean;
    private bMouseMove: boolean;
    private xMove: number;
    private enemies: Enemy[] = [];
    private walls: Wall[] = [];

    private gfx: any;

    private tries;

	constructor()
	{
		super('game')
    }

    init()
    {
        this.xMove = 0;
        this.bGameOver = false;
        this.bPaused = false;
        this.bMouseMove = true;
        this.score = 0;
        this.timerInt = 200;
        this.UI = this.scene.get('ui');
        this.cookies = [];
        this.tries = 3;
        this.UI.timerInt = this.timerInt;
        this.UI.scoreInt = this.score;
        this.UI.triesInt = this.tries;
        this.enemies = [];
        this.walls = [];
    }

    create()
    {
        super.create();

        this.dim.w = this.game.config.width;
        this.dim.h = this.game.config.height;

        this.timer = this.time.addEvent({
            delay: 1000, 
            loop: true, 
            callbackScope: this, 
            callback: this.handleTimer
        });

        this.scene.run('ui');

        // const en = new Enemy(this);
        // this.enemies.push(en);


        this.player = new Character(this, 49);
        this.paddle = new Paddle(this, 104);

        this.spawnCookies(10);

        this.walls.push(new Wall(this, 90, 120, 10));
        this.walls.push(new Wall(this, 250, 120));

        this.physics.world.on('worldbounds', this.handleWorldCollide, this);
        this.physics.world.checkCollision.up = false;

        document.addEventListener('pointerlockchange', () => {
            if(!this.bGameOver){
                this.pause();
            }
        });


        this.handleInput();
        this.cameras.main.setTint(0x00FF00);
    }

    addChar(){
        this.player = new Character(this);
        setTimeout(() => {
            this.walls.forEach(wall => {
                wall.update();
            });
        }, 500);
    }

    update(time)
    {
        this.paddle.update();
        if(!this.bGameOver && this.bMouseMove){
            this.cookies.forEach((cookie) => {
                cookie.update(time)
            });
            this.player.update();
            this.xMove = 0;
        }
    }

    spawnCookies(num){
        for(let i =0; i < num; i++){
            setTimeout(() => {
                this.cookies.push(new Cookie(this));
            }, 100*i);
        }
    }

    handleTimer(){
        if(this.timerInt >= 1 && !this.bGameOver){
            this.timerInt -= 1;
        }else{
            if(!this.bGameOver) this.player.explode();
            this.gameOver();
        }

        this.UI.tick(this.timerInt);
    }

    setScore(num){
        this.score += num;
        if(!this.bGameOver) this.UI.setScore(this.score);
    }

    handleCookieHit(cookie){
        const idx = this.cookies.indexOf(cookie);
        this.cookies.splice(idx, 1);
        if(this.cookies.length == 0){
            this.spawnCookies(10);
        }
    }

    handleInput(){
        const paddle = this.paddle;
        const ninja = this.player;

        this.input.on('pointerup', (pointer) => {
            if(this.input.mouse.locked){
                this.bMouseMove = true;
                paddle.bAiming = false;
                paddle.shoot();
            }else{
                if(!this.bPaused){
                    this.input.mouse.requestPointerLock();
                }
            }
        });

        this.input.on('pointerdown', (pointer)=> {
            if(this.input.mouse.locked){
                this.bMouseMove = false;
                paddle.strength = 0;
                paddle.bAiming = true;
            }
        });

        this.input.on('pointermove', (pointer) => {
            if(this.input.mouse.locked){
                if(this.bMouseMove){
                    this.xMove = pointer.movementX;
                    paddle.bMoving = true;
                }else{
                    paddle.showArcScene();
                    paddle.setShootAngle(pointer.movementX);
                } 
            }
        });
    }

    handleWorldCollide(body, up, down, left, right){
        if(down){
            this.handleKill();
        }
    }

    handleKill(){
        this.cameras.main.flash(100, 155, 0, 0);
        this.player.kill();
        if(this.tries > 1){
            if(!this.bGameOver){
                this.addChar();
                this.paddle.catch(this.player);
                this.setTries(-1);
            }
        }else{
            this.gameOver();
        }
    }

    setTime(num){
        this.timerInt += num;
        if(!this.bGameOver) this.UI.tick(this.timerInt);
    }

    setTries(num){
        this.tries += num;
        if(!this.bGameOver) this.UI.setTries(this.tries);
    }

    pause(e){
        if(document.pointerLockElement){
            if(this.bPaused){
                this.bPaused = false;
                this.scene.wake('ui');
                this.scene.resume('game');
                this.scene.stop('pause');
            }
        }else{
            this.scene.pause();
            this.scene.sleep('ui');
            this.scene.launch('pause');
            this.bPaused = true;
        }
    }

    gameOver(){
        this.cookies.forEach((cookie,idx) => {
            this.cookies.splice(idx, 1);
            cookie.handleTake();
            if(this.cookies.length == 0){
                // this.scene.start('game-over', this.score);
                this.changeScene('game-over', this.score);
            }
        });
        this.scene.stop('ui');
        this.scene.stop('arc-viz');
        this.bGameOver = true;
    }
}
