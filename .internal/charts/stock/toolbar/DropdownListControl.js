import { StockControl } from "./StockControl";
import { DropdownList } from "./DropdownList";
import * as $array from "../../../core/util/Array";
import * as $type from "../../../core/util/Type";
import * as $utils from "../../../core/util/Utils";
/**
 * A generic control which creates a searchable list of items in a dropdown.
 *
 * Can be used in a [[StockToolbar]].
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/stock/toolbar/dropdown-list-control/} for more info
 */
export class DropdownListControl extends StockControl {
    _afterNew() {
        // @todo still needed?
        super._afterNew();
        const button = this.getPrivate("button");
        button.className = button.className + " am5stock-control-dropdown";
    }
    _initElements() {
        super._initElements();
        // Disable icon
        //this.getPrivate("icon")!.style.display = "none";
        // Create list
        const dropdownSettings = {
            control: this,
            parent: this.getPrivate("button"),
            searchable: this.get("searchable", false),
            scrollable: this.get("scrollable", false),
            items: [],
            exclude: this.get("exclude")
        };
        const maxSearchItems = this.get("maxSearchItems");
        if (maxSearchItems) {
            dropdownSettings.maxSearchItems = maxSearchItems;
        }
        const searchCallback = this.get("searchCallback");
        if (searchCallback) {
            dropdownSettings.searchCallback = searchCallback;
        }
        const items = this.get("items");
        let currentItem = this.get("currentItem");
        if (items) {
            $array.each(items, (item) => {
                const itemObject = $type.isString(item) ? {
                    id: item,
                    label: item
                } : item;
                dropdownSettings.items.push(itemObject);
                if ($type.isString(currentItem) && currentItem == itemObject.id) {
                    currentItem = itemObject;
                }
            });
        }
        const dropdown = DropdownList.new(this._root, dropdownSettings);
        this.setPrivate("dropdown", dropdown);
        if (currentItem) {
            this.setItem(currentItem);
        }
        dropdown.events.on("closed", (_ev) => {
            this.set("active", false);
        });
        dropdown.events.on("invoked", (ev) => {
            this.setItem(ev.item);
            this.events.dispatch("selected", {
                type: "selected",
                item: ev.item,
                target: this
            });
        });
        this.on("active", (active) => {
            if (active) {
                //dropdown.setPrivate("currentId", $type.numberToString(this.get("strokeWidth")));
                this.setTimeout(() => dropdown.show(), 10);
            }
            else {
                dropdown.hide();
            }
        });
    }
    setItem(item) {
        if (this.get("fixedLabel") !== true) {
            const label = this.getPrivate("label");
            if ($type.isString(item)) {
                label.innerHTML = item;
            }
            else {
                if (item.icon) {
                    const icon = this.getPrivate("icon");
                    icon.innerHTML = "";
                    icon.appendChild(item.icon.cloneNode(true));
                    icon.style.display = "";
                }
                else {
                    //icon.style.display = "none";
                }
                if (item.label) {
                    label.innerHTML = item.label;
                    label.style.display = "";
                }
                else {
                    label.innerHTML = "";
                    label.style.display = "none";
                }
            }
        }
    }
    _beforeChanged() {
        super._beforeChanged();
        if (this.isDirty("items")) {
            const dropdown = this.getPrivate("dropdown");
            if (dropdown) {
                const items = this.get("items");
                const dropdownItems = [];
                let currentItem = this.get("currentItem");
                if (items) {
                    $array.each(items, (item) => {
                        const itemObject = $type.isString(item) ? {
                            id: item,
                            label: item
                        } : item;
                        dropdownItems.push(itemObject);
                        if ($type.isString(currentItem) && currentItem == itemObject.id) {
                            currentItem = itemObject;
                        }
                    });
                }
                dropdown.set("items", dropdownItems);
                //console.log(this.className, this.isAccessible())
            }
        }
    }
    _dispose() {
        super._dispose();
    }
    _maybeMakeAccessible() {
        super._maybeMakeAccessible();
        if (this.isAccessible()) {
            const button = this.getPrivate("button");
            button.setAttribute("aria-label", button.getAttribute("title") + "; " + this._t("Press ENTER or use arrow keys to navigate"));
            if ($utils.supports("keyboardevents")) {
                this._disposers.push($utils.addEventListener(document, "keydown", (ev) => {
                    if (document.activeElement == button) {
                        if (ev.keyCode == 38 || ev.keyCode == 40) {
                            // Open on arrows
                            if (!this.get("active")) {
                                this._handleClick();
                            }
                        }
                    }
                }));
            }
        }
    }
}
Object.defineProperty(DropdownListControl, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "DropdownListControl"
});
Object.defineProperty(DropdownListControl, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: StockControl.classNames.concat([DropdownListControl.className])
});
//# sourceMappingURL=DropdownListControl.js.map