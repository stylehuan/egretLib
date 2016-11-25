class CGamePengCard  {

		public nUserID:int = new int();// 用户ID
		public nCardChair:int = new int();// 吃碰杠牌所属位置
		public nCardID:int = new int()// 吃碰杠牌ID
		public nBaseIDs:Array<int> = new Array<int>(Global.MJ_UNIT_LEN-1)// 手里或碰出的牌
}