import BaseScene from '~/BaseScene';
import moment from 'moment';
import gsap from 'gsap';

export default class UI extends BaseScene{

    private timerText: Phaser.GameObjects.Text;
    private score: Phaser.GameObjects.Text;
    private tries: Phaser.GameObjects.Text;
    public scoreInt: number;
    public triesInt: number;
    public timerInt: number;

    constructor(){
        super('ui');
    }

    create(){
        super.create();

        this.tries = this.add.text(0, 0, "tries: " + this.triesInt).setOrigin(.5);
        this.aGrid.placeAtIndex(111, this.tries);
        gsap.from(this.tries, {y: "+= 20", alpha: 0, delay: .5})

        this.score = this.add.text(0, 0, "score: " + this.scoreInt).setOrigin(.5);
        this.aGrid.placeAtIndex(1, this.score);
        gsap.from(this.score, {y: "-= 20", alpha: 0, delay: .5})

        this.timerText = this.add.text(0, 0, "time: ").setOrigin(.5);
        this.aGrid.placeAtIndex(9, this.timerText);
        gsap.from(this.timerText, {y: "-= 20", alpha: 0, delay: .5})

        this.tick(this.timerInt);
    }

    update(){
    }

    setTries(tries: number){
        this.tries.setText("tries: " + tries);
    }

    setScore(score: number){
        this.score.setText("score: " + score);
    }

    tick(timerInt: number){
        const time = moment(timerInt * 1000).format('mm:ss');
        this.timerText.setText("time: " + time);
    }
}
