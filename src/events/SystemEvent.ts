class SystemEvent extends egret.Event {
    public static  CONNECTED_SERVER:string = "CONNECTED_SERVER";
    public static LOGIN_RESULT:string = "login_result";
    public static GETSIGN:string = "GETSIGN";
    public static SHOW_MAIN:string = "SHOW_MAIN";
    public static DESK_Animation_OVER:string = "DESK_Animation_OVER";
    public static UPDATA_PLAYERDATA:string = "UPDATA_PLAYERDATA";
    public static INPUTPWSUCCESS:string = "inputPwSucceed";

    public static ChangeView:string = "ChangeView";

    public static gameResultReady:string="game_result_ready";
    public static GET_PLAYERDATA:string="get_player_data";

    public static closeAlertNotify:string="closeAlertNotify"

    public static ONKEYREG_RESULT: string = "onkey_result";
    public static CANCEL: string = "cancel";

    public static trigger_register:string = "trigger_register";
    public static trigger_login:string = "trigger_login";
    public static getYzmSuccess:string = "GET_YZM_SUCCESS";

    public static _dispatch:egret.EventDispatcher = new egret.EventDispatcher();

    /**
     * 使用 EventDispatcher 对象注册事件侦听器对象，以使侦听器能够接收事件通知。可以为特定类型的事件、阶段和优先级在显示列表中的所有节点上注册事件侦听器。
     * @param type
     * @param listener
     * @param useCapture
     * @param priority
     * @param useWeakReference
     */
    public static addEventListener(type:string, listener:Function, target:any, useCapture:boolean = false, priority:number = 0):void {
        this._dispatch.addEventListener(type, listener, target, useCapture, priority);
    }

    /**
     * 从 EventDispatcher 对象中删除侦听器。如果没有向 EventDispatcher 对象注册任何匹配的侦听器，则对此方法的调用没有任何效果。
     * @param type
     * @param listener
     * @param useCapture
     */
    public static removeEventListener(type:string, listener:Function, target:any, useCapture:boolean = false):void {
        this._dispatch.removeEventListener(type, listener, target, useCapture);
    }

    /**
     * 将事件分派到事件流中。事件目标是对其调用 dispatchEvent() 方法的 EventDispatcher 对象。
     * @param event
     */
    public static dispatchEvents(event:egret.Event) {
        this._dispatch.dispatchEvent(event); // .target,event.type,event.bubbles,this.data
    }

    public data:any;

    public constructor(type:string, _data:any = null, bubbles:boolean = false, cancelable:boolean = false) {
        super(type, bubbles, cancelable);
        this.data = _data;
    }
}