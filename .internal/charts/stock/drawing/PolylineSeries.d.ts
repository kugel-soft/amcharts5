import type { ISpritePointerEvent } from "../../../core/render/Sprite";
import type { DataItem } from "../../../core/render/Component";
import { Line } from "../../../core/render/Line";
import { DrawingSeries, IDrawingSeriesSettings, IDrawingSeriesPrivate, IDrawingSeriesDataItem } from "./DrawingSeries";
export interface IPolylineSeriesDataItem extends IDrawingSeriesDataItem {
}
export interface IPolylineSeriesSettings extends IDrawingSeriesSettings {
}
export interface IPolylineSeriesPrivate extends IDrawingSeriesPrivate {
}
export declare class PolylineSeries extends DrawingSeries {
    static className: string;
    static classNames: Array<string>;
    _settings: IPolylineSeriesSettings;
    _privateSettings: IPolylineSeriesPrivate;
    _dataItemSettings: IPolylineSeriesDataItem;
    protected _pIndex: number;
    protected _tag: string;
    protected _drawingLine: Line;
    protected _handlePointerClick(event: ISpritePointerEvent): void;
    protected _handleBulletDragStop(event: ISpritePointerEvent): void;
    disableDrawing(): void;
    protected _afterDataChange(): void;
    clearDrawings(): void;
    protected _addPoint(event: ISpritePointerEvent): void;
    protected _endPolyline(dataItem?: DataItem<this["_dataItemSettings"]>): void;
    protected _handlePointerMove(event: ISpritePointerEvent): void;
    protected _updateElements(): void;
}
//# sourceMappingURL=PolylineSeries.d.ts.map