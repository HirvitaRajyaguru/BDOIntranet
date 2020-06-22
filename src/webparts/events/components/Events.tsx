import * as React from 'react';
import styles from './Events.module.scss';
import { IEventsProps } from './IEventsProps';
import { IEventsState } from './IEventsState';
import { escape } from '@microsoft/sp-lodash-subset';
import Moment from 'react-moment';
import 'moment-timezone';
import common from '../../common/common';
import { Loader } from '../../common/Loading';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Depths } from '@uifabric/fluent-theme/lib/fluent/FluentDepths';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { Card, ICardTokens, ICardSectionStyles, ICardSectionTokens, CardSection } from '@uifabric/react-cards';
import { FontWeights } from '@uifabric/styling';
import { Icon, IIconStyles, Image, Stack, IStackTokens, Text, ITextStyles, StackItem } from 'office-ui-fabric-react';
import { fontFamily } from 'html2canvas/dist/types/css/property-descriptors/font-family';
import { FontSizes } from '@uifabric/fluent-theme/lib/fluent/FluentType';
import * as strings from 'EventsWebPartStrings';
import { Link } from 'office-ui-fabric-react/lib/components/Link';

export default class Events extends React.Component<IEventsProps, IEventsState> {

  constructor(props: IEventsProps, state: IEventsState) {
    super(props);
    //Initialize the State
    this.state = {
      isLoading: true,
      items: [
        {
          EventOwner: {

            FirstName: '',
            LastName: '',
          },
          LocationAD: [{ Label: '' }],
          ADDepartment: [{ Label: '' }],
          Title: 'No Events',
          EventDate: '',
          ID: 0,
          EndDate: null
        }
      ]
    };
  }

