/**
 * Created by stylehuan on 2016/9/29.
 */
class FriendDeskManager extends egret.DisplayObjectContainer {
    public constructor() {
        super();
        this.init();
    }

    private listSize: number = 2;
    private rowSize: number = 2;
    private _tableSprList: Array<DeskTableView>;

    private pageSize: number;
    private pageTotal: number;
    private curPage: number = 1;

    private leftPageTriangle: SQ.Button;
    private rightPageTriangle: SQ.Button;
    private shrinkPagePanel: egret.DisplayObjectContainer;

    public dataManager: TableDataManager;

    private init(): void {
        this._tableSprList = new Array<DeskTableView>();
        this.pageSize = this.rowSize * this.listSize;
        this.initPagePanel();
    }

    private initPagePanel(): void {
        if (!this.leftPageTriangle) {
            this.leftPageTriangle = new SQ.Button("friend.page_left_tr", "friend.page_left_tr", "friend.page_left_tr");
            this.addChild(this.leftPageTriangle);
            this.leftPageTriangle.x = 5;
            this.leftPageTriangle.y = LayerManager.stage.stageHeight * .5 - this.leftPageTriangle.height * .5;
            this.leftPageTriangle.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onPrevHandler, this);
            this.leftPageTriangle.visible = false;
        }

