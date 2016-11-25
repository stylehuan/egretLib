/**
 * Created by seethinks@gmail.com on 2015/11/10.
 */
class CardMingTipContainer extends egret.DisplayObjectContainer
{
    public type:number = 0;
    public cards:Array<any>;
    public constructor() {
        super();
        this.touchEnabled = true;
    }
}