/**
 * Created by stylehuan on 2016/7/30.
 */
class MyTableData {
    public static  isReady:boolean = false;
    public static  curTableId:number = -1;
    public static  curChairId:number = -1;
    public static  lastTableId:number = -1;

    public static isShowCreateBtn:string = "is_show_create_btn";

    private static _joinPwArr:Object;

    public static addPw(id:number, pw:string):void {
        if (!this._joinPwArr) {
            this._joinPwArr = new Object();
        }
        this._joinPwArr[id + ""] = pw;
    }

    public static getPw(id:number):string {
        if (!this._joinPwArr) return "";
        return this._joinPwArr[id + ""];
    }

    public static deletePw(id:number):void {
        if (this._joinPwArr && this._joinPwArr[id]) {
            this._joinPwArr[id] = "";
        }
    }

    public static reset():void {
        this._joinPwArr = null;
        this.isReady = false;
        this.curTableId = -1;
        this.curChairId = -1;
        this.lastTableId = -1;
    }
}