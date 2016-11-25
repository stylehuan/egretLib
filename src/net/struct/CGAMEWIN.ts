class CGAMEWIN {


		public dwWinFlags:int = new int();											// 输赢标志
		public nTotalChairs:int = new int();										// 椅子数目
		public nBoutCount:int = new int();												// 第几局
		public nBanker:int = new int();													// 庄家位置
		public nPartnerGroup:FixedArray = new FixedArray("int",Global.MAX_CHAIRS_PER_TABLE);					// 所属组
		public bBankWin:int = new int();													// 庄家输赢
		public nWinPoints:FixedArray = new FixedArray("int",Global.MAX_CHAIRS_PER_TABLE);	// 输赢点数
		public nBaseScore:int = new int();													// 基本积分
		public nBaseDeposit:int = new int();													// 基本银子
		public nOldScores:FixedArray = new FixedArray("int",Global.MAX_CHAIRS_PER_TABLE);						// 旧积分
		public nOldDeposits:FixedArray = new FixedArray("int",Global.MAX_CHAIRS_PER_TABLE);					// 旧银子
		public nScoreDiffs:FixedArray = new FixedArray("int",Global.MAX_CHAIRS_PER_TABLE);							// 积分增减
		public nDepositDiffs:FixedArray = new FixedArray("int",Global.MAX_CHAIRS_PER_TABLE);						// 银子输赢
		public nWinFees:FixedArray = new FixedArray("int",Global.MAX_CHAIRS_PER_TABLE);								// 手续费
}