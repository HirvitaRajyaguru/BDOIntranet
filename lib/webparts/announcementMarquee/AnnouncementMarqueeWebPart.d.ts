import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart, IPropertyPaneConfiguration } from '@microsoft/sp-webpart-base';
import { IAnnouncementMarqueeWebPartProps } from './IAnnouncementMarqueeWebPartProps';
export default class AnnouncementMarqueeWebPart extends BaseClientSideWebPart<IAnnouncementMarqueeWebPartProps> {
    onInit<T>(): Promise<T>;
    private _listsInThisSite;
    render(): void;
    protected onDispose(): void;
    protected readonly dataVersion: Version;
    protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration;
    private fetchLists;
    private fetchOptions;
}
//# sourceMappingURL=AnnouncementMarqueeWebPart.d.ts.map