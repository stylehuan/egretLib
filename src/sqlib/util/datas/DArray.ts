/**
 * Created by seethinks@gmail.com on 2015/8/20.
 */
class DArray
{
    private arr:Array<any>;
    public type:string

    public constructor(type:string) {
        this.type = type;
        this.arr = new Array<any>();
    }

    public getAt(index:number):any
    {
        return this.arr[index]
    }
    public setAt(index:number,value:any)
    {
        this.arr[index] = value;
    }

    public setLen(value:number):void
    {
        this.arr.length = value;
    }

    public getLen():number
    {
        return this.arr.length;
    }
}