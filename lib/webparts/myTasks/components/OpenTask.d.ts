import * as React from 'react';
import { IMyTasksProps } from './IMyTasksProps';
import { IMyTasksState } from "./IMyTasksState";
import 'moment-timezone';
declare class OpenTask extends React.Component<IMyTasksProps, IMyTasksState> {
    constructor(props: IMyTasksProps);
    componentDidMount(): void;
    GetOpenPlannerTask(): void;
    render(): React.ReactElement<IMyTasksProps>;
}
export default OpenTask;
//# sourceMappingURL=OpenTask.d.ts.map