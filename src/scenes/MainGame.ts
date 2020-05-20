import Phaser, { Game } from 'phaser'
import gsap from 'gsap'
import BaseScene from '~/BaseScene';
import Character from '~/intern/Character';
import Cookie from '~/intern/Cookie';
import Paddle from '~/intern/Paddle';
import { GridFactory } from 'matter';

export default class MainGame extends BaseScene
{
    public player: Character;
    public cookies: Cookie[] = [];
    public dim: any = {w: 0, h: 0};

    private UI: any;
    private paddle: Paddle;
    private paddle2: Paddle;
    private timer: Phaser.Time.TimerEvent;
    private timerInt: number;
    private score: number;
    private bGameOver: boolean;
    private paddleGroup: Phaser.GameObjects.Group;

    private shootAngle: any;
    private gfx: any;
    private hit = false;

	constructor()
	{
		super('game')
    }

    init()
    {
        this.bGameOver = false;
        this.score = 0;
        this.timerInt = 200;
        this.UI = this.scene.get('ui');
        this.cookies = [];
        this.UI.timerInt = this.timerInt;
        this.UI.scoreInt = this.score;
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

        this.paddle = new Paddle(this, 104);
        this.paddleGroup = this.add.group([this.paddle]);

        this.player = new Character(this, 49);

        this.paddle2 = new Paddle(this, 93);
        this.paddle2.setAlpha(0);

        setTimeout(()=> {
            for(let i =0; i < 10; i++){
                this.cookies.push(new Cookie(this));
            }
        },1000)

        this.UI.triesInt = this.player.lives;

        this.physics.add.collider(this.paddle, this.player, this.handleBallHit, undefined, this);
        this.physics.world.on('worldbounds', this.handleWorldCollide, this);

        this.handleInput();
    }

    update(time)
    {
        this.cookies.forEach((cookie) => {
            cookie.update(time)
        })
    }

    handleTimer(){
        if(this.timerInt >= 1 && !this.bGameOver){
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
        const line = new Phaser.Geom.Line();
        this.gfx = this.add.graphics().setDefaultStyles({lineStyle: { width: 2, color: 0xffdd00, alpha: 0.5 }})
        let angle = Phaser.Math.Angle.BetweenPoints(paddle, this.paddle2);

        this.input.on('pointerup', (pointer) => {
            this.physics.world.setFPS(60);
            if(this.input.mouse.locked){
                this.physics.world.timeScale = 1;
                mMove = true;
                if(this.shootAngle){
                    this.shoot(this.shootAngle);

                    if(!this.hit){
                        this.shootAngle = null;
                    }
                }
            }
            this.paddle2.x = this.paddle.x;
        });

        this.input.on('pointerdown', (pointer)=> {
            this.physics.world.setFPS(420);
            this.input.mouse.requestPointerLock();
            if(this.input.mouse.locked){
                this.physics.world.timeScale = 20;
                mMove = false;
            }
        });

        this.input.on('pointermove', (pointer) => {
            if(this.input.mouse.locked){
                if(mMove == true) {
                    this.paddle2.x = this.paddle.x;
                    this.paddle2.move(pointer.movementX, this.dim);
                    this.paddleGroup.getChildren().forEach((child, idx) => {
                        if(idx == 0){
                            child.move(pointer.movementX, this.dim);
                        }else{
                            if(this.player.body.enable == false){
                                child.x = this.paddle.x;
                            }
                        }
                    })
                }else{
                    this.paddle2.x += pointer.movementX;
                    angle = Phaser.Math.Angle.BetweenPoints(paddle, this.paddle2);
                    this.shootAngle = angle;
                    // console.log(this.shootAngle);
                }
                if(this.shootAngle){
                }
                Phaser.Geom.Line.SetToAngle(line, paddle.x, paddle.y, angle, 128);
                this.gfx.clear().strokeLineShape(line);
            }
        });
    }

    handleWorldCollide(body, up, down, left, right){
        if(down){
            this.player.y = -40;
            this.player.x = Math.random() * this.dim.w;
            body.velocity.y = 1;

            if(this.player.lives > 1){
                --this.player.lives;
                this.UI.setTries(this.player.lives);
            }else{
                body.enable = false;
                if(!this.bGameOver){
                    this.gameOver();
                } 
            }
        }
    }

    handleCookieHit(char, cookie){
        this.score++;
        cookie.disableBody(true, true);
    }

    shoot(angle){
        const player = this.player; 
        const body = player.body as Phaser.Physics.Arcade.Body;
        const vel = body.velocity;
        this.gfx.clear();

        if(!body.enable){
            body.enable = true;
            this.physics.velocityFromAngle(angle * (180/Math.PI), 900, body.velocity);
        }
    }

    handleBallHit(paddle, ball){
        const body = ball.body as Phaser.Physics.Arcade.Body;
        const vel = body.velocity;

        this.hit = false;

        // console.log(this.shootAngle);

        if(!this.shootAngle){
            body.enable = false;
            this.paddleGroup.add(ball);
            this.hit = true;
        }else{
            // this.hit = false;
            this.shoot(this.shootAngle, );
        }

        this.score++;
        this.UI.setScore(this.score);

        // vel.x = 400;
        // vel.y *= 1.1;

        // body.setVelocity(vel.x, vel.y);
    }

    gameOver(){
        this.bGameOver = true;
        this.scene.stop('ui');
        this.changeScene('game-over', this.score);
    }
}
