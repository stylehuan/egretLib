class LoginScene extends SceneBase {
    public constructor() {
        super();
    }

    public resGroup: string = "LoginScene";

    public setup(): void {
        console.log("login");
    }

    public initial(): void {
        this.createBg();
        this._container = new egret.DisplayObjectContainer();
        this.addChild(this._container);

        this.initLoginPanel();

        SystemEvent.addEventListener(SystemEvent.trigger_login, this.showLoginPanel, this);
        SystemEvent.addEventListener(SystemEvent.trigger_register, this.showRegisterPanel, this);

        this.redrawByBrowser();
    }

    public uninstall(): void {
        TransitionManager.getInstance().doTransi(this, TransitionManager.FALL_RIGH_DOWN, true);
    }

    private _container: egret.DisplayObjectContainer;
    private _loginContainer: egret.DisplayObjectContainer;
    private _registerContainer: egret.DisplayObjectContainer;

    private _userLoginTab: SQ.Button;
    private _phoneLoginTab: SQ.Button;

    private _userRegisterTab: SQ.Button;
    private _phoneRegisterTab: SQ.Button;

    private loginByUserName: UserNameLoginPanel;
    private loginByPhone: PhoneLoginPanel;
    private registerByUserName: UserNameRegisterPanel;
    private registerByPhone: PhoneRegisterPanel;

    private createBg() {
        var bg: egret.Bitmap = new egret.Bitmap();
        bg.texture = RES.getRes("loadingBg");
        this.addChild(bg);
    }

    private initLoginPanel(): void {
        this._loginContainer = new egret.DisplayObjectContainer();
        this._container.addChild(this._loginContainer);

        this._userLoginTab = new SQ.Button("login.user_name_l_btn_1", "login.user_name_l_btn_1", "login.user_name_l_btn_2", "login.user_name_l_btn_2");
        this._loginContainer.addChild(this._userLoginTab);
        this._userLoginTab.data["type"] = 0;
        this._userLoginTab.addEventListener(egret.TouchEvent.TOUCH_TAP, this.triggerLoginTabHandler, this);
        this._loginContainer.addChild(this._userLoginTab);

        this._phoneLoginTab = new SQ.Button("login.phone_l_btn_1", "login.phone_l_btn_1", "login.phone_l_btn_2", "login.phone_l_btn_2");
        this._loginContainer.addChild(this._phoneLoginTab);
        this._userLoginTab.data["type"] = 1;
        this._phoneLoginTab.x = this._userLoginTab.x + this._userLoginTab.width + 90;
        this._phoneLoginTab.addEventListener(egret.TouchEvent.TOUCH_TAP, this.triggerLoginTabHandler, this);
        this._loginContainer.addChild(this._phoneLoginTab);

        this.loginByUserName = new UserNameLoginPanel();
        this._loginContainer.addChild(this.loginByUserName);

        this.loginByPhone = new PhoneLoginPanel();
        this._loginContainer.addChild(this.loginByPhone);


        this.loginByPhone.visible = false;
        this._userLoginTab.setDisable(false);


        this.loginByUserName.y = this._userLoginTab.y + this._userLoginTab.height + 10;
        this.loginByPhone.y = this._userLoginTab.y + this._userLoginTab.height + 10;
    }

    private initRegisterPanel(): void {
        this._registerContainer = new egret.DisplayObjectContainer();
        this._container.addChild(this._registerContainer);

        this._userRegisterTab = new SQ.Button("login.user_name_r_btn_1", "login.user_name_r_btn_1", "login.user_name_r_btn_2", "login.user_name_r_btn_2");
        this._registerContainer.addChild(this._userRegisterTab);
        this._userRegisterTab.data["type"] = 0;
        this._userRegisterTab.addEventListener(egret.TouchEvent.TOUCH_TAP, this.triggerRegTabHandler, this);
        this._registerContainer.addChild(this._userRegisterTab);

        this._phoneRegisterTab = new SQ.Button("login.phone_r_btn_1", "login.phone_r_btn_1", "login.phone_r_btn_2", "login.phone_r_btn_2");
        this._registerContainer.addChild(this._phoneRegisterTab);
        this._phoneRegisterTab.data["type"] = 1;
        this._phoneRegisterTab.x = this._userLoginTab.x + this._userLoginTab.width + 90;
        this._phoneRegisterTab.addEventListener(egret.TouchEvent.TOUCH_TAP, this.triggerRegTabHandler, this);
        this._registerContainer.addChild(this._phoneRegisterTab);

        this.registerByUserName = new UserNameRegisterPanel();
        this._registerContainer.addChild(this.registerByUserName);

        this.registerByPhone = new PhoneRegisterPanel();
        this._registerContainer.addChild(this.registerByPhone);

        this.registerByPhone.visible = false;
        this._userRegisterTab.setDisable(false);

        this.registerByUserName.y = this._userLoginTab.y + this._userLoginTab.height + 10;
        this.registerByPhone.y = this._userLoginTab.y + this._userLoginTab.height + 10;

    }

    private triggerLoginTabHandler(e: egret.TouchEvent): void {
        var target: SQ.Button = <SQ.Button>(e.currentTarget);
        var _type: number = target.data["type"];

        if (!_type) {
            this.loginByPhone.visible = true;
            this._phoneLoginTab.setDisable(false);

            this.loginByUserName.visible = false;
            this._userLoginTab.setDisable(true);

        } else {
            this.loginByPhone.visible = false;
            this.loginByUserName.visible = true;
            this._phoneLoginTab.setDisable(true);
            this._userLoginTab.setDisable(false);
        }
    }

    private triggerRegTabHandler(e: egret.TouchEvent): void {
        var target: SQ.Button = <SQ.Button>(e.currentTarget);
        var _type: number = target.data["type"];

        if (!_type) {
            this.registerByPhone.visible = false;
            this._phoneRegisterTab.setDisable(true);
            this.registerByUserName.visible = true;
            this._userRegisterTab.setDisable(false);
        } else {
            this.registerByPhone.visible = true;
            this._phoneRegisterTab.setDisable(false);
            this.registerByUserName.visible = false;
            this._userRegisterTab.setDisable(true);
        }
    }

    private showLoginPanel(): void {
        if (this._loginContainer) {
            this._loginContainer.visible = true;
        }

        if (this._registerContainer) {
            this._registerContainer.visible = false;
        }
    }

    private showRegisterPanel(): void {
        if (this._registerContainer) {
            this._registerContainer.visible = true;
        } else {
            this.initRegisterPanel();
        }

        if (this._loginContainer) {
            this._loginContainer.visible = false;
        }
    }

    private redrawByBrowser(): void {
        this._container.x = LayerManager.stage.stageWidth * .5 - this._container.width * .5;
        this._container.y = LayerManager.stage.stageHeight * .5 - this._container.height * .5;
    }

    public destroy(): void {
        SystemEvent.removeEventListener(SystemEvent.trigger_login, this.showLoginPanel, this);
        SystemEvent.removeEventListener(SystemEvent.trigger_register, this.showRegisterPanel, this);
        if (this.registerByPhone) {
            DisplayObjectUtil.removeForParent(this.registerByPhone);
            this.registerByPhone = null;
        }

        if (this.registerByUserName) {
            DisplayObjectUtil.removeForParent(this.registerByUserName);
            this.registerByPhone = null;
        }

        if (this.loginByPhone) {
            DisplayObjectUtil.removeForParent(this.loginByPhone);
            this.loginByPhone = null;
        }

        if (this.loginByUserName) {
            DisplayObjectUtil.removeForParent(this.loginByUserName);
            this.loginByUserName = null;
        }

        if (this._phoneRegisterTab) {
            DisplayObjectUtil.removeForParent(this._phoneRegisterTab);
            this._phoneRegisterTab = null;
        }

        if (this._userRegisterTab) {
            DisplayObjectUtil.removeForParent(this._userRegisterTab);
            this._userRegisterTab = null;
        }

        if (this._phoneLoginTab) {
            DisplayObjectUtil.removeForParent(this._phoneLoginTab);
            this._phoneLoginTab = null;
        }

        if (this._userLoginTab) {
            DisplayObjectUtil.removeForParent(this._userLoginTab);
            this._userLoginTab = null;
        }

        if (this._registerContainer) {
            DisplayObjectUtil.removeForParent(this._registerContainer);
            this._registerContainer = null;
        }

        if (this._loginContainer) {
            DisplayObjectUtil.removeForParent(this._loginContainer);
            this._loginContainer = null;
        }

        if (this._container) {
            DisplayObjectUtil.removeForParent(this._container);
            this._container = null;
        }
    }
}