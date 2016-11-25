/**
 * Created by stylehuan on 2016/11/18.
 */
class UserNameLoginPanel extends egret.DisplayObjectContainer {
    public constructor() {
        super();
        this.init();
    }

    //用户名登录
    private _login_userName: SQ.TextBox;
    private _login_userName_pw: SQ.TextBox;
    private _loginBtn: SQ.Button;

    private _goRegBtn: SQ.STTextField;

    private init(): void {
        this._login_userName = new SQ.TextBox("请输入用户名", "login.text_bg", "login.text_bg", 450);
        this._login_userName_pw = new SQ.TextBox("请输入用户名", "login.text_bg", "login.text_bg", 450);
        this._login_userName_pw.y = this._login_userName.y + this._login_userName.height +
            20;
        this.addChild(this._login_userName);
        this.addChild(this._login_userName_pw);

        this._loginBtn = new SQ.Button("login_btn_1", "login_btn_2", "login_btn_2");
        this._loginBtn.y = this.height + 50;
        this._loginBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.submitLoginHandler, this);

        this._goRegBtn = new SQ.STTextField();
        this._goRegBtn.text = "注册";
        this._goRegBtn.size = 24;
        this._goRegBtn.bold = true;
        this.addChild(this._goRegBtn);
        this._goRegBtn.x = this._loginBtn.x + this._loginBtn.width - this._goRegBtn.width - 5;
        this._goRegBtn.y = this._loginBtn.y - 15 - this._goRegBtn.height;
        this._goRegBtn.touchEnabled = true;
        this._goRegBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onRegisterHandler, this);

        this.addChild(this._loginBtn);
    }

    private onRegisterHandler(e: egret.TouchEvent): void {
        SystemEvent.dispatchEvents(new SystemEvent(SystemEvent.trigger_register));
    }

    private submitLoginHandler() {
        var userName: string = this._login_userName.text;
        var pwd: string = this._login_userName_pw.text;
        LoginManager.getInstance().sendLoginByUserName(userName, pwd);
    }
}