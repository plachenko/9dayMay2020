import Phaser, { Game } from 'phaser'
import gsap from 'gsap'
import BaseScene from '~/BaseScene';
import Character from '~/intern/Character';
import Cookie from '~/intern/Cookie';
import Paddle from '~/intern/Paddle';

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

        this.player = new Character(this, 49);
        this.paddle = new Paddle(this, 104);

        this.spawnCookies(10);

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

    update(time)
    {
        if(!this.bGameOver && this.bMouseMove){
            this.cookies.forEach((cookie) => {
                cookie.update(time)
            });
            this.paddle.move(this.xMove, this.dim);
            this.player.move(this.paddle.x); 
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
                paddle.handleShoot();
            }
        });

        this.input.on('pointerdown', (pointer)=> {
            this.input.mouse.requestPointerLock();

            if(this.input.mouse.locked){
                this.bMouseMove = false;
            }
        });

        this.input.on('pointermove', (pointer) => {
            if(this.input.mouse.locked){
                if(this.bMouseMove){
                    this.xMove = pointer.movementX;
                }else{
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
                this.player = new Character(this);
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
        this.bGameOver = true;
    }
}
