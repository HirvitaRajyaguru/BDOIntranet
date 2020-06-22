import * as React from 'react';
import styles from './Announcement.module.scss';
import { IAnnouncementProps } from './IAnnouncementProps';
import { escape } from '@microsoft/sp-lodash-subset';
import Moment from 'react-moment';
import 'moment-timezone';
import Common from '../../common/common';
import { Loader } from '../../common/Loading';
import { Link } from 'office-ui-fabric-react/lib/components/Link';
import { UrlQueryParameterCollection } from '@microsoft/sp-core-library';
import AnnouncementId from './AnnouncementId';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { FontSizes } from '@uifabric/styling';
import { mergeStyles, mergeStyleSets } from 'office-ui-fabric-react/lib/Styling';
import { Image, Stack, IStackTokens, Text, ITextStyles } from 'office-ui-fabric-react';
import * as strings from 'AnnouncementWebPartStrings';

const iconClass = mergeStyles({
  fontSize: FontSizes.superLarge,
});
const iconclassNames = mergeStyleSets({
  redAnnouncemen: [{ color: 'red' }, iconClass],
});

export interface IAnnouncementState {
  isLoading: boolean;
  items: [
    {
      "Title": string,
      "Description": string,
      "AnnouncementDate": Date,
      "ID": number
    }];
}
export default class Announcement extends React.Component<IAnnouncementProps, IAnnouncementState> {
  public constructor(props: IAnnouncementProps, state: IAnnouncementState) {
    super(props);
    //Initialize the State
    this.state = {
      isLoading: true,
      items: [
        {
          "Title": "No Announcement Available",
          "Description": "",
          "AnnouncementDate": null,
          "ID": 0
        }
      ]
    };
  }
  public async componentDidMount() {
    await this.GetCurrentUserLocation();
  }

  public componentWillReceiveProps(nextProps): void {
    this.GetCurrentUserLocation();
  }

