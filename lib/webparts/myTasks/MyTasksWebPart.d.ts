import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart, IPropertyPaneConfiguration } from '@microsoft/sp-webpart-base';
import { IMyTasksWebPartProps } from './IMyTasksWebPartProps';
export default class MyTasksWebPart extends BaseClientSideWebPart<IMyTasksWebPartProps> {
    render(): void;
    protected onDispose(): void;
    protected readonly dataVersion: Version;
    protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration;
}
//# sourceMappingURL=MyTasksWebPart.d.ts.map