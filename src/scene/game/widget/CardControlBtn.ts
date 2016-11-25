/**
 * Created by seethinks@gmail.com on 2015/11/6.
 */
class CardControlBtn extends SQ.Button {
    public type: number = 0;

    public constructor(defaultSkin: string, hoverSkin: string, pressSkin: string) {
        super(defaultSkin, hoverSkin, pressSkin);
    }
}