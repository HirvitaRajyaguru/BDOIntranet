import * as React from 'react';
import { IPartnerSpeakDetailsProps } from './IPartnerSpeakDetailsProps';
export interface IPartnerSpeakDetailsState {
    isLoading: boolean;
    speaks: {
        "Title": string;
        "Description": string;
        WriterImage: {
            "Url": string;
            "Description": string;
        };
        BannerImage: {
            "Url": string;
            "Description": string;
        };
    };
}
export default class PartnerSpeakDetails extends React.Component<IPartnerSpeakDetailsProps, IPartnerSpeakDetailsState> {
    constructor(props: IPartnerSpeakDetailsProps, state: IPartnerSpeakDetailsState);
    componentDidMount(): void;
    private LoadSpeak;
    render(): React.ReactElement<IPartnerSpeakDetailsProps>;
}
//# sourceMappingURL=PartnerSpeakDetails.d.ts.map