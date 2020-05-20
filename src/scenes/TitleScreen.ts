import Phaser from 'phaser'
import gsap from 'gsap';
import BaseScene from '~/BaseScene';

export default class TitleScreen extends BaseScene
{
    text?: Phaser.GameObjects.Text;
    pressKey?: Phaser.GameObjects.Text;
    title: Phaser.GameObjects.Image;

	constructor()
	{
		super('title');
	}

    create()
    {
        super.create();

        const width = this.game.config.width as number;
        const height = this.game.config.height as number;

        const shader = this.add.shader('RGB Shift Field', 0, 0, width, height).setOrigin(0);
        const rect = this.add.rectangle(0, 0, width, height, 0x000).setOrigin(0);

        this.text = this.add.text(0, 0, 'May 2020 9 Day Jam').setOrigin(0.5);
        this.pressKey = this.add.text(0, 0, 'Click to start').setOrigin(0.5);
        this.title = this.add.image(0, 0, "title");
        this.aGrid.placeAtIndex(60, this.title);

        this.aGrid.placeAtIndex(16, this.text);
        this.aGrid.placeAtIndex(104, this.pressKey);
        const bg = this.aGrid.placeBetween(14, 106);

        gsap.to(rect, 1.5, {alpha: .7, delay: 1, x: bg.x, y: bg.y, width: bg.w, height: bg.h});
        gsap.from(this.title, {y: "-=60", rotation: .3, alpha: 0, delay: .5});
        gsap.from(this.text, {y: "-=30", alpha: 0, delay: 1.5});
        gsap.from(this.pressKey, {y: "+=20", alpha: 0, delay: 1.5, onComplete: () => {
            this.input.on('pointerdown', (pointer)=> {
                this.cameras.main.flash(200);
                this.input.mouse.requestPointerLock();
                this.changeScene();
            });
        }});
    }

    update(){
    }

    changeScene(){
        gsap.to(this.text, .4, {y: "-=20", alpha: 0})
        gsap.to(this.pressKey, .4, {y: "+=20", alpha: 0})
        super.changeScene('game', {});
    }
}
