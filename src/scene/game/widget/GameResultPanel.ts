/**
 * Created by stylehuan on 2016/9/18.
 */
class GameResultPanel extends egret.DisplayObjectContainer {
    public constructor() {
        super();
        this.initial();
    }

    private totalPanel: GameResultTotalPanel;
    private resultItemPanel: GameResultSinglePanel;
    private _mask: egret.Sprite;

    public initial(): void {
        this._mask = new egret.Sprite();
        this._mask.touchEnabled = true;
        this._mask.graphics.beginFill(0x000000, .6);
        this._mask.graphics.drawRect(0, 0, LayerManager.stage.stageWidth, LayerManager.stage.stageHeight);
        this._mask.graphics.endFill();
        this.addChild(this._mask);

        if (!this.resultItemPanel) {
            this.resultItemPanel = new GameResultSinglePanel();
            this.addChild(this.resultItemPanel);
            this.resultItemPanel.redrawByBrowser();

            this.resultItemPanel.addEventListener("createTotalBount", this.onCreateTotalBount, this);
        }
    }

    private onCreateTotalBount(e: Event): void {
        this.resultItemPanel.removeEventListener("createTotalBount", this.onCreateTotalBount, this);

        if (this.resultItemPanel) {
            this.resultItemPanel.destroy();
            DisplayObjectUtil.removeForParent(this.resultItemPanel);
            this.resultItemPanel = null;
        }

        this.totalPanel = new GameResultTotalPanel();
        this.addChild(this.totalPanel);
        this.totalPanel.redrawByBrowser();
    }

    public destroy(): void {
        if (this.resultItemPanel) {
            this.resultItemPanel.destroy();
            DisplayObjectUtil.removeForParent(this.resultItemPanel);
            this.resultItemPanel = null;
        }
        if (this.totalPanel) {
            this.totalPanel.destroy();
            DisplayObjectUtil.removeForParent(this.totalPanel);
            this.totalPanel = null;
        }

        if (this._mask) {
            DisplayObjectUtil.removeForParent(this._mask);
            this._mask = null;
        }
    }
}