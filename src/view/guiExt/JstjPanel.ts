/**
 * Created by seethinks@gmail.com on 2016/9/12.
 */
class JstjPanel extends egret.DisplayObjectContainer{
    private _bg:egret.Bitmap;

    public txt_nameLevel:SQ.STTextField;

    public mc_centerPoint:egret.DisplayObjectContainer;
    public mc_hpPoint:egret.DisplayObjectContainer;
    public mc_hxPoint:egret.DisplayObjectContainer;
    public mc_dpPoint:egret.DisplayObjectContainer;
    public mc_hfPoint:egret.DisplayObjectContainer;
    public mc_zmPoint:egret.DisplayObjectContainer;

    public txt_ywl:SQ.STTextField;
    public txt_ewl:SQ.STTextField;
    public txt_swl:SQ.STTextField;
    public txt_siwl:SQ.STTextField;

    public txt_fll:SQ.STTextField;
    public txt_zdf:SQ.STTextField;
    public txt_tpl:SQ.STTextField;
    public txt_chl:SQ.STTextField;
    public txt_hpl:SQ.STTextField;
    public txt_zml:SQ.STTextField;
    public txt_dpl:SQ.STTextField;

    public txt_totalBouts:SQ.STTextField;


    public constructor()
    {
        super();
        if(!this._bg)
        {
            this._bg = new egret.Bitmap();
            this._bg.texture = RES.getRes("mainSprite.jstj_bg");
            this.addChild(this._bg);
        }

        if(!this.txt_nameLevel)
        {
            this.txt_nameLevel = new SQ.STTextField();
            this.txt_nameLevel.width = 220;
            this.txt_nameLevel.textAlign = "center";
            this.txt_nameLevel.x = 266;
            this.txt_nameLevel.y = 51;
            this.txt_nameLevel.textColor = 0x4a1e01;
            var str:string = SystemCenter.playSystem.selfPlayerInfo.playerName+" ● ";
            if(SystemCenter.playSystem.selfPlayerInfo.fourAnimalLabel !=0)
            {
                str +=  FourAnimalData.getTite(SystemCenter.playSystem.selfPlayerInfo.fourAnimalLabel)+"."+LevelInfo.getLevelName(SystemCenter.playSystem.selfPlayerInfo.levelID);
                this.txt_nameLevel.text = str;
            }else
            {
               // this.txt_nameLevel.text = SystemCenter.playSystem.selfPlayerInfo..nLevelScore+"/"+LevelInfo.getLevelUpgradeScore(SystemCenter.playSystem.selfPlayerInfo.levelID) + " " +LevelInfo.getLevelName(SystemCenter.playSystem.selfPlayerInfo.levelID);
                this.txt_nameLevel.text = str;
            }
            this.addChild(this.txt_nameLevel);
        }

        if(!this.mc_centerPoint)
        {
            this.mc_centerPoint = new egret.DisplayObjectContainer();
            this.mc_centerPoint.x = 134.45;
            this.mc_centerPoint.y = 151.5;
            this.addChild(this.mc_centerPoint)
        }
        if(!this.mc_hpPoint)
        {
            this.mc_hpPoint = new egret.DisplayObjectContainer();
            this.mc_hpPoint.x = 132.45;
            this.mc_hpPoint.y = 69;
            this.addChild(this.mc_hpPoint)
        }
        if(!this.mc_hxPoint)
        {
            this.mc_hxPoint = new egret.DisplayObjectContainer();
            this.mc_hxPoint.x = 209.95;
            this.mc_hxPoint.y = 126;
            this.addChild(this.mc_hxPoint)
        }
        if(!this.mc_dpPoint)
        {
            this.mc_dpPoint = new egret.DisplayObjectContainer();
            this.mc_dpPoint.x = 83.95;
            this.mc_dpPoint.y = 213.5;
            this.addChild(this.mc_dpPoint)
        }
        if(!this.mc_hfPoint)
        {
            this.mc_hfPoint = new egret.DisplayObjectContainer();
            this.mc_hfPoint.x = 180.45;
            this.mc_hfPoint.y = 214.5;
            this.addChild(this.mc_hfPoint)
        }
        if(!this.mc_zmPoint)
        {
            this.mc_zmPoint = new egret.DisplayObjectContainer();
            this.mc_zmPoint.x = 58.45;
            this.mc_zmPoint.y = 128.5;
            this.addChild(this.mc_zmPoint)
        }

        if(!this.txt_ywl)
        {
            this.txt_ywl = new SQ.STTextField();
            this.txt_ywl.x = 322.6;
            this.txt_ywl.y = 92.05;
            this.txt_ywl.textColor = 0x066f01;
            this.addChild(this.txt_ywl);
        }

        if(!this.txt_ewl)
        {
            this.txt_ewl = new SQ.STTextField();
            this.txt_ewl.x = 437.6;
            this.txt_ewl.y = 92.05;
            this.txt_ewl.textColor = 0x066f01;
            this.addChild(this.txt_ewl);
        }

        if(!this.txt_swl)
        {
            this.txt_swl = new SQ.STTextField();
            this.txt_swl.x = 322.6;
            this.txt_swl.y = 115.05;
            this.txt_swl.textColor = 0x066f01;
            this.addChild(this.txt_swl);
        }

        if(!this.txt_siwl)
        {
            this.txt_siwl = new SQ.STTextField();
            this.txt_siwl.x = 437.6;
            this.txt_siwl.y = 115.05;
            this.txt_siwl.textColor = 0x066f01;
            this.addChild(this.txt_siwl);
        }

        if(!this.txt_hpl)
        {
            this.txt_hpl = new SQ.STTextField();
            this.txt_hpl.x = 322.6;
            this.txt_hpl.y = 150.05;
            this.txt_hpl.textColor = 0x066f01;
            this.addChild(this.txt_hpl);
        }

        if(!this.txt_zml)
        {
            this.txt_zml = new SQ.STTextField();
            this.txt_zml.x = 437.6;
            this.txt_zml.y = 150.5;
            this.txt_zml.textColor = 0x066f01;
            this.addChild(this.txt_zml);
        }

        if(!this.txt_dpl)
        {
            this.txt_dpl = new SQ.STTextField();
            this.txt_dpl.x = 322.6;
            this.txt_dpl.y = 173.05;
            this.txt_dpl.textColor = 0x066f01;
            this.addChild(this.txt_dpl);
        }

        if(!this.txt_chl)
        {
            this.txt_chl = new SQ.STTextField();
            this.txt_chl.x = 437.6;
            this.txt_chl.y = 173.05;
            this.txt_chl.textColor = 0x066f01;
            this.addChild(this.txt_chl);
        }

        if(!this.txt_fll)
        {
            this.txt_fll = new SQ.STTextField();
            this.txt_fll.x = 322.6;
            this.txt_fll.y = 208.05;
            this.txt_fll.textColor = 0x066f01;
            this.addChild(this.txt_fll);
        }

        if(!this.txt_zdf)
        {
            this.txt_zdf = new SQ.STTextField();
            this.txt_zdf.x = 437.6;
            this.txt_zdf.y = 208.05;
            this.txt_zdf.textColor = 0x066f01;
            this.addChild(this.txt_zdf);
        }

        if(!this.txt_tpl)
        {
            this.txt_tpl = new SQ.STTextField();
            this.txt_tpl.x = 322.6;
            this.txt_tpl.y = 230.05;
            this.txt_tpl.textColor = 0x066f01;
            this.addChild(this.txt_tpl);
        }

        if(!this.txt_totalBouts)
        {
            this.txt_totalBouts = new SQ.STTextField();
            this.txt_totalBouts.x = 437.6;
            this.txt_totalBouts.y = 230.05;
            this.txt_totalBouts.textColor = 0x066f01;
            this.addChild(this.txt_totalBouts);
        }
    }
}