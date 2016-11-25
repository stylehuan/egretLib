/**
 * Created by stylehuan on 2016/9/29.
 */
class LiveRoomPanel extends egret.DisplayObjectContainer {
    public constructor() {
        super();
        this.setUp();
    }

    private panel: FriendDeskManager;

    private setUp() {
        this.panel = new FriendDeskManager();
        this.addChild(this.panel);

        WGManager.getInstance().isInLiveRoom = true;

        var roomIcon = new egret.Bitmap();
        roomIcon.texture = RES.getRes("friend.compere_icon");
        this.addChild(roomIcon);
        roomIcon.x = LayerManager.stage.stageWidth * .5 - roomIcon.width * .5;
        roomIcon.y = LayerManager.stage.stageHeight * .5 - roomIcon.height * .5;

        WgMsgAdaptive.getInstance().setUp();
        this.listenerMessage();
    }

    private listenerMessage(): void {
        SocketEvent.addEventListener(Global.LSR_GET_ADD_GHOSTROOM.toString(), this.getAddRoomHandler, this);
        SocketEvent.addEventListener(Global.LSR_GET_REMOVE_GHOSTROOM.toString(), this.getRemoveRoomHandler, this);
        SocketEvent.addEventListener(Global.LSR_GET_SCENE_GHOSTROOMINFO.toString(), this.getAllRoomHandler, this);

        var sendData: egret.ByteArray = new egret.ByteArray();
        sendData.position = 0;
        sendData.endian = egret.Endian.LITTLE_ENDIAN;
        sendData.writeInt(SystemCenter.playSystem.selfPlayerInfo.GameData.nScene.value);
        //获取房间信息

        LoadingManager.showLoading();
        SQGameServer.getInstance().sendCmd(Global.LSR_GET_SCENE_GHOSTROOMINFO, sendData);
    }

    private getAddRoomHandler(e: SocketEvent): void {
        LoadingManager.hideLoading();
        if (!e.data.data) return;
        var b: egret.ByteArray = e.data.data;
        b.position = 0;
        if (!e.data.positive) {
            var cgameRoomInfo: CGameRoom = new CGameRoom();
            CSerializable.Deserialization(cgameRoomInfo, b);

            if (cgameRoomInfo.nScene.value == Global.LSSCENE_FRIEND) {
                this.panel.addTable(cgameRoomInfo);
            }
        }
    }

    private getRemoveRoomHandler(e: SocketEvent): void {
        LoadingManager.hideLoading();
        if (!e.data.data) return;
        var b: egret.ByteArray = e.data.data;
        b.position = 0;
        if (!e.data.positive) {
            var cgameRoomInfo: CGameRoom = new CGameRoom();
            CSerializable.Deserialization(cgameRoomInfo, b);

            this.panel.clearEmptyOneTable(cgameRoomInfo.nRoomID.value);
        }
    }

    private getAllRoomHandler(e: SocketEvent): void {
        LoadingManager.hideLoading();
        if (!e.data.data) return;
        var b: egret.ByteArray = e.data.data;
        b.position = 0;
        if (e.data.result == Global.UR_OPERATE_SUCCEEDED) {
            var tempArr: Array<CGameRoom> = [];
            while (b.bytesAvailable) {
                var cgameRoomInfo: CGameRoom = new CGameRoom();
                CSerializable.Deserialization(cgameRoomInfo, b);

                if (cgameRoomInfo.nScene.value == Global.LSSCENE_FRIEND) {
                    tempArr.push(cgameRoomInfo);
                }
            }

            this.panel.draw(tempArr);
        }
    }

    public destroy() {
        WGManager.getInstance().isInLiveRoom = false;
        SocketEvent.removeEventListener(Global.LSR_GET_ADD_GHOSTROOM.toString(), this.getAddRoomHandler, this);
        SocketEvent.removeEventListener(Global.LSR_GET_REMOVE_GHOSTROOM.toString(), this.getRemoveRoomHandler, this);
        SocketEvent.removeEventListener(Global.LSR_GET_SCENE_GHOSTROOMINFO.toString(), this.getAllRoomHandler, this);

        if (this.panel) {
            this.panel.destroy();
            DisplayObjectUtil.removeForParent(this.panel);
            this.panel = null;
        }

        DisplayObjectUtil.removeAllChild(this);
        DisplayObjectUtil.removeForParent(this);
    }
}