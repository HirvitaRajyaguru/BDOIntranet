import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart, IPropertyPaneConfiguration } from '@microsoft/sp-webpart-base';
import { IStarPerformersWebPartProps } from './IStarPerformersWebPartProps';
export default class StarPerformersWebPart extends BaseClientSideWebPart<IStarPerformersWebPartProps> {
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
//# sourceMappingURL=StarPerformersWebPart.d.ts.map