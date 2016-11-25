class CGameTableInfo {

    public StartData:CGameStartInfo = new CGameStartInfo();
    public PlayData:CGameMJPlayData = new CGameMJPlayData();

    public  dwCurrentFlags:uint = new uint();

    public nLatestCard:int = new int();//杠个数
    public nTimeRemain:int = new int();//杠个数
    public curThrowCard:int = new int();//杠个数
}