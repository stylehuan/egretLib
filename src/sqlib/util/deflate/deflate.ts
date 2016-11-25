class deflate {

    public static__ltree:huffman_tree; //静态Huffman编码时,用来对没有改动的字节和匹配长度进行编码的树
    public static__dtree:huffman_tree; //静态Huffman编码时,用来对相隔距离进行编码的树
    private dynamic_ltree:huffman_tree; //动态Huffman编码时,用来对没有改动的字节和匹配长度进行编码的树
    private dynamic_dtree:huffman_tree; //动态Huffman编码时,用来对相隔距离进行编码的树
    private bl_tree:huffman_tree; //动态Huffman编码时,用来对解压缩时用来产生dyn_ltree和dyn_dtree的信息进行编码的树


    private istream:bit_stream;
    private ostream:egret.ByteArray;
    //Private OutPos As Long
    private lc:huffman_tree;
    private dc:huffman_tree;
    private len_order:Array<number>;

    public constructor() {
        this.len_order = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
        this.lc = new huffman_tree();
        this.lc.codes_decode = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0, 0];
        this.lc.codes_length = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0, 0, 0, 0];
        this.dc = new huffman_tree();
        this.dc.codes_decode = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577, 32769, 49153];
        this.dc.codes_length = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, 14, 14];

        //    OutPos = 0

        this.create_static_tree();
    }

    private create_static_tree():void {
        var lengths:Array<number> = new Array<number>(288);
        this.initArrayByNumber(lengths,0);
        for (var i:number = 0; i < 144; i++) lengths[i] = 8;
        for (var i:number = 144; i < 256; i++) lengths[i] = 9;
        for (var i:number = 256; i < 280; i++) lengths[i] = 7;
        for (var i:number = 280; i < 288; i++) lengths[i] = 8;
        this.static__ltree = new huffman_tree();
        this.create_codes(this.static__ltree, lengths, 288);

        for (var i:number = 0; i < 32; i++) lengths[i] = 5;
        this.static__dtree = new huffman_tree();
        this.create_codes(this.static__dtree, lengths, 32);
    }

    private create_codes(tree:huffman_tree, lengths:Array<number>, codes_count:number = 0):void {
        tree.min_length = 16;
        tree.max_length = 0;

        var bl_count:Array<number> = new Array<number>(17);
        this.initArrayByNumber(bl_count,0);
        for (var i:number = 0; i < codes_count; i++) {
            bl_count[lengths[i]]++;
            if (lengths[i] > tree.max_length) tree.max_length = lengths[i];
            if (lengths[i] < tree.min_length && lengths[i] > 0) tree.min_length = lengths[i];
        }
        {
            var ln:number = 1;
            for (var i:number = 1; i <= tree.max_length; i++) {
                ln = ln * 2 - bl_count[i];
                if (ln < 0) throw new Error();
            }
            if (ln) throw new Error();
        }

        tree.codes_length = new Array<number>(1 << tree.max_length);
        this.initArrayByNumber(tree.codes_length,0);
        tree.codes_decode = new Array<number>(1 << tree.max_length);
        this.initArrayByNumber(tree.codes_decode,0);

        var next_code:Array<number> = new Array<number>(17);
        this.initArrayByNumber(next_code,0);
        {
            var code:number = 0;
            for (var i:number = 1; i <= tree.max_length; i++) {
                code = (code + bl_count[i - 1]) * 2;
                next_code[i] = code;
            }
        }

        for (var i:number = 0; i < codes_count; i++) {
            var ln:number = lengths[i];
            if (ln != 0) {
                var code:number = deflate.bit_reverse(next_code[ln], ln);
                tree.codes_length[code] = ln;
                tree.codes_decode[code] = i;
                next_code[ln]++;
            }
        }
    }

    private static bit_reverse(value:number, bits_count:number = 0):number {
        var ret:number = 0;
        while (bits_count > 0) {
            ret = ((ret << 1) | (value & 1));
            bits_count--;
            value >>>= 1;
        }
        return ret;
    }

    public initArrayByNumber(arr:Array<number>,value:number)
    {
        var i:number = 0;
        for(i =0;i<arr.length;i++)
        {
            arr[i] = value;
        }
    }
		
		public uncompress(data:egret.ByteArray, zip64:boolean = false):void{
			if (data.length == 0)
				return;
			this.istream = new bit_stream(data);
			this.ostream = new egret.ByteArray();
			//=============================================================================
			//compression extreme: 78DA
			//compression standard:789C
			//compression faible:  785E
			switch (this.istream.getbits(16)) {
				case 0xDA78:
				case 0x9C78:
				case 0x5E78:
					break;
				default:throw new Error();
			}
			//=============================================================================
			for (var is_last_block:number = 0; !is_last_block; ){
				is_last_block = this.istream.getbits(1)
				switch (this.istream.getbits(2)){
				case 0:
					this.istream.getbits((8 - this.istream.getpos() % 8) % 8);
					
					var length:number = this.istream.getbits(16);
					var not_length:number = this.istream.getbits(16);
					if ((length ^ ~not_length) & 0xFFFF) throw new Error();
				
					for (var i:number = 0; i < length; i++ )
						this.ostream.writeByte(this.istream.getbits(8));
					break;
				case 1:
					this.uncompress_block(this.static__ltree, this.static__dtree, zip64);
					break;
				case 2:
					this.create_dynamic_tree();
					this.uncompress_block(this.dynamic_ltree, this.dynamic_dtree, zip64);
					break;
				case 3:
					throw new Error();
				}
			}
			data.clear();
			data.writeBytes(this.ostream, 0, this.ostream.length);
		}
		
		
		private create_dynamic_tree():void{
			var len_count = this.istream.getbits(5) + 257;
			var dist_count = this.istream.getbits(5) + 1;
			var codes_count = this.istream.getbits(4) + 4;
			var length:Array<number> = new Array<number>(19);
            this.initArrayByNumber(length,0);
			for (var i :number = 0 ; i < codes_count ;i++)
				length[this.len_order[i]] = this.istream.getbits(3);
			for (var i:number = codes_count ; i < 19;i++)
				length[this.len_order[i]] = 0;
			this.bl_tree = new huffman_tree();
			this.create_codes(this.bl_tree, length, 19)
			
			
			length= new Array<number>(len_count + dist_count);
            this.initArrayByNumber(length,0);
			for (var pos:number = 0; pos < len_count + dist_count;){
				var nu_bits:number = this.bl_tree.min_length;
				while( this.bl_tree.codes_length[this.istream.getbits(nu_bits,false)] != nu_bits)
					nu_bits++;
				
				var copy:number = this.bl_tree.codes_decode[this.istream.getbits(nu_bits)];
				
				if ( copy < 16){
					length[pos] = copy;
					pos ++;
				}
				else{
					var ln:number = 0;
					switch(copy){
						case 16:
							//=============================================================================
							if( pos == 0) throw new Error();
							//=============================================================================
							copy = 3 + this.istream.getbits(2);
							ln = length[pos - 1];
							break;
						case 17:
							copy = 3 + this.istream.getbits(3);
							break;
						default:
							copy = 11 + this.istream.getbits(7);
							break;
					}
					//=============================================================================
					if ( pos + copy > len_count + dist_count ) throw new Error();
					//=============================================================================
					for (; copy > 0;copy--){
						length[pos] = ln;
						pos++;
					}
				}
			}
			this.dynamic_ltree = new huffman_tree();
			this.create_codes(this.dynamic_ltree, length, len_count);
			 
			for (var i:number = 0 ; i < dist_count;i++)
			    length[i] = length[i + len_count];
			this.dynamic_dtree = new huffman_tree();
			this.create_codes(this.dynamic_dtree, length, dist_count);
		}

		private uncompress_block(ltree:huffman_tree, dtree:huffman_tree, zip64:boolean){
			while(true){
				var nu_bits:number = ltree.min_length;
				while(ltree.codes_length[this.istream.getbits(nu_bits,false)] != nu_bits)
					nu_bits++;
				
				var value:number = ltree.codes_decode[this.istream.getbits(nu_bits)];
				if (value == 256) {
					break;
				}
				else if (value < 256) {
					this.ostream.writeByte(value);
				}
				else{
					value -= 257;
					var length:number = this.lc.codes_decode[value] + this.istream.getbits(this.lc.codes_length[value]);
					if (length == 258 && zip64) length = this.istream.getbits(16) + 3;
				
					nu_bits = dtree.min_length;
					while( dtree.codes_length[this.istream.getbits(nu_bits,false)] != nu_bits)
						nu_bits++;
					
					value = dtree.codes_decode[this.istream.getbits(nu_bits)];
					
					var distance:number = this.dc.codes_decode[value] + this.istream.getbits(this.dc.codes_length[value]);
					for (var i:number = 0 ; i < length;i++)
                    {
                        var ostreamP:number = this.ostream.position;
                        this.ostream.position = ostreamP - distance;
                        var tempN:number = this.ostream.readByte()&0xff;
                        this.ostream.position = ostreamP;
                        this.ostream.writeByte(tempN);
						//this.ostream.writeByte(this.ostream[this.ostream.position - distance]);
                    }
				}
			}

		}
}