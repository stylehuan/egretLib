class CGameWinResult{


		public gamewinMJ:CGameWinMJ = new CGameWinMJ();
		public nCardsCount:FixedArray = new FixedArray("int",Global.TOTAL_CHAIRS);  // 每个玩家手里的牌的张数
		public nChairCards:FixedArray = new FixedArray("int",Global.TOTAL_CHAIRS*Global.CHAIR_CARDS); // 自己手里的牌
    public nChairAnGang:FixedArray = new FixedArray("int",Global.TOTAL_CHAIRS*Global.MJ_MAX_UNITS); // 自己手里的牌
//		public var nHuFanType:Vector.<int> = new Vector.<int>(Global.HU_MAXTYPE,true);
		public nBankerGains:int = new int();		// 庄家另算输赢番数
}