import { AxisRendererX } from "../../xy/axes/AxisRendererX";
import { ValueAxis } from "../../xy/axes/ValueAxis";
import { Indicator } from "./Indicator";
import { ColumnSeries } from "../../xy/series/ColumnSeries";
import { percent } from "../../../core/util/Percent";
import * as $type from "../../../core/util/Type";
/**
 * An implementation of a Volume Profile indicator for a [[StockChart]].
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/stock/indicators/} for more info
 * @since 5.7.0
 */
export class VolumeProfile extends Indicator {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "_editableSettings", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: [{
                    key: "countType",
                    name: this.root.language.translateAny("Count"),
                    type: "dropdown",
                    options: [
                        { value: "rows", text: this.root.language.translateAny("number of rows"), extTarget: "count", extTargetValue: 24, extTargetMinValue: 1 },
                        { value: "ticks", text: this.root.language.translateAny("ticks per row"), extTarget: "count", extTargetValue: 1000, extTargetMinValue: 200 }
                    ]
                }, {
                    key: "count",
                    name: this.root.language.translateAny("Count"),
                    type: "number",
                    minValue: 1
                }, {
                    key: "valueArea",
                    name: this.root.language.translateAny("Value Area"),
                    type: "number"
                }, {
                    key: "upColor",
                    name: this.root.language.translateAny("Up volume"),
                    type: "color"
                }, {
                    key: "downColor",
                    name: this.root.language.translateAny("Down volume"),
                    type: "color"
                }, {
                    key: "axisWidth",
                    name: this.root.language.translateAny("Width %"),
                    type: "number"
                }]
        });
        Object.defineProperty(this, "xAxis", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "upSeries", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_previousColumn", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
    }
    _afterNew() {
        super._afterNew();
        const volumeSeries = this.get("volumeSeries");
        const stockSeries = this.get("stockSeries");
        if (volumeSeries) {
            const chart = stockSeries.chart;
            const root = this._root;
            if (chart) {
                const yAxis = stockSeries.get("yAxis");
                const step = yAxis.getPrivate("step");
                if (step !== undefined) {
                    const val = yAxis.getPrivate("step") * 50;
                    this._editableSettings[0].options[1].extTargetValue = val;
                    this._editableSettings[0].options[1].extTargetMinValue = val * 0.2;
                }
                yAxis.onPrivate("step", (step) => {
                    const val = step * 50;
                    this._editableSettings[0].options[1].extTargetValue = val;
                    this._editableSettings[0].options[1].extTargetMinValue = val * 0.2;
                });
                const panelXAxis = stockSeries.get("xAxis");
                panelXAxis.on("start", () => {
                    this.markDataDirty();
                });
                panelXAxis.on("end", () => {
                    this.markDataDirty();
                });
                const xRenderer = AxisRendererX.new(root, {});
                xRenderer.grid.template.set("forceHidden", true);
                xRenderer.labels.template.set("forceHidden", true);
                this.xAxis = chart.xAxes.push(ValueAxis.new(root, {
                    zoomable: false,
                    strictMinMax: true,
                    panX: false,
                    panY: false,
                    renderer: xRenderer
                }));
                if (yAxis.get("renderer").get("opposite")) {
                    xRenderer.set("inversed", true);
                    this.xAxis.setAll({
                        x: percent(100),
                        centerX: percent(100)
                    });
                }
                this.series = chart.series.unshift(ColumnSeries.new(root, {
                    xAxis: this.xAxis,
                    yAxis: yAxis,
                    snapTooltip: false,
                    valueXField: "down",
                    openValueXField: "xOpen",
                    openValueYField: "yOpen",
                    valueYField: "y",
                    calculateAggregates: true,
                    themeTags: ["indicator", "volumeprofile", "down"]
                }));
                this.upSeries = chart.series.unshift(ColumnSeries.new(root, {
                    xAxis: this.xAxis,
                    yAxis: yAxis,
                    snapTooltip: false,
                    valueXField: "total",
                    openValueXField: "down",
                    openValueYField: "yOpen",
                    valueYField: "y",
                    calculateAggregates: true,
                    themeTags: ["indicator", "volumeprofile", "up"]
                }));
                this.upSeries.setPrivate("doNotUpdateLegend", true);
                this.series.setPrivate("doNotUpdateLegend", true);
                this.upSeries.setPrivate("baseValueSeries", stockSeries);
                this.series.setPrivate("baseValueSeries", stockSeries);
                this._handleLegend(this.series);
                this._addInteractivity(this.series);
                this._addInteractivity(this.upSeries);
            }
        }
    }
    _addInteractivity(series) {
        series.columns.template.events.on("pointerover", (e) => {
            let dataItem = e.target.dataItem;
            if (dataItem) {
                if (dataItem.component == this.upSeries) {
                    dataItem = this.series.dataItems[this.upSeries.dataItems.indexOf(dataItem)];
                    if (dataItem) {
                        const column = dataItem.get("graphics");
                        if (column) {
                            column.hover();
                            this._previousColumn = column;
                        }
                    }
                }
                else {
                    dataItem = this.upSeries.dataItems[this.series.dataItems.indexOf(dataItem)];
                    if (dataItem) {
                        const column = dataItem.get("graphics");
                        if (column) {
                            column.hover();
                            this._previousColumn = column;
                        }
                    }
                }
                this.series.updateLegendValue(dataItem);
            }
        });
        series.columns.template.events.on("pointerout", () => {
            this.series.updateLegendValue(undefined);
            if (this._previousColumn) {
                this._previousColumn.unhover();
            }
        });
        series.columns.template.adapters.add("fillOpacity", (fillOpacity, target) => {
            const dataItem = target.dataItem;
            if (dataItem) {
                const dataContext = dataItem.dataContext;
                if (dataContext) {
                    if (dataContext.area) {
                        return this.get("valueAreaOpacity", .7);
                    }
                }
            }
            return fillOpacity;
        });
    }
    _updateChildren() {
        if (this.series) {
            super._updateChildren();
            if (this.isDirty("count") || this.isDirty("countType") || this.isDirty("valueArea")) {
                this.markDataDirty();
            }
            if (this.isDirty("countType")) {
                const countType = this.get("countType");
                if (countType == "ticks") {
                    const stockSeries = this.get("stockSeries");
                    const yAxis = stockSeries.get("yAxis");
                    this._editableSettings[1].minValue = yAxis.getPrivate("step") * 50 * 0.2;
                }
                else {
                    this._editableSettings[1].minValue = 1;
                }
            }
            if (this.isDirty("upColor")) {
                const upColor = this.get("upColor");
                this.upSeries.set("fill", upColor);
                this.upSeries.set("stroke", upColor);
                this.upSeries.columns.template.setAll({
                    fill: upColor,
                    stroke: upColor
                });
                this.setCustomData("upColor", upColor);
            }
            if (this.isDirty("downColor")) {
                const downColor = this.get("downColor");
                this.series.set("fill", downColor);
                this.series.set("stroke", downColor);
                this.series.columns.template.setAll({
                    fill: downColor,
                    stroke: downColor
                });
                this.setCustomData("downColor", downColor);
            }
            if (this.isDirty("axisWidth")) {
                this.xAxis.set("width", percent(this.get("axisWidth", 40)));
            }
        }
    }
    /**
     * @ignore
     */
    prepareData() {
        const volumeSeries = this.get("volumeSeries");
        const stockSeries = this.get("stockSeries");
        if (volumeSeries && this.series) {
            let startIndex = volumeSeries.getPrivate("adjustedStartIndex", volumeSeries.startIndex());
            let endIndex = volumeSeries.endIndex();
            const count = this.get("count", 20);
            const type = this.get("countType");
            let step = 1;
            let min = Infinity;
            let max = -Infinity;
            for (let i = startIndex; i < endIndex; i++) {
                const dataItem = stockSeries.dataItems[i];
                if (dataItem) {
                    const close = dataItem.get("valueY");
                    if ($type.isNumber(close)) {
                        if (close < min) {
                            min = close;
                        }
                        if (close > max) {
                            max = close;
                        }
                    }
                }
            }
            if (min != Infinity) {
                let rows;
                if (type == "ticks") {
                    step = count / 100;
                    min = Math.floor(min / step) * step;
                    max = Math.ceil(max / step) * step;
                    rows = (max - min) / step;
                }
                else {
                    step = (max - min) / count;
                    rows = count;
                }
                const rowDataDown = [];
                const rowDataUp = [];
                for (let i = 0; i < rows; i++) {
                    rowDataDown[i] = 0;
                    rowDataUp[i] = 0;
                }
                let previousDataItem;
                for (let i = startIndex; i < endIndex; i++) {
                    const dataItem = stockSeries.dataItems[i];
                    const volumeDataItem = volumeSeries.dataItems[i];
                    if (dataItem && volumeDataItem) {
                        const close = dataItem.get("valueY");
                        const volume = volumeDataItem.get("valueY");
                        if ($type.isNumber(close) && $type.isNumber(volume)) {
                            let index = Math.floor((close - min) / step);
                            if (index == count) {
                                index = count - 1;
                            }
                            if ($type.isNumber(index)) {
                                if (previousDataItem && previousDataItem.get("valueY", close) < close) {
                                    rowDataDown[index] += volume;
                                }
                                else {
                                    rowDataUp[index] += volume;
                                }
                            }
                        }
                        previousDataItem = dataItem;
                    }
                }
                const dataDown = [];
                let sum = 0;
                for (let i = 0; i < rows; i++) {
                    let total = rowDataUp[i] + rowDataDown[i];
                    sum += total;
                    dataDown.push({
                        yOpen: min + i * step,
                        y: min + (i + 1) * step,
                        up: rowDataUp[i],
                        down: rowDataDown[i],
                        total: total,
                        xOpen: 0,
                        area: false
                    });
                }
                let len = this.series.data.length;
                if (len && len == dataDown.length) {
                    for (let i = 0; i < len; i++) {
                        this.series.data.setIndex(i, dataDown[i]);
                    }
                }
                else {
                    this.series.data.setAll(dataDown);
                }
                const dataUp = [];
                let highest = 0;
                let hi = 0;
                for (let i = 0; i < rows; i++) {
                    let total = rowDataUp[i] + rowDataDown[i];
                    dataUp.push({
                        yOpen: min + i * step,
                        y: min + (i + 1) * step,
                        up: rowDataUp[i],
                        down: rowDataDown[i],
                        total: total,
                        area: false
                    });
                    if (total > highest) {
                        highest = total;
                        hi = i;
                    }
                }
                let valueArea = sum * this.get("valueArea", 70) / 100;
                let area = highest;
                let cd = 1;
                let cu = 1;
                let dlen = dataUp.length;
                dataUp[hi].area = true;
                dataDown[hi].area = true;
                /*
                // with two rows
                while (area < valueArea) {
                    let rowAbove1 = hi + cu;
                    let rowAbove2 = hi + cu + 1;

                    let sumAbove = 0
                    if (rowAbove1 < dlen) {
                        sumAbove += dataUp[rowAbove1].total;
                    }
                    if (rowAbove2 < dlen) {
                        sumAbove += dataUp[rowAbove2].total;
                    }

                    let rowBelow1 = hi - cd;
                    let rowBelow2 = hi - cd - 1;

                    let sumBelow = 0
                    if (rowBelow1 >= 0) {
                        sumBelow += dataUp[rowBelow1].total;
                    }
                    if (rowBelow2 >= 0) {
                        sumBelow += dataUp[rowBelow2].total;
                    }

                    if (sumBelow <= sumAbove) {
                        area += sumAbove;
                        if (rowAbove1 < dlen) {
                            dataDown[rowAbove1].area = true;
                            dataUp[rowAbove1].area = true;
                            cu++;
                        }
                        if (rowAbove2 < dlen) {
                            dataDown[rowAbove2].area = true;
                            dataUp[rowAbove2].area = true;
                            cu++;
                        }
                    }
                    else {
                        area += sumBelow;
                        if (rowBelow1 >= 0) {
                            dataDown[rowBelow1].area = true;
                            dataUp[rowBelow1].area = true;
                            cd++;
                        }
                        if (rowBelow2 >= 0) {
                            dataDown[rowBelow2].area = true;
                            dataUp[rowBelow2].area = true;
                            cd++;
                        }
                    }

                    if (sumBelow == 0) {
                        cd++;
                    }
                    if (sumAbove == 0) {
                        cu++;
                    }

                    if ((cd > dlen && cu > dlen)) {
                        break;
                    }

                }
                */
                // single row
                while (area < valueArea) {
                    let rowAbove1 = hi + cu;
                    let sumAbove = 0;
                    if (rowAbove1 < dlen) {
                        sumAbove += dataUp[rowAbove1].total;
                    }
                    let rowBelow1 = hi - cd;
                    let sumBelow = 0;
                    if (rowBelow1 >= 0) {
                        sumBelow += dataUp[rowBelow1].total;
                    }
                    if (sumBelow <= sumAbove) {
                        area += sumAbove;
                        if (rowAbove1 < dlen) {
                            dataDown[rowAbove1].area = true;
                            dataUp[rowAbove1].area = true;
                            cu++;
                        }
                    }
                    else {
                        area += sumBelow;
                        if (rowBelow1 >= 0) {
                            dataDown[rowBelow1].area = true;
                            dataUp[rowBelow1].area = true;
                            cd++;
                        }
                    }
                    if (sumBelow == 0) {
                        cd++;
                    }
                    if (sumAbove == 0) {
                        cu++;
                    }
                    if ((cd > dlen && cu > dlen)) {
                        break;
                    }
                }
                area = Math.ceil(area);
                len = this.upSeries.data.length;
                if (len > 0 && len == dataUp.length) {
                    for (let i = 0; i < len; i++) {
                        this.upSeries.data.setIndex(i, dataUp[i]);
                    }
                }
                else {
                    this.upSeries.data.setAll(dataUp);
                }
            }
        }
        this.series.columns.each((column) => {
            column._markDirtyKey("fillOpacity");
        });
        this.upSeries.columns.each((column) => {
            column._markDirtyKey("fillOpacity");
        });
    }
    _dispose() {
        super._dispose();
        if (this.upSeries) {
            this.upSeries.dispose();
        }
        if (this.xAxis) {
            this.xAxis.dispose();
        }
    }
}
Object.defineProperty(VolumeProfile, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "VolumeProfile"
});
Object.defineProperty(VolumeProfile, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: Indicator.classNames.concat([VolumeProfile.className])
});
//# sourceMappingURL=VolumeProfile.js.map