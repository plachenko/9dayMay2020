import WallPart from './WallPart';

export default class Wall{
    wallparts = [];
    constructor(scene, x = 0, y = 0, num = Phaser.Math.Between(1, 9), type = null){
        for(let i = 0; i <= num * 30; i+=30){
            const wp = new WallPart(scene, x, y + i, type || Phaser.Math.Between(0, 2));
            this.wallparts.push(wp);
        }
    }

    public update(){
        this.wallparts.forEach(el => {
            el.hitTest();
        })
    }
}