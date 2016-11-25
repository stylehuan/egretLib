class CGameCombCard {


		public nUserID:int = new int();
		public nCardChair:int = new int();// 牌所属位置
		public nCardID:int = new int();// 吃碰杠牌ID
		public nBaseIDs:FixedArray = new FixedArray("int",Global.MJ_UNIT_LEN-1);// 手里或碰出的牌
        public dwFlags: uint = new uint();// 标志位
		public dwFlags2:uint = new uint();// 标志位
}