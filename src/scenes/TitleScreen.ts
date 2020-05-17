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
		super('title')
	}

    create()
    {
        super.create();

        const s = this.add.shader('RGB Shift Field', 0, 0, this.game.config.width, this.game.config.height).setOrigin(0);
        const rect = this.add.rectangle(0, 0, this.game.config.width, this.game.config.height, 0x000).setOrigin(0);

        this.text = this.add.text(0, 0, '9 Day Jam').setOrigin(0.5);
        this.pressKey = this.add.text(0, 0, 'Click to start').setOrigin(0.5);
        this.title = this.add.image(0, 0, "title");
        this.aGrid.placeAtIndex(60, this.title);

        this.aGrid.placeAtIndex(16, this.text);
        this.aGrid.placeAtIndex(104, this.pressKey);
        // this.aGrid.showNumbers();
        const r = this.aGrid.placeBetween(14, 106);

        gsap.to(rect, 1.5, {alpha: .7, delay: 1, x: r.x, y: r.y, width: r.w, height: r.h});
        gsap.from(this.title, {y: "-=60", rotation: .3, alpha: 0, delay: .5});
        gsap.from(this.text, {y: "-=30", alpha: 0, delay: 1.5});
        gsap.from(this.pressKey, {y: "+=20", alpha: 0, delay: 1.5, onComplete: () => {
            this.input.on('pointerdown', (pointer)=> {
                this.input.mouse.requestPointerLock();
                this.changeScene();
            });
        }});
    }

    changeScene(){
        gsap.to(this.text, .4, {y: "-=20", alpha: 0})
        gsap.to(this.pressKey, .4, {y: "+=20", alpha: 0})
        super.changeScene('game');
    }
}
