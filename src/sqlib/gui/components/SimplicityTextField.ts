/**
 * Created by stylehuan on 2016/8/10.
 */
module SQ {
    export class SimplicityTextField extends egret.Sprite {

        private sourceText: string;

        public _textField: egret.TextField;
        private _maxLen: number = 6;

        public constructor(sourceText: string, textStyle: SQ.TextStyleConfig) {
            super();
            this.sourceText = sourceText;
            this._maxLen = textStyle.maxLen;

            this._textField = new egret.TextField();
            this._textField.text = StrUtil.limitStr(sourceText, textStyle.maxLen);

            if (textStyle) {
                if (textStyle.textColor) {
                    this._textField.textColor = textStyle.textColor;
                }

                if (textStyle.size) {
                    this._textField.size = textStyle.size;
                }

                if (textStyle.fontFamily) {
                    this._textField.fontFamily = textStyle.fontFamily;
                }

                if (textStyle.strokeColor) {
                    this._textField.strokeColor = textStyle.strokeColor;
                }

                this._textField.bold = textStyle.isBold;

                if (textStyle.stroke) {
                    this._textField.stroke = textStyle.stroke;
                }

                if (textStyle.textFlow) {
                    this._textField.textFlow = textStyle.textFlow;
                }

                if (textStyle.height) {
                    this._textField.height = textStyle.height;
                }
            }

            this._textField.width = this._textField.textWidth + 5;
            this._textField.height = 16;

            this.addChild(this._textField);
        }

        public setText(text: string): void {
            if (this._textField) {
                this._textField.text = StrUtil.limitStr(text, this._maxLen);
            }
        }

        public showFullText(): void {

        }
    }
}