class StorageManager {
    public static USER_SIGN: string = "userSign";
    public static SCORE_LIST: string = "scoreList";
    public static MULTI_BOUT: string = "multiBout";

    public static LOGIN_NAME: string = "LOGIN_NAME";
    public static LOGIN_PWD: string = "LOGIN_PWD";

    public static LOGIN_NAME2: string = "LOGIN_NAME2";
    public static LOGIN_PWD2: string = "LOGIN_PWD2";
    public static LOGIN_TYPE: string = "LOGIN_TYPE"; //用户名登录 1;  手机号登录 2;

    public static LOGIN_LIST1: string = "LOGIN_LIST1";
    public static LOGIN_LIST2: string = "LOGIN_LIST2";
    public static FRIEND_ROOM_NAME: string = "FRIEND_ROOM_NAME";
    public static CUR_PWD: string = "CUR_PWD";


    //音量
    public static bgmVolume: string = "bgm_volume";
    public static ggmVolume: string = "ggm_volume";

    public static removeLocalStorage(itemName: string) {
        egret.localStorage.removeItem(itemName);
    }

    public static addLocalStorage(itemName: string, value: string) {
        egret.localStorage.setItem(itemName, value);
    }

    public static getLocalStorage(itemName: string): string {
        var a: string = egret.localStorage.getItem(itemName);
        if (a == undefined)
            return "";
        return a;
    }

    //更新下拉列表
    public static updateUserList(userName: string, pwd: string, typeID: number) {
        var arrStr: string;
        if (typeID == 1)
            arrStr = StorageManager.getLocalStorage(StorageManager.LOGIN_LIST1);
        else
            arrStr = StorageManager.getLocalStorage(StorageManager.LOGIN_LIST2);

        var isFresh: boolean = false;
        if (arrStr != "" && arrStr != undefined)
            var arr: any[] = JSON.parse(arrStr);
        else
            var arr: any[] = null;

        if (arr != null && arr != undefined && arr.length > 0) {
            for (var i = 0; i < arr.length; i++) {
                if (arr[i].key == userName) {
                    arr[i].value = pwd;
                    isFresh = true;
                    break;
                }
            }
        }
        else
            arr = new Array<any>();


        if (!isFresh) {
            arr.push({key: userName, value: pwd});
        }
        arrStr = JSON.stringify(arr);

        if (typeID == 1)
            StorageManager.addLocalStorage(StorageManager.LOGIN_LIST1, arrStr);
        else
            StorageManager.addLocalStorage(StorageManager.LOGIN_LIST2, arrStr);
    }


    public static GetPdwByUserName(userName: string): string {
        var pwd = StorageManager.getLocalStorage(StorageManager.CUR_PWD);
        if (pwd != null && pwd != undefined && pwd != "") {
            return pwd;
        }

        var arrStr = StorageManager.getLocalStorage(StorageManager.LOGIN_LIST1);
        var data: any[] = JSON.parse(arrStr);
        if (data != null && data != undefined)
            for (var i: number = 0; i < data.length; i++) {
                var key = data[i].key;
                var value = data[i].value;
                if (userName == key)
                    return value;
            }
        return "";
    }

}