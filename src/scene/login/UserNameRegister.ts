/**
 * Created by stylehuan on 2016/11/18.
 */
class UserNameRegisterPanel extends egret.DisplayObjectContainer {
    public constructor() {
        super();
        this.init();
    }

    private _userName: SQ.TextBox;
    private _pw: SQ.TextBox;
    private _pw_repeat: SQ.TextBox;

    private _regBtn: SQ.Button;
    private _goLoginBtn: SQ.STTextField;
    private _quickRegBtn: SQ.STTextField;

    private init(): void {
        this._userName = new SQ.TextBox("请输入用户名", "login.text_bg", "login.text_bg", 450);
        this._pw = new SQ.TextBox("请输入密码", "login.text_bg", "login.text_bg", 450);
        this._pw_repeat = new SQ.TextBox("请再输入一次", "login.text_bg", "login.text_bg", 450);


        this._pw.y = this._userName.y + this._userName.height + 20;
        this._pw_repeat.y = this._pw.y + this._pw.height + 20;

        this.addChild(this._userName);
        this.addChild(this._pw);
        this.addChild(this._pw_repeat);

        this._regBtn = new SQ.Button("login.register_btn_1", "login.register_btn_2", "login.register_btn_2");
        this._regBtn.y = this.height + 20;
        this._regBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.submitRegHandler, this);

        this._goLoginBtn = new SQ.STTextField();
        this._goLoginBtn.text = "登录";
        this._goLoginBtn.size = 24;
        this._goLoginBtn.bold = true;
        this.addChild(this._goLoginBtn);
        this._goLoginBtn.x = this._regBtn.x + this._regBtn.width - this._goLoginBtn.width - 90;
        this._goLoginBtn.y = this._regBtn.y + 15 + this._regBtn.height;
        this._goLoginBtn.touchEnabled = true;
        this._goLoginBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onLoginerHandler, this);

        this._quickRegBtn = new SQ.STTextField();
        this._quickRegBtn.text = "一键注册";
        this._quickRegBtn.size = 24;
        this._quickRegBtn.x = this._regBtn.x + 65;
        this._quickRegBtn.y = this._goLoginBtn.y;
        this._quickRegBtn.touchEnabled = true;
        this._quickRegBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.submitQuickRegHandler, this);

        this.addChild(this._quickRegBtn);
        this.addChild(this._regBtn);
    }

    private onLoginerHandler(e: egret.TouchEvent): void {
        SystemEvent.dispatchEvents(new SystemEvent(SystemEvent.trigger_login));
    }

    private submitRegHandler(e: egret.TouchEvent): void {
        var userName: string = this._userName.text;
        var pwd: string = this._pw.text;
        var pwd_repeat: string = this._pw_repeat.text;

        if (userName == "") {
            GUIFactory.getInstance().showBubbleBox("请填写用户名");
            return;
        }
        if (pwd == "") {
            GUIFactory.getInstance().showBubbleBox("请填写密码");
            return;
        }
        if (pwd_repeat != pwd) {
            GUIFactory.getInstance().showBubbleBox("两次输入的密码不一致");
            return;
        }

        LoginManager.getInstance().sendRegByUserName(userName, pwd)
    }

    private submitQuickRegHandler(e: egret.TouchEvent):void{
         LoginManager.getInstance().sendQuickRegHandler();
    }
}