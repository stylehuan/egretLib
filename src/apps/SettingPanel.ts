/**
 * Created by stylehuan on 2016/11/16.
 */
class SettingPanel extends SceneBase {
    public constructor() {
        super();
    }

    private _panel: SQ.AppPanel;
    resGroup: string;

    private soundOffBgm: SQ.CheckBox;
    private soundOffGgm: SQ.CheckBox;
    private slideBgm: eui.HSlider;
    private slideGgm: eui.HSlider;

    private bgmDefaultV: number = 70;
    private ggmDefaultV: number = 70;

    public initial(): void {
        if (this._panel) {
            this.draw();
            this._panel.init(430, 240);
        }
    }

    public setup(): void {
        var title = GUIFactory.getInstance().cAppTitle("app.sitting_title");
        var closeBtn: SQ.Button = GUIFactory.getInstance().cAppCloseIcon();
        this._panel = new SQ.AppPanel("components.app_bg", title, closeBtn);
        this.addChild(this._panel);

        var mask: egret.Bitmap = GUIFactory.getInstance().createMaskLayer();
        this.addChild(mask);

        var _exitBgmVolume: string = StorageManager.getLocalStorage(StorageManager.bgmVolume);
        var _exitGgmVolume: string = StorageManager.getLocalStorage(StorageManager.ggmVolume);

        if (_exitBgmVolume) {
            this.bgmDefaultV = parseInt(_exitBgmVolume, 10);
        }

        if (_exitGgmVolume) {
            this.ggmDefaultV = parseInt(_exitGgmVolume, 10);
        }
    }

    public uninstall(): void {
        this.destroy();
        DisplayObjectUtil.removeAllChild(this);
        DisplayObjectUtil.removeForParent(this);
    }


    public destroy(): void {

    }

    private draw(): void {
        // var exml =
        //     `<e:Skin minWidth="20" minHeight="8"  xmlns:e="http://ns.egret.com/eui">
        //         <e:Image id="track" source="resource/slider/track.png" scale9Grid="1,1,4,4" width="100%" height="6" verticalCenter="0"/>
        //         <e:Image id="trackHighlight" source="resource/slider/tracklight.png" scale9Grid="1,1,4,4" height="6" verticalCenter="0"/>
        //         <e:Image id="thumb" source="resource/slider/thumb.png" verticalCenter="0"/>
        //     </e:Skin>`;

        var changeUserLabel: SQ.STTextField = new SQ.STTextField();
        changeUserLabel.text = "切换帐号";
        changeUserLabel.textColor = 0x4C2814;
        changeUserLabel.bold = true;
        changeUserLabel.x = 315;
        changeUserLabel.y = 36;
        changeUserLabel.touchEnabled = true;
        this._panel.addChild(changeUserLabel);
        changeUserLabel.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onChangeUserHandler, this);


        var bMgLabel: SQ.STTextField = new SQ.STTextField();
        bMgLabel.text = "背景音效";
        bMgLabel.textColor = 0x4C2814;
        bMgLabel.bold = true;
        bMgLabel.x = 70;
        bMgLabel.y = 55;
        this._panel.addChild(bMgLabel);

        this.slideBgm = new eui.HSlider();
        this.slideBgm.width = 230;
        this.slideBgm.maximum = 100;
        this.slideBgm.horizontalCenter = 0;
        this.slideBgm.verticalCenter = 0;
        // ///监听 CHANGE 事件
        this.slideBgm.addEventListener(egret.Event.CHANGE, this.onBgmHSliderChange, this);
        this.slideBgm.x = bMgLabel.x;
        this.slideBgm.y = bMgLabel.y + bMgLabel.height + 10;
        this._panel.addChild(this.slideBgm);


        this.soundOffBgm = new SQ.CheckBox("静音", "components.checkbox_1", "components.checkbox_2", "components.checkbox_2");
        this.soundOffBgm.setPostion(this.slideBgm.x + this.slideBgm.width + 10, this.slideBgm.y - 5);
        this.soundOffBgm.setSelect(false);
        this._panel.addChild(this.soundOffBgm);
        this.soundOffBgm.addEventListener(egret.TouchEvent.TOUCH_TAP, this.bSoundOffHandler, this);


