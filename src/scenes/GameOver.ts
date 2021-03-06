import Phaser from 'phaser'
import gsap from 'gsap';
import BaseScene from '~/BaseScene';

export default class GameOver extends BaseScene 
{
    score?: Phaser.GameObjects.Text;
    scoreNumber = 0;
    text?: Phaser.GameObjects.Text;
    pressKey?: Phaser.GameObjects.Text;

	constructor()
	{
		super('game-over')
    }
    
    init(data)
    {
        if(typeof data == "number"){
            this.scoreNumber = data;
        }else{
            this.scoreNumber = 0;
        }
    }

    create()
    {
        const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;

        this.score = this.add.text(screenCenterX, screenCenterY - 100, 'SCORE: ' + this.scoreNumber).setOrigin(0.5);
        this.text = this.add.text(screenCenterX, screenCenterY, 'Game Over.').setOrigin(0.5);
        this.pressKey = this.add.text(screenCenterX, screenCenterY + 100, 'Click to restart').setOrigin(0.5);

        gsap.from(this.score, {y: "-=20", alpha: 0});
        gsap.from(this.text, {y: "-=20", alpha: 0, delay: .5});
        gsap.from(this.pressKey, {y: "+=20", alpha: 0, delay: 1.5, onComplete: () => {
            this.input.on('pointerdown', (pointer)=> {
                this.cameras.main.flash(200);
                this.input.mouse.requestPointerLock();
                this.changeScene();
            });
        }});

        document.addEventListener('pointerlockchange', () => {
            return false;
        });
    }

    changeScene(){
        gsap.to(this.text, .4, {y: "-=20", alpha: 0})
        gsap.to(this.pressKey, .4, {y: "+=20", alpha: 0})
        super.changeScene('game', {});
    }
}
