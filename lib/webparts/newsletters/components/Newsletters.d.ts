import * as React from 'react';
import { INewslettersProps } from './INewslettersProps';
export interface INewsStates {
    items: [{
        "title": string;
        "description": string;
        "url": string;
    }];
}
export default class Newsletters extends React.Component<INewslettersProps, INewsStates> {
    constructor(props: INewslettersProps, state: INewsStates);
    componentDidMount(): void;
    getNewsfromNewsAPI(): void;
    render(): React.ReactElement<INewslettersProps>;
}
//# sourceMappingURL=Newsletters.d.ts.map