/**
 * Created by stylehuan on 2016/8/2.
 */
class PCUtil {
    public static _instance: PCUtil;

    public static getInstance(): PCUtil {
        if (!this._instance) {
            this._instance = new PCUtil();
        }
        return this._instance;
    }

    public getCookie(nm): any {
        var m = null;
        if (RegExp) {
            var re = new RegExp(";\\s*" + nm + "=([^;]*)", "i");
            m = re.exec(';' + document.cookie);
        }
        return (m ? decodeURIComponent(m[1]) : null);
    }

    public setup(): void {
    }

    public getTicket(): string {
        var _s = this.getCookie("UC108_Ticket");
        if (_s == undefined || _s == "") {
            return "";
        }
        var _sl = _s.split('&');
        for (var i = 0; i < _sl.length; i++) {
            if (_sl[i].substring(0, 6) == 'ticket') {
                return _sl[i].split('=')[1];
            }
        }
        return "";
    }

    public goLogin(): void {
        var goUrl = window.location.href;
        window.location.href = URLDefine.dzlsLoginMain + "?gourl=" + goUrl;
    }

    private listener: EventListener;

    private listenerHandler(e: any): void {
        var self = PCUtil.getInstance();
        if (self.listener) {
            self.listener.call(self.context, [e]);
        }
    }

    private context: any;

    public addKeyEventListener(type: string, listener: EventListener, context: any) {
        if (!UIAdapter.getInstance().isPC) return;
        this.listener = listener;
        this.context = context;
        //window.addEventListener(type, this.listenerHandler, false);
    }

    public removeKeyEventListener(type: string, listener: EventListener, context: any) {
        if (!UIAdapter.getInstance().isPC) return;
        //window.removeEventListener(type, this.listenerHandler, false);
    }
}