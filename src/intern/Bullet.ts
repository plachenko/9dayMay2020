export default class Bullet extends Phaser.GameObjects.Arc{
    constructor(scene, x = 0, y = 0, angle){
        super(scene, x, y, 10, 0, 360, false, 0xFF0000);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        const body = this.body;
        body.setCircle(10);
        body.setGravity(0, -900);
        scene.physics.velocityFromAngle(angle * (180/Math.PI), 100, body.velocity);
        scene.physics.add.collider(this, scene.player, this.handleHit, undefined, this);
    }

    private handleHit(player, bullet){
        // player.body.setVelocity(0, 2000);
        bullet.explode();
        this.destroy();
    }

}