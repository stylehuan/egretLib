/**
 * Created by stylehuan on 2016/7/19.
 */
class CardAnimation extends egret.Sprite {

    private id:number;

    public constructor(id:number) {
        super();
        this.id = id;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addedToStageHandler, this);
        this.initView();
    }

    private addedToStageHandler(e:Event):void {
        this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.addedToStageHandler, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.removedFromStageHandler, this);
    }

    private mc_1:egret.Bitmap;
    private mc_2:egret.Bitmap;
    private mc_3:egret.Bitmap;
    private cardNum:egret.Bitmap;

    private initView():void {
        this.mc_1 = new egret.Bitmap();
        this.mc_1.texture = RES.getRes("paibei1.png");
        this.addChild(this.mc_1);

        this.mc_2 = new egret.Bitmap();
        this.mc_2.texture = RES.getRes("paibei2.png");
        this.addChild(this.mc_2);
        this.mc_2.y = this.mc_1.height * .5 - this.mc_2.height * .5;

        this.mc_3 = new egret.Bitmap();
        this.mc_3.texture = RES.getRes("paimian.png");
        this.addChild(this.mc_3);

        var bmdName = CardData.getCardName(this.id);
        this.cardNum = new egret.Bitmap();
        this.cardNum.texture = RES.getRes("cards." + bmdName);
        this.cardNum.y = -2;
        this.cardNum.x = -1;
        this.cardNum.scaleX = this.cardNum.scaleY = 0.35;
        this.addChild(this.cardNum);

        this.cardNum.visible = false;

        this.close();
    }

    private timer:egret.Timer;

    public running():void {
        //����һ����ʱ������
        this.timer = new egret.Timer(100);
        //ע���¼�������
        this.timer.addEventListener(egret.TimerEvent.TIMER, this.timerRunFunc, this);
        this.timer.start();

        this.mc_1.visible = false;
        this.mc_2.visible = false;
        this.mc_3.visible = true;
        this.cardNum.visible = true;
    }

    public open():void {
        if (this.timer) {
            this.timer.removeEventListener(egret.TimerEvent.TIMER, this.timerRunFunc, this);
            this.timer.stop();
            this.timer = null;
        }

        this.mc_1.visible = false;
        this.mc_2.visible = false;
        this.mc_3.visible = true;
        this.cardNum.visible = true;
    }

    public close():void {
        this.mc_1.visible = true;
        this.mc_2.visible = false;
        this.mc_3.visible = false;
        this.cardNum.visible = false;
    }

    private count:number = 0;

    private timerRunFunc():void {
        this.mc_1.visible = false;
        this.mc_2.visible = false;
        this.mc_3.visible = false;
        this.cardNum.visible = false;

        if (this.count % 3 == 0) {
            this.mc_1.visible = true;
        } else if (this.count % 3 == 1) {
            this.mc_2.visible = true;
        } else {
            this.mc_3.visible = true;
            this.cardNum.visible = true;
        }
        this.count += 1;
    }

    private removedFromStageHandler(e:Event):void {
        this.destroy();
    }

    public destroy():void {
        if (this.mc_1) {
            DisplayObjectUtil.removeForParent(this.mc_1)
            this.mc_1 = null;
        }

        if (this.mc_2) {
            DisplayObjectUtil.removeForParent(this.mc_2);
            this.mc_2 = null;
        }

        if (this.mc_3) {
            DisplayObjectUtil.removeForParent(this.mc_3);
            this.mc_3 = null;
        }
        if (this.timer) {
            this.timer.removeEventListener(egret.TimerEvent.TIMER, this.timerRunFunc, this);
            this.timer.stop();
            this.timer = null;
        }
    }
}