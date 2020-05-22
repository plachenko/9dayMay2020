export default class BootScene extends Phaser.Scene{
    constructor(){
        super('boot');
    }

    preload(){
        this.load.bitmapFont("pixelFont", "font/font.png", "font/font.xml");
        this.load.image("red", "images/particles/red.png");
        this.load.image("smoke", "images/particles/smoke.png");
        this.load.image("ninja", "images/ninja.png");
        this.load.image("title", "images/title.png");
        this.load.image("cookie", "images/cookie.png");
        this.load.glsl("stars", "starfields.glsl.js");
    }

    create()
    {
        this.add.text(20, 20, "Loading Game...");
        this.scene.start('game');
        // this.scene.start('title');
    }

}