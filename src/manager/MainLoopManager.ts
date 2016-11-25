/**
 * Created by seethinks@gmail.com on 2016/8/18.
 */
/**
 * 控制主循环，主要解决大量enterFrame同时运行可能引起的性能问题
 */
class MainLoopManager {
    private static _callbackList:{};
    private static setLoopIndex:number=0;
    public static setup():void
    {
        LayerManager.stage.addEventListener(egret.Event.ENTER_FRAME,this.mainLoop,this)
        if(!this._callbackList)
        {
            this._callbackList = {};
        }
    }
    public static addCallBack(fuc:Function,thisObject:any):number
    {
        var data:Object = {listener: fuc, thisObject: thisObject};
        this.setLoopIndex ++;
        this._callbackList[this.setLoopIndex]= data;
        return this.setLoopIndex;
    }
    public static removeCallBack(index:number):void
    {
        //console.log("index index index index index:"+index+"  this._callbackList[index]:"+this._callbackList[index])
        if (this._callbackList[index]) {
            delete this._callbackList[index];
        }
    }

    public static mainLoop(e:egret.Event):void
    {
        for(var str in this._callbackList)
        {
            var data:Object =this._callbackList[str];
            data["listener"].apply(data["thisObject"]);
        }
    }
}