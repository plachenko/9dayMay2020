import Phaser from 'phaser'
import gsap from 'gsap';
import BaseScene from '~/BaseScene';

export default class TitleScreen extends BaseScene
{
    text?: Phaser.GameObjects.Text;
    pressKey?: Phaser.GameObjects.Text;

	constructor()
	{
		super('title')
	}

    create()
    {
        super.create();

        this.text = this.add.text(0, 0, '9 Day Jam.').setOrigin(0.5);
        this.pressKey = this.add.text(0, 0, 'Press SPACE').setOrigin(0.5);

        this.aGrid.placeAtIndex(60, this.text);
        this.aGrid.placeAtIndex(71, this.pressKey);

        gsap.from(this.text, {y: "-=20", alpha: 0, delay: .5});
        gsap.from(this.pressKey, {y: "+=20", alpha: 0, delay: 1.5, onComplete: () => {
            this.input.keyboard.once('keydown-SPACE', () => {this.changeScene()});
        }});
    }

    changeScene(){
        gsap.to(this.text, .4, {y: "-=20", alpha: 0})
        gsap.to(this.pressKey, .4, {y: "+=20", alpha: 0})
        super.changeScene('game');
    }
}
