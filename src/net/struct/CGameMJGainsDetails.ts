class CGameMJGainsDetails {
    public dwFlags: uint = new uint();
    public nQuanFengIndex: int = new int();
    public nMenFengIndex: int = new int();
    public nUnitsCount: int = new int();
    public HuUnits: FixedArray = new FixedArray("CGameHuUnit", Global.MJ_MAX_UNITS)
    public nHuGains: FixedArray = new FixedArray("int", Global.HU_MAXTYPE)      //番种的番数是多少
    public nGains: int = new int();   //总番数  包括花
    public nScore: int = new int();   //积分
}