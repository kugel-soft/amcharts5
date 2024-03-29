import { Container, IContainerPrivate, IContainerSettings, IContainerEvents } from "../../core/render/Container";
import { Button } from "../../core/render/Button";
import { MultiDisposer } from "../../core/util/Disposer";
export interface IZoomable {
    zoomIn(): void;
    zoomOut(): void;
    goHome(): void;
}
export interface IZoomToolsSettings extends IContainerSettings {
    /**
     * A target element that zoom tools will control, e.g. [[ZoomableContainer]].
     */
    target?: IZoomable;
}
export interface IZoomToolsPrivate extends IContainerPrivate {
}
export interface IZoomToolsEvents extends IContainerEvents {
}
/**
 * A tool that displays button for zoomable targets.
 *
 * @since 5.8.0
 * @important
 */
export declare class ZoomTools extends Container {
    static className: string;
    static classNames: Array<string>;
    _events: IContainerEvents;
    /**
     * A [[Button]] for home.
     */
    readonly homeButton: Button;
    /**
     * A [[Button]] for zoom in.
     */
    readonly plusButton: Button;
    /**
     * A [[Button]] for zoom out.
     */
    readonly minusButton: Button;
    _settings: IZoomToolsSettings;
    _privateSettings: IZoomToolsPrivate;
    protected _disposer: MultiDisposer | undefined;
    protected _afterNew(): void;
    _prepareChildren(): void;
}
//# sourceMappingURL=ZoomTools.d.ts.map