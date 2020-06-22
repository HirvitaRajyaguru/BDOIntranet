import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart, IPropertyPaneConfiguration, IWebPartContext } from '@microsoft/sp-webpart-base';
import { IPollProps } from './components/IPollProps';
export default class PollWebPart extends BaseClientSideWebPart<IPollProps> {
    constructor(context?: IWebPartContext);
    render(): void;
    protected onDispose(): void;
    protected readonly dataVersion: Version;
    protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration;
}
//# sourceMappingURL=PollWebPart.d.ts.map