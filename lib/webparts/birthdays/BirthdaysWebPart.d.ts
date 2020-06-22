import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart, IPropertyPaneConfiguration } from '@microsoft/sp-webpart-base';
import { IBirthdaysWebPartProps } from './IBirthdaysWebPartProps';
export default class BirthdaysWebPart extends BaseClientSideWebPart<IBirthdaysWebPartProps> {
    onInit<T>(): Promise<T>;
    private _listsInThisSite;
    render(): void;
    protected onDispose(): void;
    protected readonly dataVersion: Version;
    protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration;
    private fetchOptions;
    private fetchLists;
}
//# sourceMappingURL=BirthdaysWebPart.d.ts.map