import { Version } from '@microsoft/sp-core-library';
import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
export interface IPartnerSpeakDetailsWebPartProps {
    description: string;
    siteUrl: string;
    ListName: string;
}
export default class PartnerSpeakDetailsWebPart extends BaseClientSideWebPart<IPartnerSpeakDetailsWebPartProps> {
    render(): void;
    protected onDispose(): void;
    protected readonly dataVersion: Version;
    protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration;
}
//# sourceMappingURL=PartnerSpeakDetailsWebPart.d.ts.map