class RoomInfo {
    public static RoomTable:Array<CGameRoom> = new Array<CGameRoom>();		// 本地房间表

    public static getNameByCount(count: number = 0): string {
        switch (count) {
            case 16:
                return "全庄";
            case 8:
                return "半庄"
            case 4:
                return "迷你庄";
            case 1:
                return "个人公开赛"
        }
        return "";
    }


    //获取房间总局数
    public static getBoutCount(roomId:number = 0):number {
        if (RoomInfo.RoomTable && RoomInfo.RoomTable.length) {
            for (var i:number = 0; i < RoomInfo.RoomTable.length; i++) {
                if (roomId == RoomInfo.RoomTable[i].nRoomID.value) {
                    return RoomInfo.RoomTable[i].nBoutCount.value;
                }
            }
        }
        return 0;
    }

    public static getRoomName(roomId:number = 0):string {
        if (RoomInfo.RoomTable && RoomInfo.RoomTable.length) {
            for (var i:number = 0; i < RoomInfo.RoomTable.length; i++) {
                if (roomId == RoomInfo.RoomTable[i].nRoomID.value) {
                    return RoomInfo.RoomTable[i].sRoomName;
                }
            }
        }
        return "";
    }

    public static getRoomClassId(roomId:number = 0):number {
        console.log("RoomInfo.RoomTable:" + RoomInfo.RoomTable)
        if (RoomInfo.RoomTable && RoomInfo.RoomTable.length) {
            console.log("RoomInfo.RoomTable.length:" + RoomInfo.RoomTable.length)
            for (var i:number = 0; i < RoomInfo.RoomTable.length; i++) {
                console.log("roomId:" + roomId + "  RoomInfo.RoomTable[i].nRoomID.value:" + RoomInfo.RoomTable[i].nRoomID.value)
                if (roomId == RoomInfo.RoomTable[i].nRoomID.value) {
                    return RoomInfo.RoomTable[i].nClassID.value;
                }
            }
        }
        return 0;
    }
}