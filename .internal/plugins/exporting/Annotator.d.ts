import { Entity, IEntitySettings, IEntityPrivate, IEntityEvents } from "../../core/util/Entity";
export interface IAnnotatorSettings extends IEntitySettings {
    /**
     * Layer number to use for annotations.
     *
     * @default 1000
     */
    layer?: number;
    /**
     * Raw annotation info saved by MarkerJS.
     */
    markerState?: any;
    /**
     * MarkerArea settings in form of an object where keys are setting names and
     * value is a setting value. E.g.:
     *
     * ```TypeScript
     * let annotator = am5plugins_exporting.Annotator.new(root, {
     *  markerSettings: {
     *    defaultColorSet: ["red", "green", "blue"],
     *    wrapText: true
     *  }
     *});
     * ```
     * ```JavaScript
     * var annotator = am5plugins_exporting.Annotator.new(root, {
     *  markerSettings: {
     *    defaultColorSet: ["red", "green", "blue"],
     *    wrapText: true
     *  }
     *});
     * ```
     *
     * @see {@link https://markerjs.com/reference/classes/settings.html} for a full list of settings
     * @since 5.7.4
     */
    markerSettings?: {
        [index: string]: any;
    };
    /**
     * MarkerArea style settings for user interface elements.E.g.:
     *
     * ```TypeScript
     * let annotator = am5plugins_exporting.Annotator.new(root, {
     *  markerStyleSettings: {
     *    toolboxColor: "#F472B6",
     *    toolboxAccentColor: "#BE185D"
     *  }
     *});
     * ```
     * ```JavaScript
     * var annotator = am5plugins_exporting.Annotator.new(root, {
     *  markerStyleSettings: {
     *    toolboxColor: "#F472B6",
     *    toolboxAccentColor: "#BE185D"
     *  }
     *});
     * ```
     *
     * @see {@link https://markerjs.com/reference/classes/settings.html} for a full list of settings
     * @since 5.7.5
     */
    markerStyleSettings?: {
        [index: string]: any;
    };
}
export interface IAnnotatorPrivate extends IEntityPrivate {
}
export interface IAnnotatorEvents extends IEntityEvents {
}
/**
 * A plugin that can be used to annotate charts.
 *
 * @see {@link https://www.amcharts.com/docs/v5/concepts/exporting/annotator/} for more info
 */
export declare class Annotator extends Entity {
    static className: string;
    static classNames: Array<string>;
    _settings: IAnnotatorSettings;
    _privateSettings: IAnnotatorPrivate;
    _events: IAnnotatorEvents;
    private _container?;
    private _picture?;
    private _markerArea?;
    private _skipRender?;
    protected _afterNew(): void;
    _beforeChanged(): void;
    /**
     * Triggers annotation mode on the chart. This will display UI toolbars and
     * disable all interactions on the chart itself.
     */
    open(): Promise<void>;
    _renderState(): Promise<void>;
    /**
     * Exists from annotation mode. All annotations remain visible on the chart.
     */
    close(): Promise<void>;
    /**
     * Exits from annotation mode. Any changes made during last session of the
     * annotation editing are cancelled.
     */
    cancel(): Promise<void>;
    /**
     * All annotations are removed.
     */
    clear(): void;
    toggle(): Promise<void>;
    dispose(): void;
    private _maybeInit;
    /**
     * @ignore
     */
    private _getMarkerJS;
    /**
     * An instance of MarkerJS's [[MarkerArea]].
     *
     * @see {@link https://markerjs.com/docs/getting-started} for more info
     * @return MarkerArea
     */
    getMarkerArea(): Promise<any>;
}
//# sourceMappingURL=Annotator.d.ts.map