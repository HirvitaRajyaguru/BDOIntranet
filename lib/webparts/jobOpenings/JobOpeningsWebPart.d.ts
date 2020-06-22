import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart, IPropertyPaneConfiguration } from '@microsoft/sp-webpart-base';
import { IJobOpeningsProps } from './components/IJobOpeningsProps';
export default class JobOpeningsWebPart extends BaseClientSideWebPart<IJobOpeningsProps> {
    onInit<T>(): Promise<T>;
    private _listsInThisSite;
    render(): void;
    protected onDispose(): void;
    protected readonly dataVersion: Version;
    protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration;
    private fetchLists;
    private fetchOptions;
}
//# sourceMappingURL=JobOpeningsWebPart.d.ts.map