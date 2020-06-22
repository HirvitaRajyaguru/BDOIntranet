import * as React from 'react';
import styles from './Spotlight.module.scss';
import { ISpotlightProps } from './ISpotlightProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { ISpotlightState } from './ISpotlightState';
import SpotlightID from './SpotlightID';
import common from '../../common/common';
import { Loader } from '../../common/Loading';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { Link } from 'office-ui-fabric-react/lib/components/Link';
import { UrlQueryParameterCollection } from '@microsoft/sp-core-library';
import * as strings from 'SpotlightWebPartStrings';
import Moment from 'react-moment';
import { Card, ICardTokens} from '@uifabric/react-cards';
import { FontWeights } from '@uifabric/styling';
import { NeutralColors } from '@uifabric/fluent-theme/lib/fluent/FluentColors';
import {Image, Stack, IStackTokens, Text, ITextStyles } from 'office-ui-fabric-react';
export default class Spotlight extends React.Component<ISpotlightProps, ISpotlightState> {

  constructor(props: ISpotlightProps, state: ISpotlightState) {
    super(props);
    //Initialize the State
    this.state = {
      isLoading: true,
      items: [
        {
          EmployeeName: {
            EMail: '',
            FirstName: '',
            LastName: '',
            JobTitle: ''
          },
          MediaHouse: 'No SpotLights to Display',
          ID: 0,
          Description: "",
          PublishDate: null
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
      .get((error: any, city: any, rawResponse?: any) => {
        //# TODO change Department to serviceline and officelocation to City
        this.props.graphClient.api('/me/department')  //get current user's department
          .get((ServiceLineerror: any, sericeLine: any, ServiceLinerawResponse?: any) => {
            this.getSpotlightRecords(city.value, sericeLine.value);
          });
      });
  }
  //get StarPerformer's Records
  private getSpotlightRecords(location, serviceLine): void {
    var method = 'get items for Spotlight';
    let newCommonObj: common = new common();
    var query;
    if (this.props.serviceline == strings.allServiceLine && this.props.location == strings.allLocation) //admin select all serviceline and all location
      query = "?$select=MediaHouse,ID,Description,PublishDate,EmployeeName/JobTitle,EmployeeName/EMail,EmployeeName/FirstName,EmployeeName/LastName,EmployeeName/EMail,ServiceArea,Location&$expand=EmployeeName/Id&$filter=ApprovalStatus eq 'Approved'&$orderby=PublishDate desc&$top=5";
    else if (this.props.serviceline == strings.allServiceLine && this.props.location != strings.allLocation) //admin select all serviceline and perticular location
      query = "?$select=MediaHouse,ID,Description,PublishDate,EmployeeName/JobTitle,EmployeeName/EMail,EmployeeName/FirstName,EmployeeName/LastName,EmployeeName/EMail,ServiceArea,Location&$expand=EmployeeName/Id&$orderby=PublishDate desc&$Filter=(TaxCatchAll/Term eq '" + this.props.location + "')and ApprovalStatus eq 'Approved'&$top=5";
    else if (this.props.serviceline != strings.allServiceLine && this.props.location == strings.allLocation)//admin select perticular serviceline and all location
      query = "?$select=MediaHouse,ID,Description,PublishDate,EmployeeName/JobTitle,EmployeeName/EMail,EmployeeName/FirstName,EmployeeName/LastName,EmployeeName/EMail,ServiceArea,Location&$expand=EmployeeName/Id&$orderby=PublishDate desc&$Filter=(TaxCatchAll/Term eq '" + this.props.serviceline + "')and ApprovalStatus eq 'Approved'&$top=5";
    else if (this.props.serviceline != strings.allServiceLine && this.props.location != strings.allLocation)//admin select perticular serviceline and perticular location
      query = "?$select=MediaHouse,ID,Description,PublishDate,EmployeeName/JobTitle,EmployeeName/EMail,EmployeeName/FirstName,EmployeeName/LastName,EmployeeName/EMail,ServiceArea,Location&$expand=EmployeeName/Id&$orderby=PublishDate desc&$Filter=$filter=TaxCatchAll/Term eq '" + this.props.serviceline + "' and TaxCatchAll/Term eq '" + this.props.location + "'and ApprovalStatus eq 'Approved'&$top=5";
    var dataFiltered;
    newCommonObj.getDataFromListUsingGuid(this.props.siteUrl, this.props.listId, query, method).then(async (res) => {
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
                  "EmployeeName": {
                    "EMail": myservice.EmployeeName.EMail,
                    "FirstName": myservice.EmployeeName.FirstName,
                    "LastName": myservice.EmployeeName.LastName,
                    "JobTitle": myservice.EmployeeName.JobTitle
                  },
                  "MediaHouse": myservice.MediaHouse,
                  "ID": myservice.ID,
                  "Description": myservice.Description,
                  "PublishDate": myservice.PublishDate
                });
              });
              res.data.value.forEach(otherservice => {
                orderservice.push({
                  "EmployeeName": {
                    "EMail": otherservice.EmployeeName.EMail,
                    "FirstName": otherservice.EmployeeName.FirstName,
                    "LastName": otherservice.EmployeeName.LastName,
                    "JobTitle": otherservice.EmployeeName.JobTitle
                  },
                  "MediaHouse": otherservice.MediaHouse,
                  "ID": otherservice.ID,
                  "Description": otherservice.Description,
                  "PublishDate": otherservice.PublishDate
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
              EmployeeName: {
                EMail: '',
                FirstName: '',
                LastName: '',
                JobTitle: ''
              },
              MediaHouse: 'No SpotLights to Display',
              ID: 0,
              Description: "",
              PublishDate: null
            }
          ]
        });
      }

    }).catch(error => {
      console.log(error);
    });
  }

  public render(): React.ReactElement<ISpotlightProps> {
    const cardTokens: ICardTokens = { childrenMargin: 5, childrenGap: 5, boxShadow: 'none'};
    const sectionStackTokens: IStackTokens = { childrenGap: 20 };
    const siteTextStyles: ITextStyles = {
      root: {
        fontWeight: FontWeights.semibold,
        fontFamily: 'proxima-nova, arial',
        color: NeutralColors.black
      },
    };
    const defaultFontStyle: ITextStyles = {
      root: {
        fontFamily: 'proxima-nova, arial',
        color: "#838383"
      },
    };
    const readmore: ITextStyles = {
      root: {
        color: "#838383",
        fontFamily: 'proxima-nova, arial'
      },
    };
    var queryParameters = new UrlQueryParameterCollection(window.location.href);
    if (parseInt(queryParameters.getValue("SpotlightID")) > 0) {
      return (<SpotlightID graphClient={this.props.graphClient}
        siteUrl={this.props.siteUrl}
        listId={this.props.listId}
        serviceline={this.props.serviceline}
        numberOfSeconds={this.props.numberOfSeconds}
        location={this.props.location}
      />);
    } else {
      //property of Slider
      var settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: Number(this.props.numberOfSeconds + '000'),
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />
      };
      return (
        <div className={styles.spotlight}>
          <div className={styles.container}>
            <h2>SPOTLIGHTS</h2>
            {
              (this.state.isLoading) ? <Loader message="Please wait..." /> :
                <div>
                  {
                    // If data is null then will show message of "No SpotLights to Display"
                    (this.state.items[0].MediaHouse === "No SpotLights to Display")
                      ?
                      <div className={`ms-Grid ${styles.padnone}`} dir="ltr">
                        <Stack tokens={sectionStackTokens}>
                          <Card aria-label="Clickable horizontal card " horizontal tokens={cardTokens}>
                            <Card.Item >{/*fill*/}
                              <Image src={`${this.props.siteUrl}/_layouts/15/userphoto.aspx?size=L`} alt="Placeholder image." style={{ width: '64px' }} />
                            </Card.Item>
                            <Card.Section>
                              <Text variant="large" styles={siteTextStyles}> {this.state.items[0].MediaHouse}</Text>
                            </Card.Section>
                          </Card>
                        </Stack>
                      </div>
                      :
                      <div className={`ms-Grid ${styles.padnone}`} dir="ltr">
                        <Slider {...settings}>
                          {this.state.items.map((item, key) => {
                            return (
                              <Stack tokens={sectionStackTokens}>
                                <Card aria-label="Clickable horizontal card " horizontal tokens={cardTokens}>
                                  <Card.Item >{/*fill*/}
                                    <Image src={`${this.props.siteUrl}/_layouts/15/userphoto.aspx?size=L&accountname=${item.EmployeeName.EMail}`} alt="Placeholder image." style={{ width: '64px' }} />
                                  </Card.Item>
                                  <Card.Section>
                                    <Text variant="large" styles={siteTextStyles}> {item.EmployeeName.FirstName} {item.EmployeeName.LastName} </Text>
                                    <Text variant="small" styles={defaultFontStyle}>{item.EmployeeName.JobTitle}</Text>
                                    <div dangerouslySetInnerHTML={{ __html: item.Description }} className={styles.descriptionaStyle} ></div>
                                    <Text variant="small" styles={defaultFontStyle}>{(item.MediaHouse).substring(0, 150)}</Text>
                                    <Text variant="small" styles={defaultFontStyle}>{<Moment format="DD MMM YYYY">{item.PublishDate}</Moment>}</Text>
                                    <Text variant="small" styles={defaultFontStyle}><Link href={`${this.props.siteUrl}/SitePages/Display.aspx?ListName=${this.props.listId}&ItemID=${item.ID}`} styles={readmore} target="_blank" data-interception="off">Read More</Link></Text></Card.Section>
                                </Card> </Stack>);
                          })}
                        </Slider>
                      </div>
                  }
                  <div className="ms-Grid-row">
                    <div className="ms-Grid-col ms-sm12 ms-md12">
                      <Link href={`${this.props.siteUrl}/SitePages/Search.aspx?q=${strings.searchString}`} target="_blank" data-interception="off" className={styles.viewAll}>
                        View All
                      </Link>
                    </div>
                  </div>
                </div>}
          </div>
        </div>
      );
    }
  }
}

function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", background: "black", right: "0", top: "-40px", zIndex: "1" }}
      onClick={onClick}
    />
  );
}

function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style, display: "block", background: "black", left: "89%", top: "-40px", position: "absolute", zIndex: "1"
      }}
      onClick={onClick}
    />
  );
}
