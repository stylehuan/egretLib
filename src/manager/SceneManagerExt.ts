/**
 * Created by stylehuan on 2016/8/10.
 */

declare function openMatchList();

class SceneManagerExt {
    public static goGameScene(Transition: string = TransitionManager.FADE_IN): void {
        SceneManager.getInstance().popScene();
        SceneManager.getInstance().pushScene(GameScene, Transition);
    }

    public static goFriendScene(Transition: string = TransitionManager.FADE_IN): void {
        SceneManager.getInstance().popScene();
        SceneManager.getInstance().pushScene(FriendScene, Transition);
    }

    public static goMatchScene(Transition: string = TransitionManager.FADE_IN): void {
        // SceneManager.getInstance().popScene();
        // SceneManager.getInstance().pushScene(MatchScene, Transition);

        // if (UIAdapter.getInstance().isPC) {
        //     try {
        //         openMatchList();
        //     } catch (err) {
        //
        //     }
        // } else {
        //
        // }
        Match.getInstance().leaveSceneNextFunc = function () {
            this.goMainScene();
        };
        Match.getInstance().leaveScene();
    }

    public static goMainScene(Transition: string = TransitionManager.FADE_IN): void {
        SceneManager.getInstance().popScene();
        SceneManager.getInstance().pushScene(MainScene, Transition);
    }

    public static goLoginScene(Transition: string = TransitionManager.FADE_IN): void {
        SceneManager.getInstance().popScene();
        SceneManager.getInstance().pushScene(LoginScene, Transition);
    }

    public static goWaitScene(Transition: string = TransitionManager.FADE_IN): void {
        SceneManager.getInstance().popScene();
        SceneManager.getInstance().pushScene(WaitScene, Transition);
    }

    public static backCurrScene(): void {
        if (WGManager.getInstance().isWgIng()) {
            WGManager.getInstance().sendExitWG();
        } else {
            if (SystemCenter.playSystem.selfPlayerInfo.GameData.nScene.value == Global.LSSCENE_FRIEND) {
                this.goFriendScene();
            }
            else if (SystemCenter.playSystem.selfPlayerInfo.GameData.nScene.value == Global.LS_SCENE_MATCH_NEW) {
                this.goMatchScene();
            } else {

            }
        }
    }
}