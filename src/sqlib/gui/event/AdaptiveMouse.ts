/**
 * Created by stylehuan on 2016/10/20.
 */
class AdaptiveMouse extends egret.Sprite {
    public constructor() {
        super();
        this.setup();
    }

    private setup(): void {

    }

    protected onOverFriendDoor(e:egret.TouchEvent): void {

    }

    protected onOutFriendDoor(e:egret.TouchEvent): void {
    }

    protected touchBeginHandler(e:egret.TouchEvent): void {

    }

    protected touchEndHandler(e:egret.TouchEvent): void {

    }


    public destroy(): void {
        if (UIAdapter.getInstance().isPC) {
            this.removeEventListener(mouse.MouseEvent.MOUSE_OVER, this.onOverFriendDoor, this);
            this.removeEventListener(mouse.MouseEvent.MOUSE_OUT, this.onOutFriendDoor, this);
        }

        this.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchBeginHandler, this);
        this.removeEventListener(egret.TouchEvent.TOUCH_END, this.touchEndHandler, this);
    }
}