  //get user's Current location
  //Code Review - Keep first letter of Custom method names in caps.
  public async GetCurrentUserLocation() {
    await this.props.graphClient.api('/me/city')  //get current user's profile
      .get((error: any, city: any, rawResponse?: any) => {
        //# TODO change Department to serviceline and officelocation to City
        this.props.graphClient.api('/me/department')  //get current user's department
          .get((error: any, department: any, rawResponse?: any) => {
            this.GetItemsFromAnnouncement(city.value, department.value);
          });
      });
  }
  //get Items from AnnouncmentsList for Announcement
  public GetItemsFromAnnouncement(location, serviceLine) {
    var query, dataFiltered;
    var method = 'get items for Announcement';
    let objCommon: Common = new Common();
    if (this.props.serviceline == strings.allServiceLine && this.props.location == strings.allLocation) //serviceline not selected query is fetch alerts acording to all sericeline and user's location
      query = "?$select=Title,Description,AnnouncementDate,ID,ServiceArea,Location&$filter=ApprovalStatus eq 'Approved'&$orderby=PublishDate desc&$top=1";
    else if (this.props.serviceline == strings.allServiceLine && this.props.location != strings.allLocation)
      query = "?$select=Title,Description,AnnouncementDate,ID,ServiceArea,Location&$filter=TaxCatchAll/Term eq '" + this.props.location + "'and ApprovalStatus eq 'Approved'&$orderby=PublishDate desc&$top=1";
    else if (this.props.serviceline != strings.allServiceLine && this.props.location == strings.allLocation)
      query = "?$select=Title,Description,AnnouncementDate,ID,ServiceArea,Location&$filter=TaxCatchAll/Term eq '" + this.props.serviceline + "' and ApprovalStatus eq 'Approved'&$orderby=PublishDate desc&$top=1";
    else if (this.props.serviceline != strings.allServiceLine && this.props.location != strings.allLocation)
      query = "?$select=Title,Description,AnnouncementDate,ID,ServiceArea,Location&$filter=TaxCatchAll/Term eq '" + this.props.serviceline + "' and TaxCatchAll/Term eq '" + this.props.location + "' and ApprovalStatus eq 'Approved'&$orderby=PublishDate desc&$top=1";

    objCommon.getDataFromListUsingGuid(this.props.siteurl, this.props.listId, query, method).then(async (res) => {
      if (res.data.value.length > 0) {
        //if service line is all then ordring First Your serviceline display after that other
        if (this.props.serviceline == strings.allServiceLine || this.props.location == strings.allLocation) {
          if (this.props.serviceline == strings.allServiceLine && this.props.location == strings.allLocation) //If in Property Pane selected is All Location and All Serviceline
          {
            dataFiltered = res.data.value.filter(
              data => data.ServiceArea[0].Label == serviceLine && data.Location[0].Label == location
            );//Filter by login user's service line and location
          }
          else if (this.props.serviceline == strings.allServiceLine && this.props.location != strings.allLocation) //If in Property Pane selected is perticular Location and All Serviceline
          {
            dataFiltered = res.data.value.filter(
              data => data.ServiceArea[0].Label == serviceLine
            );//Filter by login user's service line 
          }
          else if (this.props.serviceline != strings.allServiceLine && this.props.location == strings.allLocation) //If in Property Pane selected is perticular Location and All Serviceline
          {
            dataFiltered = res.data.value.filter(
              data => data.Location[0].Label == location
            );//Filter by login user's location 
          }

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
                  "Title": myservice.Title,
                  "Description": myservice.Description,
                  "AnnouncementDate": myservice.AnnouncementDate,
                  "ID": myservice.ID
                });
              });
              res.data.value.forEach(otherservice => {
                orderservice.push({
                  "Title": otherservice.Title,
                  "Description": otherservice.Description,
                  "AnnouncementDate": otherservice.AnnouncementDate,
                  "ID": otherservice.ID
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
            "Title": `No Announcement Available`,
            "Description": "",
            "AnnouncementDate": new Date(),
            "ID": 0
          }]
        });
      }
    }).catch(error => {
      console.log(error);
    });
  }

  public render(): React.ReactElement<IAnnouncementProps> {
    var SiteUrl = this.props.siteurl
    var queryParameters = new UrlQueryParameterCollection(window.location.href);
    if (parseInt(queryParameters.getValue("Announcement")) > 0) {
      return (<AnnouncementId graphClient={this.props.graphClient}
        siteurl={this.props.siteurl}
        listId={this.props.listId}
        serviceline={this.props.serviceline}
        location={this.props.location}
      />);
    } else {
      return (
        <div className={styles.announcement}>
          <Stack padding={5}>
            <div className={styles.panelStyle} >
              {
                (this.state.isLoading) ? <Loader message="Please wait..." />
                  :
                  (this.state.items[0].Title === "No Announcement Available")
                    ?
                    <div className={styles.tableStyle} >
                      <div className={styles.rowStyle}>
                        <div className={styles.announceblk}>
                          <div className={styles.CellStyle}>{this.state.items[0].Title}</div>
                        </div>
                      </div>
                    </div>
                    :
                    <div className={styles.tableStyle} >
                      {this.state.items.map(function (item, key) {
                        return (
                          <div className="ms-Grid">
                            <div className="ms-Grid-row">
                              <div className="ms-Grid-col ms-sm12 ms-md1">
                                <div ><Icon iconName="Megaphone" className={iconclassNames.redAnnouncemen} />{/*<img src={`${logo}`} className={styles.imglogo} />*/}</div>
                              </div>
                              <div className="ms-Grid-col ms-sm12 ms-md11">
                                <div className={styles.descriptionaStyle} dangerouslySetInnerHTML={{ __html: item.Description }}></div>
                              </div>
                            </div>
                          </div>)
                      }
                      )}
                    </div>
              }
            </div>
          </Stack>
        </div>
      );
    }
  }
}
