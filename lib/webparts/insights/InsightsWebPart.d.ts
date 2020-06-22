import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart, IPropertyPaneConfiguration } from '@microsoft/sp-webpart-base';
import { IInsightsWebPartProps } from './IInsightsWebPartProps';
export default class InsightsWebPart extends BaseClientSideWebPart<IInsightsWebPartProps> {
    onInit<T>(): Promise<T>;
    private _listsInThisSite;
    render(): void;
    protected onDispose(): void;
    protected readonly dataVersion: Version;
    protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration;
    private fetchOptions;
    private fetchLists;
}
//# sourceMappingURL=InsightsWebPart.d.ts.map