        if (!this.rightPageTriangle) {
            this.rightPageTriangle = new SQ.Button("friend.page_right_tr", "friend.page_right_tr", "friend.page_right_tr");
            this.addChild(this.rightPageTriangle);
            this.rightPageTriangle.x = LayerManager.stage.stageWidth - this.rightPageTriangle.width - 5;
            this.rightPageTriangle.y = LayerManager.stage.stageHeight * .5 - this.rightPageTriangle.height * .5;
            this.rightPageTriangle.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onNextHandler, this);
            this.rightPageTriangle.visible = false;
        }

        if (!this.shrinkPagePanel) {
            this.shrinkPagePanel = new egret.DisplayObjectContainer();
            this.addChild(this.shrinkPagePanel);
            this.shrinkPagePanel.y = LayerManager.stage.stageHeight - this.shrinkPagePanel.height - 50;
        }
    }

    public setShrinkPageAuto(): void {
        if (this.shrinkPagePanel) {
            this.shrinkPagePanel.x = LayerManager.stage.stageWidth * .5 - this.shrinkPagePanel.width * .5;
        }
    }

    public draw(arr: Array<CGameRoom>): void {
        this.dataManager = new TableDataManager(arr);
        var tables = this.dataManager.getTables();
        var len = tables.length;
        this.pageTotal = Math.ceil(len / this.pageSize);

        if (this.pageTotal == 0) {
            this.pageTotal = 1;
        }

        this.drawTableByPage();
        this.resetPagePanel();

        if (WGManager.getInstance().isInLiveRoom) {
            this.timer = new egret.Timer(1000);
            this.timer .addEventListener(egret.TimerEvent.TIMER, this.timerHandler, this);
            this.timer .start();
        }
    }

    private timer: egret.Timer;
    private _currSecond: number;

    private timerHandler(e: Event): void {
        var tables = this.dataManager.getTables();
        if (!tables.length) return;
        var _nowSecond: number = Math.floor(egret.getTimer() / 1000);

        if (this._currSecond == _nowSecond) return;
        this._currSecond = _nowSecond;
        for (var i: number = 0; i < tables.length; i++) {
            if (tables[i].sEnterText != "") {
                var _enterText: Object = JSON.parse(tables[i].sEnterText);

                if (!_enterText["Countdown"] || _enterText["Countdown"] < 1) continue;
                _enterText["Countdown"] -= 1;

                tables[i].sEnterText = JSON.stringify(_enterText);
            }
        }

        for (i = 0; i < this._tableSprList.length; i++) {
            var _target: DeskTableView = this._tableSprList[i];
            if (_target.timeDown) {
                _target.timeDown -= 1;
                if (_target.timeDown > 0) {
                    var _str: string = TimeUtil.getColonTimeStr(Math.floor(_target.timeDown));
                    _target.setTimeDownTxt(_str);
                }
            }
        }
    }

    private drawTableByPage(): void {
        var tables = this.getTableData();

        //渲染空桌子
        this.clearTables();
        this.addOnePageEmptyDesk();

        for (var i = 0; i < tables.length; i++) {
            this.drawTaskItem(i, tables[i]);
        }
    }

    private clearTables(): void {
        for (var i: number = 0; i < this._tableSprList.length; i++) {
            this._tableSprList[i].destroy();
            DisplayObjectUtil.removeForParent(this._tableSprList[i]);
            this._tableSprList[i] = null;
        }
    }

    private getTableData(): Array<CGameRoom> {
        var tables = this.dataManager.getTables();

        return tables.slice((this.curPage - 1) * this.pageSize, this.curPage * this.pageSize);
    }

    public addTable(cgameRoomInfo: CGameRoom): void {
        var emptyIndex = this.getEmptyDataIndex();
        var tables = this.dataManager.getTables();
        if (emptyIndex == -1) {
            emptyIndex = tables.length;
        }
        this.dataManager.addTable(emptyIndex, cgameRoomInfo);

        if (Math.ceil(tables.length / this.pageSize) > this.pageTotal) {
            this.pageTotal += 1;
            this.resetPagePanel();
        }

        //空位置在不在当前页
        var emptyPage = Math.ceil((emptyIndex + 1) / this.pageSize);
        var emptyPageIndex = emptyIndex % this.pageSize;

        if (emptyPage == this.curPage) {
            this.drawTaskItem(emptyPageIndex, cgameRoomInfo);
        }
    }

    private drawTaskItem(index: number, cgameRoomInfo: CGameRoom): void {
        var taskItem = this._tableSprList[index];
        taskItem.setup(cgameRoomInfo);
    }

    private addOnePageEmptyDesk(): void {
        var line: number = 0;
        var width: number = LayerManager.stage.stageWidth / this.listSize;
        var height = LayerManager.stage.stageHeight / this.rowSize;
        for (var i = 0; i < this.pageSize; i++) {
            var table = new DeskTableView();
            table.setPosition(width, height);
            this._tableSprList[i] = table;

            if (i % this.listSize == 0 && i != 0) {
                line += 1;
            }
            table.x = (i % this.listSize) * width;
            table.y = line * height;

            this.addChild(table);
        }
    }

    private resetPagePanel(): void {
        var filter: egret.ColorMatrixFilter = new egret.ColorMatrixFilter([0.3, 0.6, 0, 0, 0, 0.3, 0.6, 0, 0, 0, 0.3, 0.6, 0, 0, 0, 0, 0, 0, 1, 0]);

        this.leftPageTriangle.filters = null;
        this.rightPageTriangle.filters = null;
        this.leftPageTriangle.visible = false;
        this.rightPageTriangle.visible = false;

        this.shrinkPagePanel.removeChildren();

        if (this.pageTotal > 1) {
            this.leftPageTriangle.visible = true;
            this.rightPageTriangle.visible = true;
            if (this.curPage == 1) {
                this.leftPageTriangle.filters = [filter];
            }
            if (this.curPage == this.pageTotal) {
                this.rightPageTriangle.filters = [filter];
            }

            for (var i = 1; i <= this.pageTotal; i++) {
                var pageItem: ShrinkItemPanel = new ShrinkItemPanel();
                pageItem.x = this.shrinkPagePanel.width + 5;
                if (this.shrinkPagePanel.width == 0) {
                    pageItem.x = this.shrinkPagePanel.width;
                }
                if (this.curPage == i) {
                    pageItem.setStatus(true);
                }
                this.shrinkPagePanel.addChild(pageItem);
            }

            this.setShrinkPageAuto();
        } else {

        }
    }

    private onPrevHandler(e: egret.TouchEvent): void {
        if (this.curPage == 1) return;
        this.curPage -= 1;

        this.resetPagePanel();
        this.drawTableByPage();
    }

    private onNextHandler(e: egret.TouchEvent): void {
        if (this.curPage == this.pageTotal) return;
        this.curPage += 1;
        this.resetPagePanel();
        this.drawTableByPage();
    }

    public getTableById(id: number): DeskTableView {
        for (var i = 0; i < this._tableSprList.length; i++) {
            var tableItem: DeskTableView = this._tableSprList[i];
            if (tableItem.id == id) {
                return tableItem;
            }
        }
    }

    private getEmptyDataIndex(): number {
        var tables = this.dataManager.getTables();
        for (var i = 0; i < tables.length; i++) {
            if (!tables[i]) {
                return i;
                break;
            }
        }
        return -1;
    }

    public clearEmptyOneTable(id: number): void {
        var tableItem: DeskTableView = this.getTableById(id);
        if (tableItem) {
            tableItem.emptyDesk();
        }
        this.dataManager.removeTable(id);
    }

    public destroy(): void {
        if (this._tableSprList) {
            for (var i: number; i < this._tableSprList.length; i++) {
                this._tableSprList[i].destroy();
                DisplayObjectUtil.removeForParent(this._tableSprList[i]);
                this._tableSprList[i] = null;
            }
            this._tableSprList = null;
        }

        if (this.timer) {
            this.timer .stop();
            this.timer .removeEventListener(egret.TimerEvent.TIMER, this.timerHandler, this);
            this.timer = null;
        }
    }
}