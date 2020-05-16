import BaseScene from '~/BaseScene';
import gsap from 'gsap';
import moment from 'moment';
import Game from '~/intern/Game'

export default class UI extends BaseScene{

    private timer: any;
    private tInt = 0;
    private timerText: Phaser.GameObjects.Text;
    private health: Phaser.GameObjects.Text;

    constructor(){
        super('ui');
        console.log(Game);
    }

    preload()
    {
    }

    create(){
        super.create();

        this.timer = this.time.addEvent({delay: 1000, loop: true, callbackScope: this, callback: this.tEvent});

        const time = moment(Game.time * 1000).format('mm:ss');
        const timerText = this.add.text(0, 0, "time: ").setOrigin(.5);
        this.timerText = timerText;
        this.aGrid.placeAtIndex(9, timerText);
        gsap.from(timerText, {y: "-= 20", alpha: 0, delay: .5})

        // this.add.bitmapText(0, 0, "pixelFont", "testing!");
        // this.health = health;
        // this.aGrid.placeAtIndex(1, health);
        // gsap.from(health, {y: "-= 20", alpha: 0, delay: .7})
    }

    tEvent(){
        if(this.totalTime >= 1){
            this.totalTime -= 1;
            const time = moment(this.totalTime * 1000).format('mm:ss');
            this.timerText.setText('time: ' + time);
        }else{
            this.events.emit('timeUp');
            // this.changeScene('game-over')
        }
    }

    update(){
        // this.timerText.setText(this.timer.getProgress().toString().substr(0, 4));
    }
}
