class CGameWinMJ extends CSerializable{

    public constructor(){
        super();
    }
    public gamewin:CGAMEWIN = new CGAMEWIN();
    public nNewRound:int = new int();								// 下一局是新一轮开始

    public nMnGang:FixedArray = new FixedArray("int",Global.MJ_CHAIR_COUNT);
    public nAnGangs:FixedArray = new FixedArray("int",Global.MJ_CHAIR_COUNT);
    public nPnGangs:FixedArray = new FixedArray("int",Global.MJ_CHAIR_COUNT);
    public nHuaCount:FixedArray = new FixedArray("int",Global.MJ_CHAIR_COUNT);

    public nResults:FixedArray = new FixedArray("int",Global.MJ_CHAIR_COUNT);	// 胡牌结果  小于0错胡
    // public nHuChairs:FixedArray = new FixedArray("int",Global.MJ_CHAIR_COUNT);	// 玩家是否胡牌
    public nLoseChair:int = new int();					// 放冲或者被抢杠者位置 -1 自摸
    public nHuChair:FixedArray = new FixedArray("int",Global.MJ_CHAIR_COUNT);					// 胡牌位置
    public nHuCard:int = new int();					// 胡牌ID
    public nBankerHold:int = new int();				// 本局是几连庄
    public nNextBanker:int = new int();				// 下一局谁做庄
    public nChengBaoID:int = new int();				// 承包者ID

    public nTingChairs:FixedArray = new FixedArray("int",Global.MJ_CHAIR_COUNT);	// 玩家是否听牌
}