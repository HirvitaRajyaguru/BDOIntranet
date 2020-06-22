import * as React from 'react';
import { ISportsScoreProps } from './ISportsScoreProps';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
export interface ISportsScoreState {
    isLoading: boolean;
    items: [{
        "id": string;
        "title": string;
    }];
}
export default class SportsScore extends React.Component<ISportsScoreProps, ISportsScoreState> {
    constructor(props: ISportsScoreProps, state: ISportsScoreState);
    componentDidMount(): void;
    private LoadData;
    render(): React.ReactElement<ISportsScoreProps>;
}
//# sourceMappingURL=SportsScore.d.ts.map