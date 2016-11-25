/**
 * Created by seethinks@gmail.com on 2016/8/3.
 */
class MatchInfo {
    public BeginTurnInvokeMark:number;  // 暂无用
    public BeginTurnSuccessMark:number; // 暂无用
    public BuildSeatInvokeMark:number;  // 暂无用
    public BuildSeatSuccessMark:number; // 暂无用
    public CurTurnIndex:number;         // -- 当前第几轮
    public EndTurnInvokeMark:number;    // 暂无用
    public EndTurnSuccessMark:number;   // 暂无用
    public MatchID:number;
    public MaxTurnIndex:number;         // -- 最大的轮数是几
    public Ocean:number;                // -- 是否是海选
    public OceanScoreType:number;       // --  海选的积分规则（如4321或者4210）
    public PlayerCount:number;
    public ScoreType:number;            // --  非海选的积分规则（如4321或者4210）
    public Status:number;
    public Detail:string;
    public RoomId:number;
    public RoomName:string;

    public SignupTime:string;  // 报名时间

}