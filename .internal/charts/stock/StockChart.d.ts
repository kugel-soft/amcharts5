import type { StockPanel } from "./StockPanel";
import type { Axis } from "../xy/axes/Axis";
import type { DateAxis } from "../xy/axes/DateAxis";
import type { AxisRenderer } from "../xy/axes/AxisRenderer";
import type { IValueAxisSettings } from "../xy/axes/ValueAxis";
import type { XYSeries, IXYSeriesDataItem, IXYSeriesSettings } from "../xy/series/XYSeries";
import type { DataItem } from "../../core/render/Component";
import type { Indicator } from "./indicators/Indicator";
import type { StockControl } from "./toolbar/StockControl";
import { MultiDisposer, IDisposer } from "../../core/util/Disposer";
import { SpriteResizer } from "../../core/render/SpriteResizer";
import { Container, IContainerPrivate, IContainerSettings, IContainerEvents } from "../../core/render/Container";
import { ListAutoDispose } from "../../core/util/List";
import { Rectangle } from "../../core/render/Rectangle";
import { Percent } from "../../core/util/Percent";
import { SettingsModal } from "./SettingsModal";
import { Color } from "../../core/util/Color";
export interface IStockChartSettings extends IContainerSettings {
    /**
     * Main value series.
     *
     * This series is used to target by settings, as well as calculating
     * indicators, and annotations.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/stock/#Setting_main_series}
     */
    stockSeries?: XYSeries;
    /**
     * Main volume series.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/stock/#Setting_main_series}
     */
    volumeSeries?: XYSeries;
    /**
     * @ignore
     */
    comparingSeriesSettings?: Partial<IXYSeriesSettings>;
    /**
     * Settings to be applied to the the main value series, when chart is
     * switched to "percent scale".
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/stock/percent-mode/#Configuring} for more info
     */
    percentScaleSeriesSettings?: Partial<IXYSeriesSettings>;
    /**
     * Settings to be applied to the [[ValueAxis]] of the main value series,
     * when chart is switched to "percent scale".
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/stock/percent-mode/#Configuring} for more info
     */
    percentScaleValueAxisSettings?: Partial<IValueAxisSettings<AxisRenderer>>;
    /**
     * If set to `true`, the chart will go into "percent scale" when compared
     * series are added to chart, and will exit it when all of the comparisons
     * are removed.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/stock/percent-mode/} for more info
     * @default true
     */
    autoSetPercentScale?: boolean;
    /**
     * This color will be applied to columns/candles on the main value series (series
     * set as `stockSeries`) where the open value is lower or equal to the close
     * value.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/stock/#Positive_negative_colors} for more info
     */
    stockPositiveColor?: Color | null;
    /**
     * This color will be applied to columns/candles on the main value series (series
     * set as `stockSeries`) where the open value is higher than the close value.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/stock/#Positive_negative_colors} for more info
     */
    stockNegativeColor?: Color | null;
    /**
     * This color will be applied to columns/candles on the main volume series (series
     * set as `stockSeries`) where the open value is lower or equal to the close
     * value.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/stock/#Positive_negative_colors} for more info
     */
    volumePositiveColor?: Color | null;
    /**
     * This color will be applied to columns/candles on the main volume series (series
     * set as `stockSeries`) where the open value is higher than the close value.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/stock/#Positive_negative_colors} for more info
     */
    volumeNegativeColor?: Color | null;
}
export interface IStockChartPrivate extends IContainerPrivate {
    /**
     * A instance of [[SettingsModal]].
     */
    settingsModal: SettingsModal;
    /**
     * Indicates if chart has currently have any "compared" series set.
     */
    comparing?: boolean;
    /**
     * A list of compared series.
     */
    comparedSeries?: XYSeries[];
    /**
     * Main Date axis of a Stock chart
     */
    mainAxis?: DateAxis<AxisRenderer>;
}
export interface IStockChartEvents extends IContainerEvents {
    /**
     * Kicks in when drawings change.
     */
    drawingsupdated: {};
    /**
     * Kicks in when indicators change.
     */
    indicatorsupdated: {};
}
/**
 * A main class for the Stock Chart.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/stock/} for more info
 * @important
 */
