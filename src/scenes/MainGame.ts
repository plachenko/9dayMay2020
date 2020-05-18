import Phaser, { Game } from 'phaser'
import gsap from 'gsap'
import BaseScene from '~/BaseScene';
import Character from '~/intern/Character';
import Paddle from '~/intern/Paddle';

export default class MainGame extends BaseScene
{
    private UI: Phaser.Scene;
    private dim: any = {w: 0, h: 0};
    private player: Character;
    private paddle: Paddle;
    private timer: any;
    private timerInt: number;
    private score = 0;

	constructor()
	{
		super('game')
    }

    init()
    {
        this.score = 0;
        this.timerInt = 200;
        this.UI = this.scene.get('ui');
        this.UI.timerInt = this.timerInt;
        this.UI.scoreInt = this.score;
    }

    create()
    {
        super.create();

        this.timer = this.time.addEvent({
            delay: 1000, 
            loop: true, 
            callbackScope: this, 
            callback: this.handleTimer
        });

        this.scene.run('ui');

        this.dim.w = this.game.config.width;
        this.dim.h = this.game.config.height;

        this.paddle = new Paddle(this, 104);
        this.player = new Character(this);
        this.UI.triesInt = this.player.lives;

        this.physics.add.collider(this.paddle, this.player, this.handleBallHit, undefined, this);
        this.physics.world.on('worldbounds', this.handleWorldCollide, this);

        this.handleInput();
    }

    handleTimer(){
        if(this.timerInt >= 1){
            this.timerInt -= 1;
        }else{
            this.gameOver();
        }

        this.UI.tick(this.timerInt);
    }

    handleInput(){
        let mMove = true;
        const paddle = this.paddle;
        const ninja = this.player;

        this.input.on('pointerup', (pointer)=> {
            if(this.input.mouse.locked){
                this.physics.world.timeScale = 1;
                mMove = true;
                ninja.fireToggle();
            }
        });

        this.input.on('pointerdown', (pointer)=> {
            this.input.mouse.requestPointerLock();
            if(this.input.mouse.locked){
                this.physics.world.timeScale = 20;
                mMove = false;
                // ninja.fireToggle();
            }
        });

        this.input.on('pointermove', (pointer) => {
            if(this.input.mouse.locked){
                if(mMove == true) {
                    paddle.move(pointer.movementX, this.dim);
                }
            }
        });
    }

    handleWorldCollide(body, up, down, left, right){
        if(down){
            if(this.player.lives > 1){
                --this.player.lives;
                this.UI.setTries(this.player.lives);
            }else{
                this.player.body.enable = false;
                this.gameOver();
            }

            this.player.y = -40;
            this.player.x = Math.random() * this.dim.w;
            this.player.body.velocity.y = 1;
        }
    }

    handleCookieHit(char, cookie){
        this.score++;
    }

    gameOver(){
        this.scene.stop('ui');
        this.changeScene('game-over', this.score);
    }

    handleBallHit(paddle, ball){
        const body = ball.body as Phaser.Physics.Arcade.Body;
        const vel = body.velocity;

        this.score++;
        this.UI.setScore(this.score);

        vel.x = 400;
        vel.y *= 1.1;

        body.setVelocity(vel.x, vel.y);
    }
}
