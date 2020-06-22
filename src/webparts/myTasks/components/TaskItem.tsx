import * as React from "react";
import styles from "./MyTasks.module.scss";
import { MSGraphClient } from "@microsoft/sp-http";
import { ITaskItem } from "./ITaskItem";
import Moment from "react-moment";
import "moment-timezone";
import { FontWeights } from '@uifabric/styling';
import { Icon, IIconStyles, Image, Text, ITextStyles } from 'office-ui-fabric-react';
import { NeutralColors } from '@uifabric/fluent-theme/lib/fluent/FluentColors';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { FontSizes } from '@uifabric/fluent-theme/lib/fluent/FluentType';
import { Link } from 'office-ui-fabric-react/lib/components/Link';

var taskUrl = "https://tasks.office.com/synoverge.onmicrosoft.com/Home/Task/TaskID";

class TaskItem extends React.Component<ITaskItem, ITaskItem> {
  public constructor(props: ITaskItem) {
    super(props);
    //Initialize the State
    this.state = {
      Description: this.props.Description,
      Title: this.props.Title,
      DueDate: this.props.DueDate,
      Id: this.props.Id
    };
  }

  public componentDidMount() {
    this.getTaskDescription(this.props.Id);
  }

  public getTaskDescription(id) {
    MSGraphClient.prototype
      .api(`/planner/tasks/${id}/details`)
      .get((error: any, tasksResponse: any, rawResponse?: any) => {
        this.setState({ Description: tasksResponse.description });
      });
  }

  public render(): React.ReactElement<ITaskItem> {
    const siteTextStyles: ITextStyles = {
      root: {
        fontWeight: 'bold',
        fontSize: FontSizes.size14,
        fontFamily: 'proxima-nova,arial'
      },
    };
    const readmore: ITextStyles = {
      root: {
        color: NeutralColors.gray100,
        fontFamily: 'proxima-nova,arial',
        maxHeight: '40px',
        paddingTop: '5px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        fontSize: FontSizes.size14,
        fontWeight: '100',
        margin: '0'
    },
    };
    const duedates: ITextStyles = {
      root: {
        color: NeutralColors.gray160,
        fontFamily: 'proxima-nova,arial',
        fontSize: FontSizes.size12,
        paddingTop: "5px",
        paddingBottom:"10px"
      },
    }
  
    if (!this.state.Description) <div>waiting...</div>;
    return (
      <div>
        <div className="ms-Grid-row">
          <div className="ms-Grid-col ms-sm12 ms-md12">
            <Label styles={siteTextStyles}><a href={taskUrl.replace("TaskID", this.state.Id)} target="_blank" data-interception="off"> {this.state.Title} <span className={styles.textarrow}></span></a></Label>
            <Label className={styles.descriptionaStyle} >{this.state.Description}</Label>
            <Label styles={duedates}>Due Date: {<Moment format="DD MMM YYYY">{this.state.DueDate}</Moment>}</Label>
              <div className={styles.borderline} />
          </div>
        </div>
        {/**/}
         
      </div>
      
         
        
    );
  }
}

export default TaskItem;


//<div className={styles.rowStyle}>
//  <div className={styles.announceblk}>
//    <div className={styles.dueDateStyle}>{<Moment format="MMM DD ">
//      {this.state.DueDate}</Moment>}
//    </div>
//    <div className={styles.CellStyle}>
//      <a href={taskUrl.replace("TaskID", this.state.Id)} target="_blank"> {this.state.Title}
//        <span className={styles.textarrow}></span> </a>

//      <div className={styles.descriptionaStyle}>
//        {this.state.Description}
//      </div>

//    </div>
//  </div>
//</div>
