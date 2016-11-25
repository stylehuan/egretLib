/**
 * Created by stylehuan on 2016/8/10.
 */

class DeskUserPanel extends egret.Sprite {
    private nDir: number;
    private _userId: number;
    private _userName: string;
    private _score: number;
    private _levelId: number;
    private _fourAnimalLabel: number;

    private userHead: UserHead;
    private _userNameTextField: SQ.SimplicityTextField
    private _flowerSpr: egret.DisplayObjectContainer;
    private _flowerText: SQ.SimplicityTextField;
    private _flower: number = 0;

    public constructor(dire: number = 0) {
        super();
        this.nDir = dire;
    }

    public draw(): void {
        this.touchEnabled = true;

        this.userHead = new UserHead();
        this.userHead.userId = this._userId;
        this.userHead.levelId = this._levelId;
        this.userHead.fourAnimalLabel = this.fourAnimalLabel;
        this.userHead.draw();

        this.addChild(this.userHead);

        var textStyle: SQ.TextStyleConfig = new SQ.TextStyleConfig();
        textStyle.isBold = true;
        textStyle.stroke = 2;
        textStyle.size = 15;
        textStyle.strokeColor = 0x09113c;
        textStyle.maxLen = 12;

        this._userNameTextField = new SQ.SimplicityTextField(this.userName, textStyle);
        this.addChild(this._userNameTextField);

        this._flowerSpr = new egret.DisplayObjectContainer();
        var _flowerIcon = new egret.Bitmap();
        _flowerIcon.texture = RES.getRes("game.flower");
        this._flowerSpr.addChild(_flowerIcon);


        textStyle.textColor = 0xe2ea78;
        textStyle.stroke = 0;
        textStyle.strokeColor = 0;

        this._flowerText = new SQ.SimplicityTextField("x" + this.flower, textStyle);
        this._flowerText.x = this._flowerSpr.width + 5;
        this._flowerSpr.addChild(this._flowerText);

        this.addChild(this._flowerSpr);

        if (this.flower == 0) {
            this._flowerSpr.visible = false;
        }

        this.redrawByBrowser();
    }

    public die(): void {
        var colorMatrix = [
            0.3,0.6,0,0,0,
            0.3,0.6,0,0,0,
            0.3,0.6,0,0,0,
            0,0,0,1,0
        ];
        var colorFlilter : egret.ColorMatrixFilter = new egret.ColorMatrixFilter(colorMatrix);
        this.filters = [colorFlilter];
    }

    public rebirth(): void {
        this.filters = null;
    }

    public addHua(): void {
        this.flower += 1;
        this._flowerText.setText("x" + this.flower);

        this._flowerSpr.visible = true;

        TweenMax.killAll(true);
        TweenMax.to(this._flowerSpr, .4, {
            scaleX: 1.5, scaleY: 1.5, yoyo: true, repeat: 1, ease: Cubic.easeInOut
        });
    }

    public cuohu(): void {

    }

    public redrawByBrowser(): void {
        if (this.nDir == 2 || this.nDir == 4) {
            if (this._userNameTextField) {
                this._userNameTextField.x = this.width * .5 - this._userNameTextField.width * .5;
                this._userNameTextField.y = this.userHead.height;
            }

            if (this.userHead) {
                if (this.userHead.getAnimalLabel() == 0) {
                    this._userNameTextField.y += 10;
                }
            }


            if (this._flowerSpr) {
                this._flowerSpr.x = this.width * .5 - this._flowerSpr.width * .5;
                this._flowerSpr.y = this._userNameTextField.y + this._userNameTextField.height + 5;
            }
        } else {
            if (this._userNameTextField) {
                this._userNameTextField.x = 95;
                this._userNameTextField.y = 20;
            }

            // if (this.userFourAnimalIcon) {
            //     var curFrame = this.userFourAnimalIcon.currentFrame;
            //
            //     this.userFourAnimalIcon.y = 0;
            //     if (curFrame == 1) {
            //         this.userFourAnimalIcon.y = -10;
            //     }
            // }

            if (this._flowerSpr) {
                this._flowerSpr.x = this._userNameTextField.x;
                this._flowerSpr.y = this._userNameTextField.y + this._userNameTextField.height;
            }
        }
    }

    public destroy(): void {
        if (this._userNameTextField) {
            DisplayObjectUtil.removeForParent(this._userNameTextField);
            this._userNameTextField = null;
        }
    }

    public set userId(value: number) {
        this._userId = value;
    }

    public get userId(): number {
        return this._userId;
    }

    public set userName(value: string) {
        this._userName = value;
    }

    public get userName(): string {
        return this._userName;
    }

    public set flower(value: number) {
        this._flower = value;
    }

    public get flower(): number {
        return this._flower;
    }

    public set score(value: number) {
        this._score = value;
    }

    public get score(): number {
        return this._score;
    }

    public set levelId(value: number) {
        this._levelId = value;
    }

    public get levelId(): number {
        return this._levelId;
    }

    public set fourAnimalLabel(value: number) {
        this._fourAnimalLabel = value;
    }

    public get fourAnimalLabel(): number {
        return this._fourAnimalLabel;
    }
}