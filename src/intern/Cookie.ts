import BaseScene from '~/BaseScene';

export default class Character extends Phaser.GameObjects.Sprite {
    body: Phaser.Physics.Arcade.StaticBody;
    constructor(scene: BaseScene, idx = 0) {
        super(scene, 0, 0, "cookie");

    }
}