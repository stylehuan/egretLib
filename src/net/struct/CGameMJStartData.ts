class CGameMJStartData {

		public nBoutCount:int = new int();				// 第几局
		public nBaseDeposit:int = new int();			// 基本银子
		public nBaseScore:int = new int();				// 基本积分
		public nBanker:int = new int();				// 庄家椅子号
		public nBankerHold:int = new int();			// 连续坐庄局数
		public nCurrentChair:int = new int();			// 当前活动椅子号 
		public dwStatus:int = new int();				// 当前状态
		public dwCurrentFlags:int = new int();		 	// 当前能否天胡
		
		public nFirstCatch:int = new int();			// 先摸牌的人的座位
		public nFirstThrow:int = new int();			// 先出牌的人的座位
		
		public nThrowWait:int = new int();				// 出牌等待时间(秒)
		public nMaxAutoThrow:int = new int();			// 由系统指定的最大自动出牌数,达到这个数目就断线
		public nEntrustWait:int = new int();			// 托管等待时间(秒)
		
		
		public nDices:FixedArray = new FixedArray("int",4);	// 骰子大小
		public bAllowChi:boolean;				// 允许吃
		public bAnGangShow:boolean;			// 暗杠的牌能否显示
		public bJokerSortIn:boolean;			// 财神牌不固定放头上
		public bBaibanNoSort:boolean;			// 替代财神牌不排序放
		public nBeginNO:int = new int();				// 开始摸牌位置
		public nJokerNO:int = new int();				// 财神位置
		public nJokerID:int = new int();				// 财神牌ID
		public nJokerID2:int = new int();              // 财神牌ID2
		public nFanID:int = new int();					// 翻牌ID
		public nTailTaken:int = new int();				// 尾上被抓牌张数
		public nCurrentCatch:int = new int();			// 当前抓牌位置
		public nPGCHWait:int = new int();				// 碰杠吃胡等待时间(秒)
		public nPGCHWaitEx:int = new int();			// 碰杠吃胡等待时间(追加)(秒)
		
		public nReserved:FixedArray = new FixedArray("int",8);
}