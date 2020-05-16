import AlignGrid from './extern/AlignGrid';

export default class BaseScene extends Phaser.Scene
{

    protected aGrid ?: AlignGrid;
    protected timeout = .4 * 1000;
    protected cursorKeys ?: Phaser.Types.Input.Keyboard.CursorKeys;

    create(){
        this.cursorKeys = this.input.keyboard.createCursorKeys();
        this.loadGrid();
        this.cameras.main.fadeFrom(this.timeout);
    }

    changeScene(scene: string){
        this.cameras.main.fade(this.timeout);
        setTimeout(()=> {
            this.scene.start(scene);
        }, this.timeout);
    }

    protected loadGrid(){
        this.aGrid = new AlignGrid({
            scene: this,
            cols: 11,
            rows: 11 
        });
        if(this.game.debug){
            this.aGrid?.showNumbers();
        }
    }
}