/**
 * Created by stylehuan on 2016/11/15.
 */
class Match {
    private static _instance: Match;

    public static getInstance(): Match {
        if (!this._instance) {
            this._instance = new Match();
        }
        return this._instance;
    }

    public entryScene(): void {
        SocketEvent.addEventListener(Global.LSR_ENTER_SCENE.toString(), this.enterLevelSceneHandler, this);

        var sendData: egret.ByteArray = new egret.ByteArray();
        var cEnterLSScene: LS_ENTER_SCENE = new LS_ENTER_SCENE();
        cEnterLSScene.nUserID.value = SystemCenter.playSystem.selfPlayerInfo.userID;
        cEnterLSScene.nScene.value = Global.LS_SCENE_MATCH_NEW;
        CSerializable.Serialization(cEnterLSScene, sendData);
        SQGameServer.getInstance().sendCmd(Global.LSR_ENTER_SCENE, sendData);
        LoadingManager.showLoading();
    }

    private enterLevelSceneHandler(e: SocketEvent): void {
        LoadingManager.hideLoading();
        if (!e.data.data) return;
        var b: egret.ByteArray = e.data.data;
        SocketEvent.removeEventListener(Global.LSR_ENTER_SCENE.toString(), this.enterLevelSceneHandler, this);
        if (e.data.result == Global.UR_OPERATE_SUCCEEDED) {
            SystemCenter.playSystem.selfPlayerInfo.gameStatus = (SystemCenter.playSystem.selfPlayerInfo.gameStatus | Global.LSPLAYER_STATUS_INSCENE);
            SystemCenter.playSystem.selfPlayerInfo.GameData.nScene.value = Global.LS_SCENE_MATCH_NEW;

            this.getRoomInfo();
        }
        else {

        }
    }

    public getRoomId(matchId: number, isHx: boolean): number {
        var _hxv = isHx ? 1 : 0;
        return Global.GBMJ_ROOMID_MATCHNEW_BASE + matchId * 2 + _hxv;
    }

    public getRoomInfo(): void {
        var roomId: number = this.getRoomId(GlobalVar.CurMatchInfo["matchId"], GlobalVar.CurMatchInfo["isHx"]);
        var sendData: egret.ByteArray = new egret.ByteArray();
        sendData.endian = egret.Endian.LITTLE_ENDIAN;
        sendData.writeInt(roomId);
        SocketEvent.addEventListener(Global.LSR_GET_ONE_ROOMINFO.toString(), this.getRoomInfoHandler, this);
        SQGameServer.getInstance().sendCmd(Global.LSR_GET_ONE_ROOMINFO, sendData);
    }

    private getRoomInfoHandler(e: SocketEvent): void {
        if (!e.data.data) return;
        var b: egret.ByteArray = e.data.data;
        SocketEvent.removeEventListener(Global.LSR_GET_ONE_ROOMINFO.toString(), this.getRoomInfoHandler, this);
        if (e.data.result == Global.UR_OPERATE_SUCCEEDED) {
            var cgameRoomInfo: CGameRoom;
            while (b.bytesAvailable) {
                cgameRoomInfo = new CGameRoom();
                CSerializable.Deserialization(cgameRoomInfo, b);
            }

            if (cgameRoomInfo) {
                var _enterText: Object = JSON.parse(cgameRoomInfo.sPropertyText);
                GlobalVar.CurMatchInfo["playerCount"] = _enterText["PlayerCount"];
                GlobalVar.CurMatchInfo["roomId"] = cgameRoomInfo.nRoomID.value;
            }

            this.entryRoom();
        } else if (e.data.result == 500550 || e.data.result == 500535) {
            this.leaveScene();
        }
    }

    private entryRoom() {
        var cgameEnterRoom: CGameEnterRoom = new CGameEnterRoom();
        cgameEnterRoom.nUserID.value = SystemCenter.playSystem.selfPlayerInfo.userID;
        cgameEnterRoom.nRoomID.value = this.getRoomId(GlobalVar.CurMatchInfo["matchId"], GlobalVar.CurMatchInfo["isHx"]);

        var sendData: egret.ByteArray = new egret.ByteArray();
        CSerializable.Serialization(cgameEnterRoom, sendData);
        SystemCenter.playSystem.selfPlayerInfo.MatchRoomId = cgameEnterRoom.nRoomID.value;
        SocketEvent.addEventListener(Global.GBMJR_MATCHNEW_ENTERROOM.toString(), this.enterRoomHandler, this);
        SQGameServer.getInstance().sendCmd(Global.GBMJR_MATCHNEW_ENTERROOM, sendData);
    }

    private enterRoomHandler(e: SocketEvent = null): void {
        LoadingManager.hideLoading();
        SocketEvent.removeEventListener(Global.SQR_ENTER_ROOM.toString(), this.enterRoomHandler, this);
        if (e.data.result != Global.UR_OPERATE_SUCCEEDED) {
            this.leaveScene();
        } else {
            SceneManagerExt.goWaitScene();
        }
    }

    public leaveScene(): void {
        var _scene: number = SystemCenter.playSystem.selfPlayerInfo.GameData.nScene.value;
        SocketEvent.addEventListener(Global.LSR_LEAVE_SCENE.toString(), this.leaveSceneHandler, this);

        var sendData: egret.ByteArray = new egret.ByteArray();
        var cLeaveLSScene: LS_LEAVE_SCENE = new LS_LEAVE_SCENE();
        cLeaveLSScene.nUserID.value = SystemCenter.playSystem.selfPlayerInfo.userID;
        cLeaveLSScene.nScene.value = _scene;
        CSerializable.Serialization(cLeaveLSScene, sendData);
        SQGameServer.getInstance().sendCmd(Global.LSR_LEAVE_SCENE, sendData);

    }

    public leaveSceneNextFunc: Function;
    private leaveSceneHandler(e: SocketEvent): void {
        LoadingManager.hideLoading();
        if (!e.data.data) return;
        var b: egret.ByteArray = e.data.data;
        SocketEvent.removeEventListener(Global.LSR_LEAVE_SCENE.toString(), this.leaveSceneHandler, this);
        GlobalVar.CurMatchIndex = -1;
        if (e.data.result == Global.UR_OPERATE_SUCCEEDED) {
            this.leaveSceneNextFunc && this.leaveSceneNextFunc();
        }
    }
}