export default class WallPart extends Phaser.GameObjects.Rectangle{
    public velocity = {x: 900, y: 0};
    private life = -1;

    constructor(scene, x = 0, y = 0, type = 0){
        super(scene, x, y, 30, 30, 0x00FF00);

        scene.add.existing(this);
        scene.physics.world.enableBody(this, Phaser.Physics.Arcade.STATIC_BODY);

        switch(type){
            case 0:
                this.fillColor = 0xCCCCCC;
                break;
            case 1:
                this.life = 1;
                this.fillColor = 0xFF0000;
                this.velocity = {x: 200, y: 400};
                break;
            case 2: 
                this.life = 1;
                this.fillColor = 0x00FF00;
                this.velocity = {x: 200, y: -400};
                break
        }

        this.hitTest();
        // this.scene.physics.add.collider(this, this.scene.player, this.handleHit, undefined, this);
    }

    public hitTest(){
        this.scene.physics.add.collider(this, this.scene.player, this.handleHit, undefined, this);
    }

    private handleHit(wall, player){
        const body = wall.body as Phaser.Physics.Arcade.Body;
        const multX = body.touching.left ? -1 : 1;
        if( this.life > 0 ){
            this.life --;
        }else if(this.life == 0){
            this.destroy();
        }

        player.body.setVelocity(this.velocity.x * multX, this.velocity.y);
    }
}