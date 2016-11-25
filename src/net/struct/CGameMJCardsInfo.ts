class CGameMJCardsInfo {

    public bSelfCard: boolean = false;
    public bGangCard: boolean = false;
    public bTailCard: boolean = false;
    public bLastCard: boolean = false;
    public nQuanFeng: int = new int();
    public nMenFeng: int = new int();
    public nUnitsCount: int = new int();

    public PGCUnits: FixedArray = new FixedArray("CGameMJPgcUnit", Global.MJ_MAX_UNITS)

    public nHandCardIDs: FixedArray = new FixedArray("int", Global.MJ_CHAIR_CARDS)
    public nHuaCardIDs: FixedArray = new FixedArray("int", Global.MJ_MAX_HUA)
    public nHuCardID: int = new int();

}