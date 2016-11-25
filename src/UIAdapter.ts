/**
 * Created by stylehuan on 2016/7/18.
 */
class UIAdapter {
    public static instance: UIAdapter = null;

    public static getInstance() {
        if (this.instance == null) {
            this.instance = new UIAdapter();
        }
        return this.instance;
    }

    public isPC: boolean = egret.Capabilities.os == "Windows PC";

    private classPre: string = "";

    public setup(): void {
        GlobalVar.IsBrowh = this.isPC;
        if (this.isPC) {
            if (location) {
                if (location.port) {
                    if (location.port == "3000") {
                        GlobalVar.isLocal = true;
                    } else if (location.port == "1505") {
                        GlobalVar.isTest = true;
                    }
                }
            } else {
                //TODO获取壳里面的参数，判断当前的运行环境
            }
        }
        if (GlobalVar.isLocal) {
            GlobalVar.isTest = true;
        }


        if (this.isPC) {
            PCUtil.getInstance().setup();
        } else {
            this.classPre = "m";
            if (egret.Capabilities.os == "Android") {
                egret.ExternalInterface.addCallback("liveToGamefromAndroid", function (msg) {

                });

                egret.ExternalInterface.addCallback("clickAndroidBack", function (msg) {

                });

                /**
                 * shell �е���̨
                 */
                egret.ExternalInterface.addCallback("shellPause", function (msg) {

                });
                /**
                 * shell �л���Ϸ
                 */
                egret.ExternalInterface.addCallback("shellResume", function (msg) {
                    //LayerManager.init(this);
                    //Main.Resume();
                    //console.log("--------------------shellResume")
                });
            } else if (egret.Capabilities.os == "iOS") {
                egret.ExternalInterface.addCallback("shellPause", function (msg) {
                    //Main.destroyAllThings();
                });
                egret.ExternalInterface.addCallback("shellResume", function (msg) {
                    LayerManager.init(this);
                    //Main.Resume();
                    //                if(SQGameServer.getInstance().isSocketConnected)
                    //                {
                    //                    LayerManager.init(this);
                    //                    Main.Resume();
                    //                }else
                    //                {
                    1//                    egret.ExternalInterface.call("doIOSocket", "");
                    //                }
                });
                egret.ExternalInterface.addCallback("shellSaveToken", function (msg) {
                    //todo:�洢IOS�Ļ�����,�Ա㷢��������Ϣ
                    //GlobalVar.shellSaveToken = msg;
                });

            }
        }
    }

    public loadingView(): any {
        var _class = egret.getDefinitionByName(this.classPre + "LoadingUI");
        return new _class();
    }

    public doLogin(): void {
        console.log("this.isPC:" + this.isPC);
        if (this.isPC) {
            console.log("GlobalVar.isLocal" + GlobalVar.isLocal);
            if (!GlobalVar.isLocal) {
                var ticket = PCUtil.getInstance().getTicket();
                console.log("ticket" + ticket);
                if (ticket) {
                    var paramObj = new Object();
                    paramObj["cookie"] = ticket;
                    paramObj["nocache"] = +(+new Date());
                    var _request = new HttpRequest();
                    var _requestConfig = new RequestConfig();
                    _requestConfig.url = URLDefine.mainApi + URLDefine.getSign;
                    _requestConfig.params = paramObj;
                    _requestConfig.success = function (data) {
                        if (data.ID) {
                            data.UserID = data.ID;
                        }

                        SystemEvent.dispatchEvents(new SystemEvent(SystemEvent.LOGIN_RESULT, data));
                    };
                    _requestConfig.error = function () {
                        PCUtil.getInstance().goLogin();
                    };
                    _request.openHttpRequest(_requestConfig);

                } else {
                    PCUtil.getInstance().goLogin();
                }
            } else {
                SceneManagerExt.goLoginScene();
            }
        } else {
            SceneManagerExt.goLoginScene();
        }
    }

    public getTicket(): string {
        var _s = this.getCookie("UC108_Ticket");
        if (_s == undefined || _s == "") {
            return "";
        }
        var _sl = _s.split('&');
        for (var i = 0; i < _sl.length; i++) {
            if (_sl[i].substring(0, 6) == 'ticket') {
                return _sl[i].split('=')[1];
            }
        }
        return "";
    }

    private getCookie(nm): string {
        var m = null;
        if (RegExp) {
            var re = new RegExp(";\\s*" + nm + "=([^;]*)", "i");
            m = re.exec(';' + document.cookie);
        }
        return (m ? decodeURIComponent(m[1]) : "");
    }
}