  public async componentDidMount() {
    await this.getCurrentUserLocation();
  }
  public componentWillReceiveProps(nextProps): void {
    this.getCurrentUserLocation();
  }
  //get user's Current location 
  public async getCurrentUserLocation() {
    await this.props.graphClient.api('/me/city')  //get current user's profile
      .get(async (error: any, city: any, rawResponse?: any) => {
        //# TODO change Department to serviceline and officelocation to City
        await this.props.graphClient.api('/me/department')  //get current user's Service Line
          .get((serviceLineerror: any, serviceLine: any, rawServiceLineResponse?: any) => {
            this.getEventData(city.value, serviceLine.value);
          });
      });
  }
  //get EventData from Event List
  public getEventData(location, serviceLine){
    var yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    var method = 'get items for Event';
    let newCommonObj: common = new common();
    var query, dataFiltered;

    if (this.props.serviceline == strings.allServiceLine && this.props.location == strings.allLocation)
      query = "?$select=ID,Title,EventDate,LocationAD,ADDepartment,ServiceArea,EventOwner/FirstName,EventOwner/LastName,EventOwner/EMail,TaxCatchAll/Term&$expand=TaxCatchAll/Term&$expand=EventOwner/Id&$Filter=EventDate ge datetime'" + yesterday.toISOString() + "'and ApprovalStatus eq 'Approved'&$orderby=PublishDate desc&$top=2";
    else if (this.props.serviceline == strings.allServiceLine && this.props.location != strings.allLocation)
      query = "?$select=ID,Title,EventDate,LocationAD,ADDepartment,ServiceArea,EventOwner/FirstName,EventOwner/LastName,EventOwner/EMail,TaxCatchAll/Term&$expand=TaxCatchAll/Term&$expand=EventOwner/Id&$Filter=(TaxCatchAll/Term eq '" + this.props.location + "') and EventDate ge datetime'" + this.props.eventStartDate.value + "'and ApprovalStatus eq 'Approved'&$orderby=PublishDate desc &$top=2";
    else if (this.props.serviceline != strings.allServiceLine && this.props.location == strings.allLocation)
      query = "?$select=ID,Title,EventDate,LocationAD,ADDepartment,ServiceArea,EventOwner/FirstName,EventOwner/LastName,EventOwner/EMail,TaxCatchAll/Term&$expand=TaxCatchAll/Term&$expand=EventOwner/Id&$Filter=(TaxCatchAll/Term eq '" + this.props.serviceline + "') and EventDate ge datetime'" + this.props.eventStartDate.value + "'and ApprovalStatus eq 'Approved'&$orderby=PublishDate desc &$top=2";
    else if (this.props.serviceline != strings.allServiceLine && this.props.location != strings.allLocation)
      query = "?$select=ID,Title,EventDate,LocationAD,ADDepartment,ServiceArea,EventOwner/FirstName,EventOwner/LastName,EventOwner/EMail,TaxCatchAll/Term&$expand=TaxCatchAll/Term&$expand=EventOwner/Id$filter=TaxCatchAll/Term eq '" + this.props.serviceline + "' and TaxCatchAll/Term eq '" + this.props.location + "' and EventDate ge datetime'" + this.props.eventStartDate.value + "'and ApprovalStatus eq 'Approved'&$orderby=PublishDate desc&$top=2";

    newCommonObj.getDataFromListUsingGuid(this.props.siteUrl, this.props.listName, query, method).then(async (res) => {
      if (res.data.value.length > 0) {
        //if service line is all then ordring First Your serviceline display after that other
        if (this.props.serviceline == strings.allServiceLine || this.props.location == strings.allLocation) {
          if (this.props.serviceline == strings.allServiceLine && this.props.location == strings.allLocation) //If in Property Pane selected is All Location and All Serviceline
          {
            dataFiltered = res.data.value.filter(
              data => data.ServiceArea[0].Label == serviceLine && data.LocationAD[0].Label == location
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
              data => data.LocationAD[0].Label == location
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
                  "EventDate": myservice.EventDate,
                  "ADDepartment": myservice.ADDepartment,
                  "LocationAD": myservice.LocationAD,
                  "ID": myservice.ID,
                  "EventOwner": {
                    FirstName: myservice.FirstName,
                    LastName: myservice.LastName
                  },
                  "EndDate": myservice.EndDate

                });
              });
              res.data.value.forEach(otherservice => {
                orderservice.push({
                  "Title": otherservice.Title,
                  "EventDate": otherservice.EventDate,
                  "ADDepartment": otherservice.ADDepartment,
                  "LocationAD": otherservice.LocationAD,
                  "ID": otherservice.ID,
                  "EventOwner": {
                    FirstName: otherservice.FirstName,
                    LastName: otherservice.LastName
                  },
                  "EndDate": otherservice.EndDate
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
          isLoading: false, items: [
            {
              EventOwner: {

                FirstName: '',
                LastName: '',
              },
              LocationAD: [{ Label: '' }],
              ADDepartment: [{ Label: '' }],
              Title: 'No Events',
              ID:0,
              EventDate: null,
              EndDate: null
            }
          ]
        });
      }

    }).catch(error => {
      console.log(error);
    });
  }

  public render(): React.ReactElement<IEventsProps> {
    const cardTokens: ICardTokens = { childrenMargin: 5, childrenGap: 5 };
    const sectionStackTokens: IStackTokens = { childrenGap: 20 };
    const siteTextStyles: ITextStyles = {
      root: {
        fontWeight: FontWeights.semibold,
        fontFamily: 'proxima-nova, arial',
        fontSize: FontSizes.size14,
        color: '#333'
      },
    };
    const labelFontStyle: ITextStyles = {
      root: {
        fontFamily: 'proxima-nova, arial',
        fontSize: FontSizes.size12,
        fontWeight: FontWeights.semibold,
        color: '#333'
      },
    };
    const defaultFontStyle: ITextStyles = {
      root: {
        fontSize: FontSizes.size12,
        color: '#666'
      },
    };
    const spanFontStyle: ITextStyles = {
      root: {
        fontSize: FontSizes.size12,
        color: '#666',
        fontFamily: 'proxima-nova, arial'
      },
    };
    return (
      <div className={styles.events}>
        <div className={styles.container}>
          <h2>EVENTS</h2>

          {
            (this.state.isLoading) ? <Loader message="Please wait..." /> :
              (this.state.items[0].Title == 'No Events')
                ?
                <div className="ms-Grid">
                  <div className="ms-Grid">
                    <div className="ms-Grid-col ms-sm9 ms-md9">
                      <h3>No Events</h3>
                    </div>
                  </div>
                </div>
                :
                <div>
                  {this.state.items.map((item, key) => {
                    return (
                      <div>

                        {/* style={{ boxShadow: Depths.depth4 }}*/}
                        <div className="ms-Grid-row">
                          <div className="ms-Grid-col ms-md3">
                            <div className={styles.cardfont}>
                              <Label style={{ textAlign: 'center' }}>{(new Date(item.EventDate).toDateString().substring(4, 7))}</Label>
                              <Label style={{ textAlign: 'center' }}>{(new Date(item.EventDate).toDateString().substring(8, 10))}</Label>
                            </div>
                          </div>
                          <div className="ms-Grid-col ms-md9">
                            <Label styles={siteTextStyles}><Link
                              href={`${this.props.siteUrl}/SitePages/Display.aspx?ListName=${this.props.listName}&ItemID=${item.ID}`}
                              data-interception="off" target="_blank" rel="noopener noreferrer" styles={siteTextStyles}
                            >{item.Title}</Link></Label>
                            <Stack padding={0} gap={0}>
                              <StackItem>
                                <Label styles={labelFontStyle}>{item.EventOwner.FirstName} {item.EventOwner.LastName}<span style={{ fontSize: '11px', fontFamily: 'proxima-nova, arial', fontWeight: 100,color:'#666' }}> {item.ADDepartment[0].Label}</span></Label>
                              </StackItem><StackItem>
                                <Label styles={defaultFontStyle}>{item.LocationAD[0].Label} </Label>
                              </StackItem><StackItem>
                                <Label styles={defaultFontStyle}>{(new Date(item.EventDate).toDateString().substring(0, 4))} , <Moment format="hh:mm A">{item.EventDate}</Moment></Label>
                              </StackItem>
                            </Stack>
                            <div className={styles.linecolor} />
                          </div>
                        </div>

                        {/*                        <Stack tokens={sectionStackTokens}>
                          <Card aria-label="Clickable horizontal card " horizontal tokens={cardTokens}>
                            <Card.Item className={styles.cardfont}>
                              <Text variant="large" styles={siteTextStyles}> {(new Date(item.EventDate).toDateString().substring(4, 7))} </Text>
                              <Text variant="large" styles={siteTextStyles}> {(new Date(item.EventDate).toDateString().substring(8, 10))} </Text>
                            </Card.Item>
                            <Card.Section>
                              <Text variant="large" styles={siteTextStyles}> {item.Title} </Text>
                              <Text variant="small" styles={defaultFontStyle}>{item.EventOwner.FirstName} {item.EventOwner.LastName}</Text>
                              <Text variant="small" styles={defaultFontStyle}>{item.LocationAD[0].Label}</Text>
                             
                            </Card.Section>
                            <hr />
                          </Card> </Stack>
                          */}

                      </div>
                    );
                  })}
                </div>

          }

        </div>
      </div>
    );
  }
}



