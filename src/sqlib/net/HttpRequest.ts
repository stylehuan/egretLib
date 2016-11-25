/**
 * Created by stylehuan on 2016/7/26.
 */
class HttpRequest {
    public constructor() {
    }

    private loader: egret.URLLoader;

    private static requestHasMap: HashMap<string, Object>;

    private static addRequest(key, value): void {
        if (!this.requestHasMap) {
            this.requestHasMap = new HashMap<string, Object>();
        }
        this.requestHasMap.set(key, value);
    }

    private successFunc: Function;
    private errorFunc: Function;

    private static delRequestHas(key): void {
        if (this.requestHasMap) {
            if (this.requestHasMap.get(key)) {
                this.requestHasMap.delete(key);
            }
        }
    }

    public openHttpRequest(requestConfig: RequestConfig): void {
        var request = new egret.HttpRequest();
        var _params = "";
        var _type: string = requestConfig.type === "POST" ? egret.HttpMethod.POST : egret.HttpMethod.GET;
        var first = true;

        this.successFunc = requestConfig.success;
        this.errorFunc = requestConfig.error;
        request.responseType = egret.HttpResponseType.TEXT;

        if (requestConfig.params) {
            for (var key in requestConfig.params) {
                if (requestConfig.params.hasOwnProperty(key)) {
                    if (first) {
                        _params = key + "=" + requestConfig.params[key];
                        first = false;
                    } else {
                        _params += "&" + key + "=" + requestConfig.params[key];
                    }
                }
            }
        }

        if (_type == egret.HttpMethod.GET) {
            if (_params != "") {
                _params = "?" + _params;
            }
            requestConfig.url += _params;
        }
        request.open(requestConfig.url, _type);
        request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        //request.setRequestHeader("Uri-Hash", _hasCode + "");

        if (_type == egret.HttpMethod.GET) {
            request.send();
        } else {
            request.send(requestConfig.params);
        }

        //if (egret.MainContext.deviceType == egret.MainContext.DEVICE_MOBILE) {
        //    if (_type == egret.HttpMethod.GET) {
        //        request.send();
        //    } else {
        //        request.send(params);
        //    }
        //} else {
        //
        //}
        request.addEventListener(egret.Event.COMPLETE, this.onComplete, this);
        request.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onIOError, this);
        request.addEventListener(egret.ProgressEvent.PROGRESS, this.onProgress, this);
    }

    private onComplete(event: egret.Event): void {
        var request = <egret.HttpRequest>event.currentTarget;
        var data: Object = JSON.parse(request.response);
        if (data["Success"] > -1) {
            this.successFunc(data["Data"]);
        } else {
            this.errorFunc(data["Message"]);
        }
        //request.getResponseHeader("Uri-Hash");
        //this.success();
    }

    private onIOError(event: egret.Event): void {
        var request = <egret.HttpRequest>event.currentTarget;
        var data: Object = JSON.parse(request.response);
        this.errorFunc(data["Message"]);
    }

    private onProgress(event: egret.Event): void {
        var request = <egret.HttpRequest>event.currentTarget;
    }

}