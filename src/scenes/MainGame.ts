import Phaser, { Game } from 'phaser'
import gsap from 'gsap'
import BaseScene from '~/BaseScene';
import Character from '~/intern/Character';

export default class MainGame extends BaseScene
{
    cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    player: Phaser.GameObjects.Rectangle;
    ground: any;
    ball: Phaser.GameObjects.Arc;
    spaceDn = false;
    canMove = false;

	constructor()
	{
		super('game')
    }

    create()
    {
        super.create();
        this.scene.run('ui');
        this.physics.world.setFPS(480);

        let mMove = true;

        const particles = this.add.particles('red');

        const emitter = particles.createEmitter({
            speed: 100,
            scale: { start: 1, end: 0 },
            blendMode: 'ADD'
        });

        const paddle: Phaser.GameObjects.Rectangle = this.add.rectangle(0, 400, 100, 20, 0xFF0000);
        this.aGrid.placeAtIndex(104, paddle);
        this.physics.add.existing(paddle, true);

        const ninja = new Character(this);
        this.ball = ninja;
        this.aGrid.placeAtIndex(5, ninja);

        emitter.startFollow(ninja);

        this.physics.add.collider(paddle, ninja, this.handleBallHit, undefined, this);
        this.physics.world.on('worldbounds', this.handleWorldCollide, this);
        
        this.input.on('pointerup', (pointer)=> {
            if(this.input.mouse.locked){
                this.physics.world.timeScale = 1;
                mMove = true;
            }
        });

        this.input.on('pointerdown', (pointer)=> {
            this.input.mouse.requestPointerLock();
            if(this.input.mouse.locked){
                this.physics.world.timeScale = 20;
                mMove = false;
            }
        });

        this.input.on('pointermove', (pointer) => {
            if(this.input.mouse.locked){
                if(mMove == true) {
                    if(paddle.x > 0){
                        paddle.x += pointer.movementX;
                    } else {
                        paddle.x = 0;
                    }

                    if(paddle.x <= this.game.config.width - paddle.width){
                        paddle.x += pointer.movementX;
                    } else {
                        paddle.x = this.game.config.width - paddle.width;
                    }
                }
                paddle.body.updateFromGameObject();
            }
        })
    }

    update()
    {
        if(this.canMove){
            this.processPlayerInput();
        }
    }

    handleWorldCollide(body, up, down, left, right){
        if(down){
            console.log(body);

        }
    }

    handleBallHit(paddle, ball){
        const body = this.ball.body as Phaser.Physics.Arcade.Body;
        const vel = body.velocity;

        vel.x = 900.1;
        vel.y *= 1.1;

        body.setVelocity(vel.x, vel.y);
    }

    processPlayerInput()
    {
        const char = this.player;
        const ground = this.ground;

        if(this.cursorKeys.left.isDown){
            this.position--;
            this.aGrid.placeAtIndex(this.position, char);
            // char.x -= 10;
        }else if(this.cursorKeys.right.isDown){
        }

        if(this.cursorKeys.up.isDown){
            char.y -= 10;
        }else if(this.cursorKeys.down.isDown){
            char.y += 10;
        }
    }
}
