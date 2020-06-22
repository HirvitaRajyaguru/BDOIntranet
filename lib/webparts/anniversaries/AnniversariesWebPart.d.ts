import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart, IPropertyPaneConfiguration } from '@microsoft/sp-webpart-base';
import { IAnniversariesWebPartProps } from './IAnniversariesWebPartProps';
export interface IAnniversariesWebPartProps {
    description: string;
    currentUserEmail: string;
}
export default class AnniversariesWebPart extends BaseClientSideWebPart<IAnniversariesWebPartProps> {
    onInit<T>(): Promise<T>;
    private _listsInThisSite;
    render(): void;
    protected onDispose(): void;
    protected readonly dataVersion: Version;
    protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration;
    private fetchOptions;
    private fetchLists;
}
//# sourceMappingURL=AnniversariesWebPart.d.ts.map