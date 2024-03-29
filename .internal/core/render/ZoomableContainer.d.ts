import type { Time } from "../../core/util/Animation";
import type { Animation } from "../../core/util/Entity";
import type { IDisposer } from "../../core/util/Disposer";
import type { IPoint } from "../../core/util/IPoint";
import type { ISpritePointerEvent } from "../../core/render/Sprite";
import { Container, IContainerSettings, IContainerPrivate, IContainerEvents } from "../../core/render/Container";
export interface IZoomableContainerSettings extends IContainerSettings {
    /**
     * Maximum zoom-in level.
     *
     * @default 32
     */
    maxZoomLevel?: number;
    /**
     * Maximum zoom-out level.
     *
     * @default 1
     */
    minZoomLevel?: number;
    /**
     * Zoom level increase/decrease factor with each zoom action.
     *
     * @defult 2
     */
    zoomStep?: number;
    /**
     * Pinch-zooming is enabled on touch devices.
     *
     * @default true
     */
    pinchZoom?: boolean;
    /**
     * Animation duration (ms) for zoom animations.
     *
     * @default 600
     */
    animationDuration?: number;
    /**
     * Easing function to use for zoom animations.
     *
     * @default am5.ease.out(am5.ease.cubic)
     */
    animationEasing?: (t: Time) => Time;
}
export interface IZoomableContainerPrivate extends IContainerPrivate {
}
export interface IZoomableContainerEvents extends IContainerEvents {
}
/**
 * A version of [[Container]] which adds zooming capabilities.
 *
 * @see {@link https://www.amcharts.com/docs/v5/concepts/common-elements/containers/#Zoomable_container} for more info
 * @since 5.8.0
 * @important
 */
export declare class ZoomableContainer extends Container {
    static className: string;
    static classNames: Array<string>;
    _settings: IZoomableContainerSettings;
    _privateSettings: IZoomableContainerPrivate;
    _events: IZoomableContainerEvents;
    protected _za?: Animation<this["_settings"]["scale"]>;
    protected _txa?: Animation<this["_settings"]["x"]>;
    protected _tya?: Animation<this["_settings"]["y"]>;
    protected _movePoints: {
        [index: number]: IPoint;
    };
    protected _downScale: number;
    protected _downX: number;
    protected _downY: number;
    protected _pinchDP?: IDisposer;
    /**
     * All elements must be added to `contents.children` instead of `children` of
     * [[ZoomableContainer]].
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/common-elements/containers/#Zoomable_container} for more info
     */
    contents: Container;
    protected _wheelDp: IDisposer | undefined;
    protected _afterNew(): void;
    _prepareChildren(): void;
    protected _handleSetWheel(): void;
    protected _handleWheelZoom(delta: number, point: IPoint): void;
    /**
     * Zooms to specific X/Y point.
     *
     * @param   point  Center point
     * @param   level  Zoom level
     * @return         Zoom Animation object
     */
    zoomToPoint(point: IPoint, level: number): Animation<this["_settings"]["scale"]> | undefined;
    /**
     * Zooms the container contents in by `zoomStep`.
     *
     * @return Zoom Animation object
     */
    zoomIn(): Animation<this["_settings"]["scale"]> | undefined;
    /**
     * Zooms the container contents out by `zoomStep`.
     *
     * @return Zoom Animation object
     */
    zoomOut(): Animation<this["_settings"]["scale"]> | undefined;
    /**
     * Fully zooms out the container contents.
     *
     * @return Zoom Animation object
     */
    goHome(): void;
    protected _animateTo(x: number, y: number, scale: number): void;
    protected _handleThisUp(_event: ISpritePointerEvent): void;
    protected _handleThisDown(event: ISpritePointerEvent): void;
    protected _handleThisMove(event: ISpritePointerEvent): void;
    protected _handlePinch(): void;
}
//# sourceMappingURL=ZoomableContainer.d.ts.map