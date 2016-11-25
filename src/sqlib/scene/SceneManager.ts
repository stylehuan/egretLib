/**
 * Created by stylehuan on 2016/7/12.
 */
class SceneManager {
    private static _instance:SceneManager = null;

    private sceneMap:HashMap<string, any>;
    private scenesStack:Array<SceneBase>;
    public currentScene:SceneBase;

    public static getInstance():SceneManager {
        if (!this._instance) {
            this._instance = new SceneManager();
        }
        return this._instance;
    }

    public setUp():void {
        AppEvent.addEventListener(AppEvent.APP_CLOSE, this.onAppClose, this);
        this.sceneMap = new HashMap<string, any>();
        this.scenesStack = [];
    }

    //替换场景
    public replaceScene(scene:any):void {
        if (this.currentScene) {
            this.popScene();
            this.pushScene(scene);
        }
    }

    private register(scene:any):any {
        var name:string = egret.getQualifiedClassName(scene);
        var scene:any = new scene();
        this.sceneMap.set(name, scene);

        return scene;
    }

    // 场景入栈
    public pushScene(scene:any, transition:any = "", data:Object = null) {
        if (scene) {
            var name:string = egret.getQualifiedClassName(scene);
            scene = new scene();
            this.scenesStack.splice(0, 0, scene);
            this.currentScene = scene;
            //

            SceneEvent.dispatchEvents(new SceneEvent(name + "_" + SceneEvent.ENTRY, data));
            if (transition) {
                TransitionManager.getInstance().doTransi(scene, transition)
            }
        }
    }

    // 场景出栈
    public popScene():void {
        var popScene:SceneBase = this.scenesStack.shift();

        //if (this.scenesStack.length == 0) {
        //    this.pushScene(MainScene);
        //}

        if (popScene) {
            var name:string = egret.getQualifiedClassName(popScene);
            SceneEvent.dispatchEvents(new SceneEvent(name + "_" + SceneEvent.OUT));
        }
    }

    // 初始化运行场景
    public runWithScene(scene:any):void {
        this.pushScene(scene);
    }

    private onAppClose(e:Event):void {
        this.popScene();
    }
}