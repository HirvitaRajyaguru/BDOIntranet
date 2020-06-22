import * as React from 'react';
import { IAnnouncementProps } from './IAnnouncementProps';
import 'moment-timezone';
export interface IAnnouncementState {
    isLoading: boolean;
    items: [{
        "Title": string;
        "Description": string;
        "AnnouncementDate": null;
        "ExpiryDate": null;
    }];
}
export default class Announcement extends React.Component<IAnnouncementProps, IAnnouncementState> {
    constructor(props: IAnnouncementProps, state: IAnnouncementState);
    componentDidMount(): void;
    GetItemsFromAnnouncement(): void;
    render(): React.ReactElement<IAnnouncementProps>;
}
//# sourceMappingURL=Announcement.d.ts.map