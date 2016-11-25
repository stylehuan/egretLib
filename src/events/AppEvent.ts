/**
 * Created by stylehuan on 2016/7/28.
 */
class AppEvent extends egret.Event {
    public static  APP_CLOSE:string = "APP_CLOSE";
    public static _dispatch:egret.EventDispatcher = new egret.EventDispatcher();

    /**
     * ʹ�� EventDispatcher ����ע���¼�������������ʹ�������ܹ������¼�֪ͨ������Ϊ�ض����͵��¼����׶κ����ȼ�����ʾ�б��е����нڵ���ע���¼���������
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
     * �� EventDispatcher ������ɾ�������������û���� EventDispatcher ����ע���κ�ƥ�������������Դ˷����ĵ���û���κ�Ч����
     * @param type
     * @param listener
     * @param useCapture
     */
    public static removeEventListener(type:string, listener:Function, target:any, useCapture:boolean = false):void {
        this._dispatch.removeEventListener(type, listener, target, useCapture);
    }

    /**
     * ���¼����ɵ��¼����С��¼�Ŀ���Ƕ������ dispatchEvent() ������ EventDispatcher ����
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