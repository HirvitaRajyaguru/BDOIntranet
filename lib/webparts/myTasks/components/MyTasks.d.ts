import * as React from 'react';
import { IMyTasksProps } from './IMyTasksProps';
import { IMyTasksState } from "./IMyTasksState";
import 'moment-timezone';
import 'react-tabs/style/react-tabs.css';
export default class MyTasks extends React.Component<IMyTasksProps, IMyTasksState> {
    constructor(props: IMyTasksProps);
    componentDidMount(): void;
    componentWillReceiveProps(nextProps: any): void;
    GetItemsPlanner(): void;
    render(): React.ReactElement<IMyTasksProps>;
}
//# sourceMappingURL=MyTasks.d.ts.map