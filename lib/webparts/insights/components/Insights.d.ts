import * as React from 'react';
import { IInsightsProps } from './IInsightsProps';
import { IInsightsState } from './IInsightsState';
import 'moment-timezone';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
export default class Insights extends React.Component<IInsightsProps, IInsightsState> {
    constructor(props: IInsightsProps, state: IInsightsState);
    componentDidMount(): void;
    componentWillReceiveProps(nextProps: any): void;
    GetItemsFromInsights(): Promise<void>;
    render(): React.ReactElement<IInsightsProps>;
}
//# sourceMappingURL=Insights.d.ts.map