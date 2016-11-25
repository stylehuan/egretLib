class FourAnimalData{
    public static hpStan:number = 30; 	// 胡牌率
    public static zmStan:number = 30;	// 自摸率
    public static hfStan:number = 20;	// 胡牌番
    public static dpStan:number = 90;	// 点炮率  1-
    public static hxStan:number = 22;		// 胡牌巡数

    public static hpStanMin:number = 10; 	// 胡牌率
    public static zmStanMin:number = 10;	// 自摸率
    public static hfStanMin:number = 8;	// 胡牌番
    public static dpStanMin:number = 70;	// 点炮率
    public static hxStanMin:number = 10;		// 胡牌巡数

    public static QLLabel:number=2;
    public static BHLabel:number=3;
    public static ZQLabel:number=4;
    public static XWLabel:number=5;

    public static QLData:Array<any> = [.15,.4,.25,.1,.1];   // 胡牌  自摸 胡番  胡巡 防守
    public static BHData:Array<any> = [.4,.15,.15,.15,.15];
    public static ZQData:Array<any> = [.3,.1,.1,.4,.1];
    public static XWData:Array<any> = [.3,.1,.1,.1,.4];

    //public static TypeTitle:any = {2:"青龙",3:"白虎",4:"朱雀",5:"玄武"};

    public static  getTite(type:number):string
    {
        switch(type)
        {
            case 1:
                return "青龙"
            case 2:
                return "白虎"
            case 3:
                return "朱雀"
            case 4:
                return "玄武"
        }
        return "";
    }

    public static selfDpZb(userInfo:PlayerInfo):number{
//        var dp:number = (1-FourAnimalData.formatData(userInfo.gameUserInfo.nFangCount.value,userInfo.gameUserInfo.nTotalBoutCount.value))*100;
//        if(dp < FourAnimalData.dpStanMin) dp = FourAnimalData.dpStanMin;
//        if(dp > FourAnimalData.dpStan) dp = FourAnimalData.dpStan;
//        return (dp -FourAnimalData.dpStanMin) / (FourAnimalData.dpStan -FourAnimalData.dpStanMin) ;

        var dp:number = FourAnimalData.formatData(userInfo.gameUserInfo.nFangCount.value,userInfo.gameUserInfo.nTotalBoutCount.value)*100;
        if(userInfo.gameUserInfo.nFangCount.value == 0 ) dp=0;
        if(dp < FourAnimalData.dpStanMin) dp = FourAnimalData.dpStanMin;
        if(dp > FourAnimalData.dpStan) dp = FourAnimalData.dpStan;
        return (dp -FourAnimalData.dpStanMin) / (FourAnimalData.dpStan -FourAnimalData.dpStanMin) ;
    }

    public static selfZmZb(userInfo:PlayerInfo):number{
        var zm:number = FourAnimalData.formatData(userInfo.gameUserInfo.nZimoCount.value,userInfo.gameUserInfo.nHuCount.value)*100 ;
        if(zm < FourAnimalData.zmStanMin) zm = FourAnimalData.zmStanMin;
        if(zm > FourAnimalData.zmStan) zm = FourAnimalData.zmStan;
        return (zm -FourAnimalData.zmStanMin) / (FourAnimalData.zmStan -FourAnimalData.zmStanMin) ;
    }

    public static selfHpZb(userInfo:PlayerInfo):number{
        var hp:number = FourAnimalData.formatData(userInfo.gameUserInfo.nHuCount.value,userInfo.gameUserInfo.nTotalBoutCount.value)*100;
        if(hp < FourAnimalData.hpStanMin) hp = FourAnimalData.hpStanMin;
        if(hp > FourAnimalData.hpStan) hp = FourAnimalData.hpStan;
        return (hp -FourAnimalData.hpStanMin) / (FourAnimalData.hpStan -FourAnimalData.hpStanMin) ;
    }

    public static selfHxZb(userInfo:PlayerInfo):number{
//        var hx:number = FourAnimalData.formatData(userInfo.gameUserInfo.nHuXunSum.value,userInfo.gameUserInfo.nHuCount.value);
//        if(hx < FourAnimalData.hxStanMin) hx = FourAnimalData.hxStanMin;
//        if(hx > FourAnimalData.hxStan) hx = FourAnimalData.hxStan;
//        var tmp:number =  1-(hx -FourAnimalData.hxStanMin) / (FourAnimalData.hxStan -FourAnimalData.hxStanMin) ;
//        return tmp;
       // var hx:Number = formatData(userInfo.gameUserInfo.nXunSum,userInfo.gameUserInfo.nTotalBoutCount);
        var hx:number = FourAnimalData.formatData(userInfo.gameUserInfo.nHuXunSum.value,userInfo.gameUserInfo.nTotalBoutCount.value);
//			var hx:Number = formatData(userInfo.gameUserInfo.nXunSum,userInfo.gameUserInfo.nTotalBoutCount);
        if(hx < FourAnimalData.hxStanMin) hx = FourAnimalData.hxStanMin;
        if(hx > FourAnimalData.hxStan) hx = FourAnimalData.hxStan;
        var tmp:number =  1-(hx -FourAnimalData.hxStanMin) / (FourAnimalData.hxStan -FourAnimalData.hxStanMin) ;
        return tmp;
    }

    public static selfHfZb(userInfo:PlayerInfo):number{
        var hf:number = FourAnimalData.formatData(userInfo.gameUserInfo.nFanSum.value,userInfo.gameUserInfo.nHuCount.value);
        if(hf < FourAnimalData.hfStanMin) hf = FourAnimalData.hfStanMin;
        if(hf > FourAnimalData.hfStan) hf = FourAnimalData.hfStan;
        return (hf -FourAnimalData.hfStanMin) / (FourAnimalData.hfStan -FourAnimalData.hfStanMin) ;
    }

    public static selfFourAnimalType(userInfo:PlayerInfo):number{
//        var dpZb:number = FourAnimalData.selfDpZb(userInfo);
//        var zmZb:number = FourAnimalData.selfZmZb(userInfo);
//        var hpZb:number = FourAnimalData.selfHpZb(userInfo);
//        var hxZb:number = FourAnimalData.selfHxZb(userInfo);
//        var hfZb:number = FourAnimalData.selfHfZb(userInfo);
//
//
//        // 检查自己的神兽属性
//        var qlZhi:number=0;
//        var bhZhi:number=0;
//        var zqZhi:number=0;
//        var xwZhi:number=0;
//        qlZhi = hpZb*FourAnimalData.QLData[0] + zmZb*FourAnimalData.QLData[1] + hfZb*FourAnimalData.QLData[2]+ hxZb*FourAnimalData.QLData[3]+ dpZb*FourAnimalData.QLData[4];
//        bhZhi = hpZb*FourAnimalData.BHData[0] + zmZb*FourAnimalData.BHData[1] + hfZb*FourAnimalData.BHData[2]+ hxZb*FourAnimalData.BHData[3]+ dpZb*FourAnimalData.BHData[4];
//        zqZhi = hpZb*FourAnimalData.ZQData[0] + zmZb*FourAnimalData.ZQData[1] + hfZb*FourAnimalData.ZQData[2]+ hxZb*FourAnimalData.ZQData[3]+ dpZb*FourAnimalData.ZQData[4];
//        xwZhi = hpZb*FourAnimalData.XWData[0] + zmZb*FourAnimalData.XWData[1] + hfZb*FourAnimalData.XWData[2]+ hxZb*FourAnimalData.XWData[3]+ dpZb*FourAnimalData.XWData[4];
//
//
//        var tempArray:Array<any>=[qlZhi,bhZhi,zqZhi,xwZhi];
//        tempArray.sort((n1,n2) => n1 - n2);
//        if(tempArray[3] == qlZhi){
//            userInfo.fourAnimalLabel.value = FourAnimalData.QLLabel;
//        }else if (tempArray[3] == bhZhi){
//            userInfo.fourAnimalLabel.value = FourAnimalData.BHLabel;
//        }else if (tempArray[3] == zqZhi){
//            userInfo.fourAnimalLabel.value = FourAnimalData.ZQLabel;
//        }else if (tempArray[3] == xwZhi){
//            userInfo.fourAnimalLabel.value = FourAnimalData.XWLabel;
//        }
//        return userInfo.fourAnimalLabel.value;
        return 0;
    }

    private static formatData(value:number,total:number = 0):number{
        if(total==0) return 0;
        return <number> (value/total);
    }
}