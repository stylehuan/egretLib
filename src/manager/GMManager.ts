/**
 * Created by stylehuan on 2016/9/29.
 */
class GMManager {
    private static _instance: GMManager;

    public static getInstance(): GMManager {
        if (!this._instance) {
            this._instance = new GMManager();
        }
        return this._instance;
    }

    public isGm: boolean = false;
}