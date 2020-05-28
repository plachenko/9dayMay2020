import { TitleScreen } from '.';

export default class ArcVisual extends Phaser.Scene{

    public rt: Phaser.GameObjects.RenderTexture;
    private circ: Phaser.GameObjects.Arc;
    private body: Phaser.Physics.Arcade.Body;
    private world: Phaser.Physics.Arcade.World;
    public angle = 0;
    public paddle;
    public mainRef;

    constructor(){
        super('arc-viz');
    }

    create()
    {
        console.log(this.scene.manager.game.scene.scenes.main);
        this.world = this.physics.world;
        this.world.checkCollision.up = false;
        this.world.checkCollision.down = false;

        this.circ = this.add.circle(100, 400, 5, 0xFFFFFF);
        this.physics.add.existing(this.circ);
        this.rt = this.add.renderTexture(0, 0, 800, 600)
        this.body = this.circ.body as Phaser.Physics.Arcade.Body;
        this.body.setBounce(.5, .5);
        this.body.setCollideWorldBounds(true);
        this.events.on('wake', (sys, data)=>{
            this.circ.x = data.paddle.x;
            this.circ.y = data.paddle.y;
            this.paddle = data.paddle;
            this.angle = this.paddle.shootAngle;
            this.renderArc();
        });
        
        this.events
            .off('update', this.world.update, this.world)
            .off('postupdate', this.world.postupdate, this.world)

        // this.physics.add.collider(this, this,);
    }

    setPos(){
        this.circ.x = this.pos.x;
        this.circ.y = this.pos.y;
    }

    update(){
    }

    public renderArc()
    {
        this.rt.clear();
        const max = 90;
        this.physics.velocityFromAngle(this.angle * (180 / Math.PI), this.paddle.strength * 10, this.body.velocity);

        for(let i = 0; i < max; i+= 5){
            this.world.update(0, i);
            this.circ.alpha = ((max - i) / max);
            this.rt.draw(this.circ);
            this.world.postUpdate();
        }
    }
}