class CardData {
    public static cardNameMap: HashMap<number, string>;
    public static cardNumberMap: HashMap<number, string>;
    public static cardMountMap: HashMap<number, string>;
    public static cardPoolMap: HashMap<number, string>;
    public static cardIdMap: HashMap<number, number>;
    public static handCardMap: HashMap<number, string>;

    //牌的宽高
    public static CARD_WIDTH: number = 80;
    public static CARD_HEIGHT: number = 123;

    //牌种类
    public static line: number = 1;
    public static zi: number = 2;
    public static round: number = 3;

    public constructor() {
    }


    public static setUp(): void {
        CardData.cardNameMap = new HashMap<number, string>();

        //万
        CardData.cardNameMap.set(0, "card_11");
        CardData.cardNameMap.set(1, "card_12");
        CardData.cardNameMap.set(2, "card_13");
        CardData.cardNameMap.set(3, "card_14");
        CardData.cardNameMap.set(4, "card_15");
        CardData.cardNameMap.set(5, "card_16");
        CardData.cardNameMap.set(6, "card_17");
        CardData.cardNameMap.set(7, "card_18");
        CardData.cardNameMap.set(8, "card_19");


        //条
        CardData.cardNameMap.set(9, "card_21");
        CardData.cardNameMap.set(10, "card_22");
        CardData.cardNameMap.set(11, "card_23");
        CardData.cardNameMap.set(12, "card_24");
        CardData.cardNameMap.set(13, "card_25");
        CardData.cardNameMap.set(14, "card_26");
        CardData.cardNameMap.set(15, "card_27");
        CardData.cardNameMap.set(16, "card_28");
        CardData.cardNameMap.set(17, "card_29");

        //筒
        CardData.cardNameMap.set(18, "card_31");
        CardData.cardNameMap.set(19, "card_32");
        CardData.cardNameMap.set(20, "card_33");
        CardData.cardNameMap.set(21, "card_34");
        CardData.cardNameMap.set(22, "card_35");
        CardData.cardNameMap.set(23, "card_36");
        CardData.cardNameMap.set(24, "card_37");
        CardData.cardNameMap.set(25, "card_38");
        CardData.cardNameMap.set(26, "card_39");

        //字
        CardData.cardNameMap.set(27, "card_41");
        CardData.cardNameMap.set(28, "card_42");
        CardData.cardNameMap.set(29, "card_43");
        CardData.cardNameMap.set(30, "card_44");
        CardData.cardNameMap.set(31, "card_45");
        CardData.cardNameMap.set(32, "card_46");
        CardData.cardNameMap.set(33, "card_47");

        //花
        CardData.cardNameMap.set(34, "card_51");
        CardData.cardNameMap.set(35, "card_52");
        CardData.cardNameMap.set(36, "card_53");
        CardData.cardNameMap.set(37, "card_54");
        CardData.cardNameMap.set(38, "card_55");
        CardData.cardNameMap.set(39, "card_56");
        CardData.cardNameMap.set(40, "card_57");
        CardData.cardNameMap.set(41, "card_58");

        //牌山
        CardData.cardMountMap = new HashMap<number, string>();
        CardData.cardMountMap.set(1, "cardMount_heng");//横向
        CardData.cardMountMap.set(2, "cardMount_shu");//纵向

        //牌池
        CardData.cardPoolMap = new HashMap<number, string>();
        CardData.cardPoolMap.set(1, "cardPool_heng");//横向
        CardData.cardPoolMap.set(2, "cardPool_shu");//纵向

        //手牌
        CardData.handCardMap = new HashMap<number, string>();
        CardData.handCardMap.set(1, "cardHand_top");
        CardData.handCardMap.set(2, "cardHand_right");
        CardData.handCardMap.set(3, "cardHand_bottom");
        CardData.handCardMap.set(4, "cardHand_left");


    }

    public static getCardName(index: number = 0): string {
        var _id:number = this.getCardIndex(index);
        return CardData.cardNameMap.get(_id);
    }

    public static getCardIdByIndex(index: number): number {
        if (index >= 1 && index <= 9){//MJ_CS_WAN;
            index = (index-1)%9
        }else if (index >= 11 && index <= 19){//TIAO
            index = (index-11)%9 + 36;
        }else if (index >= 21 && index <= 29){//tong
            index = (index-21)%9+72;
        }else if (index >= 31 && index <= 37){
            index = (index-31)%7+108;
        }else if (index >= 41 && index <= 48){
            index = (index-41)+ 34;
        }
        return index;
    }

    public static getCardType(id:number):number
    {
        if (id >= 0 && id < 36){
            return 0;  //MJ_CS_WAN;
        }else if (id >= 36 && id < 72){
            return 1;  //MJ_CS_TIAO;
        }else if (id >= 72 && id < 108){
            return 2;  //MJ_CS_DONG;
        }else if (id >= 108 && id < 136){
            return 3;  //MJ_CS_FENG;
        }else if (id >= 136 && id < 152){
            return 4;  //MJ_CS_HUA;
        }else{
            return -1;
        }
    }

    public static getCardIndex(id:number):number
    {
        if (id >= 0 && id < 36){//MJ_CS_WAN;
            id = id%9
        }else if (id >= 36 && id < 72){//TIAO
            id = (id-36)%9 + 9;
        }else if (id >= 72 && id < 108){//tong
            id = (id-72)%9+ 18;
        }else if (id >= 108 && id < 136){
            id = (id-108)%7+ 27;
        }else if (id >= 136 && id < 152){
            id = (id-136)+ 34;
        }
        return id;
    }

    public static getIndexByCardId(id:number):number
    {
        var index:number=-1;
        if (id >= 0 && id < 36){//MJ_CS_WAN;
            index = id%9 + 1
        }else if (id >= 36 && id < 72){//TIAO
            index = (id-36)%9 + 11;
        }else if (id >= 72 && id < 108){//tong
            index = (id-72)%9+ 21;
        }else if (id >= 108 && id < 136){
            index = (id-108)%7+ 31;
        }else if (id >= 136 && id < 152){
            index = (id-136)+ 41;
        }
        return index;
    }
}