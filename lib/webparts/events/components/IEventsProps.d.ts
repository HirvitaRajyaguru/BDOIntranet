import { SPHttpClient } from '@microsoft/sp-http';
import { IEventsWebPartProps } from '../IEventsWebPartProps';
export interface IEventsProps extends IEventsWebPartProps {
    isWorkbench: boolean;
    siteUrl: string;
    spHttpClient: SPHttpClient;
}
//# sourceMappingURL=IEventsProps.d.ts.map