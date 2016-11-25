class CRC32 {
		public constructor(){}
		
		/** The crc data checksum so far. */
		private crc:number = 0;
		
		/** The fast CRC table. Computed once when the CRC32 class is loaded. */
		private static crcTable:Array<number> = CRC32.makeCrcTable();
		
		/** Make the table for a fast CRC. */
		public static makeCrcTable():Array<number> {
			var crcTable:Array<number> = new Array<number>(256);
			for (var n:number = 0; n < 256; n++) {
				var c:number = n;
				for (var k:number = 8; --k >= 0; ) {
					if((c & 1) != 0) c = 3988292384 ^ (c >>> 1);
                    //if((c & 1) != 0) c = 0xedb88320 ^ (c >>> 1);
                    // 3988292384
					else c = c >>> 1;
				}
				crcTable[n] = c;
			}
			return crcTable;
		}
		
		/**
		 * Returns the CRC32 data checksum computed so far.
		 */
		public getValue():number {
			return this.crc & 4294967295;
            // return this.crc & 0xffffffff;
		}
		
		/**
		 * Resets the CRC32 data checksum as if no update was ever called.
		 */
		public reset():void {
			this.crc = 0;
		}
		
		/**
		 * Adds the complete byte array to the data checksum.
		 * 
		 * @param buf the buffer which contains the data
		 */
		public update(buf:egret.ByteArray):void {
			var off:number = 0;
			var len:number = buf.length;
			var c:number = ~this.crc;
			// while(--len >= 0) c = CRC32.crcTable[(c ^ buf[off++]) & 0xff] ^ (c >>> 8);
            //while(--len >= 0) c = CRC32.crcTable[(c ^ buf[off++]) & 255] ^ (c >>> 8);
            buf.position = 0;
            for(var i:number = 0 ; i<buf.length;i++)
            {
                c = CRC32.crcTable[(c ^ +buf.readByte()) & 255] ^ (c >>> 8);
            }
			this.crc = ~c;
		}
}