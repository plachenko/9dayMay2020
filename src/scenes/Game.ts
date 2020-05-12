import Phaser, { Game } from 'phaser'
import gsap from 'gsap'
import BaseScene from '~/BaseScene';

export default class Level extends BaseScene
{
    cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
    player?: Phaser.GameObjects.Rectangle;
    ground?: any;
    ball?: Phaser.GameObjects.Arc;
    spaceDn = false;
    canMove = false;

	constructor()
	{
		super('game')
	}

	preload()
    {
        // this.load.setBaseURL('http://labs.phaser.io')
        // this.load.image('logo', 'assets/sprites/phaser3-logo.png')
        // this.load.image('red', 'assets/particles/red.png')
    }

    create()
    {
        super.create();

        this.scene.run('ui');
        const ground = this.aGrid.placeBetween(77, 109);
        this.add.rectangle(
            ground.x, 
            ground.y, 
            ground.w, 
            ground.h, 
            0x00FF00).setOrigin(0);
        this.ground = ground;

        const ballGeo: Phaser.GameObjects.Arc = this.add.circle(0, 0, 10, 0xffffff);
            this.physics.add.existing(ballGeo);
            this.ball = ballGeo;

        const player = this.add.rectangle(0, 0, 30, 60, 0xFF0000).setOrigin(.5, 0);
            this.aGrid.placeAtIndex(88, player);
            gsap.from(player, 1.2, {x: -40, delay: .8, onComplete:()=>{this.canMove = true}})

            this.player = player;

        const ball = ballGeo.body as Phaser.Physics.Arcade.Body;
            ball.setCircle(10);
            ball.setBounce(.9, .9);
            ball.allowGravity = true;
            ball.setCollideWorldBounds(true);


        this.input.keyboard.on('keydown-SPACE', () => {
            ball.setVelocity(190, -200);
        });
    }

    update()
    {
        if(this.canMove){
            this.processPlayerInput();
        }
    }

    processPlayerInput()
    {
        /*
        if(this.cursors?.space?.isDown){
            if(this.spaceDn){
                this.spaceDn = false;
                this.ball?.body.allowGravity = false;
            }else{
                this.spaceDn = true;
                this.ball?.body.allowGravity = true;
                this.ball?.body.setVelocity(0, -200);
            }
            console.log(this.spaceDn);
        }

        */
        const char = this.player;
        const ground = this.ground;

        if(this.cursorKeys.left.isDown && char.y >= ground.x){
            char.x -= 10;
        }else if(this.cursorKeys.right.isDown && char.x <= ground.x + ground.w){
            char.x += 10;
        }

        if(this.cursorKeys.up.isDown && ((char.y - 100) <= ground.y)){
            char.y -= 10;
        }else if(this.cursorKeys.down.isDown && char.y >= (ground.y + ground.h)){
            char.y += 10;
        }else{
            char.y += 0;
        }

    }
}
