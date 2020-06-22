import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart, IPropertyPaneConfiguration } from '@microsoft/sp-webpart-base';
export interface INewJoineesWebPartProps {
    description: string;
}
export default class NewJoineesWebPart extends BaseClientSideWebPart<INewJoineesWebPartProps> {
    render(): void;
    protected onDispose(): void;
    protected readonly dataVersion: Version;
    protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration;
}
//# sourceMappingURL=NewJoineesWebPart.d.ts.map