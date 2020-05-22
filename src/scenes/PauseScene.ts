import gsap from 'gsap';
import BaseScene from '~/BaseScene';

export default class PauseScene extends BaseScene{
    constructor(){
        super('pause');
    }

    create()
    {
        super.create();

        const width = this.game.config.width as number;
        const height = this.game.config.height as number;

        const pauseText = this.add.text(0, 0, 'Paused.').setOrigin(.5);
        this.aGrid.placeAtIndex(60, pauseText);
        gsap.from(pauseText, {y: "-=60", rotation: .3, alpha: 0});

        const rect = this.add.rectangle(0, 0, width, height, 0x000).setOrigin(0);
        rect.setAlpha(.5);

        this.input.on('pointerdown', () => {
            this.input.mouse.requestPointerLock();
        });
    }
}
