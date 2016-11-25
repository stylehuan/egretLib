/**
 * Created by seethinks@gmail.com on 2016/8/3.
 */
class MatchIconView extends egret.Sprite {
    private data:Object;

    public showIndex:number;
    public matchId:number;
    public _txtName:egret.TextField;
    private _icon:egret.Bitmap;
    private _bg:egret.Bitmap;

    private _jinIcon:egret.Bitmap;
    private _yinIcon:egret.Bitmap;

    private _stateIcon:egret.Bitmap;

    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addedToStageHandler, this);


        mouse.setButtonMode(this, true);

        if(this._icon == null)
        {
            this._icon = new egret.Bitmap();
            this._icon.x = 14;
            this._icon.y = 12;
            this._icon.texture = RES.getRes("match.kuangdi");
            this._icon.scaleX = this._icon.scaleY = .86;
            this.addChild(this._icon)
        }

        if(this._bg == null)
        {
            this._bg = new egret.Bitmap();
            this._bg.texture = RES.getRes("match.matchIconBg");
            this._bg.scaleX = this._bg.scaleY = .86;
            this.addChild(this._bg);
        }

        //this._txt = new egret.TextField();
        //this._txt.text="0"
        this.anchorOffsetX = this._bg.width*.5;
        this.anchorOffsetY = this._bg.height*.5;

        if(this._jinIcon == null)
        {
            this._jinIcon = new egret.Bitmap();
            this._jinIcon.texture = RES.getRes("match.jin");
            this.addChild(this._jinIcon);
        }
        if(this._yinIcon == null)
        {
            this._yinIcon = new egret.Bitmap();
            this._yinIcon.texture = RES.getRes("match.yin");
            this.addChild(this._yinIcon);
        }
        if(this._txtName == null)
        {
            this._txtName = new egret.TextField();
            this._txtName.width = 110;
            this._txtName.x = 5;
            this._txtName.size = UIAdapter.getInstance().isPC?14:24;
            this._txtName.y = 97;
            this._txtName.textAlign = "center"
            this.addChild(this._txtName)
        }
        if(this._stateIcon == null)
        {
            this._stateIcon =new egret.Bitmap();
            this._stateIcon.texture = RES.getRes("match.kebaoming")
            this._stateIcon.x = 42;
            this._stateIcon.y = 118;
            this.addChild(this._stateIcon)
        }
        //this.addChild(this._txt);

    }


    public draw():void {

    }


    public showState(str:string):void
    {
       if(this._stateIcon) this._stateIcon.texture = RES.getRes("match."+str)
    }

    private addedToStageHandler(e:Event):void {
        this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.addedToStageHandler, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.removedFromStageHandler, this);
    }

    private removedFromStageHandler(e:Event):void {
        this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.removedFromStageHandler, this);
        this.destroy();
    }


    public destroy():void {
        if (this.data != null) this.data = null;
        if(this._icon != null)
        {
            DisplayObjectUtil.removeForParent(this._icon);
            this._icon = null;
        }
        if(this._bg != null)
        {
            DisplayObjectUtil.removeForParent(this._bg);
            this._bg = null;
        }
        if(this._stateIcon != null)
        {
            DisplayObjectUtil.removeForParent(this._stateIcon);
            this._stateIcon = null;
        }

        this.removeChildren();
    }
}