        var gMgLabel: SQ.STTextField = new SQ.STTextField();
        gMgLabel.text = "游戏音效";
        gMgLabel.textColor = 0x4C2814;
        gMgLabel.bold = true;
        gMgLabel.x = 70;
        gMgLabel.y = this.slideBgm.y + this.slideBgm.height + 30;
        this._panel.addChild(gMgLabel);


        this.slideGgm = new eui.HSlider();
        this.slideGgm.width = 230;
        this.slideGgm.maximum = 100;
        this.slideGgm.horizontalCenter = 0;
        this.slideGgm.verticalCenter = 0;
        this.slideGgm.pendingValue = 10;
        ///监听 CHANGE 事件
        this.slideGgm.addEventListener(egret.Event.CHANGE, this.onGgmHSliderChange, this);

        // this._hSlider = hSlilder;
        this.slideGgm.x = gMgLabel.x;
        this.slideGgm.y = gMgLabel.y + gMgLabel.height + 10;
        this._panel.addChild(this.slideGgm);

        this.soundOffGgm = new SQ.CheckBox("静音", "components.checkbox_1", "components.checkbox_2", "components.checkbox_2");
        this.soundOffGgm.setPostion(this.slideGgm.x + this.slideGgm.width + 10, this.slideGgm.y - 5);
        this.soundOffGgm.setSelect(false);
        this._panel.addChild(this.soundOffGgm);
        this.soundOffGgm.addEventListener(egret.TouchEvent.TOUCH_TAP, this.gSoundOffHandler, this);

        var self = this;
        this._timer = egret.setTimeout(function () {
            self.slideGgm.pendingValue = this.ggmDefaultV;
            self.slideBgm.pendingValue = this.bgmDefaultV;
            self.changeBgmValue();
            self.changeGgmValue();
        }, this, 1000);
    }

    private _timer: number;

    private onBgmHSliderChange(e: egret.Event) {
        var slilder = <eui.HSlider>e.target;
        this.changeBgmValue();
    }

    private onGgmHSliderChange(e: egret.Event) {
        var slilder = <eui.HSlider>e.target;
        this.changeGgmValue();
    }

    private onChangeUserHandler(e: egret.Event): void {
        StorageManager.removeLocalStorage(StorageManager.USER_SIGN);
        SceneManagerExt.goLoginScene();
    }

    private changeBgmValue(): void {
        var _b: boolean = this.slideBgm.pendingValue == 0 ? true : false;
        this.soundOffBgm.setSelect(_b);

        StorageManager.addLocalStorage(StorageManager.bgmVolume, this.slideBgm.pendingValue + "");
        SoundManager.getInstance().setBgVolume(this.slideBgm.pendingValue / 100);
    }

    private changeGgmValue(): void {
        var _b: boolean = this.slideGgm.pendingValue == 0 ? true : false;
        this.soundOffGgm.setSelect(_b);

        StorageManager.addLocalStorage(StorageManager.ggmVolume, this.slideGgm.pendingValue + "");
        SoundManager.getInstance().setEffectVolume(this.slideGgm.pendingValue / 100);
    }

    private bSoundOffHandler(e: SQ.GuiEvent): void {
        this.slideBgm.pendingValue = this.soundOffBgm.isSelect ? 0 : this.bgmDefaultV;

        this.changeBgmValue();
    }

    private gSoundOffHandler(e: SQ.GuiEvent): void {
        this.slideGgm.pendingValue = this.soundOffGgm.isSelect ? 0 : this.ggmDefaultV;

        this.changeGgmValue();
    }

    // private onVSLiderChange(e:egret.Event) {
    //     var slilder = <eui.HSlider>e.target;
    //     var hSlider = this._hSlider;
    //     var info = this._info;
    //     var scale = slilder.pendingValue / hSlider.maximum;
    //     hSlider.maximum = slilder.pendingValue;
    //     hSlider.value *= scale;
    //     info.text = "设置水平滑块的最大值为" + slilder.pendingValue;
    // }
}