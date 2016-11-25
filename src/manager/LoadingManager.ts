/**
 * Created by seethinks@gmail.com on 2015/10/13.
 */
class LoadingManager {
    static mcLoading: egret.Bitmap;
    static loadingBg: egret.Sprite;
    static loadingContainer: egret.DisplayObjectContainer;

    static outTimer: egret.Timer;
    static _showIconTimeout: number;

    public static showLoading(): void {
        if (this.loadingContainer == null) {
            this.loadingContainer = new egret.DisplayObjectContainer();

            this.loadingBg = new egret.Sprite();
            this.loadingBg.graphics.beginFill(0x000000, 0);
            this.loadingBg.graphics.drawRect(0, 0, LayerManager.stage.stageWidth, LayerManager.stage.stageHeight);
            this.loadingBg.graphics.endFill();
            this.loadingContainer.addChild(this.loadingBg);

            this.mcLoading = new egret.Bitmap();
            this.mcLoading.texture = RES.getRes("common.loading");
            this.mcLoading.anchorOffsetX = this.mcLoading.width * .5;
            this.mcLoading.anchorOffsetY = this.mcLoading.height * .5;


            this.mcLoading.x = LayerManager.stage.stageWidth * .5;
            this.mcLoading.y = LayerManager.stage.stageHeight * .5;
            this.mcLoading.visible = false;
            this.loadingContainer.addChild(this.mcLoading);
            this._showIconTimeout = egret.setTimeout(this.showIcon, this, 1000);
            LayerManager.TopLayer.addChild(this.loadingContainer)
        } else {
            this.mcLoading.visible = false;
            this._showIconTimeout = egret.setTimeout(this.showIcon, this, 1000);
            this.loadingContainer.visible = true;
        }

        if (this.outTimer != null) {
            this.outTimer.stop();
            this.outTimer.removeEventListener(egret.TimerEvent.TIMER, this.outTimerHandler, this);
            this.outTimer = null;
            this.outTimer = new egret.Timer(8000);
            this.outTimer.addEventListener(egret.TimerEvent.TIMER, this.outTimerHandler, this);
            this.outTimer.start();
        } else {
            this.outTimer = new egret.Timer(8000);
            this.outTimer.addEventListener(egret.TimerEvent.TIMER, this.outTimerHandler, this);
            this.outTimer.start();
        }
    }

    private static outTimerHandler(e: egret.TimerEvent): void {
        if (this.outTimer != null) {
            this.outTimer.stop();
            this.outTimer.removeEventListener(egret.TimerEvent.TIMER, this.outTimerHandler, this);
            this.outTimer = null;
        }
        this.hideLoading();
    }

    private static showIcon(): void {
        if (this.mcLoading)  this.mcLoading.visible = true;
        egret.clearTimeout(this._showIconTimeout);
        TweenMax.to(this.mcLoading, .8, {
            rotation: 360, repeat: -1,
            ease: Linear.easeNone
        });
    }

    public static hideLoading(): void {
        egret.clearTimeout(this._showIconTimeout);
        if (LoadingManager.loadingContainer) LoadingManager.loadingContainer.visible = false;
        TweenMax.killTweensOf(this.mcLoading, true);
    }
}