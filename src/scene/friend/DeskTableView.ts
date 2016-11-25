/**
 * Created by stylehuan on 2016/7/29.
 */
class DeskTableView extends egret.Sprite {
    public constructor() {
        super();

        this.desk_bg = new egret.Bitmap();
        this.desk_bg.texture = RES.getRes("friend.desk_bg");
        this.addChild(this.desk_bg);

        this.bg = new egret.Bitmap();
        this.bg.texture = RES.getRes("friend.desk");
        this.addChild(this.bg);
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addedToStageHandler, this);
    }

    private addedToStageHandler(e: Event): void {
        this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.addedToStageHandler, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.removedFromStageHandler, this);
    }

    private removedFromStageHandler(e: Event): void {
        this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.removedFromStageHandler, this);
        this.destroy();
    }

    private data: CGameRoom;
    private _id: number;
    private tableName: string;
    private status: number = 1;//桌子状态    1等待中   2游戏总
    private isLock: boolean = false;
    private isNeedWg: boolean = false;
    private isNeedYs: boolean = false;
    private cardTime: number;
    private fanType: number;
    private panType: number;
    private users: Array<DeskUserView>;
    private _readyLen: number = 0;
    public isEmpty: boolean = true;
    public tableId: number;

    private _timeDown: number;

    public get id(): number {
        return this._id;
    }

    public set timeDown(value: number) {
        this._timeDown = value;
    }

    public get timeDown(): number {
        return this._timeDown;
    }

    public setTimeDownTxt(str: string): void {
        this.timeDownTxt.text = str;
        this.timeDownTxt.x = this.bg.x + this.bg.width - this.timeDownTxt.width;
        this.timeDownTxt.y = this.bg.y + this.bg.height - this.timeDownTxt.height - 50;
    }

    public setup(room: CGameRoom, isLive: boolean = false): void {
        this.data = room;
        this.isEmpty = false;

        this.tableName = this.data.sRoomName;
        this.panType = this.data.nBoutCount.value;
        this._id = this.data.nRoomID.value;
        this.fanType = this.data.nHuMinLimit.value;

        if (this.data.sPropertyText != "") {
            var _enterText: Object = JSON.parse(this.data.sPropertyText);

            if (_enterText["Countdown"]) {
                this.timeDown = _enterText["Countdown"];
            }

            if (_enterText["PassWord"]) {
                this.isLock = true;
            }

            if (_enterText["LookOn"]) {
                this.isNeedWg = true;
            }

            if (_enterText["DelayCount"]) {
                this.isNeedYs = true;
            }

            if (_enterText["ThrowWait"]) {
                this.cardTime = _enterText["ThrowWait"];
            }

            this.users = [];
            var userIds = _enterText["Players"];
            for (var i: number = 0; i < userIds.length; i++) {
                if (_enterText["Ready"][i] == 1) {
                    this._readyLen += 1;
                }
                var userItem: DeskUserView = new DeskUserView();
                this.users.push(userItem);
            }

            this.data.sPropertyText = JSON.stringify(_enterText);
        }
        this.setDeskStatus();
        this.draw();
    }

    private title: egret.Sprite;
    private title_bg: egret.Bitmap;
    private lockIcon: egret.Bitmap;
    private cardTimeText: egret.TextField;
    private roomText: egret.TextField;
    private txtFan: egret.TextField;
    private wgIcon: egret.Bitmap;
    private ysIcon: egret.Bitmap;
    private bg: egret.Bitmap;
    private desk_bg: egret.Bitmap;
    private ready_btn: SQ.Button;
    private unready_btn: SQ.Button;
    private timeDownTxt: SQ.STTextField;


    private draw(): void {
        if (this.data) {
            this.title = new egret.Sprite();
            this.addChild(this.title);

            this.title_bg = new egret.Bitmap();
            this.title_bg.texture = RES.getRes("friend.desk_title");
            this.title.addChild(this.title_bg);

            this.title.x = this.width * .5 - this.title.width * .5;
            this.title.y = this.bg.y - 55 - this.title.height;

            if (this.isLock) {
                this.lockIcon = new egret.Bitmap();
                this.lockIcon.texture = RES.getRes("friend.lock");
                this.title.addChild(this.lockIcon);
                this.lockIcon.x = -4;
                this.lockIcon.y = 0;
            }

            this.roomText = new egret.TextField();
            this.roomText.text = this.data.sRoomName;
            this.roomText.size = 16;
            this.title.addChild(this.roomText);
            this.roomText.x = this.isLock ? this.lockIcon.width : 4;
            this.roomText.y = 6;

            if (this.isNeedWg) {
                this.wgIcon = new egret.Bitmap();
                this.wgIcon.texture = RES.getRes("friend.wg");
                this.addChild(this.wgIcon);
                this.wgIcon.x = this.title.x - 5;
                this.wgIcon.y = this.title.y + this.title.height + 2;
            }

            this.txtFan = new egret.TextField();
            this.txtFan.text = this.panType + "盘" + this.fanType + "番";
            this.addChild(this.txtFan);
            this.txtFan.width = 65;
            this.txtFan.size = 16;
            this.txtFan.textAlign = "center";
            this.txtFan.x = this.bg.x + this.bg.width;
            this.txtFan.y = this.bg.y + this.bg.height + 25;

            if (this.cardTime) {
                this.cardTimeText = new egret.TextField();
                this.cardTimeText.text = this.cardTime + "";
                this.cardTimeText.width = this.cardTimeText.textWidth;
                this.cardTimeText.size = 14;
                this.addChild(this.cardTimeText);
                this.cardTimeText.x = this.txtFan.x + this.txtFan.width - this.cardTimeText.width + 10;
                this.cardTimeText.y = this.txtFan.y - this.cardTimeText.height - 18;
            }

            if (this.isNeedYs) {
                this.ysIcon = new egret.Bitmap();
                this.ysIcon.texture = RES.getRes("friend.yanchi");
                this.addChild(this.ysIcon);
                this.ysIcon.x = this.cardTimeText.x - this.ysIcon.width - 2;
                this.ysIcon.y = this.bg.y + this.bg.height - 10;
            }


            for (var i = 0; i < this.users.length; i++) {
                var userItem: DeskUserView = this.users[i];
                this.addChild(userItem);
                userItem.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onStoolHandler, this);
                userItem.touchChildren = true;
                userItem.touchEnabled = true;
                userItem.chairNo = i;
                this.setChildIndex(this.bg, this.numChildren - 1);
                this.setUserPosition(i);
            }

            this.timeDownTxt = new SQ.STTextField();
            this.timeDownTxt.text = "";
            this.addChild(this.timeDownTxt);
        }
    }

    private onStoolHandler(e: egret.TouchEvent): void {
        var _stoolItem: DeskUserView = <DeskUserView>e.currentTarget;
        var _chairNo: number = _stoolItem.chairNo;
        var _tableId: number = this.id;

        this.triggerId = _stoolItem.userId;

        //是不是空位置
        if (_stoolItem.userId > -1) {
            //主播围观
            if (WGManager.getInstance().isInLiveRoom && WGManager.getInstance().isCompere && this.status == 2) {
                this.sendCompereHandler(this._id, this.triggerId);
                return;
            }

            //如果是GM
            if (GMManager.getInstance().isGm && this.status == 1 && MyTableData.curTableId == -1) {
                this.showGmMenu(_stoolItem.userId);
                e.stopPropagation();
                return;
            }

            if (this.isNeedWg && this.status == 2) {
                if (MyTableData.curTableId > 0) {
                    GUIFactory.getInstance().showBubbleBox("退出您所在的房间才能围观");
                    return;
                }

                if (this.isLock) {
                    //本地有缓存
                    var _pw: string = MyTableData[_tableId];
                    if (_pw) {
                        this.sendWgHandler(_stoolItem.userId, _pw);
                        return;
                    }
                    this.openPwRoomPanel(GlobalVar.inputPwWg, {targetId: _stoolItem.userId});
                    return;
                }
                this.sendWgHandler(_stoolItem.userId);
            }

            //点的是自己
            if (MyTableData.curChairId == _chairNo && MyTableData.curTableId == _tableId) {
                if (MyTableData.isReady) {
                    GUIFactory.getInstance().showBubbleBox("先取消准备才能站起来");
                    return;
                }
                this.sendStandUPHandler();
                return;
            } else {
                GUIFactory.getInstance().showBubbleBox("该位置有人了");
                return;
            }

        } else {
            if (MyTableData.isReady) {
                GUIFactory.getInstance().showBubbleBox("先取消准备后才能选择该位置！");
                return;
            }

            //有密码
            if (this.isLock) {
                //本地有缓存
                var _pw: string = MyTableData.getPw(_tableId);
                if (_pw) {
                    this.sendSitDownHandler(_chairNo, _pw);
                    return;
                }
                this.openPwRoomPanel(GlobalVar.inputPwSitDown, {tableId: this.id, chairNo: _stoolItem.chairNo});
                return;
            }
            this.sendSitDownHandler(_chairNo);
        }
    }

    private openPwRoomPanel(type: string, data: Object) {
        SceneManager.getInstance().pushScene(InputPwPanel, "", {type: type, data: data});
    }

    private sendCompereHandler(roomId: number = 0, targetId: number): void {
        if (this.timeDown > 0) {
            GUIFactory.getInstance().showBubbleBox("防作弊时间段内禁止围观");
            return;
        }

        WGManager.getInstance().roomId = roomId;
        WGManager.getInstance().tableNo = 0;
        WGManager.getInstance().lookerID = targetId;
        WGManager.getInstance().sendCompereWg();
    }


    private sendSitDownHandler(chairNo: number, password: string = "") {
        var sendData: egret.ByteArray = new egret.ByteArray();
        var _cSitDown: LS_FRIEND_SITDOWN = new LS_FRIEND_SITDOWN();
        _cSitDown.nUserID.value = SystemCenter.playSystem.selfPlayerInfo.userID;
        _cSitDown.nRoomID.value = this.id;
        _cSitDown.nChairNO.value = chairNo;
        CSerializable.Serialization(_cSitDown, sendData)
        CSerializable._Serialization(password, sendData, "string");

        LoadingManager.showLoading();
        SQGameServer.getInstance().sendCmd(Global.LSR_FRIEND_SITDOWN, sendData);
    }

    private sendStandUPHandler(): void {
        var sendData: egret.ByteArray = new egret.ByteArray();
        var _cStandUp: LS_FRIEND_STANDUP = new LS_FRIEND_STANDUP();
        _cStandUp.nUserID.value = SystemCenter.playSystem.selfPlayerInfo.userID;
        _cStandUp.nRoomID.value = this.id;
        CSerializable.Serialization(_cStandUp, sendData);

        LoadingManager.showLoading();
        SQGameServer.getInstance().sendCmd(Global.LSR_FRIEND_STANDUP, sendData);
    }

    private showGmMenu(uid: number): void {

    }

    private triggerId: number;

    private sendWgHandler(targetId: number, pw: string = "") {
        SocketEvent.addEventListener(Global.LSR_TRACK_PLAYER.toString(), this.getWgPlayerHand, this);
        var sendData: egret.ByteArray = new egret.ByteArray();
        var _trackPlayer: CLSTrackPlayer = <any>new CLSTrackPlayer();
        _trackPlayer.nUserID.value = SystemCenter.playSystem.selfPlayerInfo.userID;
        _trackPlayer.nTarget.value = targetId;
        CSerializable.Serialization(_trackPlayer, sendData);
        CSerializable._Serialization(pw, sendData, "string");
        SQGameServer.getInstance().sendCmd(Global.LSR_TRACK_PLAYER, sendData);
    }

    private getWgPlayerHand(e: SocketEvent): void {
        LoadingManager.hideLoading();
        SocketEvent.removeEventListener(Global.LSR_TRACK_PLAYER.toString(), this.getWgPlayerHand, this);
        if (!e.data.data) return;
        var b: egret.ByteArray = e.data.data;
        b.position = 0;
        if (e.data.result == Global.UR_OPERATE_SUCCEEDED) {
            WGManager.getInstance().lookerID = this.triggerId;
        }
        //等待配桌
        else if (e.data.result == 500665) {
            WGManager.getInstance().lookerID = this.triggerId;
            SceneManagerExt.goWaitScene();
        }
    }


    public setPosition(width: number, height: number): void {
        this.width = width;
        this.height = height;

        this.graphics.beginFill(0x336699, 0);
        this.graphics.drawRect(0, 0, this.width, this.height);
        this.graphics.endFill();

        if (this.bg) {
            this.bg.x = this.width * .5 - this.bg.width * .5;
            this.bg.y = this.height * .5 - this.bg.height * .5;
        }

        if (this.desk_bg) {
            this.desk_bg.x = this.bg.x - 3;
            this.desk_bg.y = this.bg.y + 20;
        }
    }

    private setUserPosition(chairNo: number) {
        var userItem = this.users[chairNo];
        var self = this;
        var obj = new Object();
        obj["onComplete"] = function () {
            self.drawUserItem(chairNo)
        };
        obj["onCompleteParams"] = [userItem];
        obj["ease"] = Cubic.easeInOut;

        switch (chairNo) {
            case 0:
                userItem.x = this.bg.x + 20;
                userItem.y = this.bg.y + 20;

                obj["x"] = this.bg.x + this.bg.width + 5;
                obj["y"] = this.bg.y + 20;
                break;
            case 1:
                userItem.x = this.bg.x + 27;
                userItem.y = this.bg.y + 20;

                obj["x"] = this.bg.x + 27;
                obj["y"] = this.bg.y - 40;
                break;
            case 2:
                userItem.x = this.bg.x + 20;
                userItem.y = this.bg.y + 20;

                obj["x"] = this.bg.x - 43;
                obj["y"] = this.bg.y + 20;
                break;
            case 3:
                userItem.x = this.bg.x + 27;
                userItem.y = this.bg.y + 30;

                obj["x"] = this.bg.x + 27;
                obj["y"] = this.bg.y + this.bg.height - 20;
                break;
        }

        TweenMax.to(userItem, .5, obj);
    }

    private drawUserItem(chairNo: number): void {
        var _userId = -1;
        var _userName = "";
        var _isReady = false;

        var _enterText: any = <any>JSON.parse(this.data.sPropertyText);

        if (_enterText["Players"][chairNo]) {
            _userId = _enterText["Players"][chairNo];
            _userName = _enterText["NickName"][chairNo];
            // if (Object.prototype.toString.call(_enterText["Ready"]) == "[object Number]") {
            //     if (_enterText["Ready"] & (1 << chairNo)) {
            //
            //     }
            // }

            if (_enterText["Ready"][chairNo]) {
                _isReady = true;
            }
            this.setChildIndex(this.bg, 1);
            var userItem = this.users[chairNo];
            userItem.chairNo = chairNo;
            userItem.userName = _userName;
            userItem.userId = _userId;
            userItem.isReady = _isReady;
            userItem.draw();

            if (_userId == SystemCenter.playSystem.selfPlayerInfo.userID) {
                this.initReadyBtn();
                this.ready_btn.visible = !userItem.isReady;
                this.unready_btn.visible = userItem.isReady;
            }
        }
    }

    private initReadyBtn(): void {
        if (!this.ready_btn) {
            this.ready_btn = new SQ.Button("friend.ready_btn_1", "friend.ready_btn_2", "friend.ready_btn_2");
            this.addChild(this.ready_btn);
            this.ready_btn.x = this.bg.x + 12;
            this.ready_btn.y = this.bg.y + this.bg.height + 25;
            this.ready_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onReadyBtnHandler, this)
        }
        if (!this.unready_btn) {
            this.unready_btn = new SQ.Button("friend.unready_btn_1", "friend.unready_btn_1", "friend.unready_btn_1");
            this.addChild(this.unready_btn);
            this.unready_btn.x = this.bg.x + 12;
            this.unready_btn.y = this.bg.y + this.bg.height + 25;
            this.unready_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onUnReadyBtnHandler, this)
        }
        this.ready_btn.visible = false;
        this.unready_btn.visible = false;
    }

    private onReadyBtnHandler(e: egret.TouchEvent) {
        var sendData: egret.ByteArray = new egret.ByteArray();
        sendData.endian = egret.Endian.LITTLE_ENDIAN;
        sendData.writeInt(SystemCenter.playSystem.selfPlayerInfo.userID);
        LoadingManager.showLoading();
        SQGameServer.getInstance().sendCmd(Global.LSR_FRIEND_READY, sendData);
    }

    private onUnReadyBtnHandler(e: egret.TouchEvent) {
        var sendData: egret.ByteArray = new egret.ByteArray();
        sendData.endian = egret.Endian.LITTLE_ENDIAN;
        sendData.writeInt(SystemCenter.playSystem.selfPlayerInfo.userID);
        LoadingManager.showLoading();
        SQGameServer.getInstance().sendCmd(Global.LSR_FRIEND_UNREADY, sendData);
    }


    public sitDownUser(cSitDown: LS_FRIEND_SITDOWN, nikeName: string): void {
        var _enterText: any = <any>JSON.parse(this.data.sPropertyText);
        var _chair = _enterText["Players"].indexOf(cSitDown.nUserID.value);
        var _userName: string = _enterText["NickName"][_chair];

        if (cSitDown.nUserID.value == SystemCenter.playSystem.selfPlayerInfo.userID) {
            this.initReadyBtn();
            this.ready_btn.visible = true;
        }

        var userItem = this.users[cSitDown.nChairNO.value];
        if (userItem) {
            userItem.chairNo = _chair;
            userItem.userName = _userName;
            userItem.userId = cSitDown.nUserID.value;
            userItem.isReady = false;
            userItem.draw();
        }
    }

    public standUpUser(cStandUp: LS_FRIEND_STANDUP): void {
        if (cStandUp.nUserID.value == SystemCenter.playSystem.selfPlayerInfo.userID) {
            if (this.ready_btn) {
                this.ready_btn.visible = false;
            }
        }
        for (var i = 0; i < this.users.length; i++) {
            var _userItem = this.users[i];
            if (_userItem && _userItem.userId == cStandUp.nUserID.value) {
                _userItem.clearStool();
            }
        }
    }

    public readyUser(userId: number): void {
        if (userId == SystemCenter.playSystem.selfPlayerInfo.userID) {
            this.ready_btn.visible = false;
            this.unready_btn.visible = true;
        }

        for (var i = 0; i < this.users.length; i++) {
            var _userItem = this.users[i];
            if (_userItem && _userItem.userId == userId) {
                _userItem.isReady = true;
                this._readyLen += 1;
            }
        }

        this.setDeskStatus();
    }

    public unReadyUser(userId: number): void {
        if (userId == SystemCenter.playSystem.selfPlayerInfo.userID) {
            this.ready_btn.visible = true;
            this.unready_btn.visible = false;
        }

        for (var i = 0; i < this.users.length; i++) {
            var _userItem = this.users[i];
            if (_userItem && _userItem.userId == userId) {
                _userItem.isReady = false;
                this._readyLen -= 1;
            }
        }

        this.setDeskStatus();
    }

    private setDeskStatus(): void {
        this.status = 1;
        if (this._readyLen == 4) {
            this.status = 2;
        }
    }

    private clearAllUser(): void {
        var animation = function (userItem, obj) {
            TweenMax.to(userItem, .5, obj);
        };
        var self = this;
        if (this.users) {
            for (var i = 0; i < this.users.length; i++) {
                (function (index) {
                    var userItem = self.users[index];
                    userItem.clearStool();

                    self.setChildIndex(self.bg, self.numChildren - 1);

                    var obj = new Object();
                    obj["onComplete"] = function () {
                        DisplayObjectUtil.removeForParent(userItem);
                        userItem = null;
                    };
                    obj["onCompleteParams"] = [userItem];
                    obj["ease"] = Cubic.easeInOut;

                    switch (index) {
                        case 0:
                            obj["x"] = userItem.x - 50;
                            break;
                        case 2:
                            obj["x"] = userItem.x + 50;
                            break;
                        case 1:
                            obj["y"] = userItem.y + 50;
                            break;
                        case 3:
                            obj["y"] = userItem.y - 50;
                            break;
                    }

                    animation(userItem, obj);
                })(i);
            }

            this.users = null;
        }
    }

    private clearDisplayExcludeBg(): void {
        if (this.data != null) this.data = null;
        this.clearAllUser();
        var self = this;
        if (this.cardTimeText) {
            DisplayObjectUtil.removeForParent(this.cardTimeText);
            this.cardTimeText = null;
        }

        if (this.ready_btn) {
            DisplayObjectUtil.removeForParent(this.ready_btn);
            this.ready_btn = null;
        }

        if (this.unready_btn) {
            DisplayObjectUtil.removeForParent(this.unready_btn);
            this.unready_btn = null;
        }

        if (this.title) {
            DisplayObjectUtil.removeForParent(this.title);
            this.title = null;
        }

        if (this.lockIcon) {
            DisplayObjectUtil.removeForParent(this.lockIcon);
            this.lockIcon = null;
        }

        if (this.cardTime) {
            DisplayObjectUtil.removeForParent(this.cardTime);
            this.cardTime = null;
        }

        if (this.roomText) {
            DisplayObjectUtil.removeForParent(this.roomText);
            this.roomText = null;
        }
        if (this.txtFan) {
            DisplayObjectUtil.removeForParent(this.txtFan);
            this.txtFan = null;
        }

        if (this.timeDownTxt) {
            DisplayObjectUtil.removeForParent(this.timeDownTxt);
            this.timeDownTxt = null;
        }

        if (this.wgIcon) {
            DisplayObjectUtil.removeForParent(this.wgIcon);
            this.wgIcon = null;
        }

        if (this.ysIcon) {
            DisplayObjectUtil.removeForParent(this.ysIcon);
            this.ysIcon = null;
        }
    }

    public emptyDesk(): void {
        this.isEmpty = true;
        this._readyLen = 0;
        this._id = 0;
        this.tableName = "";
        this.status = 1;
        this.isLock = false;
        this.isNeedWg = false;
        this.isNeedYs = false;
        this.cardTime = -1;
        this.fanType = -1;
        this.panType = -1;

        this.clearDisplayExcludeBg();
    }

    public destroy(): void {
        this.emptyDesk();
        if (this.bg) {
            DisplayObjectUtil.removeForParent(this.bg);
            this.bg = null;
        }

        if (this.desk_bg) {
            DisplayObjectUtil.removeForParent(this.desk_bg);
            this.desk_bg = null;
        }
    }
}