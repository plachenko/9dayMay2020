export default class BootScene extends Phaser.Scene{
    constructor(){
        super('boot');
    }

    preload(){
        this.load.setPath('assets')
        this.load.bitmapFont("pixelFont", "font/font.png", "font/font.xml")
    }

    create()
    {
        this.add.text(20, 20, "Loading Game...");
        this.scene.start('game');
        // this.scene.start('title');
    }

}