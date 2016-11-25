/**
 * Created by seethinks@gmail.com on 2016/8/23.
 */
class RandomUtil {
    private static  uuid():string {
        function s4() {
            return (((1 + Math.random()) * 0x10000) || 0).toString(16).substring(1);
        }

        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }

    public static getUid():string {
        return this.uuid();
    }

    public static getSmallRandom(len:number = 8):string {
        return Math.random().toString(36).slice(2).slice(0, len);
    }

    public static getRandom(min, max):number {
        return Math.floor(Math.random() * (max - min) + min);
    }
}