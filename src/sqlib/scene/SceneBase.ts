/**
 * Created by stylehuan on 2016/7/12.
 */
class SceneBase extends egret.Sprite {
    public constructor() {
        super();
        this.id = RandomUtil.getSmallRandom();
        this.name = egret.getQualifiedClassName(this);
        this.listenEvent();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addedToStageHandler, this);
    }

    public data: Object;

    private addedToStageHandler(e: Event): void {
        this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.addedToStageHandler, this);
        this.initial();
    }

    private id: string;
    //private name:string;

    public get ID(): string {
        return this.id;
    }

    private addToSceneLayer(): void {
        LayerManager.SceneLayer.addChild(this);
        this.touchEnabled = true;
    }

    protected resGroup: string;

    protected listenEvent(): void {
        SceneEvent.addEventListener(this.name + "_" + SceneEvent.ENTRY, this.EntryHandler, this);
        SceneEvent.addEventListener(this.name + "_" + SceneEvent.OUT, this.outHandler, this);
    }

    protected EntryHandler(e: SceneEvent): void {
        this.data = e.data;
        SceneEvent.removeEventListener(this.name + "_" + SceneEvent.ENTRY, this.EntryHandler, this);
        this.setup();
        this.resLoad();
    }

    private resLoad(): void {
        var self = this;
        if (this.resGroup && !RES.isGroupLoaded(this.resGroup)) {
            RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            setTimeout(()=> {
                RES.loadGroup(self.resGroup);
            }, 100);
            LoadingManager.showLoading();
        } else {
            this.resLoaded();
        }
    }

    private onResourceLoadComplete(event: RES.ResourceEvent): void {
        if (event.groupName == this.resGroup) {
            LoadingManager.hideLoading();
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            this.resLoaded();
        }
    }

    private onResourceProgress(event: RES.ResourceEvent): void {
        if (event.groupName == this.resGroup) {
            //SetLoadingView(event.itemsLoaded, event.itemsTotal);
            //if(this.currentScene){
            //    SceneEvent.dispatchEvents(new SceneEvent(SceneEvent.READY));
            //}
        }
    }

    /**
     * 资源加载出错
     */
    private onResourceLoadError(event: RES.ResourceEvent): void {
        console.warn("Group:" + event.groupName + " ���м���ʧ�ܵ���Ŀ");
        this.onResourceLoadComplete(event);
    }

    private outHandler(e: Event): void {
        this.clearEvent();
        this.uninstall();
        DisplayObjectUtil.removeForParent(this);
    }

    private resLoaded(): void {
        LoadingManager.hideLoading();
        this.addToSceneLayer();
    }

    protected setup(): void {
    }

    protected  initial(): void {
    }

    //卸载
    protected uninstall(): void {
    }

    public destroy(): void {
        this.data = null;
        this.clearEvent();
        DisplayObjectUtil.removeForParent(this);
    }

    private clearEvent(): void {
        SceneEvent.removeEventListener(this.name + "_" + SceneEvent.ENTRY, this.EntryHandler, this);
        SceneEvent.removeEventListener(this.name + "_" + SceneEvent.OUT, this.outHandler, this);
    }
}