class CGameHU_UNIT extends CSerializable{

		public constructor(){
			super();
		}
		public dwType:int = new int();
		public dwFlag:int = new int();
		public aryIndexes:FixedArray = new FixedArray("int",Global.MJ_UNIT_LEN);
}