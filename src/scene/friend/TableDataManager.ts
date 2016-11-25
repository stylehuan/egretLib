/**
 * Created by stylehuan on 2016/7/29.
 */
class TableDataManager {
    private tablesList: Array<CGameRoom>;

    public constructor(arr: Array<CGameRoom>) {
        for (var i: number = 0; i < arr.length; i++) {
            var transformObject = this.transformReady(arr[i].sPropertyText);
            arr[i].sPropertyText = JSON.stringify(transformObject);
        }
        this.tablesList = arr;
    }

    public addTable(index: number, cGameRoom: CGameRoom): void {
        var transformObject = this.transformReady(cGameRoom.sPropertyText);
        cGameRoom.sPropertyText = JSON.stringify(transformObject);

        this.tablesList[index] = cGameRoom;
    }

    private transformReady(sPropertyText: string): Object {
        var _enterText: Object = JSON.parse(sPropertyText);
        var userIds = _enterText["Players"];
        var ready: Array<number> = [];
        for (var i: number = 0; i < userIds.length; i++) {
            if (Object.prototype.toString.call(_enterText["Ready"]) == "[object Number]") {
                ready[i] = 0;
                if (_enterText["Ready"] & (1 << i)) {
                    ready[i] = 1;
                }
            }
        }

        _enterText["Ready"] = ready;
        return _enterText;
    }

    public removeTable(tableId: number): void {
        for (var i: number = 0; i < this.tablesList.length; i++) {
            if (this.tablesList[i].nRoomID.value == tableId) {
                this.tablesList[i] = null;
                break;
            }
        }
    }


    public getTables(): Array<CGameRoom> {
        return this.tablesList;
    }

    public getTableItem(tableId: number): CGameRoom {
        for (var i: number = 0; i < this.tablesList.length; i++) {
            if (this.tablesList[i] && this.tablesList[i].nRoomID.value == tableId) {
                return this.tablesList[i];
            }
        }
        return null;
    }

    public updateSitDown(_cSitDown: LS_FRIEND_SITDOWN, nikeName: string): void {
        var nowTable: CGameRoom = this.getTableItem(_cSitDown.nRoomID.value);
        var _nowEnterText: any = <any>JSON.parse(nowTable.sPropertyText);

        _nowEnterText["Players"][_cSitDown.nChairNO.value] = _cSitDown.nUserID.value;
        _nowEnterText["NickName"][_cSitDown.nChairNO.value] = nikeName;

        nowTable.sPropertyText = JSON.stringify(_nowEnterText);
    }

    public updateStandUp(_cStandUp: LS_FRIEND_STANDUP): void {
        var table = this.getTableItem(_cStandUp.nRoomID.value);

        if (!table) return;
        var _enterText: any = <any>JSON.parse(table.sPropertyText);
        var _oldChair: number = Number(_enterText["Players"].indexOf(_cStandUp.nUserID.value));
        if (_oldChair > -1) {
            _enterText["Players"][_oldChair] = 0;
            _enterText["NickName"][_oldChair] = "";
            _enterText["Ready"][_oldChair] = 0;
        }

        table.sPropertyText = JSON.stringify(_enterText);
    }

    public updateReady(roomId: number, userId: number): void {
        var table = this.getTableItem(roomId);
        var _oEnterText: Object = JSON.parse(table.sPropertyText);
        var _chair = _oEnterText["Players"].indexOf(userId);
        if (_chair > -1) {
            _oEnterText["Ready"][_chair] = 1;
        }
        table.sPropertyText = JSON.stringify(_oEnterText);
    }

    public updateUnReady(roomId, userId): void {
        var table = this.getTableItem(roomId);
        var _oEnterText: Object = JSON.parse(table.sPropertyText);
        var _chair = _oEnterText["Players"].indexOf(userId);
        if (_chair > -1) {
            _oEnterText["Ready"][_chair] = 0;
        }
        table.sPropertyText = JSON.stringify(_oEnterText);
    }
}