class VectorUtil{
    public static vertorToArray(_v:any):Array<any>{
        var arr:Array<any> = [];
        if(_v){
            try
            {
                for(var i:number=0;i<_v.getLen();i++){
                    arr.push(_v.getAt(i).value);
                }
            }catch(Error)
            {
                for(var i:number=0;i<_v.length;i++){
                    arr.push(_v[i].value);
                }
            }
        }

        return arr;
    }
}