export declare class StockChart extends Container {
    static className: string;
    static classNames: Array<string>;
    _settings: IStockChartSettings;
    _privateSettings: IStockChartPrivate;
    _events: IStockChartEvents;
    protected _xAxes: Array<Axis<AxisRenderer>>;
    protected _downY?: number;
    protected _upperPanel?: StockPanel;
    protected _dhp?: Percent;
    protected _uhp?: Percent;
    protected _downResizer?: Rectangle;
    protected _syncExtremesDp?: MultiDisposer;
    protected _drawingsChanged: boolean;
    protected _indicatorsChanged: boolean;
    protected _baseDP?: IDisposer;
    /**
     * A list of stock panels.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/stock/#Panels} for more info
     */
    readonly panels: ListAutoDispose<StockPanel>;
    /**
     * A list of indicators on chart.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/stock/indicators/} for more info
     */
    readonly indicators: ListAutoDispose<Indicator>;
    /**
     * A [[Container]], resiting on top of the charts, suitable for additional
     * tools, like [[Scrollbar]].
     *
     * @default Container.new()
     */
    readonly toolsContainer: Container;
    /**
     * A [[Container]] where all the stock panels are placed into.
     *
     * @default Container.new()
     */
    readonly panelsContainer: Container;
    /**
     * An array of all Stock Controls that are created for this chart.
     *
     * @since 5.7.0
     */
    readonly controls: StockControl[];
    /**
     * An instance of [[SpriteResizer]] used for various drawing tools.
     *
     * @since 5.7.0
     */
    spriteResizer: SpriteResizer;
    protected _afterNew(): void;
    dispose(): void;
    /**
     * Forces redrawing of all annotations (drfawings).
     */
    markDirtyDrawings(): void;
    /**
     * Forces redrawing of Indicators.
     */
    markDirtyIndicators(): void;
    /**
     * Enables or disables interactivity of annotations (drawings).
     *
     * @param value Drawings interactive?
     * @since 5.4.9
     */
    drawingsInteractive(value: boolean): void;
    _prepareChildren(): void;
    _afterChanged(): void;
    _updateChildren(): void;
    /**
     * Enables or disables percent scale mode.
     *
     * If `percentScale` is not set, it will try to determine the status on its own.
     *
     * In percent scale mode `percentScaleSeriesSettings` and `percentScaleValueAxisSettings` will
     * be applied to the regular series on the main panel and its Y axis.
     *
     * @param  percentScale  Comparison mode active
     */
    setPercentScale(percentScale?: boolean): void;
    /**
     * Adds a "compared" series to chart. Returns the same series.
     *
     * @param   series  Compared series
     * @return          Compared series
     */
    addComparingSeries(series: XYSeries): XYSeries;
    /**
     * Removes compared series.
     *
     * @param  series  Compared series
     */
    removeComparingSeries(series: XYSeries): void;
    protected _maybePrepSeriesDefaults(series: XYSeries): void;
    getSeriesDefault(series: XYSeries, setting: keyof IXYSeriesSettings): any;
    protected _maybePrepAxisDefaults(): void;
    protected _processIndicator(indicator: Indicator): void;
    protected _removeIndicator(indicator: Indicator): void;
    protected _removePanel(chart: StockPanel): void;
    _updateControls(): void;
    protected _processPanel(panel: StockPanel): void;
    _updateResizers(): void;
    protected _syncYAxesSize(): void;
    protected _removeXAxis(_axis: Axis<AxisRenderer>): void;
    protected _processXAxis(axis: Axis<AxisRenderer>): void;
    protected _syncExtremes(): void;
    protected _syncXAxes(axis: Axis<AxisRenderer>): void;
    /**
     * Returns a color for volume, based on current and previous close.
     *
     * * `positiveColor` - close is greater or euqal than close of the previous period.
     * * `negativeColor` - close is lower than close of the previous period.
     *
     * @param   dataItem       Target data item
     * @param   negativeColor  "Negative color" (red)
     * @param   positiveColor  "Positive color" (green)
     * @return  Color
     */
    getVolumeColor(dataItem: DataItem<IXYSeriesDataItem>, negativeColor?: Color, positiveColor?: Color): Color | undefined;
    /**
     * Returns a first [[StockControl]] of specific type.
     *
     * @since 5.7.0
     * @param   type  Control name
     * @return        Control
     */
    getControl(type: string): StockControl | undefined;
}
/**
 * Registers a custom class so that objects (e.g. indicators) using it can be
 * serialized and restored later.
 *
 * @param  name  Class name
 * @param  ref   Class reference
 * @since 5.7.2
 */
export declare function registerClass(name: string, ref: any): void;
//# sourceMappingURL=StockChart.d.ts.map