class SQGameServer extends egret.DisplayObjectContainer {
    public isConnect:boolean = true;
    public webSocket:egret.WebSocket;
    private static _singleton:boolean = true;
    private static _instance:SQGameServer;
    public m_token:number = 0;
    public m_msgQueue:Array<CPacket>;
    public m_buff:egret.ByteArray;

    public _t:egret.Timer;
    public isSocketConnectFlag:boolean = false;

    public constructor() {
        super();
        this.m_msgQueue = new Array<CPacket>();
    }

    public static getInstance():SQGameServer {
        if (!SQGameServer._instance) {
            SQGameServer._singleton = false;
            SQGameServer._instance = new SQGameServer();
            SQGameServer._singleton = true;
        }
        return SQGameServer._instance;
    }

    public connectServer():void {
        this.isSocketConnectFlag = false;
        this.m_buff = new egret.ByteArray();
        this.webSocket = new egret.WebSocket();
        this.webSocket.type = egret.WebSocket.TYPE_BINARY;
        this.webSocket.addEventListener(egret.ProgressEvent.SOCKET_DATA, this.onReceiveMessage, this);
        this.webSocket.addEventListener(egret.Event.CONNECT, this.onSocketOpen, this);
        this.webSocket.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onSocketError, this);

        this.webSocket.addEventListener(egret.Event.CLOSE, this.onSocketClose, this);
        this.webSocket.connect(URLDefine.ServerIp, URLDefine.ServerPort);
        console.log("do connect servsdfsder ip:" +URLDefine.ServerIp + "  port:" + URLDefine.ServerPort);
    }

    private onSocketError(e:egret.IOErrorEvent):void {
        //this.isConnect = false;
        console.log("this.isSocketConnectFlag:" + this.isSocketConnectFlag)
        //

        if (this.isSocketConnectFlag) {
            if (egret.Capabilities.os == "Android") {
                egret.ExternalInterface.call("doAndroidReLoadGame", "");
            }
            else {
                egret.ExternalInterface.call("doIOSSocketError", "");
            }
        }
        console.log("server onSocketError!!!" + e.hashCode);
    }

    private onSocketClose():void {
        console.log("server onSocketClose!!!:" + this._isSd);
        this.isSocketConnectFlag = false;
        if (this._isSd) {
            this._isSd = false;
            console.log("  this._isSd = false;-------------------------------------");
            return;
        }
        this.destroy();
        //this.isConnect = false;
        //var alert:ST.AlertKnow = new ST.AlertKnow(ST.AlertKnow.BTN_YES)
        //alert.show("亲，服务器mm不高兴了，请点击重连安慰一下她吧，木啊！", function ():void {
        //        alert.hide();
        //        if (GlobalVar.IsBrowh) {
        //            document.location.reload();
        //        } else {
        //            if (egret.Capabilities.os == "Android")
        //                egret.ExternalInterface.call("doAndroidReLoadGame", "");
        //            else
        //                egret.ExternalInterface.call("doIOSExitGame", "");
        //        }
        //
        //    }
        //);
        PopUpManager.alert("系统消息","亲，和服务器连接中断咯，请点击重连！", function ():void {
            if (GlobalVar.IsBrowh) {
                document.location.reload();
            } else {
                if (egret.Capabilities.os == "Android")
                    egret.ExternalInterface.call("doAndroidReLoadGame", "");
                else
                    egret.ExternalInterface.call("doIOSExitGame", "");
            }
        });
    }

    private onSocketOpen():void {
        console.log("server 连接成功!!!");
        SocketEvent.dispatchEvents(new SocketEvent(SocketEvent.CONNECTED_SERVER));
        this.isConnect = true;
        this.isSocketConnectFlag = true;
        //** 加心跳timer
        if (this._t == null) {
            this._t = new egret.Timer(GlobalVar.headTime);
            this._t.addEventListener(egret.TimerEvent.TIMER, this.heart, this);
            this._t.start();
        }
    }

    private heart(e:egret.TimerEvent):void {
       this.sendHead();
    }

    public sendHead():void{
        this.processRequest(500005, new egret.ByteArray, 0);
    }

    private tempTimer:number;

    private OnNotifyReceived(msg_type:number, request:number, data:egret.ByteArray, result:number, requestData:egret.ByteArray):void {

        var se:SocketEvent;
        if (msg_type == 2) {
            requestData.position = 0;
            requestData.endian = egret.Endian.LITTLE_ENDIAN;

            console.log("response->" + data + ",head:" + request + ",result:" + result);
            se = new SocketEvent(request.toString());
            se.data = {data: data, request: request, result: result, positive: true, requestData: requestData};
            SocketEvent.dispatchEvents(se);
        } else {
            console.log("response->" + data + ",head:" + request + ",result:" + result);
            se = new SocketEvent(request.toString());
            se.data = {data: data, request: request, result: result, positive: false, requestData: requestData};
            SocketEvent.dispatchEvents(se);
        }
    }

    private onReceiveMessage(e:egret.Event):void {
        var ba:egret.ByteArray = new egret.ByteArray();
        this.webSocket.readBytes(ba);
        this.m_buff.position = this.m_buff.length;
        this.m_buff.writeBytes(ba, 0, ba.length);
        this.m_buff.position = 0;

        var packet:CPacket;
        while ((packet = new CPacket).FromBytes(this.m_buff)) {
            var temp:egret.ByteArray = new egret.ByteArray();
            this.m_buff.readBytes(temp, 0, this.m_buff.bytesAvailable);
            this.m_buff = temp;
            if (packet.msg_type == 2) {
                //console.log("this.m_msgQueue:"+this.m_msgQueue+"  this.m_msgQueue size:"+this.m_msgQueue.length)
                //console.log("this.m_msgQueue[0].session_id:"+this.m_msgQueue[0].session_id+"  packet.session_id:"+packet.session_id)
                if (this.m_msgQueue[0].session_id != packet.session_id) {
                    this.webSocket.close();
                    //                        var info:AlertInfo = new AlertInfo();
                    //                        info.str ="need_echo出错->。:"+packet.request+":"+this.m_msgQueue.length;
                    //                        info.type =  AlertType.ALARM
                    //                        info.state = 1
                    //                        info.applyFun = function ():void{
                    //                            this.navigateToURL(new URLRequest("javascript:location.reload();"),"_self");
                    //                        }
                    //                        var alert:AlertKnow = new AlertKnow(info);
                    //                        alert.show();
                    return;
                }
                //                for (var str in packet)
                //                {
                //                    console.log(" ppppppppppppppp str:"+str+"    ----:"+packet[str])
                //                }
                this.OnNotifyReceived(packet.msg_type, this.m_msgQueue[0].request, packet.raw_data, packet.request, this.m_msgQueue[0].raw_data);
                this.m_msgQueue.shift();

                //console.log("this.m_msgQueue.length:"+this.m_msgQueue.length)
                if (this.m_msgQueue.length > 0) {
                    var temp2:egret.ByteArray = new egret.ByteArray();
                    this.m_msgQueue[0].ToBytes(temp2);
                    this.webSocket.writeBytes(temp2, 0, temp2.length);
                    this.webSocket.flush();
                }
            }
            else {
                this.OnNotifyReceived(packet.msg_type, packet.request, packet.raw_data, Global.UR_OPERATE_SUCCEEDED, null);
            }

        }
    }

    public sendCmd(cmd:number, data:egret.ByteArray, echo_wait:number = 1):void {
        this.processRequest(cmd, data, echo_wait);
    }

    /**
     * 发送数据给服务端
     * @param request
     * @param data
     * @param echo_wait
     */
    public processRequest(request:number, data:egret.ByteArray, echo_wait:number = 1):void {
        //console.log("this.webSocket:"+this.webSocket+"  this.webSocket.connected:"+this.webSocket.connected)
        if (!this.webSocket) return;
        if (!this.webSocket.connected) return;
        var packet:CPacket = new CPacket();
        packet.request = request;
        packet.session_id = ++this.m_token;
        packet.encrypt = 0;
        packet.echo_wait = echo_wait;
        packet.compress = 0;
        packet.raw_data.writeBytes(data, 0, data.length);
        //packet.result = 0;
        if (echo_wait == 1) {
            ////            if(packet.request == 221080){
            ////                for(var i:number=0;i<this.m_msgQueue.length;i++){
            ////                    if((<CPacket><any> (this.m_msgQueue[i])).request == 221080){
            //////							LogToRemote.SaveToRemote(true,"出牌这里的队列中，已经有一条出牌记录，对抗赛... jj");
            ////                    }
            ////                }
            ////            }
            this.m_msgQueue.push(packet);
            //            if (this.m_msgQueue.length > 50){
            //                var info:AlertInfo = new AlertInfo();
            //                info.str ="need_echo出错->。:"+packet.request+":"+this.m_msgQueue.length;
            //                info.type =  AlertType.ALARM
            //                info.state = 1
            //                info.applyFun = function ():void{
            //                    //this.navigateToURL(new egret.URLRequest("javascript:location.reload();"),"_self");
            //                }
            //                var alert:AlertKnow = new AlertKnow(info);
            //                alert.show();
            //            }
            //
            if (this.m_msgQueue.length > 1)
                return;
        }
        var temp:egret.ByteArray = new egret.ByteArray();
        packet.ToBytes(temp);
        console.log("Send ->" + request + "   can shu ->" + data + "  request:" + request + "  temp -->" + temp);
        this.webSocket.writeBytes(temp, 0, temp.length);
        this.webSocket.flush();
    }

    private _isSd:boolean = false; // 是否手动关闭
    public destroy(isSd:boolean = false):void {
        // this._isSd = isSd;

        if (this.webSocket != null) {
            this.webSocket.removeEventListener(egret.ProgressEvent.SOCKET_DATA, this.onReceiveMessage, this);
            this.webSocket.removeEventListener(egret.Event.CONNECT, this.onSocketOpen, this);
            this.webSocket.removeEventListener(egret.IOErrorEvent.IO_ERROR, this.onSocketError, this);
            this.webSocket.removeEventListener(egret.Event.CLOSE, this.onSocketClose, this);
            this.webSocket.close();
            this.webSocket = null;
        }
        if (this._t != null) {
            this._t.stop();
            this._t.removeEventListener(egret.TimerEvent.TIMER, this.heart, this);
            this._t = null;
        }

    }
}