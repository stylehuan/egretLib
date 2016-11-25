/**
 * Created by stylehuan on 2016/8/3.
 */
class GameScene extends SceneBase {
    public constructor() {
        super();
    }

    public resGroup: string = "gameScene";

    private _bg: egret.Bitmap;
    private _desk: MahjongDeskView;

    public setup(): void {
    }

    public initial(): void {
        //this.initBg();
        DeskManager.getInstance().isInGameScene = true;
        if (!this._desk) {
            this._desk = MahjongDeskView.getInstance();
            this.addChild(this._desk);
            this._desk.setup();
            this._desk.init();

            if (DeskManager.getInstance().isXw) {
                this.initDeskNoTransition();
                this.gameReady();
            } else {
                // this.initDeskTransition();
                this.initDeskNoTransition();
                this.gameReady();
            }
        }
    }

    public uninstall(): void {
        TransitionManager.getInstance().doTransi(this, TransitionManager.FALL_RIGH_DOWN, true);
    }

    private initBg(): void {
        this._bg = new egret.Bitmap();
        this._bg.texture = RES.getRes("game_bg.png");
        this.addChild(this._bg);
    }

    private initDeskTransition(): void {
        this._desk.anchorOffsetX = this._desk.width;
        this._desk.anchorOffsetY = this._desk.height;
        this._desk.x = this._desk.width * .5;
        this._desk.y = LayerManager.stage.stageHeight + this._desk.height * .5;
        this._desk.rotation = -20;
        var self = this;

        TweenMax.to(this._desk, 3, {
            x: this._desk.width + 8,
            y: LayerManager.stage.stageHeight,
            rotation: 0, onComplete: function (): void {
                self.gameReady();
            }, onCompleteParams: [this._desk],
            ease: Quint.easeOut
        });
    }

    private initDeskNoTransition(): void {
        // this._desk.anchorOffsetX = this._desk.width;
        // this._desk.anchorOffsetY = this._desk.height;
        // this._desk.x = this._desk.width;
        // this._desk.y = LayerManager.stage.stageHeight;
    }

    private gameReady(): void {

        this._desk.deskDraw();
    }

    public destroy(): void {
        if (this._bg) {
            DisplayObjectUtil.removeForParent(this._bg);
            this._bg = null;
        }

        if (this._desk) {
            this._desk.destroy();
            DisplayObjectUtil.removeForParent(this._desk);
            this._desk = null;
        }
    }
}