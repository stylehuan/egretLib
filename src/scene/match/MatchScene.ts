/**
 * Created by stylehuan on 2016/7/22.
 */
class MatchScene extends SceneBase {
    public constructor() {
        super();
    }

    public resGroup:string = "matchScene";
    private _bg:egret.Bitmap;
    private _backBtn:EButton;
    private _bottomLine:egret.Sprite;

    private _startBtn:EButton;
    private _starIcon:egret.Bitmap;

    private _arrowRightBtn:EButton;
    private _arrowLeftBtn:EButton;

    private _moreBtn:EButton;

    private _matchList:HashMap<number,MatchInfo>;
    private _turnList:HashMap<number,Array<TurnInfo>>;
    private _matchIconContainer:egret.DisplayObjectContainer;
    //private _matchIconMask:egret.Sprite;

    private _matchNameTxt:SQ.STTextField;
    private _matchInfoTxt:SQ.STTextField;

    private _curIndex:number=0;
    private _totalLen:number=0;
    private _iconTotal:number=18;
    private _iconLenOff:number=2;  // 以中间对位置，会有往左两个偏移
    private radius:number=495;

    private _curIcon:MatchIconView;

    private _matchTimer:egret.Timer;

    private _txtDjs:SQ.STTextField;

    private _matchStatus:string="";

    public initial():void {
        if(GlobalVar.CurMatchIndex != -1) this._curIndex = GlobalVar.CurMatchIndex;
        this._bg = new egret.Bitmap();
        this._bg.texture = RES.getRes("match_bg.jpg");
        this.addChild(this._bg);
        this._bg.touchEnabled = true;

        if(this._matchList == null)
        {
            this._matchList = new HashMap<number,MatchInfo>();
        }
        if(this._turnList == null)
        {
            this._turnList = new HashMap<number,Array<TurnInfo>>();
        }

        this._backBtn = GUIFactory.getInstance().createBackBtn2();
        this._backBtn.x = LayerManager.stage.stageWidth - this._backBtn.width;
        this._backBtn.y = -this._backBtn.height;
        this.addChild(this._backBtn);

        this._backBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBackHandler, this);

        this._bottomLine = new egret.Sprite();
        var _bg = GUIFactory.getInstance().createBottomLine();
        this._bottomLine.addChild(_bg);
        this._bottomLine.y = LayerManager.stage.stageHeight;
        this.addChild(this._bottomLine);

        this._arrowRightBtn = new EButton(this,"jiantouyou",null,"",24,1,"match");
        this._arrowRightBtn.x = LayerManager.stage.stageWidth - 76 - this._arrowRightBtn.width;
        this._arrowRightBtn.y = LayerManager.stage.stageHeight - 26 - this._arrowRightBtn.height;
        this._arrowRightBtn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.iconRightMove,this);
        this.addChild(this._arrowRightBtn);

        this._arrowLeftBtn = new EButton(this,"jiantouzuo",null,"",24,1,"match");
        this._arrowLeftBtn.x = 76;
        this._arrowLeftBtn.y = LayerManager.stage.stageHeight - 26 - this._arrowLeftBtn.height;
        this._arrowLeftBtn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.iconLeftMove,this);
        this.addChild(this._arrowLeftBtn);

        if(this._moreBtn ==null)
        {
            this._moreBtn = new EButton(this,"morebtn",null,"",16,1,"match");
            this._moreBtn.x = 576;
            this._moreBtn.y = 202;
            this.addChild(this._moreBtn);
        }


        TweenMax.to(this._bottomLine, .5, {
            y: LayerManager.stage.stageHeight - this._bottomLine.height, ease: Cubic.easeInOut
        });
        TweenMax.to(this._backBtn, .5, {
            y: 0, ease: Cubic.easeInOut
        });

        if(this._startBtn == null)
        {
            this._startBtn= new EButton(this,"kaishi",null,"",24,1,"match");
            this._startBtn.x = LayerManager.stage.stageWidth*.5 - this._startBtn.width*.5;
            this._startBtn.y = LayerManager.stage.stageHeight - this._startBtn.height-50;
            this._startBtn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.doStartHandler,this);
            this.addChild(this._startBtn);
        }
        if(this._starIcon == null)
        {
            this._starIcon = new egret.Bitmap();
            this._starIcon.texture = RES.getRes("match.kaishi");
            this._starIcon.anchorOffsetX = this._starIcon.width*.5;
            this._starIcon.anchorOffsetY = this._starIcon.height*.5;
            this._starIcon.x = LayerManager.stage.stageWidth*.5 ;
            this._starIcon.visible=false;
            this._starIcon.y = LayerManager.stage.stageHeight -50-this._starIcon.height*.5;
            this.addChild(this._starIcon);
        }

        if(this._matchIconContainer == null)
        {
            this._matchIconContainer = new egret.DisplayObjectContainer();
            this._matchIconContainer.anchorOffsetX = this._matchIconContainer.width*.5;
            this._matchIconContainer.anchorOffsetY = this._matchIconContainer.height*.5;
            this.addChild(this._matchIconContainer);
        }

