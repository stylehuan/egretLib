/**
 * Created by seethinks@gmail.com on 2016/8/23.
 */
class StrUtil {
    public static countLetterNum(s:String):number {
        var len:number = 0, sLength:number = s.length, _char:number = 0;
        for (var i:number = 0; i < sLength; i++) {
            if (!/[\u4e00-\u9fa5]/g.test(s.charAt(i))) {
                len += 1;
            } else {
                len += 2;
            }
        }
        return len;
    }

    public static limitStr(str:string, maxLen:number):string {
        var _s:string = "", len:number = 0;
        for (var i:number = 0; i < str.length; i++) {
            if (!/[\u4e00-\u9fa5]/g.test(str.charAt(i))) {
                len += 1;
            } else {
                len += 2;
            }

            if (len > maxLen) return _s;
            _s += str.charAt(i);
        }

        return _s;
    }
}