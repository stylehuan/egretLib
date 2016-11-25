class PlayerData {
    public outArr: Array<any>;  // 传出匹配的卡牌序列
    public handArr: Array<any>; // 手上的牌
    public fuluArr: any;

    public constructor() {
        this.fuluArr = {kz: {}, sz: []};  // kz:刻子   , sz:顺子
        this.handArr = [];
    }

    /**
     * 增加手牌
     */
    public addCardData(index: number = 0): void {
        this.handArr.push(index);
    }

    /**
     * 删除手牌
     */
    public delCardData(index: number = -1): void {
        if (index == -1) {
            ///console.log("this.handArr 1:"+this.handArr.length)
            this.handArr.splice(0, 1);
            //console.log("this.handArr 2:"+this.handArr.length)
        }
        else {
            var p: number = this.handArr.indexOf(index);
            //console.log("p 1:"+p)
            if (p > -1) {
                this.handArr.splice(p, 1);
            }
        }
    }

    public sortHandDataNoReverse(): void {
        //this.handArr.sort(Array<any>.NUMERIC);
        var valueList: Array<number> = new Array<number>();
        var i: number;
        for (i = 0; i < this.handArr.length; i++) {
            valueList.push(this.handArr[i]);
        }
        var sortedArray: Array<number> = new Array<number>();
        sortedArray = valueList.sort((n1, n2) => n1 - n2);
        this.handArr = sortedArray;
    }

    //		public sortHandData():void{
    //            var valueList:Array<number>=new Array<number>();
    //            var i:number;
    //            for(i=0;i<this.handArr.length;i++){
    //                valueList.push(this.handArr[i]);
    //            }
    //            var sortedArray:Array<number>=new Array<number>();
    //            sortedArray = valueList.sort((n1,n2) => n1 - n2);
    //            sortedArray.reverse();
    //            this.handArr = sortedArray;
    //		}

    public sortHandData(): void {
        var tempArr: any = this.handArr.concat();
        this.handArr = PlayerData.sort(tempArr);
    }

    public static sort(arr: Array<any>): Array<any> {
        var _w: Array<any> = new Array<any>();
        var _tiao: Array<any> = new Array<any>();
        var _tong: Array<any> = new Array<any>();
        var _zi: Array<any> = new Array<any>();
        var _hua: Array<any> = new Array<any>();
        var len: number = arr.length;

        if (arr[0] == -1)
            return arr;

        for (var i: number = 0; i < arr.length; i++) {
            if (arr[i] > -1) {
                switch (CardData.getCardType(arr[i])) {
                    case 0:
                        _w.push(arr[i]);
                        break;
                    case 1:
                        _tiao.push(arr[i]);
                        break;
                    case 2:
                        _tong.push(arr[i]);
                        break;
                    case 3:
                        _zi.push(arr[i]);
                        break;
                    case 4:
                        _hua.push(arr[i]);
                        break;
                }
            }
        }

        // while (len) {
        //     if (arr[len - 1] > -1) {
        //         switch (CardData.getCardType(arr[len - 1])) {
        //             case 0:
        //                 _w.push(arr[len - 1]);
        //                 break;
        //             case 1:
        //                 _tiao.push(arr[len - 1]);
        //                 break;
        //             case 2:
        //                 _tong.push(arr[len - 1]);
        //                 break;
        //             case 3:
        //                 _zi.push(arr[len - 1]);
        //                 break;
        //             case 4:
        //                 _hua.push(arr[len - 1]);
        //                 break;
        //         }
        //     }
        //     len -= 1;
        // }


        //while(len){
        //    if(arr[len-1] == -1) return arr;
        //    //console.log("CardData.getCardType(arr[len-1]):"+CardData.getCardType(arr[len-1])+"   arr[len-1]:"+arr[len-1]+"   r:"+Math.random()*9999999)
        //    switch(CardData.getCardType(arr[len-1])){
        //        case 0:
        //            _w.push(arr[len-1]);
        //            break;
        //        case 1:
        //            _tiao.push(arr[len-1]);
        //            break;
        //        case 2:
        //            _tong.push(arr[len-1]);
        //            break;
        //        case 3:
        //            _zi.push(arr[len-1]);
        //            break;
        //        case 4:
        //            _hua.push(arr[len-1]);
        //            break;
        //    }
        //    len -=1;
        //}

        //        _w.sort((n1,n2) => CardData.getCardIndex(n1) > CardData.getCardIndex(n2) ? 1: -1);
        //        _tiao.sort((n1,n2) => CardData.getCardIndex(n1) > CardData.getCardIndex(n2) ? 1: -1);
        //        _tong.sort((n1,n2) => CardData.getCardIndex(n1) > CardData.getCardIndex(n2) ? 1: -1);
        //        _zi.sort((n1,n2) => CardData.getCardIndex(n1) > CardData.getCardIndex(n2) ? 1: -1);
        //        _hua.sort((n1,n2) => CardData.getCardIndex(n1) > CardData.getCardIndex(n2) ? 1: -1);

        //console.log(" this.handArr .length:"+ this.handArr.length,"  _tiao:"+_tiao)
        _w.sort(this.paigexun);
        _tiao.sort(this.paigexun);
        _tong.sort(this.paigexun);
        _zi.sort(this.paigexun);
        _hua.sort(this.paigexun);

        //        _w.sort();
        //        _tiao.sort();
        //        _tong.sort();
        //        _zi.sort();
        //        _hua.sort();


        return _w.concat(_tong, _tiao, _zi, _hua)
    }

    private static paigexun(a: number, b: number = 0): number {
        if (CardData.getCardIndex(a) > CardData.getCardIndex(b)) {
            return 1;
        } else if (CardData.getCardIndex(a) < CardData.getCardIndex(b)) {
            return -1;
        }

        return 0;
    }

    public init(len: number): void {
        for (var i: number = 0; i < len; i++) {
            this.handArr[i] = 0;
        }
    }

    /** 根据浏览器宽高重绘 **/
    public redrawByBrowser(): void {
    }

    /** 析构 */
    public destroy(): void {
        if (this.handArr) {
            this.handArr.length = 0;
            this.handArr = null;
        }
        if (this.outArr) {
            this.outArr.length = 0;
            this.outArr = null;
        }
    }
}