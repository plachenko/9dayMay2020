import Phaser, { Game } from 'phaser'
import gsap from 'gsap'
import BaseScene from '~/BaseScene';

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

        // this.scene.add('ui');
        
        const group = this.add.group();
        this.scene.run('ui');
        this.scene.get('ui').events.on('timeUp', ()=>{
            // this.changeScene('game-over');
        });
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

        group.add(ballGeo);

        const player = this.add.rectangle(0, 0, 30, 60, 0xFF0000).setOrigin(.5, 0);
            this.aGrid.placeAtIndex(this.position, player);
            gsap.from(player, 1.2, {x: -40, delay: .8, onComplete:()=>{this.canMove = true}})

            this.player = player;

        group.add(player);

        const ball = ballGeo.body as Phaser.Physics.Arcade.Body;
            ball.setCircle(10);
            ball.setBounce(.9, .9);
            ball.allowGravity = false;
            ball.setCollideWorldBounds(true);

        
        this.input.keyboard.on('keydown-RIGHT', () => {
            this.position++;
            const pos = this.aGrid.getIndexPos(this.position);
            gsap.to(group, {x: pos.x})
        });

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
