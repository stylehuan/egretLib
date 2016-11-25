 class CGameMJPlayData {


		public PengCards:FixedArray = new FixedArray("CGameCardsUnit",Global.MJ_CHAIR_COUNT*Global.MJ_MAX_PENG);	// 碰出的牌
		public nPengCount:FixedArray = new FixedArray("int",Global.MJ_CHAIR_COUNT);

		public ChiCards:FixedArray = new FixedArray("CGameCardsUnit",Global.MJ_CHAIR_COUNT*Global.MJ_MAX_CHI);// 吃出的牌
		public nChiCount:FixedArray = new FixedArray("int",Global.MJ_CHAIR_COUNT);// 吃出的牌

		public MnGangCards:FixedArray = new FixedArray("CGameCardsUnit",Global.MJ_CHAIR_COUNT*Global.MJ_MAX_GANG);// 明杠出的牌
		public nMnGangCount:FixedArray = new FixedArray("int",Global.MJ_CHAIR_COUNT);// 明杠出的牌

		public AnGangCards:FixedArray = new FixedArray("CGameCardsUnit",Global.MJ_CHAIR_COUNT*Global.MJ_MAX_GANG);// 暗杠出的牌
		public nAnGangCount:FixedArray = new FixedArray("int",Global.MJ_CHAIR_COUNT);

		public PnGangCards:FixedArray = new FixedArray("CGameCardsUnit",Global.MJ_CHAIR_COUNT*Global.MJ_MAX_GANG);// 碰杠出的牌
		public nPnGangCount:FixedArray = new FixedArray("int",Global.MJ_CHAIR_COUNT);

		public nOutCards:FixedArray = new FixedArray("int",Global.MJ_CHAIR_COUNT*Global.MJ_MAX_OUT);//打出的牌

		public nOutCount:FixedArray = new FixedArray("int",Global.MJ_CHAIR_COUNT);

		public nHuaCards:FixedArray = new FixedArray("int",Global.MJ_CHAIR_COUNT*Global.MJ_MAX_HUA);	// 补花打出的牌

		public nHuaCount:FixedArray = new FixedArray("int",Global.MJ_CHAIR_COUNT);	// 补花打出的牌

        public nResults:FixedArray = new FixedArray("int",Global.MJ_CHAIR_COUNT);	// 胡牌结果

	 public nPlayerDelay:FixedArray =new FixedArray("int",Global.MJ_CHAIR_COUNT);

	 public nAskExit: FixedArray = new FixedArray("int", Global.MJ_CHAIR_COUNT);
	 public nTotalAskExit: FixedArray = new FixedArray("int", Global.MJ_CHAIR_COUNT);
}