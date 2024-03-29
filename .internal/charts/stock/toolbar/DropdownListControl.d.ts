import { StockControl, IStockControlSettings, IStockControlPrivate, IStockControlEvents } from "./StockControl";
import { DropdownList, IDropdownListItem } from "./DropdownList";
export interface IDropdownListControlSettings extends IStockControlSettings {
    /**
     * Currently selected item.
     */
    currentItem?: string | IDropdownListItem;
    /**
     * Label does not change when item is selected in the list.
     */
    fixedLabel?: boolean;
    /**
     * A list of items in the dropdown.
     */
    items?: Array<string | IDropdownListItem>;
    /**
     * If set to `true`, the dropdown will fix the height to fit within chart's
     * area, with scroll if the contents do not fit.
     */
    scrollable?: boolean;
    /**
     * Maximum search items to show.
     */
    maxSearchItems?: number;
    /**
     * Is the list searchable? If `true` shows search field and
     * calls `searchCallback` function for a list of items.
     */
    searchable?: boolean;
    /**
     * A callback function which returns a list of items based on a search query.
     */
    searchCallback?: (query: string) => IDropdownListItem[];
    /**
     * An array of item IDs to now show in the list.
     *
     * @since 5.7.0
     */
    exclude?: string[];
}
export interface IDropdownListControlPrivate extends IStockControlPrivate {
    dropdown?: DropdownList;
}
export interface IDropdownListControlEvents extends IStockControlEvents {
    selected: {
        item: string | IDropdownListItem;
    };
}
/**
 * A generic control which creates a searchable list of items in a dropdown.
 *
 * Can be used in a [[StockToolbar]].
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/stock/toolbar/dropdown-list-control/} for more info
 */
export declare class DropdownListControl extends StockControl {
    static className: string;
    static classNames: Array<string>;
    _settings: IDropdownListControlSettings;
    _privateSettings: IDropdownListControlPrivate;
    _events: IDropdownListControlEvents;
    protected _afterNew(): void;
    protected _initElements(): void;
    setItem(item: string | IDropdownListItem): void;
    _beforeChanged(): void;
    protected _dispose(): void;
    protected _maybeMakeAccessible(): void;
}
//# sourceMappingURL=DropdownListControl.d.ts.map