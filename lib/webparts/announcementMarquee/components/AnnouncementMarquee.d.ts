import * as React from 'react';
import { IAnnouncementMarqueeProps } from './IAnnouncementMarqueeProps';
export interface IAnnouncementMarqueeState {
    items: [{
        "Description": string;
        "Title": string;
    }];
}
export default class AnnouncementMarquee extends React.Component<IAnnouncementMarqueeProps, IAnnouncementMarqueeState> {
    constructor(props: IAnnouncementMarqueeProps, state: IAnnouncementMarqueeState);
    componentDidMount(): void;
    componentWillReceiveProps(nextProps: any): void;
    private getAnnouncementData;
    render(): React.ReactElement<IAnnouncementMarqueeProps>;
}
//# sourceMappingURL=AnnouncementMarquee.d.ts.map