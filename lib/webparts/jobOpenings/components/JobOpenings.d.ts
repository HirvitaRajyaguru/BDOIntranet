import * as React from 'react';
import { IJobOpeningsProps } from './IJobOpeningsProps';
import 'moment-timezone';
export interface IJobopeningsState {
    isLoading: boolean;
    items: [{
        Id: number;
        Title: string;
        Created: null;
        Location: string;
        JobDescription: string;
    }];
    counter: number;
}
export default class JobOpenings extends React.Component<IJobOpeningsProps, IJobopeningsState> {
    constructor(props: IJobOpeningsProps);
    componentDidMount(): void;
    GetItemsForJobOpening(): void;
    render(): React.ReactElement<IJobOpeningsProps>;
}
//# sourceMappingURL=JobOpenings.d.ts.map