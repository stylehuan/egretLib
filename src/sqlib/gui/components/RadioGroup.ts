module SQ {
    export class RadioGroup extends egret.EventDispatcher {
        private _radioList:Array<Radio>;
        private _curRadio:Radio;

        public constructor() {
            super();
            this._radioList = new Array<Radio>();
            this._curRadio = null;
        }

        /**
         * 返回radio群组
         * @param    ...radio
         * @return
         */
        public static groupRadios(...radios):RadioGroup {
            var g:RadioGroup = new RadioGroup();
            var length1:number = radios.length;
            for (var i1:number = 0; i1 < length1; i1++) {
                var i:Radio = radios[i1];
                g.appendRadio(i);
            }
            return g;
        }

        /**
         * 添加radio进群组
         * @param    r
         */
        public appendRadio(r:Radio):void {
            if (r == null) {
                return;
            }
            r.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.setSelectedHandler, this);
            this._radioList.push(r);
        }

        /**
         * 监听raido选择事件
         * @param    e
         */
        private setSelectedHandler(e:GuiEvent):void {
            for (var i:number = 0; i < this._radioList.length; i++) {
                this._radioList[i].setSelect(false);
            }
            this._curRadio = <Radio>(e.currentTarget);
            this._curRadio.setSelect(true);
            var sue:GuiEvent = new GuiEvent(GuiEvent.STRADIOGROUP_RADIO_SELECTEDINDEX);
            sue.data = {selectIndex: this._radioList.indexOf(this._curRadio)};
            this.dispatchEvent(sue);
        }

        /**
         * 删除radio
         * @param    r
         */
        public removeRadio(r:Radio):void {
            var index:number = this._radioList.indexOf(r);
            if (index != -1) {
                this._radioList.splice(index, 1);
            }
        }

        /**
         * 返回radio数量
         * @return
         */
        public RadioNum():number {
            return this._radioList.length;
        }

        public getCurSelectedIndex():number {
            var index:number = -1;
            for (var i:number = 0; i < this._radioList.length; i++) {
                if (this._radioList[i]._isSelect) {
                    index = i;
                    return index;
                }
            }
            return index;
        }

        public getCurSelectedValue():string {
            var index:number = -1;
            for (var i:number = 0; i < this._radioList.length; i++) {
                if (this._radioList[i]._isSelect) {
                    index = i;
                    break;
                    //return index;
                }
            }
            if (index != -1)
                return this._radioList[i].getValue();
            return "";
        }


        /**
         * 释放
         */
        public destory():void {
            for (var i:number = 0; i < this._radioList.length; i++) {
                this._radioList[i].removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.setSelectedHandler, this);
            }
            this._radioList.length = 0;
            this._radioList = null;
            if (this._curRadio) this._curRadio = null;
        }
    }
}