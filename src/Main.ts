//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
class Main extends eui.UILayer {
    /**
     * 加载进度界面
     * loading process interface
     */
    private loadingView: LoadingUI;

    protected createChildren(): void {
        super.createChildren();
        UIAdapter.getInstance().setup();
        mouse.enable(this.stage);
        //this.stage.dirtyRegionPolicy = egret.DirtyRegionPolicy.OFF;
        var assetAdapter = new AssetAdapter();
        this.stage.registerImplementation("eui.IAssetAdapter", assetAdapter);
        this.stage.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());

        //this.stage.scaleMode =     egret.StageScaleMode.NO_SCALE = "noScale";

        //初始化Resource资源加载库
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/default.thm.json", "resource/");
        RES.loadConfig("resource/default.res.json", "resource/");
        RES.loadConfig("resource/resource.json?t=" + (+new Date()), "resource/");
        LayerManager.init(this);
        SystemEvent.addEventListener(SystemEvent.SHOW_MAIN, this.showMain, this);
    }

    /**
     * 配置文件加载完成,开始预加载皮肤主题资源和preload资源组。
     * Loading of configuration file is complete, start to pre-load the theme configuration file and the preload resource group
     */
    private onConfigComplete(event: RES.ResourceEvent): void {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        // load skin theme configuration file, you can manually modify the file. And replace the default skin.
        //加载皮肤主题配置文件,可以手动修改这个文件。替换默认皮肤。
        var theme = new eui.Theme("resource/default.thm.json", this.stage);
        theme.addEventListener(eui.UIEvent.COMPLETE, this.onThemeLoadComplete, this);
    }

    private isThemeLoadEnd: boolean = false;

    /**
     * 主题文件加载完成,开始预加载
     * Loading of theme configuration file is complete, start to pre-load the
     */
    private onThemeLoadComplete(): void {
        this.isThemeLoadEnd = true;
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
        RES.loadGroup("loading");
    }

    private isResourceLoadEnd: boolean = false;

    /**
     * preload资源组加载完成
     * preload resource group is loaded
     */
    private onResourceLoadComplete(event: RES.ResourceEvent): void {
        if (event.groupName == "loading") {
            GlobalVar.ConfigData = RES.getRes("global");
            console.log("GlobalVar.ConfigDataIsDebug:" + GlobalVar.ConfigData.isDebug);
            GlobalVar.isDebug = GlobalVar.ConfigData.isDebug;
            if (GlobalVar.ConfigData.isDebug) {
                URLDefine.dzlsLoginMain = GlobalVar.ConfigData.dzlsLoginMainTest;
                URLDefine.doMain = GlobalVar.ConfigData.doMainTest;
                URLDefine.mainDoMain = GlobalVar.ConfigData.mainDoMainTest;
                URLDefine.ServerIp = GlobalVar.ConfigData.ServerIpTest;
                URLDefine.ServerPort = GlobalVar.ConfigData.ServerPortTest;
            } else {
                URLDefine.dzlsLoginMain = GlobalVar.ConfigData.dzlsLoginMain;
                URLDefine.doMain = GlobalVar.ConfigData.doMain;
                URLDefine.mainDoMain = GlobalVar.ConfigData.mainDoMain;
                URLDefine.ServerIp = GlobalVar.ConfigData.ServerIp;
                URLDefine.ServerPort = GlobalVar.ConfigData.ServerPort;
            }
            URLDefine.doMainApi = URLDefine.doMain + "/api";
            URLDefine.mainApi = URLDefine.mainDoMain + "/api";
            if (!GlobalVar.ConfigData.isDebug) {
                URLDefine.doMainApi = URLDefine.doMain;
                URLDefine.mainApi = URLDefine.mainDoMain;
            }

            CardData.setUp();
            //this.loadingView = UIAdapter.getInstance().loadingView();
            this.loadingView = new LoadingUI()

            this.stage.addChild(this.loadingView);
            RES.loadGroup("mainScene");
        } else if (event.groupName == "mainScene") {
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
        }
    }

    private showMain(e: Event): void {
        var self = this;
        SystemEvent.removeEventListener(SystemEvent.SHOW_MAIN, this.showMain, this);
        self.createScene();
        TweenMax.to(this.loadingView, 1, {
            alpha: 0,
            onComplete: function (): void {
                self.stage.removeChild(self.loadingView);
            }, onCompleteParams: [this.loadingView], ease: Cubic.easeInOut
        });
    }

    private createScene() {
        SoundManager.getInstance().playBg("Snd_bg");

        MainLoopManager.setup();
        SystemCenter.playSystem = new PlayerSystem();
        SystemCenter.playSystem.setup();
        FanData.setUp();
        SceneManager.getInstance().setUp();
        SystemMsg.setup();

        this.doLogin();
    }


    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    private onItemLoadError(event: RES.ResourceEvent): void {
        console.warn("Url:" + event.resItem.url + " has failed to load");
    }

    /**
     * 资源组加载出错
     * Resource group loading failed
     */
    private onResourceLoadError(event: RES.ResourceEvent): void {
        //TODO
        console.warn("Group:" + event.groupName + " has failed to load");
        //忽略加载失败的项目
        //ignore loading failed projects
        this.onResourceLoadComplete(event);
    }

    /**
     * preload资源组加载进度
     * loading process of preload resource
     */
    private onResourceProgress(event: RES.ResourceEvent): void {
        if (event.groupName != "loading") {
            this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
        }
    }

    private doLogin(): void {
        SystemEvent.addEventListener(SystemEvent.LOGIN_RESULT, this.loginResultHandler, this);
        var self = this;

        if (UIAdapter.getInstance().isPC) {
            var ticket = UIAdapter.getInstance().getTicket();
            if (ticket) {
                var paramObj = new Object();
                paramObj["cookie"] = ticket;
                var _request = new HttpRequest();
                var _requestConfig = new RequestConfig();
                _requestConfig.url = URLDefine.doMainApi + URLDefine.getSign;
                _requestConfig.params = paramObj;
                _requestConfig.success = function (data) {
                    self.validSign(data.Sign);
                };
                _requestConfig.error = function () {
                    UIAdapter.getInstance().doLogin();
                };

                _request.openHttpRequest(_requestConfig);
            } else {
                UIAdapter.getInstance().doLogin();
            }
        } else {
            var sign: string = StorageManager.getLocalStorage(StorageManager.USER_SIGN);
            console.log("获取我的本地票据:" + sign);
            console.log("URLDefine.doMain:" + URLDefine.doMain);
            if (sign) {
                self.validSign(sign);
            } else {
                UIAdapter.getInstance().doLogin();
            }
        }
    }

    private validSign(sign): void {
        var self = this;
        if (sign) {
            SystemCenter.playSystem.selfPlayerInfo.sign = sign;

            var paramObj = new Object();
            paramObj["sign"] = sign;
            var _request = new HttpRequest();
            var _requestConfig = new RequestConfig();
            _requestConfig.url = URLDefine.doMainApi + URLDefine.ValidSign;
            _requestConfig.params = paramObj;
            _requestConfig.success = function (data) {
                SystemCenter.playSystem.selfPlayerInfo.userID = data.UserID;
                SystemCenter.playSystem.selfPlayerInfo.playerName = data.NickName;

                self.doConnectGameServer();
            };
            _requestConfig.error = function () {
                UIAdapter.getInstance().doLogin();
            };

            _request.openHttpRequest(_requestConfig);
        }
    }

    private loginResultHandler(e: SystemEvent): void {
        SystemEvent.removeEventListener(SystemEvent.LOGIN_RESULT, this.loginResultHandler, this);
        SystemCenter.playSystem.selfPlayerInfo.sign = e.data.Sign;
        SystemCenter.playSystem.selfPlayerInfo.userID = e.data.UserID;
        SystemCenter.playSystem.selfPlayerInfo.playerName = e.data.NickName;

        StorageManager.addLocalStorage(StorageManager.USER_SIGN, e.data.Sign);

        SceneManager.getInstance().popScene();

        this.doConnectGameServer();
    }

    private doConnectGameServer(): void {
        WGManager.getInstance().setUp();
        GameManager.getInstance().setUp();
    }
}
