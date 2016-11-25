class CGameCuoHu extends CSerializable{

		public constructor(){
			super();
		}
		public nUserID:int = new int();// 用户ID
		public nCardsCount:int = new int();/// 每个玩家手里的牌的张数
		public nChairCards:FixedArray = new FixedArray("int",Global.CHAIR_CARDS);	// 自己手里的牌
}