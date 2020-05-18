export default class Character extends Phaser.GameObjects.Sprite {
    private lives = 3;
    private particles;
    private fire;
    public fireOn = false;

    constructor(scene: Phaser.Scene, idx = 0){
        super(scene, 0, 0, "ninja");

        this.setScale(.2);
        this.particles = scene.add.particles('red');
        this.fire = this.particles.createEmitter({
            speed: 100,
            scale: { start: .6, end: 0 },
            blendMode: 'ADD'
        });
        this.fire.startFollow(this);
        this.fire.stop();

        scene.add.existing(this);
        scene.physics.add.existing(this);
        scene.aGrid.placeAtIndex(idx, this);

        const body = this.body as Phaser.Physics.Arcade.Body;
        body.setCircle(30);
        body.setBounce(.9, .9);
        body.setCollideWorldBounds(true);
        body.onWorldBounds = true;
        body.angularDrag = 1;
        body.angularVelocity = 900;
    }

    fireToggle(){
        if(this.fireOn){
            this.fire.start();
            this.fireOn = false;
        }else{
            this.fire.stop();
            this.fireOn = true;
        }
    }
}