/**
 * Created by stylehuan on 2016/9/19.
 */
class GameResultTransition {
    //特殊番种提示
    public static specialFan: Array<number> = [44, 45, 46, 47];

    /*
     *显示闪电
     * */
    public static showHeLight(position: egret.Point, callBack: Function): void {
        var func = callBack || function () {
            };
        var helight: egret.Sprite = EcffectFactory.getInstance().createHeLight(func);
        LayerManager.TopLayer.addChild(helight);
        helight.x = position.x || 0;
        helight.y = position.y || 0;
    }

    public static showHuCardMove(position: egret.Point, callBack: Function): void {
        var func = callBack || function () {
            };
        var helight: egret.Sprite = EcffectFactory.getInstance().createHeCardMove(func);
        LayerManager.TopLayer.addChild(helight);
        helight.x = position.x || 0;
        helight.y = position.y || 0;
    }
}
