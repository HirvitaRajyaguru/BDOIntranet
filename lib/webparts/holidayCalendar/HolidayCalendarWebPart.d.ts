import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart, IPropertyPaneConfiguration } from '@microsoft/sp-webpart-base';
import { IHolidayCalendarWebPartProps } from './IHolidayCalendarWebPartProps';
export default class HolidayCalendarWebPart extends BaseClientSideWebPart<IHolidayCalendarWebPartProps> {
    onInit<T>(): Promise<T>;
    private _listsInThisSite;
    render(): void;
    protected onDispose(): void;
    protected readonly dataVersion: Version;
    protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration;
    /**
     *  fetch List Options
     * @param url
     */
    private fetchOptions;
    private fetchLists;
}
//# sourceMappingURL=HolidayCalendarWebPart.d.ts.map