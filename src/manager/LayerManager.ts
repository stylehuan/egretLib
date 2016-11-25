/**
 * Created by seethinks@gmail.com on 2015/3/12.
 */
class LayerManager {
    static BgLayer: egret.DisplayObjectContainer;
    static SceneLayer: egret.DisplayObjectContainer;
    static TopLayer: egret.DisplayObjectContainer;
    static AlertLayer: egret.DisplayObjectContainer;
    static GUILayer: egret.DisplayObjectContainer;
    static AppLayer: egret.DisplayObjectContainer;
    static SysLayer: egret.DisplayObjectContainer;
    static GameLayer: egret.DisplayObjectContainer;
    static stage: egret.Stage;

    /**
     * 根
     */
    private static _root: egret.DisplayObjectContainer;

    public static init($container: egret.DisplayObjectContainer): void {

        LayerManager._root = $container;
        LayerManager.stage = egret.MainContext.instance.stage;

        /**
         * 适应屏幕的底色填充
         * @type {egret.Shape}
         */
        //            var shp:egret.Shape = new egret.Shape;
        //            shp.graphics.lineStyle( 0, 0x00ffff );
        //            shp.graphics.beginFill( 0x336699 );
        //            shp.graphics.drawRoundRect( 0, 0, this.stage.stageWidth, this.stage.stageHeight, 3, 3 );
        //            shp.graphics.endFill();
        //            LayerManager._root.addChild( shp );

        if (!LayerManager.BgLayer) {
            LayerManager.BgLayer = new egret.DisplayObjectContainer();
            LayerManager.BgLayer.touchEnabled = false;
            LayerManager.BgLayer.touchChildren = false;
            LayerManager._root.addChild(LayerManager.BgLayer);
        }

        if (!LayerManager.SceneLayer) {
            LayerManager.SceneLayer = new egret.DisplayObjectContainer();
            LayerManager._root.addChild(LayerManager.SceneLayer);
        }


        if (!LayerManager.GameLayer) {
            LayerManager.GameLayer = new egret.DisplayObjectContainer();
            //                LayerManager.GameLayer.touchEnabled = false;
            //                LayerManager.GameLayer.touchChildren = false;
            LayerManager._root.addChild(LayerManager.GameLayer);
        }


        if (!LayerManager.SysLayer) {
            LayerManager.SysLayer = new egret.DisplayObjectContainer();
            // LayerManager.SysLayer.touchEnabled = false;
            //LayerManager.SysLayer.touchChildren = false;
            LayerManager._root.addChild(LayerManager.SysLayer);
        }
        if (!LayerManager.GUILayer) {
            LayerManager.GUILayer = new egret.DisplayObjectContainer();
            LayerManager._root.addChild(LayerManager.GUILayer);
        }
        if (!LayerManager.AppLayer) {
            LayerManager.AppLayer = new egret.DisplayObjectContainer();
            LayerManager.AppLayer.touchEnabled = true;
            LayerManager.AppLayer.touchChildren = true;
            LayerManager._root.addChild(LayerManager.AppLayer);
        }
        if (!LayerManager.AlertLayer) {
            LayerManager.AlertLayer = new egret.DisplayObjectContainer();
            LayerManager.AlertLayer.touchEnabled = true;
            LayerManager.AlertLayer.touchChildren = true;
            LayerManager._root.addChild(LayerManager.AlertLayer)
        }

        if (!LayerManager.TopLayer) {

            LayerManager.TopLayer = new egret.DisplayObjectContainer();
            LayerManager.TopLayer.touchEnabled = true;
            LayerManager.TopLayer.touchChildren = true;
            LayerManager._root.addChild(LayerManager.TopLayer)
        }


    }

    public static createBg():void
    {
        var bg: egret.Bitmap = new egret.Bitmap();
        bg.texture = RES.getRes("scene_bg");
        bg.touchEnabled = true;
        bg.width = LayerManager.stage.stageWidth;
        bg.height = LayerManager.stage.stageHeight;
        LayerManager.BgLayer.addChild(bg)
        bg.alpha=1;
        //var tw = egret.Tween.get(bg);
        //tw.to({alpha:1},200);
    }

    public static removeGameLevel():void
    {
        if(this.GameLayer)
        {
            this.GameLayer.removeChildren();
        }
    }

    public static destroy():void
    {
        if(this.BgLayer)
        {
            this.BgLayer.removeChildren();
        }
        if(this.SceneLayer)
        {
            this.SceneLayer.removeChildren();
        }
        if(this.TopLayer)
        {
            this.TopLayer.removeChildren();
        }
        if(this.AlertLayer)
        {
            this.AlertLayer.removeChildren();
        }
        if(this.GUILayer)
        {
            this.GUILayer.removeChildren();
        }
        if(this.AppLayer)
        {
            this.AppLayer.removeChildren();
        }
        if(this.SysLayer)
        {
            this.SysLayer.removeChildren();
        }
        if(this.GameLayer)
        {
            this.GameLayer.removeChildren();
        }
    }
}