//        if(this._matchIconMask == null)
//        {
//            this._matchIconMask = new egret.Sprite();
//            this._matchIconMask.graphics.beginFill(0x333333)
//            this._matchIconMask.graphics.drawRect(90,0,780,276)
//            this._matchIconMask.graphics.endFill();
//            this._matchIconContainer.mask = this._matchIconMask;
//            this._matchIconMask.y = LayerManager.stage.stageHeight*.5-16;;
//            this.addChild(this._matchIconMask);
//        }

        if(this._matchNameTxt == null)
        {
            this._matchNameTxt = new SQ.STTextField();
            this._matchNameTxt.width = 120;
            this._matchNameTxt.textAlign="center"
            this._matchNameTxt.text="";
            this._matchNameTxt.strokeColor = 0xb38145;
            this._matchNameTxt.stroke = 2;
            this._matchNameTxt.x = 420;
            this._matchNameTxt.y = 84;
            this._matchNameTxt.touchEnabled = false;
            this.addChild(this._matchNameTxt);
        }
        if(this._matchInfoTxt == null)
        {
            this._matchInfoTxt = new SQ.STTextField();
            this._matchInfoTxt.x = 390;
            this._matchInfoTxt.y = 120;
            this._matchInfoTxt.textColor=0xb38145;
            this._matchInfoTxt.touchEnabled = false;
            this.addChild(this._matchInfoTxt);
        }
        this.listenerMessage();

        if(this._matchTimer == null)
        {
            this._matchTimer = new egret.Timer(200);
            this._matchTimer.addEventListener(egret.TimerEvent.TIMER,this.checkMatchIconStateHandler,this);
            this._matchTimer.start();
        }

        if(this._txtDjs == null)
        {
            this._txtDjs = new SQ.STTextField();
            this._txtDjs.text = "";
            this._txtDjs.x = 390;
            this._txtDjs.y = 20;
            this.addChild(this._txtDjs);
        }

        //this.addEventListener(egret.Event.ENTER_FRAME,this.loop,this);
        //TipsTapManager.addTips(this._startBtn,"比赛就要开始咯！",1);
        //TipsTapManager.addTips(this._arrowLeftBtn,"向左转！",2);
        //TipsTapManager.addTips(this._arrowRightBtn,"向右转！",3);
    }


    private doStartHandler(e:egret.TouchEvent):void
    {
//        this._userNameTextField = new SQ.SimplicityTextField(this.userName, 12);
//        this._scoreTextField = new SQ.SimplicityTextField(this._score + "", 12)
//        this.addChild(this._userNameTextField);
//        this.addChild(this._scoreTextField);

        //EcffectFactory.getInstance().createMoreStar(300,new egret.Point(Math.random()*200+50,Math.random()*400+50))
        //Ocean  (1) 时间段
        var i:number=0;
        var l:number = this._turnList.get(this._curIcon.matchId).length;
        var nowTimer:number = GlobalVar.ServerLocalDateOff+new Date().getTime();
        for(i=0;i<l;i++)
        {
            if(this._turnList.get(this._curIcon.matchId)[i].TurnIndex == 0 && this._turnList.get(this._curIcon.matchId)[i].ID>0 )
            {
                //console.log("nowTimer:"+nowTimer)
                //console.log("cur BT:"+new Date(this._turnList.get(this._curIcon.matchId)[i].BeginTime).getTime());
                //console.log("cur ST:"+new Date(this._turnList.get(this._curIcon.matchId)[i].EndTime).getTime());
                if(nowTimer>=new Date(this._turnList.get(this._curIcon.matchId)[i].BeginTime).getTime() && nowTimer <=new Date(this._turnList.get(this._curIcon.matchId)[i].EndTime).getTime())
                {
                    var cgameEnterRoom:CGameEnterRoom = new CGameEnterRoom();
                    cgameEnterRoom.nUserID.value = SystemCenter.playSystem.selfPlayerInfo.userID;
                    cgameEnterRoom.nRoomID.value = this._matchList.get(this._curIcon.matchId).RoomId -1;
                    var sendData:egret.ByteArray = new egret.ByteArray();
                    CSerializable.Serialization(cgameEnterRoom, sendData);
                    SystemCenter.playSystem.selfPlayerInfo.MatchRoomId = cgameEnterRoom.nRoomID.value;
                    SocketEvent.addEventListener(Global.GBMJR_MATCHNEW_ENTERROOM.toString(), this.enterRoomHandler, this);
                    SQGameServer.getInstance().sendCmd(Global.GBMJR_MATCHNEW_ENTERROOM, sendData);
                    LoadingManager.showLoading();
                    GlobalVar.CurMatchInfo = {roomId:this._matchList.get(this._curIcon.matchId).RoomId -1,playerCount:this._matchList.get(this._curIcon.matchId).PlayerCount,isHaiXuan:true,djs:0,cGamePlayerData:null};
                    GlobalVar.CurMatchIndex = this._curIndex;
                }
            }else if (this._turnList.get(this._curIcon.matchId)[i].ID>0)   // 非海选逻辑
            {
                if(nowTimer>=new Date(this._turnList.get(this._curIcon.matchId)[i].BeginTime).getTime() && nowTimer <=new Date(this._turnList.get(this._curIcon.matchId)[i].EndTime).getTime())
                {
                    LoadingManager.showLoading();
                    SocketEvent.addEventListener(Global.GR_RESPONE_ENTER_GAME_OK.toString(), this.enterGameHandler, this);
                    var sendData:egret.ByteArray = new egret.ByteArray();
                    sendData.endian = egret.Endian.LITTLE_ENDIAN;
                    sendData.writeInt(SystemCenter.playSystem.selfPlayerInfo.userID);
                    SQGameServer.getInstance().sendCmd(Global.SQR_ENTER_GAME, sendData);   // 为什么这里之前要填 0 ？
                }else
                {
                    if(this._matchStatus == "kebaoming")
                    {
                        PopUpManager.alert("系统消息","亲，请先去网站上报名。");
                    }else if(this._matchStatus != "hxjinxing")
                    {
                        PopUpManager.alert("系统消息","亲，比赛时间还未开始，请稍等");
                    }
                }
            }
        }
    }

    private enterGameHandler(e: SocketEvent = null): void {
        LoadingManager.hideLoading();
        SocketEvent.removeEventListener(Global.GR_RESPONE_ENTER_GAME_OK.toString(), this.enterGameHandler, this);
        if (!e.data.data) return;
        var b:egret.ByteArray = e.data.data;
        b.position = 0;
        b.endian = egret.Endian.LITTLE_ENDIAN;
        console.log("e.data.result :"+e.data.result )
        if (e.data.result == Global.UR_OPERATE_SUCCEEDED) {

            var djs:number = b.readInt();
            console.log("djs:" + djs)
            var _cGameStartSoloTable:CGameSOLOTABLE = new CGameSOLOTABLE();
            CSerializable.Deserialization(_cGameStartSoloTable, b);
            var _cGamePlayerData = new Array<CGamePlayerData>(4);
            for (var i:number = 0; i < 4; i++) {
                _cGamePlayerData[i] = new CGamePlayerData();
                CSerializable.Deserialization(_cGamePlayerData[i], b);
                console.log("nChairNO:" + _cGamePlayerData[i].GameData.nChairNO.value+"  nUserID:" + _cGamePlayerData[i].GameData.nUserID)
            }
            GlobalVar.CurMatchInfo = {roomId:this._matchList.get(this._curIcon.matchId).RoomId -1,
                playerCount:this._matchList.get(this._curIcon.matchId).PlayerCount,isHaiXuan:false,djs:djs,cGamePlayerData:_cGamePlayerData};
            SceneManager.getInstance().runWithScene(WaitScene);
        }
    }

    private enterRoomHandler(e: SocketEvent = null): void {
        LoadingManager.hideLoading();
        SocketEvent.removeEventListener(Global.SQR_ENTER_ROOM.toString(), this.enterRoomHandler, this);
        if (e.data.result == Global.UR_OPERATE_SUCCEEDED) {
            SceneManagerExt.goWaitScene();
        }
    }

    private listenerMessage():void
    {
        LoadingManager.showLoading();
        SocketEvent.addEventListener(Global.SQR_GET_ROOMINFO.toString(), this.getSecneRoomInfo, this);
        var sendData:egret.ByteArray = new egret.ByteArray();
        sendData.position = 0;
        sendData.endian = egret.Endian.LITTLE_ENDIAN;
        sendData.writeInt(SystemCenter.playSystem.selfPlayerInfo.GameData.nScene.value);
        //获取房间信息
        SQGameServer.getInstance().sendCmd(Global.SQR_GET_ROOMINFO, sendData);
    }

    private getSecneRoomInfo(e:SocketEvent):void {
        LoadingManager.hideLoading();
        SocketEvent.removeEventListener(Global.SQR_GET_ROOMINFO.toString(), this.getSecneRoomInfo, this);
        if (!e.data.data) return;
        if (e.data.requestData) {
            var sceneID:number = e.data.requestData.readInt();
            if (sceneID != Global.LS_SCENE_MATCH_NEW)
                return;
        }

        // sPropertyText = json     sOpenText = json(关于timer)
        var b:egret.ByteArray = e.data.data;
        b.position = 0
        if (e.data.positive) {
            var uid:number = SystemCenter.playSystem.selfPlayerInfo.userID;
            if (e.data.result == Global.UR_OPERATE_SUCCEEDED) {
                while (b.bytesAvailable) {
                    var cgameRoom:CGameRoom = new CGameRoom();
                    CSerializable.Deserialization(cgameRoom, b);
                    if (cgameRoom.nScene.value == Global.LS_SCENE_MATCH_NEW) {
                        var _enterText:Object = JSON.parse(cgameRoom.sPropertyText);
                        var matchInfo:MatchInfo = new MatchInfo();
                        matchInfo.BeginTurnInvokeMark= _enterText["BeginTurnInvokeMark"];
                        matchInfo.BeginTurnSuccessMark= _enterText["BeginTurnSuccessMark"];
                        matchInfo.BuildSeatInvokeMark= _enterText["BuildSeatInvokeMark"];
                        matchInfo.BuildSeatSuccessMark= _enterText["BuildSeatSuccessMark"];
                        matchInfo.CurTurnIndex= _enterText["CurTurnIndex"];
                        matchInfo.EndTurnInvokeMark= _enterText["EndTurnInvokeMark"];
                        matchInfo.EndTurnSuccessMark= _enterText["EndTurnSuccessMark"];
                        matchInfo.MatchID= _enterText["MatchID"];
                        matchInfo.MaxTurnIndex= _enterText["MaxTurnIndex"];
                        matchInfo.Ocean= _enterText["Ocean"];
                        matchInfo.OceanScoreType= _enterText["OceanScoreType"];
                        matchInfo.PlayerCount= _enterText["PlayerCount"];
                        matchInfo.ScoreType= _enterText["ScoreType"];
                        matchInfo.Status= _enterText["Status"];
                        matchInfo.Detail= _enterText["Detail"];
                        matchInfo.RoomId = cgameRoom.nRoomID.value;
                        matchInfo.RoomName = cgameRoom.sRoomName;
                        matchInfo.SignupTime = _enterText["SignupTime"];

                        //console.log("matchInfo.MatchID:"+matchInfo.MatchID+"  Ocean:"+matchInfo.Ocean+"  cgameRoom.nRoomID:"+cgameRoom.nRoomID.value);
                        if(matchInfo.Ocean ==0)  this._matchList.set(matchInfo.MatchID,matchInfo);

                        var _openDataText:Object = JSON.parse(cgameRoom.sOpenText);
                        var arr:Array<TurnInfo> = new Array<TurnInfo>();
                        for(var str in _openDataText)
                        {

                            var turnInfo:TurnInfo = new TurnInfo();
                            turnInfo.AccessType = _openDataText[str]["AccessType"];
                            turnInfo.AccessValue = _openDataText[str]["AccessValue"];
                            turnInfo.BeginTime = _openDataText[str]["BeginTime"];
                            turnInfo.EndTime = _openDataText[str]["EndTime"];
                            turnInfo.ID = _openDataText[str]["ID"];
                            turnInfo.MatchID = _openDataText[str]["MatchID"];
                            turnInfo.SigninMax = _openDataText[str]["SigninMax"];
                            turnInfo.Status = _openDataText[str]["Status"];
                            turnInfo.TurnIndex = _openDataText[str]["TurnIndex"];
                            arr.push(turnInfo)
                        }
                        this._turnList.set(matchInfo.MatchID,arr)
                    }
                }
                this.drawMatchIcon();
            }
        }
    }
    public setup():void {
        console.log("entryTransition");
    }

    public uninstall():void {
        //TransitionManager.getInstance().doTransi(this,TransitionManager.FALL_RIGH_DOWN,true);
        console.log("uninstall matchScene")
        this.destroy();
    }

    // 画出比赛的icon
    private _canIconMove:boolean=true;
    private checkMathIcon():void
    {
        //console.log("this._curIndex:"+this._curIndex)
        var itemRadian:number=360/this._iconTotal;
        if(this._curIndex>this._iconTotal) this._curIndex=0;
        for(var i=0;i<this._iconTotal;i++ ){
            var raius:number=itemRadian*(i-(this._curIndex+this._iconLenOff));
            var tx:number=Math.sin(raius*Math.PI/180)*this.radius+100;
            var ty:number=100-Math.cos(raius*Math.PI/180)*this.radius;
            if( i<this._matchIconContainer.numChildren)
            {
                var matchIconView:MatchIconView =  <MatchIconView>this._matchIconContainer.getChildAt(i);
                this._canIconMove = false;
                var dropShadowFliter:egret.GlowFilter = new egret.GlowFilter(0x000000,1,10,10);
                //matchIconView.filters = [dropShadowFliter];
                var self = this;
                TweenMax.to(matchIconView,.4,{scaleX:1,scaleY:1,x:tx,y:ty,onComplete:function():void{
                    self._canIconMove = true;
                    self._starIcon.visible=false;
                    self._startBtn.visible =true;
                }})
            }
        }
        self.showMatchInfo();
    }

    private showMatchInfo():void
    {
        //ParticleFactory.getInstance().createStar(600,new egret.Point(Math.random()*400+200,Math.random()*400+200))
        var icon:MatchIconView = <MatchIconView> this._matchIconContainer.getChildAt(this._curIndex+this._iconLenOff);
        if(icon)
        {
            this._curIcon = icon;
            TweenMax.to(this._curIcon,.2,{scaleX:1.1,scaleY:1.1});
            var dropShadowFliter:egret.GlowFilter = new egret.GlowFilter(0xffffff,1,14,14);
            //this._curIcon.filters = [dropShadowFliter];
            this._matchInfoTxt.text = icon.matchId+":"+this._matchList.get(icon.matchId).Detail;
            this._matchNameTxt.text = this._matchList.get(icon.matchId).RoomName;
//            this._curIcon.addChild(EcffectFactory.getInstance().createLightRound(Math.round(Math.random()*2+1)))
//            var mc:egret.MovieClip= EcffectFactory.getInstance().createHeLight()
//            mc.x = 200*Math.random()+200;
//            mc.y = 200*Math.random()+200;
//            this.addChild(mc)

            if(this._curIcon && this.rotationIndex == -1)
            {
                let func:Function = function(evt: egret.Event) {
                    var dx:number=this._curIcon.x -  this._starIcon.x;
                    var dy:number=this._curIcon.y - this._starIcon.y ;
                    var radians:number=Math.atan2(dy,dx);
                    this._starIcon.rotation = (radians*180/Math.PI-7.6)*6;
                };
                this.rotationIndex = MainLoopManager.addCallBack(func,this)
            }
        }
    }
    private rotationIndex:number=-1;

    private iconRightMove(e:egret.TouchEvent):void
    {
        if(!this._canIconMove) return;
        if(this._curIndex<=-this._iconLenOff) return;
        this._curIndex --;
        this._starIcon.visible=true;
        this._startBtn.visible =false;
        this.checkMathIcon();
    }

    private iconLeftMove(e:egret.TouchEvent):void
    {
        if(!this._canIconMove) return;
        if(this._curIndex>=((this._totalLen-1)-this._iconLenOff)) return;
        this._curIndex ++;
        this._starIcon.visible=true;
        this._startBtn.visible =false;
        this.checkMathIcon();
    }

    private checkMatchState(matchIconView:MatchIconView):void
    {
        if(!this._curIcon) return;
        var isHaveState:boolean=false;
        var matchInfo:MatchInfo = this._matchList.get(matchIconView.matchId);
        //console.log("matchIconView:"+matchIconView.matchId+"  Status:"+this._matchList.get(matchIconView.matchId).Status)
        var nowTimer:number = GlobalVar.ServerLocalDateOff+new Date().getTime()

        if(matchInfo.Status >=200 )
        {
            matchIconView.showState("jishu")
            this._startBtn.getBitmap().texture = RES.getRes("match.chakan");
            this._starIcon.texture = RES.getRes("match.chakan");
            isHaveState = true;
            this._matchStatus = "jieshu";
        }else
        {
            var i:number = 0;
            var l:number = this._turnList.get(matchIconView.matchId).length;
            var j:number=0;
            var isSignUp:boolean = false;

            var signUpTime:number = new Date(matchInfo.SignupTime).getTime();
            //console.log("nowTimer:"+nowTimer+" signUpTime:"+matchInfo.SignupTime+"   signUpTime2:"+signUpTime)
            if(nowTimer < signUpTime)
            {
                // 可以报名的时间段
                for(j=0;j<SystemCenter.playSystem.selfPlayerInfo.MatchNewData.vmnsu.getLen();j++)
                {
                    if(matchIconView.matchId == SystemCenter.playSystem.selfPlayerInfo.MatchNewData.vmnsu.getAt(j).nMatchID.value)
                    {
                        isSignUp = true;
                    }
                }
                //console.log("isSignUp:"+isSignUp)
                if(isSignUp)   //已报名
                {
                    matchIconView.showState("yibaoming");
                    isHaveState = true;
                    if(this._curIcon.matchId == matchIconView.matchId)
                    {
                        this._matchStatus = "yibaoming";
                        this.showDjs(signUpTime, nowTimer);
                        this._startBtn.getBitmap().texture = RES.getRes("match.kaishi");
                        this._starIcon.texture = RES.getRes("match.kaishi");
                    }
                }else
                {
                    matchIconView.showState("kebaoming")
                    isHaveState = true;
                    if(this._curIcon.matchId == matchIconView.matchId) {
                        this._matchStatus = "kebaoming";
                        this.showDjs(signUpTime, nowTimer);
                        this._startBtn.getBitmap().texture = RES.getRes("match.baoming");
                        this._starIcon.texture = RES.getRes("match.baoming");
                    }
                }
            }else
            {
                for(i=0;i<l;i++)
                {
                    if (this._turnList.get(matchIconView.matchId)[i].ID == 0)  // 如果是无效轮次，跳过
                    {
                        continue;
                    }
                    if(nowTimer>=new Date(this._turnList.get(matchIconView.matchId)[i].BeginTime).getTime() && nowTimer <=new Date(this._turnList.get(matchIconView.matchId)[i].EndTime).getTime())
                    {
                        if(this._turnList.get(matchIconView.matchId)[i].TurnIndex == 0)  // 这里是海选
                        {
                            matchIconView.showState("jinxing");
                            isHaveState = true;
                            if(this._curIcon.matchId == matchIconView.matchId) {
                                this._matchStatus = "hxjinxing";
                                this._startBtn.getBitmap().texture = RES.getRes("match.kaishi");
                                this.showDjs(new Date(this._turnList.get(matchIconView.matchId)[i+1].BeginTime).getTime(),nowTimer);
                                this._starIcon.texture = RES.getRes("match.kaishi");
                            }
                        }else               // 正式对阵
                        {
                            if(nowTimer < new Date(this._turnList.get(matchIconView.matchId)[i].BeginTime).getTime()+GlobalVar.MatchSigninLastTime*1000)
                            {
                                // 签到时间段
//                               GBMJ_MATCHNEW_SIGNIN_STATUS_APPLY  =0,
//                                GBMJ_MATCHNEW_SIGNIN_STATUS_END    =200,
//                                console.log("this._turnList.get(matchIconView.matchId)[i].ID:"+this._turnList.get(matchIconView.matchId)[i].ID)
//                                console.log("SystemCenter.playSystem.selfPlayerInfo.MatchNewData.mnsi.nTurnID.value:"+SystemCenter.playSystem.selfPlayerInfo.MatchNewData.mnsi.nTurnID.value)
                                if(SystemCenter.playSystem.selfPlayerInfo.MatchNewData.mnsi.nTurnID.value ==0)
                                {
                                    // 可签到状态  - 因为没有签到过
                                    //console.log("weiqiandao")
                                    matchIconView.showState("weiqiandao");
                                    isHaveState = true;
                                    if(this._curIcon.matchId == matchIconView.matchId) {
                                        this._matchStatus = "weiqiandao";
                                        this._startBtn.getBitmap().texture = RES.getRes("match.qiandao");
                                        this._starIcon.texture = RES.getRes("match.qiandao");
                                        this.showDjs(new Date(this._turnList.get(matchIconView.matchId)[i+1].BeginTime).getTime(),nowTimer);
                                    }
                                }else if(this._turnList.get(matchIconView.matchId)[i].ID == SystemCenter.playSystem.selfPlayerInfo.MatchNewData.mnsi.nTurnID.value)
                                {
                                    // 当前轮次已经签到过
                                    //console.log("yiqiandao")
                                    matchIconView.showState("yiqiandao");
                                    isHaveState = true;
                                    if(this._curIcon.matchId == matchIconView.matchId) {
                                        this._matchStatus = "yiqiandao";
                                        this._startBtn.getBitmap().texture = RES.getRes("match.kaishi");
                                        this._starIcon.texture = RES.getRes("match.kaishi");
                                        this.showDjs(new Date(this._turnList.get(matchIconView.matchId)[i+1].BeginTime).getTime()+GlobalVar.MatchSigninLastTime*1000+GlobalVar.MatchSeatLastTime*1000,nowTimer);
                                    }
                                }else
                                {
                                    // 开始比赛状态
                                    matchIconView.showState("jinxing");
                                    isHaveState = true;
                                    if(this._curIcon.matchId == matchIconView.matchId) {
                                        this._matchStatus = "jinxing";
                                        this._startBtn.getBitmap().texture = RES.getRes("match.kaishi");
                                        this._starIcon.texture = RES.getRes("match.kaishi");
                                    }
                                }
                            }else
                            {
                                // 开始比赛状态
                                matchIconView.showState("jinxing");
                                isHaveState = true;
                                if(this._curIcon.matchId == matchIconView.matchId) {
                                    this._startBtn.getBitmap().texture = RES.getRes("match.kaishi");
                                    this._starIcon.texture = RES.getRes("match.kaishi");
                                }
                            }
                        }
                        break;
                    }else    //如果比赛没有开始
                    {
                        if(  nowTimer>=new Date(this._turnList.get(matchIconView.matchId)[i].BeginTime).getTime())  // 如果比赛没有开始
                        {
                            if(this._turnList.get(matchIconView.matchId)[i].TurnIndex == 0)  // 这里是海选
                            {
                                matchIconView.showState("jinxing");
                                isHaveState = true;
                                if(this._curIcon.matchId == matchIconView.matchId) {
                                    this._matchStatus = "hxjinxing";
                                    this._startBtn.getBitmap().texture = RES.getRes("match.kaishi");
                                    this._starIcon.texture = RES.getRes("match.kaishi");
                                    this.showDjs(new Date(this._turnList.get(matchIconView.matchId)[i].BeginTime).getTime(), nowTimer);
                                }
                            }
                        }
                    }
                }
            }
        }
        if(!isHaveState)
        {
            this._startBtn.getBitmap().texture = RES.getRes("match.kaishi");
            this._starIcon.texture = RES.getRes("match.kaishi");
            matchIconView.showState("jinxing");
        }

    }

    /**
     * 显示倒计时
     */
    private showDjs(value:number,nowTime:number):void
    {
        var djs = Math.round(value - nowTime)/1000;
        //console.log("djs:"+djs+"    value - "+ TimeUtil.getColonTimeStr(value)+"  nowTimer - "+ TimeUtil.getColonTimeStr(nowTime));
        if(this._matchStatus == "kebaoming")
        {
            this._txtDjs.text = "离报名截止还有:" +TimeUtil.getColonTimeStr(djs);
        }else if(this._matchStatus == "hxjinxing")
        {
            this._txtDjs.text = "离海选开始:" +TimeUtil.getColonTimeStr(djs);
        }else if (this._matchStatus == "jinxing")
        {
            this._txtDjs.text = "";
        }else if (this._matchStatus == "yibaoming")
        {
            this._txtDjs.text = "离比赛开始:"+TimeUtil.getColonTimeStr(djs);
        }
    }

    private drawMatchIcon():void
    {
        this._totalLen = this._matchList.size;
        if(this._totalLen>this._iconTotal) this._totalLen=this._iconTotal;
        if(this._matchIconContainer.numChildren==1) this._curIndex=-2;
        if(this._matchIconContainer.numChildren==2) this._curIndex=-1;
        var self = this;
        self._matchIconContainer.x = this.radius*.5+142;
        self._matchIconContainer.y = LayerManager.stage.stageHeight+this.radius*.5-86;

        var matchList:HashMap<number,MatchInfo> = this._matchList;
        var i:number=0;
        matchList.forEach(function(value, key){
            var matchIconView:MatchIconView = new MatchIconView();
            matchIconView.matchId = matchList.getKey(i);
            matchIconView._txtName.text = matchList.get(matchIconView.matchId).RoomName;
            var dropShadowFliter:egret.GlowFilter = new egret.GlowFilter(0x000000,1,10,10);
            //matchIconView.filters = [dropShadowFliter];
            //matchIconView.showState("kaishi-1");
            self._matchIconContainer.addChild(matchIconView);
            self.checkMatchState(matchIconView);
            i++;
        })

        var itemRadian:number=360/this._iconTotal;
        for(var i=0;i<this._iconTotal;i++ ){
            var raius:number=itemRadian*(i-(this._curIndex+this._iconLenOff));
            var x=Math.sin(raius*Math.PI/180)*this.radius+100;
            var y=100-Math.cos(raius*Math.PI/180)*this.radius;
            if( i<self._matchIconContainer.numChildren)
            {
                var matchIconView:MatchIconView =  <MatchIconView>self._matchIconContainer.getChildAt(i);
                matchIconView.showIndex = i-this._iconLenOff;
                matchIconView.x = x;
                matchIconView.y = y;
            }
        }
        this.showMatchInfo();
    }

    private onBackHandler(e:egret.TouchEvent):void {
        LoadingManager.showLoading();
        var _scene:number = SystemCenter.playSystem.selfPlayerInfo.GameData.nScene.value;
        SocketEvent.addEventListener(Global.LSR_LEAVE_SCENE.toString(), this.leaveSceneHandler, this);

        var sendData:egret.ByteArray = new egret.ByteArray();
        var cLeaveLSScene:LS_LEAVE_SCENE = new LS_LEAVE_SCENE();
        cLeaveLSScene.nUserID.value = SystemCenter.playSystem.selfPlayerInfo.userID;
        cLeaveLSScene.nScene.value = _scene;
        CSerializable.Serialization(cLeaveLSScene, sendData);
        SQGameServer.getInstance().sendCmd(Global.LSR_LEAVE_SCENE, sendData);

    }

    private leaveSceneHandler(e:SocketEvent):void {
        LoadingManager.hideLoading();
        if (!e.data.data) return;
        var b:egret.ByteArray = e.data.data;
        SocketEvent.removeEventListener(Global.LSR_LEAVE_SCENE.toString(), this.leaveSceneHandler, this);
        GlobalVar.CurMatchIndex = -1;
        if (e.data.result == Global.UR_OPERATE_SUCCEEDED) {
            SceneManager.getInstance().popScene();
            SceneManager.getInstance().pushScene(MainScene,TransitionManager.FADE_IN);
        }
    }

    private checkMatchIconStateHandler(e:egret.Timer):void
    {
        if(this._matchIconContainer.numChildren<=0) return;
        var i:number=0;
        for(i=0;i<this._matchIconContainer.numChildren;i++)
        {
            this.checkMatchState(<MatchIconView>this._matchIconContainer.getChildAt(i));
        }
    }

    public destroy():void {
        if(this._matchTimer)
        {
            this._matchTimer.removeEventListener(egret.TimerEvent.TIMER,this.checkMatchIconStateHandler,this);
            this._matchTimer = null;
        }
        if(this.rotationIndex != -1) MainLoopManager.removeCallBack(this.rotationIndex);
        if (this._bg) {
            DisplayObjectUtil.removeForParent(this._bg);
            this._bg = null;
        }
        if (this._backBtn) {
            this._backBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onBackHandler, this);
            DisplayObjectUtil.removeForParent(this._backBtn);
            this._backBtn = null;
        }
        if (this._bottomLine) {
            DisplayObjectUtil.removeForParent(this._bottomLine);
            this._bottomLine = null;
        }
//        if (this._matchIconMask) {
//            DisplayObjectUtil.removeForParent(this._matchIconMask);
//            this._matchIconMask = null;
//        }
        if (this._matchIconContainer) {
            DisplayObjectUtil.removeForParent(this._matchIconContainer);
            this._matchIconContainer = null;
        }
        if(this._curIcon) this._curIcon = null;
        if(this._matchList) this._matchList = null;
        if(this._turnList) this._turnList = null;

        SocketEvent.removeEventListener(Global.GBMJR_MATCHNEW_ENTERROOM.toString(), this.enterRoomHandler, this);
        SocketEvent.removeEventListener(Global.SQR_GET_ROOMINFO.toString(), this.getSecneRoomInfo, this);
        this.removeChildren();
        DisplayObjectUtil.removeForParent(this);
    }
}