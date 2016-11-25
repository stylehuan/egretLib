/**
 * Created by stylehuan on 2016/7/20.card
    /*时间字符串处理类
     * */
class TimeUtil {
        public static DAY_SECONDS:number = 24 * 3600;

        /**
         * 获取 00：00：00格式的时间显示
         * @param _time 单位秒
         * @return
         */
        public static getColonTimeStr(_time:number = 0):string {
            var _h:number = Math.floor(_time / 3600);
            var _m:number = Math.floor((_time % 3600) / 60);
            var _s:number = Math.round((_time % 3600) % 60);
            var _str:string = (_h >= 10 ? (_h + "") : ("0" + _h)) + ":" + (_m >= 10 ? (_m + "") : ("0" + _m)) + ":" + (_s >= 10 ? (_s + "") : ("0" + _s));
            return _str;
        }

        /**
         * 获取 00：00格式的时间显示
         * @param _time 单位秒
         * @return
         */
        public static getColonTimeStrByM(_time:number = 0):string {
            var _m:number = Math.floor((_time % 3600) / 60);
            var _s:number = (_time % 3600) % 60;
            var _str:string = (_m >= 10 ? (_m + "") : ("0" + _m)) + ":" + (_s >= 10 ? (_s + "") : ("0" + _s));
            return _str;
        }

        public static getColonTimeStrByM2(_time:number = 0):string {
            var _h:number = Math.floor(_time / 3600);
            var _m:number = Math.floor((_time % 3600) / 60);
            var _s:number = (_time % 3600) % 60;
            var _str:string = (_h >= 10 ? (_h + "") : ("0" + _h)) + ":" + (_m >= 10 ? (_m + "") : ("0" + _m)) + ":" + (_s >= 10 ? (_s + "") : ("0" + _s));
            return _str;
        }

        public static getColonTimeStrByM3(_time:number = 0):string {
            var _D:number = Math.floor(_time / 86400);
            var _h:number = Math.floor((_time % 86400) / 3600);
            var _m:number = Math.floor(((_time % 86400) % 3600) / 60);
            var _s:number = ((_time % 86400) % 3600) % 60;
            var _str:string;

            if (_D > 0) {
                _str = _D + "天后";
            }
            else {
                _str = (_h >= 10 ? (_h + "") : ("0" + _h)) + ":" + (_m >= 10 ? (_m + "") : ("0" + _m)) + ":" + (_s >= 10 ? (_s + "") : ("0" + _s));
            }

            return _str;
        }

        public static timeDate:Date = new Date();

        public static getHourMinuteTimeStr(second:number = 0):string {
            this.timeDate.setTime(second * 1000);
            var hour:number = this.timeDate.getHours();
            var minute:number = this.timeDate.getMinutes();
            var str:string = this.getTimeText(hour, minute);
            return str;
        }

        private static getTimeText(minute:number, second:number = 0):string {
            var timeStr:string = "";
            timeStr += minute < 10 ? "0" + minute : minute.toString();
            timeStr += ":";
            timeStr += second < 10 ? "0" + second : second.toString();
            return timeStr;
        }

        /**
         * 若时间大于等于一天  返回 0天 格式的时间显示
         * 若时间小于一天 则返回 00：00：00格式的时间显示
         * @param _time
         * @return
         */
        public static getFormatTimeStr(_time:number = 0):string {
            if (_time >= this.DAY_SECONDS) {
                return Math.ceil(_time / this.DAY_SECONDS) + "天";
            }

            return this.getColonTimeStr(_time);
        }

        /**
         * C server 时间转成秒数
         */
        public static timeToSec(str:string):number {
            return parseInt(str.substr(8, 2)) * 3600 + parseInt(str.substr(10, 2)) * 60 + parseInt(str.substr(12, 2));
        }
}