import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart, IPropertyPaneConfiguration } from '@microsoft/sp-webpart-base';
import { IEventsWebPartProps } from './IEventsWebPartProps';
export default class EventsWebPart extends BaseClientSideWebPart<IEventsWebPartProps> {
    onInit<T>(): Promise<T>;
    private _listsInThisSite;
    render(): void;
    protected onDispose(): void;
    protected readonly dataVersion: Version;
    protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration;
    private fetchLists;
    private fetchOptions;
    private onEventStartDateValidation;
    private onEventEndDateValidation;
}
//# sourceMappingURL=EventsWebPart.d.ts.map