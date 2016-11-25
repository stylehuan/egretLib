/**
 * Created by stylehuan on 2016/8/18.
 */
class LoginScene1 extends SceneBase {
    public constructor() {
        super();
    }

    public resGroup:string = "friendScene";

    private _container:egret.DisplayObjectContainer;
    private userBox:SQ.TextBox;
    private pwBox:SQ.TextBox;
    private btn:egret.Sprite;

    public initial():void {
        this._container = new egret.DisplayObjectContainer();
        this.addChild(this._container);
        this._container.x = 100;
        this._container.y = 100;

        this.userBox = new SQ.TextBox("seethinks001", "");
        this._container.addChild(this.userBox);

        this.pwBox = new SQ.TextBox("123123123d", "");
        this._container.addChild(this.pwBox);

        this.pwBox.y = this._container.height + 20;

        this.btn = new egret.Sprite();
        this.btn.graphics.beginFill(0xffffff, 1)
        this.btn.graphics.drawRect(0, 0, 100, 100)
        this.btn.graphics.endFill();
        this.btn.y = this._container.height + 20;

        this._container.addChild(this.btn);
        this.btn.touchEnabled = true;
        this.btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.loginHandler, this);
    }

    private loginHandler(e:egret.TouchEvent):void {
        var paramObj = new Object();
        paramObj["userName"] = encodeURIComponent(this.userBox.text);
        paramObj["pwd"] = this.pwBox.text;
        var _request = new HttpRequest();
        var _requestConfig = new RequestConfig();
        _requestConfig.url = URLDefine.doMainApi + URLDefine.LogInByWeb;
        _requestConfig.params = paramObj;
        _requestConfig.success = function (data) {
            SystemEvent.dispatchEvents(new SystemEvent(SystemEvent.LOGIN_RESULT, data));
        };
        _requestConfig.error = function () {

        };
        _request.openHttpRequest(_requestConfig);
    }

    public setup():void {
        console.log("login");
    }

    public uninstall():void {
        TransitionManager.getInstance().doTransi(this, TransitionManager.FALL_RIGH_DOWN, true);
    }

    public destroy():void {

    }
}