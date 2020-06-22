import * as React from 'react';
import styles from './MyTasks.module.scss';
import { IMyTasksProps } from './IMyTasksProps';
import { IMyTasksState, IMyPlannerTask } from "./IMyTasksState";
import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';
import Moment from 'react-moment';
import 'moment-timezone';
import TaskItem from "./TaskItem";

class OpenTask extends React.Component<IMyTasksProps, IMyTasksState> {
  constructor(props: IMyTasksProps) {
    super(props);
    //Initialize the State
    this.state = {
      tasks: [],
      NoTasks: "No Tasks Available"
    };
  }

  public componentDidMount() {
    this.GetOpenPlannerTask();
  }
  //get open tasks
  public GetOpenPlannerTask() {

    var today = new Date();
    var apiUrl = '/me/planner/tasks';

    this.props.graphClient
      .api(apiUrl)
      .get((error: any, tasksResponse: any, rawResponse?: any) => {
        const allTasks: MicrosoftGraph.PlannerTask[] = tasksResponse.value; //Open Tak means not completed and get only 10
        const plannerTasks: MicrosoftGraph.PlannerTask[] = allTasks.filter(e => e.percentComplete != 100).sort((a, b) =>
          new Date(a.dueDateTime).getDate() - new Date(b.dueDateTime).getDate()
        ).slice(0, 10);
        this.setState({ tasks: plannerTasks });
      });
  }
  public render(): React.ReactElement<IMyTasksProps> {
    return (
      <div className={styles.myTasks}>
        {/*check whether have you any Task*/}
        {this.state.tasks.length <= 0 ? (
          <div className={styles.tableStyle}>
            <div className={styles.rowStyle}>
              <div className={styles.announceblk}>
                <div className={styles.CellStyle}>{this.state.NoTasks}</div>
              </div>
            </div>
          </div>
        ) : (
            <div className={styles.tableStyle}>{
              this.state.tasks.map((item, key)=> {
                return (
                  <TaskItem
                    Title={item.title}
                    DueDate={item.dueDateTime}
                    Id={item.id}
                    Description=""
                  ></TaskItem>
                );
              })}
            </div>
          )}
      </div>
    );
  }
}
export default OpenTask;
