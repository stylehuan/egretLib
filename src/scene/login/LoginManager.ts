/**
 * Created by stylehuan on 2016/11/20.
 */
class LoginManager {
    public constructor() {

    }

    public static instance: LoginManager = null;

    public static getInstance() {
        if (this.instance == null) {
            this.instance = new LoginManager();
        }
        return this.instance;
    }

    public sendLoginByUserName(userName: string, pw: string): void {
        var self = this;
        var paramObj = new Object();
        paramObj["userName"] = encodeURIComponent(userName);
        paramObj["pwd"] = pw;

        var _request = new HttpRequest();
        var _requestConfig = new RequestConfig();
        _requestConfig.url = URLDefine.mainApi + URLDefine.LogInByWeb;
        _requestConfig.params = paramObj;
        _requestConfig.success = function (data) {
            self.successHandler(data);
        };
        _requestConfig.error = function (msg) {
            self.errorHandler(msg);
        };
        _request.openHttpRequest(_requestConfig);
    }

    public sendLoginByPhone(phone: string, pwd: string): void {
        var self = this;

        var paramObj = new Object;
        paramObj["mobile"] = encodeURIComponent(phone);
        paramObj["pwd"] = pwd;

        var _request = new HttpRequest();
        var _requestConfig = new RequestConfig();
        _requestConfig.url = URLDefine.mainApi + URLDefine.LogInByPhoneNo;
        _requestConfig.params = paramObj;
        _requestConfig.success = function (data) {
            self.successHandler(data);
        };
        _requestConfig.error = function (msg) {
            self.errorHandler(msg);
        };
        _request.openHttpRequest(_requestConfig);

    }

    public getCodeHandler(mobile: string): void {
        var paramObj = new Object;
        paramObj["mobile"] = mobile;

        var self = this;

        var _request = new HttpRequest();
        var _requestConfig = new RequestConfig();
        _requestConfig.url = URLDefine.mainApi + URLDefine.SendRegSms;
        _requestConfig.params = paramObj;
        _requestConfig.success = function (data) {
            self.sendSmsResultHandler();
        };
        _requestConfig.error = function (msg) {
            self.errorHandler(msg);
        };
        _request.openHttpRequest(_requestConfig);
    }

    public sendRegByUserName(userName: string, pwd: string): void {
        var paramObj = new Object;
        paramObj["userName"] = encodeURIComponent(userName);
        paramObj["pwd"] = pwd;

        var self = this;

        var _request = new HttpRequest();
        var _requestConfig = new RequestConfig();
        _requestConfig.url = URLDefine.mainApi + URLDefine.RegisterByUserName;
        _requestConfig.params = paramObj;
        _requestConfig.success = function (data) {
            PopUpManager.alert("注册成功", "您的用户名称是:" + data.UserName + ",密码是:" + data.Pwd + ",请妥善保管");
            self.successHandler(data);
        };
        _requestConfig.error = function (msg) {
            self.errorHandler(msg);
        };
        _request.openHttpRequest(_requestConfig);
    }

    public sendRegByPhone(phone: string, pwd: string, yzmCode: string): void {
        var paramObj = new Object;
        paramObj["mobile"] = phone;
        paramObj["pwd"] = pwd;
        paramObj["smsVerifyCode"] = yzmCode;

        var self = this;

        var _request = new HttpRequest();
        var _requestConfig = new RequestConfig();
        _requestConfig.url = URLDefine.mainApi + URLDefine.RegisterByPhoneNo;
        _requestConfig.params = paramObj;
        _requestConfig.success = function (data) {
            PopUpManager.alert("注册成功", "您的用户名称是:" + data.UserName + ",密码是:" + data.Pwd + ",请妥善保管");
            self.successHandler(data);
        };
        _requestConfig.error = function (msg) {
            self.errorHandler(msg);
        };
        _request.openHttpRequest(_requestConfig);
    }

    public sendQuickRegHandler():void{
        var paramObj = new Object;

        var self = this;

        paramObj["wifiID"] = "00-00-00-00-00-00";
        paramObj["imeiID"] = "222";
        paramObj["imsiID"] = "222";
        paramObj["simSerialNo"] = "222";
        paramObj["systemID"] = "222";

        var _request = new HttpRequest();
        var _requestConfig = new RequestConfig();
        _requestConfig.url = URLDefine.mainApi + URLDefine.ClientRegister;
        _requestConfig.params = paramObj;
        _requestConfig.success = function (data) {
            PopUpManager.alert("注册成功", "您的用户名称是:" + data.UserName + ",密码是:" + data.Pwd + ",请妥善保管");
            self.successHandler(data);
        };
        _requestConfig.error = function (msg) {
            self.errorHandler(msg);
        };
        _request.openHttpRequest(_requestConfig);
    }

    private sendSmsResultHandler(): void {
        GUIFactory.getInstance().showBubbleBox("获取成功,请查收短信验证码");
    }

    private successHandler(data): void {
        SystemEvent.dispatchEvents(new SystemEvent(SystemEvent.LOGIN_RESULT, data));
    }

    private errorHandler(msg): void {
        PopUpManager.alert("系统消息", GlobalVar.sss + msg);
    }
}