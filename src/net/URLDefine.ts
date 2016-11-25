/**
 * Created by seethinks@gmail.com on 2015/8/10.
 */
class URLDefine {
    constructor() {
    }

    public static dzlsLoginMain: string = "http://dzls.saiqu.org:2090/login.aspx";
    public static doMain: string = "http://gbmj.saiqu.org:1505";       //测试
    public static mainDoMain: string = "http://www.saiqu.org:1505";       //测试
    public static ServerIp: string = "115.236.49.168";   // 192.168.1.102   192.168.6.34  // - 公网 - 115.236.49.168
    public static ServerPort: number = 1852;   // 1855 弹幕服务器    - 1852 游戏服务器

    public static doMainApi: string ="";
    public static mainApi: string = "";

    public static getSign: string = "/Main/EnterGame";
    public static LogInByWeb: string = "/Main/LogIn";                   //��¼
    public static ValidSign: string = "/Main/ValidSign";                //��֤Ʊ��
    public static ClientRegister: string = "/Main/ClientRegister";      //һ��ע��
    public static GetAllRoom: string = "/Main/GetAllRoom";              //��ȡ����ֱ����

    public static getUserFace: string = "/main/getuserface";
    public static faceAgency: string = "/home/imageagent";


    //�Ƿ����ӿ�
    public static GetMatchList: string = "/StatScore/GetMatchList";          //��������
    public static GetMatchInfo: string = "/StatScore/GetMatchInfo";          //��ȡ��������
    public static AddMatch: string = "/StatScore/AddMatch";                  //�������

    public static CreateMultiBout: string = "/StatScore/CreateMultiBout";    //��������
    public static GetMultiBout: string = "/StatScore/GetMultiBout";          //��ȡ��������
    public static GetMultiBoutList: string = "/StatScore/GetMultiBoutList";  //��ȡ�����б�
    public static UpdateMultiboutStatus: string = "/StatScore/UpdateMultiboutStatus";  //�޸ĳ���״̬

    public static GetBoutList: string = "/StatScore/GetBoutList";            //��ȡ���λ����Ϣ
    public static AddScore: string = "/StatScore/AddScore";                  //��ӼǷ����ȷ�

    public static UpdateNickName: string = "/main/UpdateNickNameM";                  //��ӼǷ����ȷ


    public static HeartBeat: string = "/main/HeartBeat";

    public static GetVedioList: string = "/main/GetVedioList";  // GetVedioList(int top)

    public static SendRegSms: string = "/main/SendRegSms";  // SendRegSms(string mobile)
    public static GetUserFace: string = "/main/GetUserFace";  // GetUserFace(int userID)
    public static RegisterByPhoneNo: string = "/main/RegisterByPhoneNo";  // SendRegSms(string mobile)
    public static RegisterByUserName: string = "/Main/Register";  // SendRegSms(string mobile)
    public static LogInByPhoneNo: string = "/main/LogInByPhoneNo";  //LogInByPhoneNo(string mobile, string pwd)

    public static ExChangeTeleFee: string = "/main/ExChangeTeleFee";  //LogInByPhoneNo(string mobile, string pwd)

    public static GetGameRecordList: string = "/main/GetGameRecordList";  //main/GetGameRecordList(int multiID)   主域
    public static GetMultiListBySign: string = "/main/GetMultiListBySign";  //main/GetMultiListBySign(string sign)   主域

}