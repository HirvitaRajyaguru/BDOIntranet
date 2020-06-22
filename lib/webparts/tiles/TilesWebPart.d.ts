import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart, IPropertyPaneConfiguration } from '@microsoft/sp-webpart-base';
import { ITilesWebPartProps } from './ITilesWebPartProps';
export default class TilesWebPart extends BaseClientSideWebPart<ITilesWebPartProps> {
    onInit<T>(): Promise<T>;
    private _listsInThisSite;
    render(): void;
    protected onDispose(): void;
    protected readonly dataVersion: Version;
    protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration;
    private fetchOptions;
    private fetchLists;
}
//# sourceMappingURL=TilesWebPart.d.ts.map