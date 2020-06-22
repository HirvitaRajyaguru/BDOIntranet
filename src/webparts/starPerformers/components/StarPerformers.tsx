import * as React from 'react';
import styles from './StarPerformers.module.scss';
import { IStarPerformersProps } from './IStarPerformersProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { IStarPerformersState } from './IStarPerformersState';
import common from '../../common/common';
import { Loader } from '../../common/Loading';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from 'office-ui-fabric-react';
import AllStarPerformers from './AllStarPerformers';
import * as strings from 'StarPerformersWebPartStrings';


export default class StarPerformers extends React.Component<IStarPerformersProps, IStarPerformersState> {

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
    this.getCurrentUserLocation();
  }
  public componentWillReceiveProps(nextProps): void {
    this.getCurrentUserLocation();
  }
  //get user's Current location 
  public async getCurrentUserLocation() {
    await this.props.graphClient.api('/me')  //get current user's profile
      .get((error: any, userResponse: any, rawResponse?: any) => {
        //# TODO change Department to serviceline and officelocation to City
        this.props.graphClient.api('/me/department')  //get current user's ServiceLine
          .get((ServiceLineerror: any, sericeLine: any, ServiceLinerawResponse?: any) => {
            this.getStarPerformarRecord(userResponse.officeLocation, sericeLine.value);
          });
      });
  }

  //get StarPerformer's data
  private getStarPerformarRecord(location, serviceLine): void {
    var method = 'get items for Star Performars';
    let newCommonObj: common = new common();
    var query = `?$select=*,EmployeeName/EMail,EmployeeName/FirstName,EmployeeName/LastName,EmployeeName/EMail&$expand=EmployeeName/Id`;
    if (this.props.serviceline == undefined)  //serviceline not selected query is fetch alerts acording to current user's sericeline and location
      query = "?$select=*,EmployeeName/EMail,EmployeeName/FirstName,EmployeeName/LastName,EmployeeName/EMail,TaxCatchAll/Term&$filter=TaxCatchAll/Term eq '" + serviceLine + "' and TaxCatchAll/Term eq '" + location + "'&$expand=TaxCatchAll/Label,EmployeeName/Id&$orderby=AwardDate desc&$top=5";
    else if (this.props.serviceline == strings.allServiceline) //is fetch alerts acording to all sericeline and user's location
      query = "?$select=*,EmployeeName/EMail,EmployeeName/FirstName,EmployeeName/LastName,EmployeeName/EMail&$expand=EmployeeName/Id&$orderby=AwardDate desc&$Filter=(TaxCatchAll/Term eq '" + location + "')&$top=5";
    else//query is fetch alerts acording to selected sericeline and user's location
      query = "?$select=*,EmployeeName/EMail,EmployeeName/FirstName,EmployeeName/LastName,EmployeeName/EMail,TaxCatchAll/Term&$filter=TaxCatchAll/Term eq '" + this.props.serviceline + "' and TaxCatchAll/Term eq '" + location + "'&$expand=TaxCatchAll/Label,EmployeeName/Id&$orderby=AwardDate desc&$top=5";

    newCommonObj.getDataFromListUsingGuid(this.props.siteUrl, this.props.listId, query, method).then(async (res) => {
      if (res.data.value.length > 0) {
        //if service line is all then ordring First Your serviceline display after that other
        if (this.props.serviceline == "ALL SERVICELINE") {
          var dataFiltered = res.data.value.filter(
            data => data.ServiceArea[0].Label == serviceLine //Filter by your service line
          );
          if (dataFiltered.length > 0) {
            if (dataFiltered.length == res.data.value.length) {//If all filtered data's service line = yur service line
              this.setState({ items: dataFiltered, isLoading: false });
            }
            else {
              var i = 0;
              for (i = 0; i < dataFiltered.length; i++) {
                const index = res.data.value.indexOf(dataFiltered[i]);
                if (index > -1) {
                  res.data.value.splice(index, 1);
                }
              }
              let orderservice = [];
              dataFiltered.forEach(myservice => {
                orderservice.push({
                  "EmployeeName": {
                    "EMail": myservice.EmployeeName.EMail,
                    "FirstName": myservice.EmployeeName.FirstName,
                    "LastName": myservice.EmployeeName.LastName
                  },
                  "AwardType": myservice.AwardType,
                  "AwardDate": myservice.AwardDate
                });
              });
              res.data.value.forEach(otherservice => {
                orderservice.push({
                  "EmployeeName": {
                    "EMail": otherservice.EmployeeName.EMail,
                    "FirstName": otherservice.EmployeeName.FirstName,
                    "LastName": otherservice.EmployeeName.LastName
                  },
                  "AwardType": otherservice.AwardType,
                  "AwardDate": otherservice.AwardDate
                });
              });
              var item; item = orderservice;
              this.setState({ items: item, isLoading: false });
            }
          }
          else { //If in data Filterd no one is your serviceline
            this.setState({ items: res.data.value, isLoading: false });
          }
        }
        else { this.setState({ items: res.data.value, isLoading: false }); }

      }
      else {
        this.setState({
          isLoading: false,
          items: [{
            EmployeeName: {
              EMail: '',
              FirstName: '',
              LastName: ''
            },
            AwardType: 'No Award to Display',
            AwardDate: ''
          }]
        });
      }
    }).catch(error => {
      console.log(error);
    });
  }
  public render(): React.ReactElement<IStarPerformersProps> {

    return (
      <div className={styles.starPerformers}>
        {
          (this.props.Homepage == true) ? (
            <div className={styles.container}>
              <h2>Rewards</h2>
              {
                (this.state.isLoading) ? <Loader message="Please wait..." /> :
                  // If data is null then will show message of "No Award to Display"
                  (this.state.items[0].AwardType === "No Award to Display")
                    ?
                    <div className="ms-Grid-row">
                      <div className="ms-Grid-col ms-sm3 ms-md3">
                        <img src={`${this.props.siteUrl}/_layouts/15/userphoto.aspx?size=L`} />
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
                              <img src={`${this.props.siteUrl}/_layouts/15/userphoto.aspx?size=L&accountname=${item.EmployeeName.EMail}`} />
                            </div>
                          ) : (<div></div>)}
                          <div className="ms-Grid-col ms-sm9 ms-md9">
                            <div className={styles.paddingtop}>
                              <h3> {item.EmployeeName.FirstName} {item.EmployeeName.LastName}</h3>
                              <p> {item.AwardType}</p>
                            </div>
                          </div>
                        </div>);
                      })}
                    </div>
              }{/*/SitePages/Star-Performers.aspx*/}
              <div className="ms-Grid-row">
                <div className="ms-Grid-col ms-sm12 ms-md12">
                  <Link href={`${this.props.siteUrl}/SitePages/Search.aspx?q=${strings.searchString}`} target="_blank" className={styles.viewAll}>
                    View All
              </Link>
                </div>
              </div>
            </div>
          ) :
            (<AllStarPerformers siteUrl={this.props.siteUrl} listId={this.props.listId}
              graphClient={this.props.graphClient}
              serviceline={this.props.serviceline}
              Homepage={this.props.Homepage} IsImage={this.props.IsImage} />)
        }
      </div>
    );
  }
}

