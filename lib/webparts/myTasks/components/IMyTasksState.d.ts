import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';
export interface IMyTasksState {
    tasks: MicrosoftGraph.PlannerTask[];
    NoTasks: string;
}
export interface IMyPlannerTask extends MicrosoftGraph.PlannerTask {
    Description: string;
}
//# sourceMappingURL=IMyTasksState.d.ts.map