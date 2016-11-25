class CSerializable {

    public constructor() {

    }

    /**
     * 序列化 c的结构体
     * @param data
     * @param outArray
     * @constructor
     */
    public static Serialization(data: any, outArray: egret.ByteArray) {
        outArray.endian = egret.Endian.LITTLE_ENDIAN;
        for (var key in data) {
            if (key.charAt(0) == "_") continue;
            var type: string = this.checkType(data[key]);
            this._Serialization(data[key], outArray, type);
        }
    }

    private static checkType(cv: any): string {
        if (cv.__class__ == undefined) {
            if (Array.isArray(cv)) {
                return "Array";
            } else {
                return typeof (cv);
            }
        } else {
            return cv.__class__;
        }
    }

    public static _Serialization(cv: any, outArray: egret.ByteArray, valueType: string) {
        switch (valueType) {
            case "int":
                if (cv == null) {
                    outArray.writeInt(0);
                } else {
                    outArray.writeInt(cv.value);
                }
                break;
            case "string":
                if (cv == null) {
                    outArray.writeUnsignedInt(1);
                    outArray.writeByte(0);
                } else {
                    var ba: egret.ByteArray = new egret.ByteArray();
                    ba.endian = egret.Endian.LITTLE_ENDIAN;
                    //ba.writeUTF(cv);
                    //ba.writeUTFBytes(cv);
                    this.writeGB2312Bytes(ba, cv);
                    ba.writeByte(0);
                    ba.position = 0;
                    outArray.writeUnsignedInt(ba.length);
                    outArray.writeBytes(ba, 0, ba.length);
                }
                break;
            case "boolean":
                if (cv == null) {
                    outArray.writeInt(0);
                } else {
                    outArray.writeInt(cv);
                }
                break;
            case "uint":
                if (cv == null) {
                    outArray.writeUnsignedInt(0);
                } else {
                    outArray.writeUnsignedInt(cv.value);
                }
                break;
            case "double":
                if (cv == null) {
                    outArray.writeDouble(0);
                } else {
                    outArray.writeDouble(cv.value);
                }
                break;
            default:
                if (valueType == "FixedArray") {
                    if (cv == null) throw {}
                    var len2: number = cv.getLen();
                    //.writeUnsignedInt( len2);
                    for (var i = 0; i < len2; i++) {
                        this._Serialization(cv.getAt(i), outArray, this.checkType(cv.getAt(i)));
                        //  this.Serialization(cv.getAt(i), outArray);
                    }
                } else if (valueType == "Array") // 这里肯定是array
                {
                    if (cv == null) {
                        outArray.writeInt(0);
                    } else {
                        var len2: number = cv.getLen();
                        outArray.writeUnsignedInt(len2);
                        for (var i = 0; i < len2; i++) {
                            this._Serialization(cv.getAt(i), outArray, this.checkType(cv.getAt(i)));
                            //    this.Serialization(cv.getAt(i), outArray);
                        }
                    }
                } else {
                    if (cv == null) cv = new (egret.getDefinitionByName(valueType));
                    // cv = new (egret.getDefinitionByName(type) as Class)();
                    this.Serialization(cv, outArray);
                }
        }
    }

    /**
     * 反序列化 C 结构体
     * @param data
     * @param outArray   要传入的序列化数据，应该是inArray
     * @constructor
     */
    public static Deserialization(data: any, outArray: egret.ByteArray) {
        outArray.endian = egret.Endian.LITTLE_ENDIAN;
        for (var key in data) {
            if (key.charAt(0) == "_") continue;
            var type: string = this.checkType(data[key]);
            data[key] = this._Deserialization(data[key], outArray, type);
        }
    }

    public static _Deserialization(cv: any, data: egret.ByteArray, valueType: string): any {
        if (data.bytesAvailable > 0) {
            switch (valueType) {
                case "int":
                    var tempInt: int = new int();
                    tempInt.value = data.readInt();
                    return tempInt;
                    break;
                case "uint":
                    var tempUint: int = new uint();
                    tempUint.value = data.readUnsignedInt();
                    return tempUint;
                    break;
                case "boolean":
                    return data.readInt();
                    break;
                case "double":
                    var tempDouble: int = new double();
                    tempDouble.value = data.readDouble();
                    return tempDouble;
                    break;
                case "string":
                    var len: number = data.readUnsignedInt();
                    return this.readGB2312Bytes(data, len);
                    break;
                default:
                    //console.log("valueType:" + valueType)
                    if (valueType == "FixedArray") {
                        if (cv == null) throw {}
                        var len2: number = cv.getLen();
                        for (var i = 0; i < len2; i++) {
                            if (cv.getAt(i) == null) cv.setAt(i, new (egret.getDefinitionByName(cv.type)));
                            var value = this._Deserialization(cv.getAt(i), data, this.checkType(cv.getAt(i)));
                            cv.setAt(i, value);
                        }
                        return cv;
                    } else if (valueType == "DArray") {
                        var len3: number = data.readInt();
                        cv.setLen(len3);
                        for (var i = 0; i < len3; i++) {
                            if (cv[i] == null) cv[i] = new (egret.getDefinitionByName(cv.type));
                            cv.setAt(i, this._Deserialization(cv[i], data, this.checkType(cv[i])))
                            // console.log("this.checkType(cv[i]):"+this.checkType(cv[i]+"  to:"+cv.toString()))
                            //cv[i]=this._Deserialization(cv[i],data,this.checkType(cv[i]));
                        }
                        //console.log("222222222 cv:" + cv)
                        return cv;
                    } else {
                        if (cv == null) cv = new (egret.getDefinitionByName(valueType));
                        this.Deserialization(cv, data);
                        return cv;
                    }
                    break;
            }
        } else {
            return {};
        }
    }

    public static writeGB2312Bytes(ba: egret.ByteArray, str: string): void {
        var utf8: egret.ByteArray = new egret.ByteArray();
        utf8.writeUTFBytes(str);
        utf8.position = 0;
        while (utf8.bytesAvailable > 0) {
            var c: number = (utf8.readByte() & 0xff);
            var unicode: number = 0;
            if (0 <= c && c <= 0x7F) {
                unicode = (c & 0x7F);
                ba.writeByte(unicode);
                continue;
            }
            else if (0xC0 <= c && c <= 0xDF) {
                unicode = (c & 0x1F);
                for (var i: number = 0; i < 1; i++) {
                    c = (utf8.readByte() & 0xff);
                    if ((c >> 6) != 2) throw "not legitimate utf8!";
                    unicode = ((unicode << 6) | (c & 0x3F));
                }
            }
            else if (0xE0 <= c && c <= 0xEF) {
                unicode = (c & 0x0F);
                for (var i: number = 0; i < 2; i++) {
                    c = (utf8.readByte() & 0xff);
                    if ((c >> 6) != 2) throw "not legitimate utf8!";
                    unicode = ((unicode << 6) | (c & 0x3F));
                }
            }
            else if (0xF0 <= c && c <= 0xF7) {
                unicode = (c & 0x07);
                for (var i: number = 0; i < 3; i++) {
                    c = (utf8.readByte() & 0xff);
                    if ((c >> 6) != 2) throw "not legitimate utf8!";
                    unicode = ((unicode << 6) | (c & 0x3F));
                }
            }
            else if (0xF8 <= c && c <= 0xFB) {
                unicode = (c & 0x03);
                for (var i: number = 0; i < 4; i++) {
                    c = (utf8.readByte() & 0xff);
                    if ((c >> 6) != 2) throw "not legitimate utf8!";
                    unicode = ((unicode << 6) | (c & 0x3F));
                }
            }
            else if (0xFC <= c && c <= 0xFD) {
                unicode = (c & 0x01);
                for (var i: number = 0; i < 5; i++) {
                    c = (utf8.readByte() & 0xff);
                    if ((c >> 6) != 2) throw "not legitimate utf8!";
                    unicode = ((unicode << 6) | (c & 0x3F));
                }
            }
            else {
                throw "not legitimate utf8!";
            }
            c = unicode_to_gb2312.GetGB2312ByUnicode(unicode);
            ba.writeByte(c >> 8 & 0xFF);
            ba.writeByte(c & 0xFF);
        }

    }

    public static readGB2312Bytes(ba: egret.ByteArray, len: number): string {
        var utf8: egret.ByteArray = new egret.ByteArray();
        if (ba.length == 0) {
            return "";
        }
        for (var i: number = 0; i < len; i++) {
            var c: number = (ba.readByte() & 0xff);
            if (c > 0x7f) {
                ba.position--;
                var tempEndian: any = ba.endian;
                ba.endian = egret.Endian.BIG_ENDIAN;
                c = ba.readUnsignedShort() & 0xffff;
                ba.endian = tempEndian;
                c = gb2312_to_unicode.GetUnicodeByGB2312(c)
                i++;
            }
            if (c <= 0x0000007f) {
                utf8.writeByte(c & 0xff);
            }
            else if (c <= 0x000007FF) {
                utf8.writeByte((c >> 6 | 0xC0) & 0xff);
                utf8.writeByte((c & 0x3F | 0x80) & 0xff);
            }
            else if (c <= 0x0000FFFF) {
                utf8.writeByte((c >> 12 | 0xE0) & 0xff);
                utf8.writeByte((c >> 6 & 0x3F | 0x80) & 0xff);
                utf8.writeByte((c & 0x3F | 0x80) & 0xff);
            }
            else if (c <= 0x001FFFFF) {
                utf8.writeByte(c >> 18 | 0xF0);
                utf8.writeByte(c >> 12 & 0x3F | 0x80);
                utf8.writeByte(c >> 6 & 0x3F | 0x80);
                utf8.writeByte(c & 0x3F | 0x80);
            }
            else if (c <= 0x03FFFFFF) {
                utf8.writeByte(c >> 24 | 0xF8);
                utf8.writeByte(c >> 18 & 0x3F | 0x80);
                utf8.writeByte(c >> 12 & 0x3F | 0x80);
                utf8.writeByte(c >> 6 & 0x3F | 0x80);
                utf8.writeByte(c & 0x3F | 0x80);
            }
            else if (c <= 0x7FFFFFFF) {
                utf8.writeByte(c >> 30 | 0xFC);
                utf8.writeByte(c >> 24 & 0x3F | 0x80);
                utf8.writeByte(c >> 18 & 0x3F | 0x80);
                utf8.writeByte(c >> 12 & 0x3F | 0x80);
                utf8.writeByte(c >> 6 & 0x3F | 0x80);
                utf8.writeByte(c & 0x3F | 0x80);
            }
        }
        utf8.position = 0;
        return utf8.readUTFBytes(utf8.length);
    }
}