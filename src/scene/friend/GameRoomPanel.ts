/**
 * Created by stylehuan on 2016/9/29.
 */
class GameRoomPanel extends egret.DisplayObjectContainer {
    public constructor() {
        super();
        this.setUp();
    }

    private panel: FriendDeskManager;

    private setUp() {
        this.panel = new FriendDeskManager();
        this.addChild(this.panel);

        var roomIcon = new egret.Bitmap();
        roomIcon.texture = RES.getRes("friend.friend_icon");
        this.addChild(roomIcon);
        roomIcon.x = LayerManager.stage.stageWidth * .5 - roomIcon.width * .5;
        roomIcon.y = LayerManager.stage.stageHeight * .5 - roomIcon.height * .5;

        this.listenerMessage();
    }

    private listenerMessage(): void {
        SocketEvent.addEventListener(Global.SQR_GET_ROOMINFO.toString(), this.getSecneRoomInfo, this);
        SocketEvent.addEventListener(Global.LSR_FRIEND_DELETEROOM.toString(), this.deleteRoomHandler, this);
        SocketEvent.addEventListener(Global.LSR_FRIEND_CREATEROOM.toString(), this.createRoomHandler, this);

        SocketEvent.addEventListener(Global.LSR_FRIEND_SITDOWN.toString(), this.getSitDownHandler, this);
        SocketEvent.addEventListener(Global.LSR_FRIEND_STANDUP.toString(), this.getStandUpHandler, this);
        SocketEvent.addEventListener(Global.LSR_FRIEND_READY.toString(), this.getReadyHandler, this);
        SocketEvent.addEventListener(Global.LSR_FRIEND_UNREADY.toString(), this.getUnReadyHandler, this);
        //SocketEvent.addEventListener(Global.LSR_FRIEND_KICKOFF_PLAYER, this.getOffPlayerHandler, this);

        var sendData: egret.ByteArray = new egret.ByteArray();
        sendData.position = 0;
        sendData.endian = egret.Endian.LITTLE_ENDIAN;
        sendData.writeInt(SystemCenter.playSystem.selfPlayerInfo.GameData.nScene.value);
        //获取房间信息

        LoadingManager.showLoading();
        SQGameServer.getInstance().sendCmd(Global.SQR_GET_ROOMINFO, sendData);
    }

    private getSecneRoomInfo(e: SocketEvent): void {
        LoadingManager.hideLoading();
        if (!e.data.data) return;
        if (e.data.requestData) {
            var sceneID: number = e.data.requestData.readInt();
            if (sceneID != 2)
                return;
        }
        var b: egret.ByteArray = e.data.data;
        b.position = 0;
        if (e.data.positive) {
            var uid: number = SystemCenter.playSystem.selfPlayerInfo.userID;
            if (e.data.result == Global.UR_OPERATE_SUCCEEDED) {
                var tempArr: Array<CGameRoom> = [];
                while (b.bytesAvailable) {
                    var cgameRoom: CGameRoom = new CGameRoom();
                    CSerializable.Deserialization(cgameRoom, b);
                    if (cgameRoom.nScene.value == Global.LSSCENE_FRIEND) {
                        var _enterText: Object = JSON.parse(cgameRoom.sPropertyText);
                        var _index: number = _enterText["Players"].indexOf(uid);

                        if (_index > -1) {
                            MyTableData.curTableId = cgameRoom.nRoomID.value;
                            MyTableData.curChairId = _index;
                            MyTableData.lastTableId = cgameRoom.nRoomID.value;
                            if (_enterText["Ready"] & (1 << _index)) {
                                MyTableData.isReady = true;
                            }
                        }
                        tempArr.push(cgameRoom);
                    }
                }

                this.panel.draw(tempArr);
            }
        }
    }

    private deleteRoomHandler(e: SocketEvent): void {
        if (!e.data.data) return;
        var b: egret.ByteArray = e.data.data;
        b.position = 0;
        b.endian = egret.Endian.LITTLE_ENDIAN;
        if (!e.data.positive) {
            var roomId: number = b.readInt();
            MyTableData.deletePw(roomId);
            if (roomId == MyTableData.curTableId) {
                this.dispatchEventWith(MyTableData.isShowCreateBtn, false, true);
            }

            this.panel.clearEmptyOneTable(roomId);
        }
    }

    private createRoomHandler(e: SocketEvent): void {
        if (!e.data.data) return;
        var b: egret.ByteArray = e.data.data;
        if (!e.data.positive) {
            while (b.bytesAvailable) {
                var cgameRoomInfo: CGameRoom = new CGameRoom();
                CSerializable.Deserialization(cgameRoomInfo, b);
                var uid: number = SystemCenter.playSystem.selfPlayerInfo.userID;
                var _enterText: any = <any>JSON.parse(cgameRoomInfo.sPropertyText);
                var isMy = _enterText["Players"].indexOf(uid);
                if (isMy > -1) {
                    MyTableData.curChairId = isMy;
                    MyTableData.curTableId = cgameRoomInfo.nRoomID.value;
                    MyTableData.lastTableId = cgameRoomInfo.nRoomID.value;

                    this.dispatchEventWith(MyTableData.isShowCreateBtn, false, false);
                }

                this.panel.addTable(cgameRoomInfo);
            }
        }
    }

