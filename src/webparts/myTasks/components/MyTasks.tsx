import * as React from 'react';
import styles from './MyTasks.module.scss';
import { IMyTasksProps } from './IMyTasksProps';
import { IMyTasksState, IMyPlannerTask } from "./IMyTasksState";
import TaskItem from "./TaskItem";
import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';
import Moment from 'react-moment';
import 'moment-timezone';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import OpenTask from './OpenTask';
import CloseTask from './CloseTask';
import { Link } from 'office-ui-fabric-react/lib/components/Link';
import { Icon, IIconStyles, Image, Text, ITextStyles } from 'office-ui-fabric-react';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { FontSizes } from '@uifabric/fluent-theme/lib/fluent/FluentType';
export default class MyTasks extends React.Component<IMyTasksProps, IMyTasksState> {
  constructor(props: IMyTasksProps) {
    super(props);
    //Initialize the State
    this.state = {
      tasks: [],
      NoTasks: "No Tasks Available"
    };
  }

  public componentDidMount() {
    this.GetItemsPlanner();
    console.log(this.props.completedRequest);
  }
  public componentWillReceiveProps(nextProps): void {
    console.log(nextProps.completedRequest);
  }
  public GetItemsPlanner() {

    var today = new Date();
    var apiUrl = '/me/planner/tasks';

    this.props.graphClient
      .api(apiUrl)
      .get((error: any, tasksResponse: any, rawResponse?: any) => {
        console.log('tasksResponse', tasksResponse);

        const allTasks: MicrosoftGraph.PlannerTask[] = tasksResponse.value;
        const plannerTasks: MicrosoftGraph.PlannerTask[] = allTasks.filter(e => e.percentComplete != 100).sort((a, b) =>
          new Date(a.dueDateTime).getDate() - new Date(b.dueDateTime).getDate()
        ).slice(0, 4);
        this.setState({ tasks: plannerTasks });
      });
  }

  public render(): React.ReactElement<IMyTasksProps> {
    const siteTextStyles: ITextStyles = {
      root: {
        fontWeight: 'bold',
        fontSize: FontSizes.size14,
        fontFamily: 'proxima-nova,arial'
      },
    };
    return (<div className={styles.myTasks}>
      <div className={styles.panelStyle}>
        <h2 className={styles.tableCaptionStyle}>My Tasks</h2>
        {/*check whether it is close Request want or not*/}
        {this.props.completedRequest == true ? (
          <Tabs className={styles.tab}>
            <TabList>
              <Tab>Open</Tab>
              <Tab>Close</Tab>
            </TabList>
            <TabPanel>
              <OpenTask graphClient={this.props.graphClient} completedRequest={this.props.completedRequest} siteUrl={this.props.siteUrl} />
            </TabPanel>
            <TabPanel>
              <CloseTask graphClient={this.props.graphClient} completedRequest={this.props.completedRequest} siteUrl={this.props.siteUrl} />
            </TabPanel>
          </Tabs>
        ) : (
            <div className={styles.myTasks}>
              {/*check whether have you any Task*/}
              {this.state.tasks.length <= 0 ? (
                <div>
                  <Label styles={siteTextStyles}> {this.state.NoTasks}</Label>
                </div>
              ) : (
                  <div >{
                    this.state.tasks.map(function (item, key) {
                      return (
                        <TaskItem
                          Title={item.title}
                          DueDate={item.dueDateTime}
                          Id={item.id}
                          Description=""
                        ></TaskItem>
                      );
                    })}
                    <div className="ms-Grid-row">
                      <div className="ms-Grid-col ms-sm12 ms-md12">
                        <Link href={`https://tasks.office.com/`} target="_blank" data-interception="off" className={styles.viewAll}>
                          View All
                      </Link>
                      </div>
                    </div>
                  </div>
                )}
            </div>)}
      </div>
    </div>);
  }
}
