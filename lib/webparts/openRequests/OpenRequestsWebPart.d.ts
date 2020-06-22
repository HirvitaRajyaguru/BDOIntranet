import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart, IPropertyPaneConfiguration } from '@microsoft/sp-webpart-base';
export interface IOpenRequestsWebPartProps {
    description: string;
}
export default class OpenRequestsWebPart extends BaseClientSideWebPart<IOpenRequestsWebPartProps> {
    render(): void;
    protected onDispose(): void;
    protected readonly dataVersion: Version;
    protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration;
}
//# sourceMappingURL=OpenRequestsWebPart.d.ts.map