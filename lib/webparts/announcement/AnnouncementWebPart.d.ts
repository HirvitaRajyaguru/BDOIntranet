import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart, IPropertyPaneConfiguration } from '@microsoft/sp-webpart-base';
import { IAnnouncementWebPartProps } from './IAnnouncementWebPartProps';
export default class AnnouncementWebPart extends BaseClientSideWebPart<IAnnouncementWebPartProps> {
    private listDropdownDisabled;
    onInit<T>(): Promise<T>;
    private _listsInThisSite;
    private _listsofSite;
    render(): void;
    protected onDispose(): void;
    protected readonly dataVersion: Version;
    protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration;
    private fetchsiteOptions;
    private fetchOptions;
    private fetchLists;
}
//# sourceMappingURL=AnnouncementWebPart.d.ts.map