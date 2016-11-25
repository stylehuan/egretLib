/**
 * Created by seethinks@gmail.com on 2015/11/4.
 */
class UITimeDown extends egret.DisplayObjectContainer {
    public mc_container:egret.DisplayObjectContainer;
    public ys_btn:SQ.Button;

    public constructor() {
        super();
        if (this.mc_container == null) {
            this.mc_container = new egret.DisplayObjectContainer();
            this.addChild(this.mc_container);
        }
        if (this.ys_btn == null) {
            this.ys_btn = new SQ.Button("game.UI_desk_delay_btn_1", "game.UI_desk_delay_btn_1", "game.UI_desk_delay_btn_1");
            this.ys_btn.x = 100;
            this.ys_btn.y = 60;
            this.addChild(this.ys_btn);
        }
    }

    public draw():void {
        var bg:egret.Bitmap = new egret.Bitmap();
        bg.texture = RES.getRes("game.time_down_bg");
        bg.x = -bg.width * .25;
        bg.y = -bg.height * .35;
        this.mc_container.addChild(bg)
    }
}