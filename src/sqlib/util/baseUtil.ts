/**
 * Created by seethinks@gmail.com on 2016/8/23.
 */
class baseUtil {
    public static isExitFlag(source:number, target:number):boolean {
        return (source & target) == target;
    }
}