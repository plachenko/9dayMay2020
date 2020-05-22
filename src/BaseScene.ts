import AlignGrid from './extern/AlignGrid';

export default class BaseScene extends Phaser.Scene
{

    public aGrid ?: AlignGrid;
    protected timeout = .4 * 1000;
    protected cursorKeys ?: Phaser.Types.Input.Keyboard.CursorKeys;

    create(){
        this.cursorKeys = this.input.keyboard.createCursorKeys();
        this.loadGrid();
        this.cameras.main.fadeFrom(this.timeout);
    }

    changeScene(scene: string, data, time = null){
        this.cameras.main.fade(this.timeout);
        const _time = time || this.timeout;
        setTimeout(()=> {
            this.scene.start(scene, data);
        }, _time);
    }

    protected loadGrid(){
        this.aGrid = new AlignGrid({
            scene: this,
            cols: 11,
            rows: 11 
        });
    }
}