import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart, IPropertyPaneConfiguration } from '@microsoft/sp-webpart-base';
import { IQuickLinksWebPartProps } from './IQuickLinksWebPartProps';
export default class QuickLinksWebPart extends BaseClientSideWebPart<IQuickLinksWebPartProps> {
    onInit<T>(): Promise<T>;
    private _listsInThisSite;
    render(): void;
    protected onDispose(): void;
    protected readonly dataVersion: Version;
    protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration;
    private fetchLists;
    private fetchOptions;
}
//# sourceMappingURL=QuickLinksWebPart.d.ts.map