import BaseScene from '~/BaseScene';
import gsap from 'gsap';

export default class UI extends BaseScene{

    private timer: any;
    private timerText: Phaser.GameObjects.Text;
    private health: Phaser.GameObjects.Text;

    constructor(){
        super('ui');
    }

    create(){
        super.create();

        // this.timer = this.time.addEvent({delay: 1000});

        const timerText = this.add.text(0, 0, "test").setOrigin(.5);
        this.timerText = timerText;
        this.aGrid.placeAtIndex(9, timerText);
        gsap.from(timerText, {y: "-= 20", alpha: 0, delay: .5})

        const health = this.add.text(0, 0, "score").setOrigin(.5);
        this.health = health;
        this.aGrid.placeAtIndex(1, health);
        gsap.from(health, {y: "-= 20", alpha: 0, delay: .7})
    }

    update(){
        // this.timerText.setText(this.timer.getProgress().toString());

    }
}
