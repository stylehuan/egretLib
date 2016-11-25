/**
 * Created by stylehuan on 2016/10/4.
 */
class ShrinkItemPanel extends egret.DisplayObjectContainer {
    public constructor() {
        super();
        this.setUp();
    }

    private defaultSkin: egret.Shape;
    private highlightSkin: egret.Shape;

    private setUp(): void {
        this.defaultSkin = new egret.Shape();
        this.defaultSkin = new egret.Shape();
        this.defaultSkin.graphics.beginFill(0x999999, 1);
        this.defaultSkin.graphics.drawCircle(0, 0, 5);
        this.defaultSkin.graphics.endFill();
        this.addChild(this.defaultSkin);

        this.highlightSkin = new egret.Shape();
        this.highlightSkin = new egret.Shape();
        this.highlightSkin.graphics.beginFill(0xff0000, 1);
        this.highlightSkin.graphics.drawCircle(0, 0, 5);
        this.highlightSkin.graphics.endFill();
        this.addChild(this.highlightSkin);

        this.setStatus(false);
    }

    public setStatus(isHighLight: boolean): void {
        this.highlightSkin.visible = isHighLight;
        this.defaultSkin.visible = !isHighLight;
    }

    public destroy(): void {
        if (this.defaultSkin) {
            DisplayObjectUtil.removeForParent(this.defaultSkin);
            this.defaultSkin = null;
        }
        if (this.highlightSkin) {
            DisplayObjectUtil.removeForParent(this.highlightSkin);
            this.highlightSkin = null;
        }

        DisplayObjectUtil.removeForParent(this);
    }
}