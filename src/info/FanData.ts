class FanData {
    public static cardFanMap: HashMap<number,string>;

    public constructor() {
    }

    public static setUp(): void {
        FanData.cardFanMap = new HashMap<number, string>();

        FanData.cardFanMap.set(0, "HU_BASEFAN$底番$0");
        FanData.cardFanMap.set(1, "HU_DA4XI$大四喜$88");
        FanData.cardFanMap.set(2, "HU_DA3YUAN$大三元$88");
        FanData.cardFanMap.set(3, "HU_LV1SE$绿一色$88");
        FanData.cardFanMap.set(4, "HU_9LIANBAODENG$九莲宝灯$88");
        FanData.cardFanMap.set(5, "HU_4GANG$四杠$88");
        FanData.cardFanMap.set(6, "HU_LIAN7DUI$连七对$88");
        FanData.cardFanMap.set(7, "HU_13YAO$十三幺$88");
        FanData.cardFanMap.set(8, "HU_QING19$清幺九$64");
        FanData.cardFanMap.set(9, "HU_XIAO4XI$小四喜$64");
        FanData.cardFanMap.set(10, "HU_XIAO3YUAN$小三元$64");
        FanData.cardFanMap.set(11, "HU_ZI1SE$字一色$64");
        FanData.cardFanMap.set(12, "HU_4ANKE$四暗刻$64");
        FanData.cardFanMap.set(13, "HU_1SE2LONGHUI$一色双龙会$64");
        FanData.cardFanMap.set(14, "HU_1SE4TONGSHUN$一色四同顺$48");
        FanData.cardFanMap.set(15, "HU_1SE4JIEGAO$一色四节高$48");
        FanData.cardFanMap.set(16, "HU_1SE4BUGAO$一色四步高$32");
        FanData.cardFanMap.set(17, "HU_3GANG$三杠$32");
        FanData.cardFanMap.set(18, "HU_HUN19$混幺九$32");
        FanData.cardFanMap.set(19, "HU_7DUI$七对$24");
        FanData.cardFanMap.set(20, "HU_7XINGBK$七星不靠$24");
        FanData.cardFanMap.set(21, "HU_QUAN2KE$全双刻$24");
        FanData.cardFanMap.set(22, "HU_QING1SE$清一色$24");
        FanData.cardFanMap.set(23, "HU_1SE3TONGSHUN$一色三同顺$24");
        FanData.cardFanMap.set(24, "HU_1SE3JIEGAO$一色三节高$24");
        FanData.cardFanMap.set(25, "HU_QUANDA$全大$24");
        FanData.cardFanMap.set(26, "HU_QUANZHONG$全中$24");
        FanData.cardFanMap.set(27, "HU_QUANXIAO$全小$24");
        FanData.cardFanMap.set(28, "HU_QINGLONG$清龙$16");
        FanData.cardFanMap.set(29, "HU_3SE2LONGHUI$三色双龙会$16");
        FanData.cardFanMap.set(30, "HU_1SE3BUGAO$一色三步高$16");
        FanData.cardFanMap.set(31, "HU_QUANDAI5$全带五$16");
        FanData.cardFanMap.set(32, "HU_3TONGKE$三同刻$16");
        FanData.cardFanMap.set(33, "HU_3ANKE$三暗刻$16");
        FanData.cardFanMap.set(34, "HU_QUANBUKAO$全不靠$12");
        FanData.cardFanMap.set(35, "HU_ZUHELONG$组合龙$12");
        FanData.cardFanMap.set(36, "HU_DAYU5$大于五$12");
        FanData.cardFanMap.set(37, "HU_XIAOYU5$小于五$12");
        FanData.cardFanMap.set(38, "HU_3FENGKE$三风刻$12");
        FanData.cardFanMap.set(39, "HU_HUALONG$花龙$8");
        FanData.cardFanMap.set(40, "HU_TUIBUDAO$推不倒$8");
        FanData.cardFanMap.set(41, "HU_3SE3TONGSHUN$三色三同顺$8");
        FanData.cardFanMap.set(42, "HU_3SE3JIEGAO$三色三节高$8");
        FanData.cardFanMap.set(43, "HU_WUFANHU$无番胡$8");
        FanData.cardFanMap.set(44, "HU_MIAOSHOUHUICHUN$妙手回春$8");
        FanData.cardFanMap.set(45, "HU_HAIDILAOYUE$海底捞月$8");
        FanData.cardFanMap.set(46, "HU_GANGKAI$杠上开花$8");
        FanData.cardFanMap.set(47, "HU_QIANGGANGHU$抢杠胡$8");
        FanData.cardFanMap.set(48, "HU_PNPN$碰碰胡$6");
        FanData.cardFanMap.set(49, "HU_HUN1SE$混一色$6");
        FanData.cardFanMap.set(50, "HU_3SE3BUGAO$三色三步高$6");
        FanData.cardFanMap.set(51, "HU_5MENQI$五门齐$6");
        FanData.cardFanMap.set(52, "HU_QUANQIUREN$全求人$6");
        FanData.cardFanMap.set(53, "HU_2ANGANG$双暗杠$6");
        FanData.cardFanMap.set(54, "HU_2JIANKE$双箭刻$6");
        FanData.cardFanMap.set(55, "HU_QUANDAIYAO$全带幺$4");
        FanData.cardFanMap.set(56, "HU_BUQIUREN$不求人$4");
        FanData.cardFanMap.set(57, "HU_2MINGGANG$双明杠$4");
        FanData.cardFanMap.set(58, "HU_JUEZHANG$和绝张$4");
        FanData.cardFanMap.set(59, "HU_JIANKE$箭刻$2");
        FanData.cardFanMap.set(60, "HU_QUANFENGKE$圈风刻$2");
        FanData.cardFanMap.set(61, "HU_MENFENGKE$门风刻$2");
        FanData.cardFanMap.set(62, "HU_MENQIANQING$门前清$2");
        FanData.cardFanMap.set(63, "HU_PINGHU$平胡$2");
        FanData.cardFanMap.set(64, "HU_4GUI1$四归一$2");
        FanData.cardFanMap.set(65, "HU_2TONGKE$双同刻$2");
        FanData.cardFanMap.set(66, "HU_2ANKE$双暗刻$2");
        FanData.cardFanMap.set(67, "HU_ANGQANG$暗杠$2");
        FanData.cardFanMap.set(68, "HU_DUANYAO$断幺$2");
        FanData.cardFanMap.set(69, "HU_YIBANGAO$一般高$1");
        FanData.cardFanMap.set(70, "HU_XIXIANGFENG$喜相逢$1");
        FanData.cardFanMap.set(71, "HU_LIAN6$连六$1");
        FanData.cardFanMap.set(72, "HU_LAOSHAOFU$老少副$1");
        FanData.cardFanMap.set(73, "HU_YAOJIUKE$幺九刻$1");
        FanData.cardFanMap.set(74, "HU_MINGGANG$明杠$1");
        FanData.cardFanMap.set(75, "HU_QUE1MEN$缺一门$1");
        FanData.cardFanMap.set(76, "HU_WUZI$无字$1");
        FanData.cardFanMap.set(77, "HU_BIANZHANG$边张$1");
        FanData.cardFanMap.set(78, "HU_KANZHANG$坎张$1");
        FanData.cardFanMap.set(79, "HU_DANDIAOJIANG$单钓将$1");
        FanData.cardFanMap.set(80, "HU_ZIMO$自摸$1");
        FanData.cardFanMap.set(81, "HU_HUAPAI$花牌$1");
        FanData.cardFanMap.set(82, "HU_MINGANGUANG$明暗杠$5");
    }

    public static getFanName(id: number = 0): string {
        var str: string = FanData.cardFanMap.get(id);
        var arr = str.split("$");
        return arr[1];
    }

    public static getFanType(id: number = 0): string {
        var str: string = FanData.cardFanMap.get(id);
        var arr = str.split("$");
        return arr[0];
    }

    public static getFanMax(id: number): number {
        var str: string = FanData.cardFanMap.get(id);
        var arr = str.split("$");
        return parseInt(arr[2], 10);
    }
}