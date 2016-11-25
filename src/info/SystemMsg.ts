/**
 * Created by stylehuan on 2016/7/29.
 */
class SystemMsg {
    private static  systemHasMap:HashMap<number, string>;

    public static setup():void {
        this.systemHasMap = new HashMap<number, string>();
        this.systemHasMap.set(Global.SQR_DATALEN_MISMATCH, "���ݳ��Ȳ�ƥ��");
        this.systemHasMap.set(Global.SQR_SOAPOPERATE_FAILED, "soap ���Ӳ���");
        this.systemHasMap.set(Global.SQR_DBOPERATE_FAILED, "���ݿ�����ʧ��");
        this.systemHasMap.set(Global.SQR_PLAYER_NOTEXIST, "�û�������");
        this.systemHasMap.set(Global.SQR_PLAYERSTATUS_MISMATCH, "���״̬����");
        this.systemHasMap.set(Global.SQR_PLAYERDATA_MISMATCH, "������ݴ���");
        this.systemHasMap.set(Global.SQR_ROOM_NOTEXIST, "���䲻����");
        //this.systemHasMap.set(Global.SQR_ROOM_EXISTED, "���䲻����");
        this.systemHasMap.set(Global.SQR_ROOM_CLOSED, "�����ѹر�");
        this.systemHasMap.set(Global.SQR_ROOM_DISABLE, "���䲻����");
        this.systemHasMap.set(Global.SQR_ROOM_OVERFLOW, "");
        this.systemHasMap.set(Global.SQR_NOTENOUGHT_VALUE, "���Ȳ���");
        this.systemHasMap.set(Global.SQR_EXCEED_VALUE, "");
        this.systemHasMap.set(Global.SQR_NOTENOUGHT_PLAYER, "");
        this.systemHasMap.set(Global.SQR_EXCEED_PLAYER, "��Ϣ������T");
        this.systemHasMap.set(Global.SQR_SOLO_FAILED, "");
        this.systemHasMap.set(Global.SQR_RESULT_UNSAVE, "");
        this.systemHasMap.set(Global.SQR_LOADSCRIPT_FAILED, "");
        this.systemHasMap.set(Global.SQR_COOLDOWN_OVER, "");
        this.systemHasMap.set(Global.SQR_PASSWORD_MISMATCH, "");
        this.systemHasMap.set(Global.SQR_WAIT_FOR_START, "");

        this.systemHasMap.set(Global.SQR_ROOM_OVERFLOW, "��λ��������");
        this.systemHasMap.set(Global.SQR_PASSWORD_MISMATCH, "密码输入有误");
        this.systemHasMap.set(Global.LSR_GET_ONE_ROOMINFO, "��λ��������");

        //GM
        this.systemHasMap.set(Global.LSR_FRIEND_KICKOFF_PLAYER, "GM����֪ͨ");
        this.systemHasMap.set(Global.LSR_KICK_OFF_TABLE, "GMɢ��֪ͨ");
        this.systemHasMap.set(Global.SQR_DELAY_TEST, "GM散桌");
    }

    public static getMsg(key:number):string {
        return this.systemHasMap.get(key);
    }
}