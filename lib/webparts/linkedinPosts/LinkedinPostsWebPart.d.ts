import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart, IPropertyPaneConfiguration } from '@microsoft/sp-webpart-base';
export interface ILinkedinPostsWebPartProps {
    description: string;
}
export default class LinkedinPostsWebPart extends BaseClientSideWebPart<ILinkedinPostsWebPartProps> {
    render(): void;
    protected onDispose(): void;
    protected readonly dataVersion: Version;
    protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration;
}
//# sourceMappingURL=LinkedinPostsWebPart.d.ts.map