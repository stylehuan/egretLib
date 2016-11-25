/**
 * Created by stylehuan on 2016/7/26.
 */
class TransitionManager {
    private static _singleton:boolean = true;
    private static _instance:TransitionManager;

    static FADE_IN:string = "fade_in";
    static FADE_OUT:string = "fade_out";
    static FALL_RIGH_DOWN:string = "fall_righ_down";

    public constructor() {
        if (TransitionManager._singleton) {
            throw new Error("ֻ����getInstance()����ȡʵ��");
        }
    }

    public static getInstance():TransitionManager {
        if (!TransitionManager._instance) {
            TransitionManager._singleton = false;
            TransitionManager._instance = new TransitionManager();
            TransitionManager._singleton = true;
        }
        return TransitionManager._instance;
    }

    public doTransi(scene:any,transiType:string="",gc:boolean=false):void {
        if(transiType == TransitionManager.FADE_IN)
        {
            scene.alpha = 0;
            TweenMax.to(scene, .6, {
                alpha:1,
                onComplete: function ():void {
                    if(gc)  scene.destroy();
                }, onCompleteParams: [scene]
            });
        }

        if(transiType == TransitionManager.FADE_OUT)
        {
            TweenMax.to(scene, .6, {
                alpha:0,
                onComplete: function ():void {
                    if(gc)  scene.destroy();
                }, onCompleteParams: [scene]
            });
        }

        if(transiType == TransitionManager.FALL_RIGH_DOWN)
        {
            TweenMax.to(scene, .6, {
                rotation: 40,
                alpha: 0,
                onComplete: function ():void {
                    if(gc)  scene.destroy();
                }, onCompleteParams: [scene], ease: Cubic.easeInOut
            });
        }
    }
}