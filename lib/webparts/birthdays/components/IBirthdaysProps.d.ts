import { MSGraphClient } from '@microsoft/sp-http';
import { IBirthdaysWebPartProps } from '../IBirthdaysWebPartProps';
export interface IBirthdaysProps extends IBirthdaysWebPartProps {
    siteurl: string;
    msGraphClient: MSGraphClient;
    currentUserEmail: string;
}
//# sourceMappingURL=IBirthdaysProps.d.ts.map