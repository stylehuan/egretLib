class LevelInfo{
		public static LevelInfoTalbe:Array<CLSLevelItem> = new Array<CLSLevelItem>()

        public static getLevelUpgradeScore(levelID:number = 0):number
        {
            if(LevelInfo.LevelInfoTalbe && LevelInfo.LevelInfoTalbe.length){
                for(var i:number=0;i<LevelInfo.LevelInfoTalbe.length;i++){
                    if(levelID == LevelInfo.LevelInfoTalbe[i].nLevelID.value){
                        return LevelInfo.LevelInfoTalbe[i].nUpgradeScore.value;
                    }
                }
            }
            return 9999999;
        }

		public static getLevelName(levelID:number = 0):string{
			if(LevelInfo.LevelInfoTalbe && LevelInfo.LevelInfoTalbe.length){
				for(var i:number=0;i<LevelInfo.LevelInfoTalbe.length;i++){
					if(levelID == LevelInfo.LevelInfoTalbe[i].nLevelID.value){
						return LevelInfo.LevelInfoTalbe[i].sName;
					}
				}
			}
			return "";
		}
}