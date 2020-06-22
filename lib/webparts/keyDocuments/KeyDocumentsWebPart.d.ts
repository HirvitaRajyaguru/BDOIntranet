import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart, IPropertyPaneConfiguration } from '@microsoft/sp-webpart-base';
import { IKeyDocumentsWebPartProps } from './IKeyDocumentsWebPartProps';
export default class KeyDocumentsWebPart extends BaseClientSideWebPart<IKeyDocumentsWebPartProps> {
    onInit<T>(): Promise<T>;
    private _listsInThisSite;
    render(): void;
    protected onDispose(): void;
    protected readonly dataVersion: Version;
    protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration;
    private fetchOptions;
    private fetchLists;
}
//# sourceMappingURL=KeyDocumentsWebPart.d.ts.map