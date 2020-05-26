import { TitleScreen } from '.';

export default class ArcVisual extends Phaser.Scene{

    public rt: Phaser.GameObjects.RenderTexture;
    private circ: Phaser.GameObjects.Arc;
    private body: Phaser.Physics.Arcade.Body;
    private world: Phaser.Physics.Arcade.World;
    public angle = 0;
    public paddle;

    constructor(){
        super('arc-viz');
    }

    create()
    {
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

            /*
        for(let i = 0; i < 100; i++){
            this.world.update(0, i);
            this.rt.draw(this.circ);
            this.world.postUpdate();
        }
        */
        // this.render();
    }

    setPos(){
        this.circ.x = this.pos.x;
        this.circ.y = this.pos.y;
    }

    update(){
        // console.log(this.angle);
        // this.circ.x += 1;
        // console.log(this.angle);
        /*
        if(this.angle !== this.paddle.shootAngle){
            this.angle = this.paddle.shootAngle;
        }
        this.renderArc();
        */
    }

    public renderArc()
    {
        this.rt.clear();
        const max = 180;
        // this.body.setVelocity(100, -900);
        this.physics.velocityFromAngle(this.angle * (180 / Math.PI), this.paddle.strength * 10, this.body.velocity);
        // this.physics.velocityFromAngle(this.angle, this.paddle.strength * 10, this.body.velocity);

        for(let i = 0; i < max; i+= 10){
            this.world.update(0, i);
            this.circ.alpha = ((max - i) / max);
            this.rt.draw(this.circ);
            this.world.postUpdate();
        }
    }
}