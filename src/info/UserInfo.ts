class UserInfo{
		/**
		 * 从服务器上同步本地的用户数据 
		 */
		public static UpdatePlayerData(uId:number = 0):void{
			SocketEvent.addEventListener(Global.LSR_GET_PLAYERDATA.toString(),UserInfo.upDatePlayerDataHandler,this);
			var b:egret.ByteArray = new egret.ByteArray();
			b.endian = egret.Endian.LITTLE_ENDIAN;
			b.writeInt(uId);
			SQGameServer.getInstance().sendCmd(Global.LSR_GET_PLAYERDATA,b);
		}
		
		/**
		 * 更新用户数据
		 */
		private static upDatePlayerDataHandler(e:SocketEvent):void{
            SocketEvent.removeEventListener(Global.LSR_GET_PLAYERDATA.toString(),UserInfo.upDatePlayerDataHandler,this);
			if(!e.data.data) return;
			var b:egret.ByteArray = e.data.data;
			
			if(e.data.result == Global.UR_OPERATE_SUCCEEDED){
				var cGamePlayerData:CGamePlayerData = new CGamePlayerData();
				CSerializable.Deserialization(cGamePlayerData,b);
				SystemCenter.playSystem.selfPlayerInfo.gameUserInfo = cGamePlayerData.StatData;
				SystemCenter.playSystem.selfPlayerInfo.gameStatus = cGamePlayerData.GameData.dwStatus.value;
				SystemCenter.playSystem.selfPlayerInfo.GameData= cGamePlayerData.GameData;
                SystemCenter.playSystem.selfPlayerInfo.SaiquCoin = cGamePlayerData.UserInfo.nSaiquCoin.value;
                if(!baseUtil.isExitFlag(SystemCenter.playSystem.selfPlayerInfo.gameStatus, Global.LSPLAYER_STATUS_INSCENE))
                {
                    SystemCenter.playSystem.selfPlayerInfo.GameData.nScene.value= 0;
                }

				SystemCenter.playSystem.selfPlayerInfo.levelID = cGamePlayerData.StatData.nLevelID.value;
				SystemCenter.playSystem.selfPlayerInfo.levelName =  LevelInfo.getLevelName(SystemCenter.playSystem.selfPlayerInfo.levelID);
                SystemCenter.playSystem.selfPlayerInfo.fourAnimalLabel = cGamePlayerData.StatData.nFourBeast.value;
                var systemEvent: SystemEvent = new SystemEvent(SystemEvent.UPDATA_PLAYERDATA);
                //FourAnimalData.selfFourAnimalType(SystemCenter.playSystem.selfPlayerInfo);
                SystemEvent.dispatchEvents(systemEvent);
			}
		}
}