import * as React from 'react';
import styles from './Spotlight.module.scss';
import { ISpotlightProps } from './ISpotlightProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { ISpotlightState } from './ISpotlightState';
import common from '../../common/common';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default class AllSpotlight extends React.Component<ISpotlightProps, ISpotlightState> {

  constructor(props: ISpotlightProps, state: ISpotlightState) {
    super(props);
    //Initialize the State
    this.state = {
      isLoading:true,
      items: [
        {
          EmployeeName: {
            EMail: '',
            FirstName: '',
            LastName: '',
            JobTitle: ''
          },
          MediaHouse: 'No Spotlight to Display',
          ID: 0,
          Description: "",
          PublishDate:null
        }
      ]
    };
  }

  public componentDidMount(): void {
    this.getSpotlightRecords();
  }
  public componentWillReceiveProps(nextProps): void {
    this.getSpotlightRecords();
  }
  //get StarPerformer's Records
  private getSpotlightRecords(): void {
    var Url = this.props.siteUrl;
    var method = 'get items for Spotlight';
    var listId = this.props.listId;
    let newCommonObj: common = new common();
    var query = `?$select=EmployeeName/JobTitle,EmployeeName/EMail,EmployeeName/FirstName,EmployeeName/LastName,EmployeeName/EMail,MediaHouse,HeadLine,RespectivePageLink&$expand=EmployeeName/Id`;

    newCommonObj.getDataFromListUsingGuid(Url, listId, query, method).then(async (res) => {
      if (res.data.value != undefined && res.data.value != null) {
        //response not null then setState this Response
        this.setState({ items: res.data.value });
      }
    }).catch(error => {
      console.log(error);
    });
  }

  public render(): React.ReactElement<ISpotlightProps> {
    return (
      <div className={styles.container}>
        <h2>SPOTLIGHTS</h2>
        {
          // If data is null then will show message of "No SpotLights to Display"
          (this.state.items[0].MediaHouse === "No SpotLights to Display")
            ?
            <div className={`ms-Grid ${styles.padnone}`} dir="ltr">
              <div className="ms-Grid-row">
                <div className="ms-Grid-col ms-sm3 ms-md3">
                  <img src={`${this.props.siteUrl}/_layouts/15/userphoto.aspx?size=L`} style={{ width: '100px' }} />
                </div>
                <div className="ms-Grid-col ms-sm9 ms-md9">
                  <div className={styles.spotdetails}>
                    <h2>No SpotLights to Display</h2>
                  </div>
                </div>
              </div>
            </div>
            :
            <div className={`ms-Grid ${styles.padnone}`} dir="ltr">
              {this.state.items.map((item, key) => {
                return (<div className="ms-Grid-row">
                  <div className="ms-Grid-col ms-sm3 ms-md3">
                    <img src={`${this.props.siteUrl}/_layouts/15/userphoto.aspx?size=L&accountname=${item.EmployeeName.EMail}`} style={{ width: '100px' }} />
                  </div>
                  <div className="ms-Grid-col ms-sm9 ms-md9">
                    <div className={styles.spotdetails}>
                      <h2> {item.EmployeeName.FirstName} {item.EmployeeName.LastName}</h2>
                      <p> {item.EmployeeName.JobTitle}</p>
                      <p>{(item.MediaHouse).substring(0, 150)}</p>
                      <p> <a href={`${this.props.siteUrl}/SitePages/Spotlight.aspx?SpotlightID=${item.ID}`} className={styles.readmore} target="_blank">Read More</a></p>
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

