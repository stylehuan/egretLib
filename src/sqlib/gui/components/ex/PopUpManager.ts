/**
 * 面板弹出的管理类
 */
module PopUpManager {

    export var darkSprite:egret.Sprite;

    /**
     * 添加面板方法
     * panel       		面板
     * dark        		背景是否变黑
     * popUpWidth      	指定弹窗宽度，定位使用
     * popUpHeight      	指定弹窗高度，定位使用
     * effectType        0：没有动画 1:从中间轻微弹出 2：从中间猛烈弹出  3：从左向右 4：从右向左 5、从上到下 6、从下到上
     */
    export function addPopUp(panel, dark:boolean = false, popUpWidth:number = 0,popUpHeight:number = 0,effectType:number = 0,isAlert:boolean = false):void{
        if(LayerManager.AppLayer.contains(panel)){//判断是否包含panel
            return;
        }
        if(dark){
            this.darkSprite = new egret.Sprite();
            this.darkSprite.graphics.clear();
            this.darkSprite.graphics.beginFill(0x000000, 0.3);
            this.darkSprite.graphics.drawRect(0, 0, LayerManager.stage.stageWidth, LayerManager.stage.stageHeight);
            this.darkSprite.graphics.endFill();
            this.darkSprite.width = LayerManager.stage.stageWidth;
            this.darkSprite.height = LayerManager.stage.stageHeight;

            if(!LayerManager.AppLayer.contains(this.darkSprite)){
                LayerManager.AppLayer.addChild( this.darkSprite );
            }
            this.darkSprite.touchEnabled = true;

            egret.Tween.get(this.darkSprite).to({alpha:1},150);
            this.darkSprite.visible = true;
        }

        LayerManager.AppLayer.addChild(panel);

        //GameConfig.curPanel = panel;
        if(popUpWidth != 0){
            panel.x = LayerManager.stage.stageWidth/2 - popUpWidth/2;
            panel.y = LayerManager.stage.stageHeight/2 - popUpHeight/2;
        }else{
            popUpWidth = panel.width;
            popUpHeight = panel.height;
        }

        //以下是弹窗动画
        var leftX:number = LayerManager.stage.stageWidth/2 - popUpWidth/2;
        var upY:number = LayerManager.stage.stageHeight/2 - popUpHeight/2;
        switch(effectType){
            case 0:
                break;
            case 1:
                panel.alpha = 0;
                panel.scaleX = 0.5;
                panel.scaleY = 0.5;
                panel.x = panel.x + popUpWidth/4;
                panel.y = panel.y + popUpHeight/4;
                egret.Tween.get(panel).to({alpha:1,scaleX:1,scaleY:1,x:panel.x - popUpWidth/4,y:panel.y - popUpHeight/4},300,egret.Ease.backOut);
                break;
            case 2:
                panel.alpha = 0;
                panel.scaleX = 0.5;
                panel.scaleY = 0.5;
                panel.x = panel.x + popUpWidth/4;
                panel.y = panel.y + popUpHeight/4;
                egret.Tween.get(panel).to({alpha:1,scaleX:1,scaleY:1,x:panel.x - popUpWidth/4,y:panel.y - popUpHeight/4},600,egret.Ease.elasticOut);
                break;
            case 3:
                if(isAlert){
                    panel.x = - popUpWidth;
                    egret.Tween.get(panel).to({x:leftX},500,egret.Ease.cubicOut);
                }else{
                    panel.x = - popUpWidth;
                    egret.Tween.get(panel).to({x:0},500,egret.Ease.cubicOut);
                }
                break;
            case 4:
                if(isAlert){
                    panel.x = popUpWidth;
                    egret.Tween.get(panel).to({x:leftX},500,egret.Ease.cubicOut);
                }else{
                    panel.x = popUpWidth;
                    egret.Tween.get(panel).to({x:0},500,egret.Ease.cubicOut);
                }
                break;
            case 5:
                if(isAlert){
                    panel.y = - popUpHeight;
                    egret.Tween.get(panel).to({y:upY},500,egret.Ease.cubicOut);
                }else{
                    panel.y = - popUpHeight;
                    egret.Tween.get(panel).to({y:0},500,egret.Ease.cubicOut);
                }
                break;
            case 6:
                if(isAlert){
                    panel.y = LayerManager.stage.stageHeight;
                    egret.Tween.get(panel).to({y:upY},500,egret.Ease.cubicOut);
                }else{
                    panel.y = popUpHeight;
                    egret.Tween.get(panel).to({y:0},500,egret.Ease.cubicOut);
                }
                break;
            default:
                break;
        }

    }

    /**
     * 移除面板方法
     * panel       		面板
     * effectType        0：没有动画 1:从中间缩小消失 2：  3：从左向右 4：从右向左 5、从上到下 6、从下到上
     */
    export function removePopUp(panel,effectType:number = 0):void{

        var onComplete:Function = function(){
            if(LayerManager.AppLayer.contains(this.darkSprite)){
                LayerManager.AppLayer.removeChild( this.darkSprite );
            }
        };
        if(this.darkSprite){
            egret.Tween.get(this.darkSprite).to({alpha:0},100).call(onComplete,this);
        }

        //以下是弹窗动画
        switch(effectType){
            case 0:
                break;
            case 1:
                egret.Tween.get(panel).to({scaleX:0,scaleY:0,x:panel.x + panel.width/2,y:panel.y + panel.height/2},200);
                break;
            case 2:
                break;
            case 3:
                egret.Tween.get(panel).to({x:panel.width},200,egret.Ease.cubicOut);
                break;
            case 4:
                egret.Tween.get(panel).to({x:-panel.width},200,egret.Ease.cubicOut);
                break;
            case 5:
                egret.Tween.get(panel).to({y:panel.height},200,egret.Ease.cubicOut);
                break;
            case 6:
                egret.Tween.get(panel).to({y:-panel.height},200,egret.Ease.cubicOut);
                break;
            default:
                break;
        }

        egret.setTimeout(function () {
            if(LayerManager.AppLayer.contains(panel)){//判断是否包含panel
                LayerManager.AppLayer.removeChild(panel);
            }
        }, this, 300);
    }

    var _alert:AlertPanel;
    //提示框
    /**
     * titleStr       标题
     * descStr        描述
     * acceptFun      确认方法
     * effectType        0：没有动画 1:从中间轻微弹出 2：从中间猛烈弹出  3：从左向右 4：从右向左 5、从上到下 6、从下到上
     */
    export function alert(titleStr:string = "",descStr:string = "",acceptFun:Function = null,effectType:number = 1):void {
        if(this._alert == null){
            this._alert = new AlertPanel(titleStr,descStr,null,acceptFun);
            PopUpManager.addPopUp(this._alert,true,this._alert.getWidth(),this._alert.getHeight(),effectType,true);
            SystemEvent.addEventListener(SystemEvent.closeAlertNotify,this.closeAlertPanel,this);
        }
    }

    //关闭alert方法
    export function closeAlertPanel():void {
        if(this._alert != null){
            PopUpManager.removePopUp(this._alert,1);
            this._alert = null;
        }
    }

}


