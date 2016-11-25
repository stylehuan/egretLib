/**
 * Created by stylehuan on 2016/9/29.
 */
class MJScanner {
    public m_s: string;

    public constructor(s: string){
        this.m_s = s;
    }

    private IsDelimiter(sChar: string, bName: boolean = false): boolean {
        if (sChar == ",") return true;
        if (!bName) {
            if (sChar == ":") return true;
            if (sChar == "[") return true;
            if (sChar == "]") return true;
        }
        return false;
    }

    public ReadType(): string {
        for (var i: number = 0; i < this.m_s.length; i++) {
            if (this.IsDelimiter(this.m_s.charAt(i)))
                break;
            if (!(
                    (this.m_s.charAt(i) >= "A" && this.m_s.charAt(i) <= "Z")
                    ||
                    (this.m_s.charAt(i) >= "a" && this.m_s.charAt(i) <= "z")
                ))
                break;
        }
        var sType: string = this.m_s.substring(0, i);

        if (this.IsDelimiter(this.m_s.charAt(i))) i++;
        this.m_s = this.m_s.substring(i);
        return sType;
    }

    public ReadName(): string {
        for (var i: number = 0; i < this.m_s.length; i++) {
            if (this.IsDelimiter(this.m_s.charAt(i), true))
                break;
        }
        var sName: string = this.m_s.substring(0, i);

        if (this.IsDelimiter(this.m_s.charAt(i), true)) i++;
        this.m_s = this.m_s.substring(i);
        return sName;
    }

    public ReadInt(nLen: number = 2147483647): number {
        for (var i: number = 0; i < nLen; i++) {
            if (i >= this.m_s.length)
                break;
            if (this.IsDelimiter(this.m_s.charAt(i)))
                break;
            if (!((this.m_s.charAt(i) >= "0" && this.m_s.charAt(i) <= "9") || this.m_s.charAt(i) == "+" || this.m_s.charAt(i) == "-"))
                break;
        }
        var sInt: string = this.m_s.substring(0, i);
        var nInt: number = parseInt(sInt, 10);

        if (this.IsDelimiter(this.m_s.charAt(i))) i++;
        this.m_s = this.m_s.substring(i);
        return nInt;
    }

    public ReadChar(): string {
        for (var i: number = 0; i < 1; i++) {
            if (i >= this.m_s.length)
                break;
            if (this.IsDelimiter(this.m_s.charAt(i)))
                break;
            if (!(
                    (this.m_s.charAt(i) >= "A" && this.m_s.charAt(i) <= "Z")
                    ||
                    (this.m_s.charAt(i) >= "a" && this.m_s.charAt(i) <= "z")
                ))
                break;
        }
        var sChar: string = this.m_s.substring(0, i);

        if (this.IsDelimiter(this.m_s.charAt(i))) i++;
        this.m_s = this.m_s.substring(i);
        return sChar;
    }

    public HasNext(): boolean {
        return this.m_s.length > 0;
    }
}