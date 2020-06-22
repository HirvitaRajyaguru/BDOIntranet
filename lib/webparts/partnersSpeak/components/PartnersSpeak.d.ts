import * as React from 'react';
import { IPartnersSpeakProps } from './IPartnersSpeakProps';
export interface IPartnersSpeakState {
    isLoading: boolean;
    speaks: {
        "Title": string;
        "Description": string;
        WriterImage: {
            "Url": URL;
        };
        BannerImage: {
            "Url": URL;
        };
    };
}
export default class PartnersSpeak extends React.Component<IPartnersSpeakProps, IPartnersSpeakState> {
    constructor(props: IPartnersSpeakProps, state: IPartnersSpeakState);
    componentDidMount(): void;
    private LoadSpeak;
    render(): React.ReactElement<IPartnersSpeakProps>;
}
//# sourceMappingURL=PartnersSpeak.d.ts.map