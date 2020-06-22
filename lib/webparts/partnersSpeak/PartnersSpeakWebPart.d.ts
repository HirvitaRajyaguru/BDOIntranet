import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart, IPropertyPaneConfiguration } from '@microsoft/sp-webpart-base';
import { IPartnersSpeakWebpartProps } from './IPartnersSpeakWebpartProps';
export default class PartnersSpeakWebPart extends BaseClientSideWebPart<IPartnersSpeakWebpartProps> {
    onInit<T>(): Promise<T>;
    private _listsInThisSite;
    render(): void;
    protected onDispose(): void;
    protected readonly dataVersion: Version;
    protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration;
    private fetchLists;
    private fetchOptions;
}
//# sourceMappingURL=PartnersSpeakWebPart.d.ts.map