    private getSitDownHandler(e: SocketEvent) {
        LoadingManager.hideLoading();
        if (!e.data.data)
            return;
        var b: egret.ByteArray = e.data.data;
        b.position = 0;
        if (e.data.positive) {
            if (e.data.result != Global.UR_OPERATE_SUCCEEDED) {
                var str: string = "";
                switch (e.data.result) {
                    case 500530:
                    case 500545:
                        str = "该位置有人啦";
                        break;
                    case 500660:
                        str = "密码输入有误";
                        break;
                }
                GUIFactory.getInstance().showBubbleBox(str);
            }
        } else {
            var _cSitDown: LS_FRIEND_SITDOWN = new LS_FRIEND_SITDOWN();
            CSerializable.Deserialization(_cSitDown, b);
            var nikeName: string = "";
            nikeName = CSerializable._Deserialization(nikeName, b, "string");

            //var _oldChair:number = -1;
            var tableItem: DeskTableView;
            if (_cSitDown.nOldRoomID.value != 0) {
                if (_cSitDown.nOldRoomID.value == _cSitDown.nRoomID.value) {
                    var cStandUp: LS_FRIEND_STANDUP = new LS_FRIEND_STANDUP();
                    cStandUp.nRoomID = _cSitDown.nRoomID;
                    cStandUp.nUserID = _cSitDown.nUserID;
                    tableItem = this.panel.getTableById(_cSitDown.nRoomID.value);
                } else {
                    var cStandUp: LS_FRIEND_STANDUP = new LS_FRIEND_STANDUP();
                    cStandUp.nRoomID = _cSitDown.nOldRoomID;
                    cStandUp.nUserID = _cSitDown.nUserID;
                    tableItem = this.panel.getTableById(_cSitDown.nOldRoomID.value);
                }
                if (tableItem) {
                    this.panel.dataManager.updateStandUp(cStandUp);
                    tableItem.standUpUser(cStandUp);
                }
            }

            tableItem = this.panel.getTableById(_cSitDown.nRoomID.value);
            this.panel.dataManager.updateSitDown(_cSitDown, nikeName);
            if (tableItem) {
                tableItem.sitDownUser(_cSitDown, nikeName);
            }


            if (_cSitDown.nUserID.value == SystemCenter.playSystem.selfPlayerInfo.userID) {
                MyTableData.curChairId = _cSitDown.nChairNO.value;
                MyTableData.curTableId = _cSitDown.nRoomID.value;
                MyTableData.lastTableId = _cSitDown.nRoomID.value;

                this.dispatchEventWith(MyTableData.isShowCreateBtn, false, false);
            }
        }
    }

    private getStandUpHandler(e: SocketEvent) {
        LoadingManager.hideLoading();
        if (!e.data.data) return;
        var b: egret.ByteArray = e.data.data;
        if (!e.data.positive) {
            var _cStandUp: LS_FRIEND_STANDUP = new LS_FRIEND_STANDUP();
            CSerializable.Deserialization(_cStandUp, b);

            var tableItem = this.panel.getTableById(_cStandUp.nRoomID.value);
            if (tableItem) {
                tableItem.standUpUser(_cStandUp);
            }

            this.panel.dataManager.updateStandUp(_cStandUp);

            if (_cStandUp.nUserID.value == SystemCenter.playSystem.selfPlayerInfo.userID) {
                MyTableData.curChairId = -1;
                MyTableData.curTableId = -1;
                MyTableData.isReady = false;

                this.dispatchEventWith(MyTableData.isShowCreateBtn, false, true);
            }
        }
    }

    private getReadyHandler(e: SocketEvent) {
        LoadingManager.hideLoading();
        if (!e.data.data) return;
        var b: egret.ByteArray = e.data.data;
        if (<any>!e.data.positive) {
            b.endian = egret.Endian.LITTLE_ENDIAN;
            var userId: number = b.readInt();
            var roomId: number = b.readInt();
            if (userId == SystemCenter.playSystem.selfPlayerInfo.userID) {
                MyTableData.isReady = true;
            }

            var tableItem = this.panel.getTableById(roomId);
            if (tableItem) {
                tableItem.readyUser(userId);
            }

            this.panel.dataManager.updateReady(roomId, userId);
        }
    }

    private getUnReadyHandler(e: SocketEvent) {
        LoadingManager.hideLoading();
        if (!e.data.data)
            return;
        var b: egret.ByteArray = e.data.data;
        if (!e.data.positive) {
            b.endian = egret.Endian.LITTLE_ENDIAN;
            var userId: number = (b.readInt());
            var roomId: number = (b.readInt());

            if (userId == SystemCenter.playSystem.selfPlayerInfo.userID) {
                MyTableData.isReady = false;
            }

            var tableItem = this.panel.getTableById(roomId);
            if (tableItem) {
                tableItem.unReadyUser(userId);
            }
            this.panel.dataManager.updateUnReady(roomId, userId);
        }
    }

    public destroy() {
        MyTableData.reset();
        SocketEvent.removeEventListener(Global.SQR_GET_ROOMINFO.toString(), this.getSecneRoomInfo, this);
        SocketEvent.removeEventListener(Global.LSR_FRIEND_DELETEROOM.toString(), this.deleteRoomHandler, this);
        SocketEvent.removeEventListener(Global.LSR_FRIEND_CREATEROOM.toString(), this.createRoomHandler, this);

        SocketEvent.removeEventListener(Global.LSR_FRIEND_SITDOWN.toString(), this.getSitDownHandler, this);
        SocketEvent.removeEventListener(Global.LSR_FRIEND_STANDUP.toString(), this.getStandUpHandler, this);
        SocketEvent.removeEventListener(Global.LSR_FRIEND_READY.toString(), this.getReadyHandler, this);
        SocketEvent.removeEventListener(Global.LSR_FRIEND_UNREADY.toString(), this.getUnReadyHandler, this);

        if (this.panel) {
            this.panel.destroy();
            DisplayObjectUtil.removeForParent(this.panel);
            this.panel = null;
        }

        DisplayObjectUtil.removeAllChild(this);
        DisplayObjectUtil.removeForParent(this);
    }
}