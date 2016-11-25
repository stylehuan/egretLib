 class CGameHU_DETAILS extends CSerializable{

		public constructor(){
			super();
		}
//		public var dwHuFlags:Vector.<int> = new Vector.<int>(Global.MJ_HU_FLAGS_ARYSIZE,true)	// 胡牌标志	
//		public var nHuGains:Vector.<int> = new Vector.<int>(Global.MJ_HU_GAINS_ARYSIZE,true);			// 胡牌番数
//		public var nSubGains:Vector.<int> = new Vector.<int>(Global.MJ_HU_GAINS_ARYSIZE,true)		// 胡牌番数(辅助)
//		public var nUnitsCount:int;							// 胡牌牌型单元数
//		public var HU_UNIT:Vector.<CGameHU_UNIT> = new Vector.<CGameHU_UNIT>(Global.MJ_MAX_UNITS,true);				// 胡牌具体牌型
		
		
		
		public dwFlags:int = new int();// 胡牌标志
		public nQuanFengIndex:int = new int();
		public nMenFengIndex:int = new int();
		public nUnitsCount:int = new int();					// 胡牌牌型单元数
		public HU_UNIT:FixedArray = new FixedArray("CGameHU_UNIT",Global.MJ_MAX_UNITS);// 胡牌具体牌型
		public nHuGains:FixedArray = new FixedArray("int",Global.HU_MAXTYPE);// 胡牌番数
		public nGains:int = new int();//总的番数
		public nScore:int = new int();//加减的分数

}