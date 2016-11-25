/**
 * Created by seethinks@gmail.com on 2016/9/12.
 */
module SQ {
    export class STTextField extends egret.TextField {
        public constructor()
        {
            super();
            this.size = UIAdapter.getInstance().isPC?14:18;
        }
    }
}