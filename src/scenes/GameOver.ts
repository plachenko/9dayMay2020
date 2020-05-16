import Phaser from 'phaser'
import gsap from 'gsap';
import BaseScene from '~/BaseScene';

export default class GameOver extends BaseScene 
{
    text?: Phaser.GameObjects.Text;
    pressKey?: Phaser.GameObjects.Text;

	constructor()
	{
		super('game-over')
	}

	preload()
    {
    }

    create()
    {
        const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;

        this.text = this.add.text(screenCenterX, screenCenterY, 'Game Over.').setOrigin(0.5);
        this.pressKey = this.add.text(screenCenterX, screenCenterY + 100, 'Press SPACE').setOrigin(0.5);

        /*
        gsap.from(this.text, {y: screenCenterY - 20, alpha: 0, delay: .5});
        gsap.from(this.pressKey, {y: screenCenterY + 120, alpha: 0, delay: 2, onComplete: () => {
            this.input.keyboard.once('keydown-SPACE', () => {
                gsap.to(this.text, .4, {y: screenCenterY - 30, alpha: 0})
                gsap.to(this.pressKey, .4, {y: screenCenterY + 120, alpha: 0})
                setTimeout(() => {
                    this.scene.start('game')
                }, 500);
            });
        }});
        */

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
