import { Version } from '@microsoft/sp-core-library';
import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
export interface IEmployeeProfileWebPartProps {
    description: string;
}
export default class EmployeeProfileWebPart extends BaseClientSideWebPart<IEmployeeProfileWebPartProps> {
    render(): void;
    protected onDispose(): void;
    protected readonly dataVersion: Version;
    protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration;
}
//# sourceMappingURL=EmployeeProfileWebPart.d.ts.map