import { MSGraphClient } from '@microsoft/sp-http';
import { IAnniversariesWebPartProps } from '../IAnniversariesWebPartProps';
export interface IAnniversaryProps extends IAnniversariesWebPartProps {
    siteurl: string;
    msGraphClient: MSGraphClient;
    currentUserEmail: string;
}
//# sourceMappingURL=IAnniversariesProps.d.ts.map