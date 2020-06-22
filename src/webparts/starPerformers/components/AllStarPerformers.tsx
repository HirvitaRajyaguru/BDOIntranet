import * as React from 'react';
import styles from './StarPerformers.module.scss';
import { IStarPerformersProps } from './IStarPerformersProps';
import { escape, extend } from '@microsoft/sp-lodash-subset';
import { IStarPerformersState } from './IStarPerformersState';
import common from '../../common/common';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default class AllStarPerformers extends React.Component<IStarPerformersProps, IStarPerformersState> {

  constructor(props: IStarPerformersProps, state: IStarPerformersState) {
    super(props);
    //Initialize the State
    this.state = {
      items: [
        {
          EmployeeName: {
            EMail: '',
            FirstName: '',
            LastName: ''
          },
          AwardType: 'No Award to Display',
          AwardDate: '',
        }
      ],
      isLoading: false
    };
  }

  public componentDidMount(): void {
    this.getStarPerformarRecord();
  }
  public componentWillReceiveProps(nextProps): void {
    this.getStarPerformarRecord();
  }

  //get StarPerformer's data
  private getStarPerformarRecord(): void {
    var yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    var Url = this.props.siteUrl;
    var method = 'get items for Star Performars';
    var listId = this.props.listId;
    let newCommonObj: common = new common();
    var query= `?$select=EmployeeName/EMail,EmployeeName/FirstName,EmployeeName/LastName,EmployeeName/EMail,AwardName,ExpiryDate&$expand=EmployeeName/Id&$Filter=(ExpiryDate ge datetime'${yesterday.toISOString()}')`;
    newCommonObj.getDataFromListUsingGuid(Url, listId, query, method).then(async (res) => {
      if (res.data.value != undefined && res.data.value != null) {
        //response not null then setState this Response
        this.setState({ items: res.data.value });
      }
    }).catch(error => {
      console.log(error);
    });
  }

  public render(): React.ReactElement<IStarPerformersProps> {
    return (
      <div className={styles.container}>
      <h2>STAR PERFORMERS</h2>
        {
          // If data is null then will show message of "No Award to Display"
          (this.state.items[0].AwardType === "No Award to Display")
            ?
            <div className="ms-Grid-row">
              <div className="ms-Grid-col ms-sm3 ms-md3">
                <img src={`${this.props.siteUrl}/_layouts/15/userphoto.aspx?size=L`} style={{ width: '100px' }} />
              </div>

              <div className="ms-Grid-col ms-sm9 ms-md9">
                <div >
                  <h3> No Award to Display</h3>
                </div>
              </div>
            </div>
            :
            <div>
              {this.state.items.map((item, key) => {
                return (<div className="ms-Grid-row">
                  {/*Image display or Not*/}
                  {this.props.IsImage == true ? (
                    <div className="ms-Grid-col ms-sm3 ms-md3">
                      <img src={`${this.props.siteUrl}/_layouts/15/userphoto.aspx?size=L&accountname=${item.EmployeeName.EMail}`} style={{ width: '100px' }} />
                    </div>
                  ) : (<div></div>)}
                  <div className="ms-Grid-col ms-sm9 ms-md9">
                    <div >
                      <h3> {item.EmployeeName.FirstName} {item.EmployeeName.LastName}</h3>
                      <p> {item.AwardType}</p>
                    </div>
                  </div>
                </div>);
              })}
            </div>
        }
      </div>
    );
  }
}
