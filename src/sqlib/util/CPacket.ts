class CPacket {

    private KEY:Array<number> = [95,1,41,88,19,6,17,12,13,47,53,56,57,14,86,85,12,53,81,87,65,34,35,55,1,40,10,81,93,76,92,90,28,14,74,84,50,53,61,27,30,12,8,38,63,40,73,24,85,56,2,29,22,16,36,10,57,99,44,40,30,22,82,33,51,78,75,98,55,2,23,12,61,61,38,25,79,63,96,85,20,1,25,90,48,15,13,63,48,82,34,56,21,29,15,75,7,72,12,31,24,82,19,21,47,72,6,21,94,11,68,21,56,64,17,72,34,58,82,66,13,65,47,32,59,24,6,67];
    //private KEY:Array<any> = new Array<any>();

    public sys_type:number = 0;
    public session_id:number = 0;
    public echo_wait:number = 0;
    public msg_type:number = 0;
    public request:number = 0;
    public encrypt:number = 0;
    public encryptoriginlen:number = 0;
    public compress:number = 0;
    public compressoriginlen:number = 0;
    public raw_data:egret.ByteArray=new egret.ByteArray();

    //private zips:zip;

    public constructor() {
        //this.zips = new zip();
    }


    public ToBytes(buff:egret.ByteArray):void{

        this.compressoriginlen = this.raw_data.length;
        //this.raw_data.compress();
        this.encryptoriginlen = this.raw_data.length;
        //var key:egret.ByteArray = new egret.ByteArray();
        //for (var i:number = 0; i < 16/*KEY.length*/; i++) key.writeByte(this.KEY[i]);
        //var aes:ICipher = Crypto.getCipher("aes-128-ecb", key, Crypto.getPad("null"));
        //while (this.raw_data.length % 16 != 0) this.raw_data.writeByte(0);
        //aes.encrypt(this.raw_data);

        buff.endian = egret.Endian.LITTLE_ENDIAN;
        buff.clear();
        buff.writeInt(0);
        buff.writeInt(0);
        buff.writeInt(this.sys_type);
        buff.writeInt(this.session_id);
        buff.writeInt(this.echo_wait);
        buff.writeInt(this.msg_type);
        buff.writeInt(this.request);
        buff.writeInt(this.encrypt);
        buff.writeInt(this.encryptoriginlen);
        buff.writeInt(this.compress);
        buff.writeInt(this.compressoriginlen);
        buff.writeBytes(this.raw_data, 0, this.raw_data.length);
        buff.position = 0;
        buff.writeInt(buff.length);

        var crc32:CRC32 = new CRC32();
        crc32.reset();
        crc32.update(buff);
        buff.position = 4;
        CPacket.writeBinInt(buff,crc32.getValue())
    }
    public FromBytes(buff:egret.ByteArray):boolean{
        if (buff.bytesAvailable >= 4) {
            var pos:number = buff.position;
            var msg_size:number = buff.readInt();
            if (msg_size < 0 || msg_size > 0xffff) {
                throw <Error><any> ("msg size error!");
                //UWL_FATAL("The message size (%x)in decodebuffer is not right, destroy", msg_size);
                return false;
            }

            if (buff.bytesAvailable < msg_size - 4) {
                buff.position = pos;
                return false;
            }

            var crc:number = buff.readInt();
            var tmp:egret.ByteArray = new egret.ByteArray();
            buff.position = pos;
            buff.readBytes(tmp, 0, msg_size);
            tmp.position = 4;
            tmp.writeInt(0);

            var crc32:CRC32 = new CRC32();
            crc32.reset();
            crc32.update(tmp);
            if (crc32.getValue() != crc) {
                throw <Error><any> ("crc check error!");
                return false;
            }

            tmp.position = 8;
            this.sys_type = tmp.readInt();
            this.session_id = tmp.readInt();
            //console.log("this.session_id:"+this.session_id)
            this.echo_wait = tmp.readInt();
            this.msg_type = tmp.readInt();
            // console.log("this.msg_type:"+this.msg_type)
            this.request = tmp.readInt();
            //console.log("this.request:"+this.request)
            this.encrypt = tmp.readInt();
            this.encryptoriginlen = tmp.readInt();
            this.compress = tmp.readInt();
            this.compressoriginlen = tmp.readInt();
            tmp.readBytes(this.raw_data, 0, tmp.bytesAvailable);
            //console.log("tmp:"+tmp)
            var key:egret.ByteArray = new egret.ByteArray();
            for (var i:number = 0; i < 16/*KEY.length*/; i++) key.writeByte(this.KEY[i]);

//            for(var jj:number =0 ;jj<this.raw_data.length;jj++)
//            {
//                this.raw_data.position = jj;
//                console.log("dd:"+this.raw_data.readByte());
//            }

            if(this.encrypt !=0)
            {
                if(this.raw_data != null)
                {
                    var raw_data2:egret.ByteArray = new egret.ByteArray();
                    var aes2:rijndael = new rijndael();
                    aes2.Decrypt(key, this.raw_data, raw_data2);
                    this.raw_data = raw_data2;
                }
            }
//            console.log("----------------------------------------------");
//            for(var jj:number =0 ;jj<this.raw_data.length;jj++)
//            {
//                this.raw_data.position = jj;
//                console.log("dd:"+this.raw_data.readByte());
//            }
            //var aes:ICipher = Crypto.getCipher("aes-128-ecb", key, Crypto.getPad("null"));
            //aes.decrypt(this.raw_data);
//				trace("1:",raw_data.length);
//				trace("raw_data:",raw_data[0],raw_data[1]);
//				this.raw_data.uncompress();
            //trace("2:",raw_data.length);
            var def:deflate = new deflate();
//            var i:number ;
//            for(i=0;i<def.static__dtree.codes_decode.length;i++)
//            {
//                console.log("static__dtree:"+def.static__dtree.codes_decode[i]);
//            }
//            console.log("===========================================");
//            for(i=0;i<def.static__ltree.codes_decode.length;i++)
//            {
//                console.log("static__ltree:"+def.static__ltree.codes_decode[i]);
//            }
            if (this.compress !=0)
            {
                if (this.raw_data != null) def.uncompress(this.raw_data);

            }
            if (this.raw_data != null) this.raw_data.position = 0;
//            console.log("===========================================");
//            for(var jj:number =0 ;jj<this.raw_data.length;jj++)
//            {
//                this.raw_data.position = jj;
//                console.log("dd:"+this.raw_data.readByte());
//            }
            return true;
        }
        return false;
    }

    public static writeBinInt(b:egret.ByteArray,value:number)
    {
        if(-2147483648<=value && value<=2147483647)
            b.writeInt(value)
        else if(0<=value && value<4294967295)
            b.writeUnsignedInt(value)
        else
            console.log("二进制数据超出范围，来源 writeBinInt")
    }
}