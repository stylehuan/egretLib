class bit_stream {
		private bit_pos:number = 0;
		private bit_data:egret.ByteArray;
		
		public constructor(data:egret.ByteArray=null) {
			this.bit_pos = 0;
			this.bit_data = new egret.ByteArray();
			if (data != null)
				this.bit_data.writeBytes(data,0, data.length);
		}
		
		public getpos():number {
			return this.bit_pos;
		}
		
		public getbits(count:number,move_pos:boolean=true):number {
			var value:number = 0;
			for (var i :number = 0; i < count; i++ ) {
				var pos:number = this.bit_pos + i;
				var bit_index:number = pos % 8;
				var arr_index:number = (pos - bit_index) / 8;
                this.bit_data.position = arr_index;
                var tempValue:number = this.bit_data.readByte()&0xff;
				value |= ((( tempValue>>> bit_index) & 1) << i);
			}
			if (move_pos)
				this.bit_pos += count;
			return value;
		}
}