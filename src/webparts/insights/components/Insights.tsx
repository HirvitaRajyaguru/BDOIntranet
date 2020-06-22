import * as React from 'react';
import styles from './Insights.module.scss';
import { IInsightsProps } from './IInsightsProps';
import { IInsightsState } from './IInsightsState';
import { escape } from '@microsoft/sp-lodash-subset';
import * as strings from 'InsightsWebPartStrings';
import Moment from 'react-moment';
import 'moment-timezone';
import InsightsID from './InsightsID';
import { UrlQueryParameterCollection } from '@microsoft/sp-core-library';
import common from '../../common/common';
import { Loader } from '../../common/Loading';
import { Link } from 'office-ui-fabric-react/lib/components/Link';
import { IStyle, Overlay, ITextStyles } from 'office-ui-fabric-react';
import { Card, CardTitle, CardText, CardImg, CardImgOverlay, CardDeck } from 'reactstrap';
import { NeutralColors } from '@uifabric/fluent-theme/lib/fluent/FluentColors';
import { FontSizes } from '@uifabric/fluent-theme/lib/fluent/FluentType';
import { FontWeights } from '@uifabric/styling';
import { Label } from 'office-ui-fabric-react/lib/Label';

interface IOverlay {
  root: IStyle;
}
const siteTextStyles: ITextStyles = {
  root: {
    fontSize: FontSizes.size16,
    fontWeight: FontWeights.semibold,
    color: NeutralColors.white,
    textDecoration: 'none',
    textTransform: 'uppercase',
    fontFamily: 'proxima-nova, arial'

  },
};
const overlayStyles: IOverlay = {
  root: [
    // 'OverlayExample-content',
    {
      bottom: '0',
      color: 'white',
      left: '0',
      //   padding: '30% 0 10% 5%',
      marginBottom: '5px',
      position: 'absolute',
      right: '0',
      backgroundColor: 'rgba(0,0,0, 0.6)',
      fontFamily: 'proxima-nova, arial'
    },
  ],
};
const BigImageoverlayStyles: IOverlay = {
  root: [
    // 'OverlayExample-content',
    {
      bottom: '0',
      color: 'white',
      left: '0',
      //  padding: '60% 0 10% 5%',
      marginBottom: '5px',
      position: 'absolute',
      right: '0',
      backgroundColor: 'rgba(0,0,0, 0.6)',
      fontFamily: 'proxima-nova, arial'
    },
  ],
};
export default class Insights extends React.Component<IInsightsProps, IInsightsState> {
  public constructor(props: IInsightsProps, state: IInsightsState) {
    super(props);
    //Initialize the State
    this.state = {
      isLoading: true,

      //State items that containe insight's information
      items: [
        {
          "AlertDate": null,
          "Title": "No Insights Found.",
          "Description": "",
          "ID": 0,
          "Type": 'Insights',
          "List": "",
          "SearchString": "",
          "AttachmentFiles": [{
            ServerRelativeUrl: ''
          }],

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
          .get((serviceLineerror: any, serviceLine: any, serviceLinerawResponse?: any) => {
            this.GetItemsFromInsights(city.value, serviceLine.value);
          });
      });
  }
  //get Items of Insights and Banner both
  public async GetItemsFromInsights(location, department) {
    let newCommonObj: common = new common();
    var query, querynews, queryglobal, querythought, queryTiffin;
    if (this.props.serviceline == strings.allServiceLine && this.props.location == strings.allLocation) //admin select all serviceline and all location
    {
      query = "?$select=*,AttachmentFiles/ServerRelativeUrl&$expand=AttachmentFiles&$filter=ApprovalStatus eq 'Approved' and AlertName ne 'The Indian Tiffin'&$orderby=PublishDate desc&$top=1";
      queryTiffin = "?$select=*,AttachmentFiles/ServerRelativeUrl&$expand=AttachmentFiles&$filter=ApprovalStatus eq 'Approved'and AlertName eq 'The Indian Tiffin'&$orderby=PublishDate desc&$top=1";
      querynews = "?$select=*,AttachmentFiles/ServerRelativeUrl&$expand=AttachmentFiles&$filter=ApprovalStatus eq 'Approved'&$orderby=PublishDate desc&$top=1";
      queryglobal = "?$select=*,AttachmentFiles/ServerRelativeUrl&$expand=AttachmentFiles&$filter=ApprovalStatus eq 'Approved'&$orderby=PublishDate desc&$top=1";
      querythought = "?$select=*,AttachmentFiles/ServerRelativeUrl&$expand=AttachmentFiles&$filter=ApprovalStatus eq 'Approved'&$orderby=PublishDate desc&$top=1";
    }
    else if (this.props.serviceline == strings.allServiceLine && this.props.location != strings.allLocation) //admin select all serviceline and perticular location
    {
      query = "?$select=*,AttachmentFiles/ServerRelativeUrl&$expand=AttachmentFiles&$filter=TaxCatchAll/Term eq '" + this.props.location + "'and ApprovalStatus eq 'Approved' and AlertName ne 'The Indian Tiffin'&$orderby=PublishDate desc&$top=1";
      queryTiffin = "?$select=*,AttachmentFiles/ServerRelativeUrl&$expand=AttachmentFiles&$filter=TaxCatchAll/Term eq '" + this.props.location + "'and ApprovalStatus eq 'Approved' and AlertName eq 'The Indian Tiffin'&$orderby=PublishDate desc&$top=1";
      querynews = "?$select=*,AttachmentFiles/ServerRelativeUrl&$expand=AttachmentFiles&$filter=TaxCatchAll/Term eq '" + this.props.location + "'and ApprovalStatus eq 'Approved'&$orderby=PublishDate desc&$top=1";
      queryglobal = "?$select=*,AttachmentFiles/ServerRelativeUrl&$expand=AttachmentFiles&$filter=TaxCatchAll/Term eq '" + this.props.location + "' and ApprovalStatus eq 'Approved'&$orderby=PublishDate desc&$top=1";
      querythought = "?$select=*,AttachmentFiles/ServerRelativeUrl&$expand=AttachmentFiles&$filter=TaxCatchAll/Term eq '" + this.props.location + "' and ApprovalStatus eq 'Approved'&$orderby=PublishDate desc&$top=1";
    }
    else if (this.props.serviceline != strings.allServiceLine && this.props.location == strings.allLocation)//admin select perticular serviceline and all location
    {
      query = "?$select=*,AttachmentFiles/ServerRelativeUrl&$expand=AttachmentFiles&$filter=TaxCatchAll/Term eq '" + this.props.serviceline + "'and ApprovalStatus eq 'Approved' and AlertName ne 'The Indian Tiffin'&$orderby=PublishDate desc&$top=1";
      queryTiffin = "?$select=*,AttachmentFiles/ServerRelativeUrl&$expand=AttachmentFiles&$filter=TaxCatchAll/Term eq '" + this.props.serviceline + "'and ApprovalStatus eq 'Approved' and AlertName eq 'The Indian Tiffin'&$orderby=PublishDate desc&$top=1";
      querynews = "?$select=*,AttachmentFiles/ServerRelativeUrl&$expand=AttachmentFiles&$filter=TaxCatchAll/Term eq '" + this.props.serviceline + "'and ApprovalStatus eq 'Approved'&$orderby=PublishDate desc&$top=1";
      queryglobal = "?$select=*,AttachmentFiles/ServerRelativeUrl&$expand=AttachmentFiles&$filter=TaxCatchAll/Term eq '" + this.props.serviceline + "' and ApprovalStatus eq 'Approved'&$orderby=PublishDate desc&$top=1";
      querythought = "?$select=*,AttachmentFiles/ServerRelativeUrl&$expand=AttachmentFiles&$filter=TaxCatchAll/Term eq '" + this.props.serviceline + "' and ApprovalStatus eq 'Approved'&$orderby=PublishDate desc&$top=1";
    }
    else if (this.props.serviceline != strings.allServiceLine && this.props.location != strings.allLocation)//admin select perticular serviceline and perticular location
    {
      query = "?$select=*,AttachmentFiles/ServerRelativeUrl&$expand=AttachmentFiles&$filter=TaxCatchAll/Term eq '" + this.props.serviceline + "' and TaxCatchAll/Term eq '" + this.props.location + "'and ApprovalStatus eq 'Approved' and AlertName ne 'The Indian Tiffin'&$orderby=PublishDate desc&$top=1";
      queryTiffin = "?$select=*,AttachmentFiles/ServerRelativeUrl&$expand=AttachmentFiles&$filter=TaxCatchAll/Term eq '" + this.props.serviceline + "' and TaxCatchAll/Term eq '" + this.props.location + "'and ApprovalStatus eq 'Approved and AlertName eq 'The Indian Tiffin'&$orderby=PublishDate desc&$top=1";
      querynews = "?$select=*,AttachmentFiles/ServerRelativeUrl&$expand=AttachmentFiles&$filter=TaxCatchAll/Term eq '" + this.props.serviceline + "' and TaxCatchAll/Term eq '" + this.props.location + "'and ApprovalStatus eq 'Approved'&$orderby=PublishDate desc&$top=1";
      queryglobal = "?$select=*,AttachmentFiles/ServerRelativeUrl&$expand=AttachmentFiles&$filter=TaxCatchAll/Term eq '" + this.props.serviceline + "' and TaxCatchAll/Term eq '" + this.props.location + "' and ApprovalStatus eq 'Approved'&$orderby=PublishDate desc&$top=1";
      querythought = "?$select=*,AttachmentFiles/ServerRelativeUrl&$expand=AttachmentFiles&$filter=TaxCatchAll/Term eq '" + this.props.serviceline + "' and TaxCatchAll/Term eq '" + this.props.location + "' and ApprovalStatus eq 'Approved'&$orderby=PublishDate desc&$top=1";
    }
    //Fetch the data from the list which select from Property pane
    newCommonObj.getDataFromListUsingGuid(this.props.siteurl, this.props.listId, query, 'get items for Insights').then(async (res) => {
      newCommonObj.getDataFromListUsingGuid(this.props.siteurl, this.props.listId, queryTiffin, 'get items for Insights').then(async (tiffin) => {
        newCommonObj.getDataFromListUsingGuid(this.props.siteurl, this.props.newslistId, querynews, 'get items for NewsLetter').then(async (news) => {
          newCommonObj.getDataFromListUsingGuid(this.props.siteurl, this.props.globalthoughtleadershiplistId, queryglobal, 'get items for Global thought leadership').then(async (globalthought) => {
            newCommonObj.getDataFromListUsingGuid(this.props.siteurl, this.props.thoughtleadershiplistId, querythought, 'get items for Thought leadership').then(async (localthought) => {
              if (res.data.value.length > 0 || news.data.value.length > 0 || localthought.data.value > 0) {
                let allrecords = []; var insightsAndNews;
                localthought.data.value.forEach(localthought => {
                  var AttachmentImage = localthought.AttachmentFiles.filter(data => data.ServerRelativeUrl.endsWith('.jpg') || data.ServerRelativeUrl.endsWith('.png'));
                  allrecords.push({
                    "Title": localthought.Title,
                    "Description": localthought.Description,
                    "ID": localthought.ID,
                    "ServiceArea": localthought.ServiceArea,
                    "AlertDate": localthought.PublishDate,
                    "Type": strings.TypeThought,
                    "SearchString": strings.SearchThought,
                    "List": this.props.thoughtleadershiplistId,
                    "AttachmentFiles": [{ ServerRelativeUrl: AttachmentImage[0].ServerRelativeUrl }]
                  })
                });
                res.data.value.forEach(insights => { //add insights in allrecords
                  var AttachmentImage = insights.AttachmentFiles.filter(data => data.ServerRelativeUrl.endsWith('.jpg') || data.ServerRelativeUrl.endsWith('.png'));
                  allrecords.push({
                    "Title": insights.Title,
                    "Description": insights.Description,
                    "AlertDate": insights.PublishDate,
                    "ID": insights.ID,
                    "ServiceArea": insights.ServiceArea,
                    "Type": strings.TypeInsights,
                    "List": this.props.listId,
                    "SearchString": strings.SearchInsights,
                    "AttachmentFiles": [{ ServerRelativeUrl: AttachmentImage[0].ServerRelativeUrl }]
                  });
                });
                tiffin.data.value.forEach(tiffin => {
                  var AttachmentImage = tiffin.AttachmentFiles.filter(data => data.ServerRelativeUrl.endsWith('.jpg') || data.ServerRelativeUrl.endsWith('.png'));
                  allrecords.push({
                    "Title": tiffin.Title,
                    "Description": tiffin.Description,
                    "ID": tiffin.ID,
                    "ServiceArea": tiffin.ServiceArea,
                    "AlertDate": tiffin.PublishDate,
                    "Type": strings.TypeTiffin,
                    "SearchString": strings.SearchTiffin,
                    "List": this.props.listId,
                    "AttachmentFiles": [{ ServerRelativeUrl: AttachmentImage[0].ServerRelativeUrl }]
                  })
                });
                news.data.value.forEach(news => { //add newletter in allrecords
                  var AttachmentImage = news.AttachmentFiles.filter(data => data.ServerRelativeUrl.endsWith('.jpg') || data.ServerRelativeUrl.endsWith('.png'));
                  allrecords.push({
                    "Title": news.Title,
                    "Description": news.Description,
                    "AlertDate": news.PublishDate,
                    "ID": news.ID,
                    "ServiceArea": news.ServiceArea,
                    "Type": strings.TypeNewsletter,
                    "List": this.props.newslistId,
                    "SearchString": strings.SearchNewsletter,
                    "AttachmentFiles": [{ ServerRelativeUrl: AttachmentImage[0].ServerRelativeUrl }]
                  });
                });  
                globalthought.data.value.forEach(globalthought => {
                  var AttachmentImage = globalthought.AttachmentFiles.filter(data => data.ServerRelativeUrl.endsWith('.jpg') || data.ServerRelativeUrl.endsWith('.png'));
                  allrecords.push({
                    "Title": globalthought.Title,
                    "Description": globalthought.Description,
                    "ID": globalthought.ID,
                    "ServiceArea": globalthought.ServiceArea,
                    "AlertDate": globalthought.PublishDate,
                    "Type": strings.TypeGlobalThought,
                    "List": this.props.globalthoughtleadershiplistId,
                    "SearchString": strings.SearchGlobalThought,
                    "AttachmentFiles": [{ ServerRelativeUrl: AttachmentImage[0].ServerRelativeUrl }]
                  })
                });
                insightsAndNews = allrecords.slice(0, 5);  //First 5 record (display only 5)
                //if service line is all then ordring First Your serviceline display after that other

                this.setState({ items: insightsAndNews, isLoading: false });
                // this.setState({ items: insightsAndNews, isLoading: false });
              }
              else {
                this.setState({
                  isLoading: false, items: [
                    {
                      "AlertDate": new Date(),
                      "Title": `No Insights Found.`,
                      "Description": "",
                      "ID": 0,
                      "Type": "",
                      "List": "",
                      "SearchString": "",
                      "AttachmentFiles": [{
                        ServerRelativeUrl: ''
                      }],
                    }

                  ]
                })
              }
            })
          })
        })
      })
    }).catch(error => {
      console.log(error);
    });
  }

  public render(): React.ReactElement<IInsightsProps> {
    var queryParameters = new UrlQueryParameterCollection(window.location.href);
    if (parseInt(queryParameters.getValue("LID")) > 0) {
      return (<InsightsID graphClient={this.props.graphClient}
        siteurl={this.props.siteurl}
        listId={this.props.listId}
        newslistId={this.props.newslistId}
        thoughtleadershiplistId={this.props.thoughtleadershiplistId}
        globalthoughtleadershiplistId={this.props.globalthoughtleadershiplistId}
        serviceline={this.props.serviceline}
        location={this.props.location} />);
    } else {
      return (
        <div className={styles.insights}>
          <div className={styles.container}>
            {
              (this.state.isLoading) ? <Loader message="Please wait..." /> :
                (this.state.items[0].Title === "No Insights Found.")
                  ? <Label>{this.state.items[0].Title}</Label>
                  :
                  <div className="ms-Grid" >
                    <div className="ms-Grid-row">
                      <div className={`ms-Grid-col ms-sm12 ms-md6 ${styles.paddingCol}`}>
                        {this.state.items.slice(0, 1).map((item, index) => {
                          return (
                            <Card className={styles.cardWrapper}>
                              <Link href={`${this.props.siteurl}/SitePages/Search.aspx?q=${item.SearchString}`} target="_blank" data-interception="off">
                                <CardImg top width="100%" height="404px" src={item.AttachmentFiles[0].ServerRelativeUrl} alt="Card image cap" />
                                <Overlay styles={BigImageoverlayStyles}>
                                  <div className={styles.overlayposition}>
                                    <Link href={`${this.props.siteurl}/SitePages/Display.aspx?ListName=${item.List}&ItemID=${item.ID}`} styles={siteTextStyles} target='_blank' >{item.Title}</Link>
                                    <p>{<Moment format="DD MMM YYYY">{item.AlertDate}</Moment>}</p>
                                    <p>
                                      <small className="text-muted">{item.Type}</small>
                                    </p>
                                  </div>
                                </Overlay></Link>
                            </Card>
                          );
                        })}
                      </div>
                      <div className={`ms-Grid-col ms-sm12 ms-md3 ${styles.paddingCol}`}>
                        <CardDeck>
                          {this.state.items.slice(1, 3).map((item, index) => {
                            return (
                              <Card className={styles.cardWrapper}>
                                <Link href={`${this.props.siteurl}/SitePages/Search.aspx?q=${item.SearchString}`} target="_blank" data-interception="off">
                                  <CardImg top width="100%" height="200px" src={item.AttachmentFiles[0].ServerRelativeUrl} alt="Card image cap" />
                                  <Overlay styles={overlayStyles}>
                                    <div className={styles.overlayposition}>
                                      <Link href={`${this.props.siteurl}/SitePages/Display.aspx?ListName=${item.List}&ItemID=${item.ID}`} styles={siteTextStyles} target='_blank' >{item.Title}</Link>
                                      <p>{<Moment format="DD MMM YYYY">{item.AlertDate}</Moment>}</p>
                                      <p>
                                        <small className="text-muted">{item.Type}</small>
                                      </p>
                                    </div>
                                  </Overlay>
                                </Link> </Card>
                            );
                          })}
                        </CardDeck>
                      </div>
                      <div className={`ms-Grid-col ms-sm12 ms-md3 ${styles.paddingCol}`}>
                        <CardDeck>
                          {this.state.items.slice(3, 5).map((item, index) => {
                            return (
                              <Card className={styles.cardWrapper}>
                                <Link href={`${this.props.siteurl}/SitePages/Search.aspx?q=${item.SearchString}`} target="_blank" data-interception="off">
                                  <CardImg top width="100%" height="200px" src={item.AttachmentFiles[0].ServerRelativeUrl} alt="Card image cap" />
                                  <Overlay styles={overlayStyles}>
                                    <div className={styles.overlayposition}>
                                      <Link href={`${this.props.siteurl}/SitePages/Display.aspx?ListName=${item.List}&ItemID=${item.ID}`} styles={siteTextStyles} target='_blank' >{item.Title}</Link>
                                      <p>{<Moment format="DD MMM YYYY">{item.AlertDate}</Moment>}</p>
                                      <CardText>
                                        <small className="text-muted">{item.Type}</small>
                                      </CardText>
                                    </div>
                                  </Overlay>
                                </Link>
                              </Card>
                            );
                          })}
                        </CardDeck>
                      </div>
                    </div>
                  </div>
            }{/*TODO add url */}
          </div>
        </div>
      );

    }
  }
}
