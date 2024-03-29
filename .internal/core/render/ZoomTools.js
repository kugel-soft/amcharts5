import { Container } from "../../core/render/Container";
import { Button } from "../../core/render/Button";
import { Graphics } from "../../core/render/Graphics";
import { MultiDisposer } from "../../core/util/Disposer";
/**
 * A tool that displays button for zoomable targets.
 *
 * @since 5.8.0
 * @important
 */
export class ZoomTools extends Container {
    constructor() {
        super(...arguments);
        /**
         * A [[Button]] for home.
         */
        Object.defineProperty(this, "homeButton", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: this.children.push(Button.new(this._root, { width: 35, height: 35, themeTags: ["home"] }))
        });
        /**
         * A [[Button]] for zoom in.
         */
        Object.defineProperty(this, "plusButton", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: this.children.push(Button.new(this._root, { width: 35, height: 35, themeTags: ["plus"] }))
        });
        /**
         * A [[Button]] for zoom out.
         */
        Object.defineProperty(this, "minusButton", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: this.children.push(Button.new(this._root, { width: 35, height: 35, themeTags: ["minus"] }))
        });
        Object.defineProperty(this, "_disposer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
    }
    _afterNew() {
        super._afterNew();
        this.set("position", "absolute");
        this.set("layout", this._root.verticalLayout);
        this.addTag("zoomtools");
        this.plusButton.setAll({
            icon: Graphics.new(this._root, { themeTags: ["icon"] }),
            layout: undefined
        });
        this.minusButton.setAll({
            icon: Graphics.new(this._root, { themeTags: ["icon"] }),
            layout: undefined
        });
        this.homeButton.setAll({
            icon: Graphics.new(this._root, { themeTags: ["icon"] }),
            layout: undefined
        });
    }
    _prepareChildren() {
        super._prepareChildren();
        if (this.isDirty("target")) {
            const target = this.get("target");
            const previous = this._prevSettings.target;
            if (target) {
                this._disposer = new MultiDisposer([
                    this.plusButton.events.on("click", () => {
                        target.zoomIn();
                    }),
                    this.minusButton.events.on("click", () => {
                        target.zoomOut();
                    }),
                    this.homeButton.events.on("click", () => {
                        target.goHome();
                    })
                ]);
            }
            if (previous && this._disposer) {
                this._disposer.dispose();
            }
        }
    }
}
Object.defineProperty(ZoomTools, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "ZoomTools"
});
Object.defineProperty(ZoomTools, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: Container.classNames.concat([ZoomTools.className])
});
//# sourceMappingURL=ZoomTools.js.map