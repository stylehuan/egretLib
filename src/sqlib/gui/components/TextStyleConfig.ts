/**
 * Created by stylehuan on 2016/8/10.
 */
module SQ {
    export class TextStyleConfig {
        public textColor: number = 0xfffffff;
        public height: number = 20;
        public size: number = 14;
        public maxLen: number = 6;
        public textAlign: string = "left";
        public fontFamily: string = "Microsoft Yahei,KaiTi";
        public strokeColor: number;
        public isBold: boolean;
        public stroke: number;
        public textFlow:Array<egret.ITextElement>;
    }
}