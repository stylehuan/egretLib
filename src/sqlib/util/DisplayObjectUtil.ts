/**
 * Created by seethinks@gmail.com on 2015/5/4.
 */
class DisplayObjectUtil {
        static removeAllElement(group:eui.Group) {
            while (group.numElements > 0) {
                group.removeChildAt(0)
            }
        }

        static  removeAllChild(dis:any) {
            while (dis.numChildren > 0) {
                dis.removeChildAt(0);
            }
        }

        static  removeForParent(dis:any) {
            try{
            if (dis.parent) dis.parent.removeChild(dis);
            }catch(e){}
        }

        static createTextFile(text:string, color:number, size:number, strokeColor:number, isBold:boolean=false, stroke:number=0):egret.TextField {
            var txt:egret.TextField = new egret.TextField();
            txt.text = text;
            txt.textColor = color;
            txt.size = size;
            txt.fontFamily = "Microsoft Yahei,KaiTi";
            txt.strokeColor = strokeColor;
            txt.bold = isBold;
            txt.stroke = stroke;
            return txt;
        }
}
