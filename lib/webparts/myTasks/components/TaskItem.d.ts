import * as React from "react";
import { ITaskItem } from "./ITaskItem";
import "moment-timezone";
declare class TaskItem extends React.Component<ITaskItem, ITaskItem> {
    constructor(props: ITaskItem);
    componentDidMount(): void;
    getTaskDescription(id: any): void;
    render(): React.ReactElement<ITaskItem>;
}
export default TaskItem;
//# sourceMappingURL=TaskItem.d.ts.map