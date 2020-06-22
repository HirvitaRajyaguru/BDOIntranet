import * as React from 'react';
import styles from './EmployeeStories.module.scss';
import { IEmployeeStoriesProps } from './IEmployeeStoriesProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { IEmployeeStoriesState } from './IEmployeeStoriesState';
import common from '../../common/common';
import { Link } from 'office-ui-fabric-react/lib/components/Link';
import { UrlQueryParameterCollection } from '@microsoft/sp-core-library';
import EmployeeStoriesDisplay from './EmployeeStoriesDisplay';
import { Loader } from '../../common/Loading';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { FontSizes } from '@uifabric/fluent-theme/lib/fluent/FluentType';
import { SharedColors } from '@uifabric/fluent-theme/lib/fluent/FluentColors';
import * as strings from 'EmployeeStoriesWebPartStrings';
import { Card, ICardTokens, ICardSectionStyles, ICardSectionTokens, CardSection } from '@uifabric/react-cards';
import { FontWeights } from '@uifabric/styling';
import { Icon, IIconStyles, Image, Stack, IStackTokens, Text, ITextStyles } from 'office-ui-fabric-react';
import { NeutralColors } from '@uifabric/fluent-theme/lib/fluent/FluentColors';

export default class EmployeeStories extends React.Component<IEmployeeStoriesProps, IEmployeeStoriesState> {
  constructor(props: IEmployeeStoriesProps, state: IEmployeeStoriesState) {
    super(props);
    //Initialize the State
    this.state = {
      image: [{
        ServerRelativeUrl: ''
      }],
      items: [
        {
          ID: 0,
          Title: 'No Employee Story to Display',
          Description: '',
          "AttachmentFiles": [{
            ServerRelativeUrl: ''
          }],
          EmployeeName: { FirstName: '', LastName: '' },
          ADDepartment: [{ Label: '' }],
          Location: [{ Label: '' }]
        }
      ],
      ReqID: 0,
      isLoading: true,
    };
  }
  public async componentDidMount() {
    await this.GetCurrentUserLocation();
  }
  public componentWillReceiveProps(nextProps): void {
    this.GetCurrentUserLocation();
  }
  //get user's Current location 
  public async GetCurrentUserLocation() {
    //# TODO change Department to serviceline
    const response = await this.props.graphClient.api('/me/department') //get current user's department
      .get((error: any, department: any, rawResponse?: any) => {
        this.props.graphClient.api('/me/city') //get current user's city
          .get((error: any, city: any, rawResponse?: any) => {
            this.GetEmployeeStoryRecord(department.value, city.value);
          });
      });
  }

  //get Employee Story Record's data
  public GetEmployeeStoryRecord(serviceLine, location) {
    var method = 'get items for Employee Stories';
    let newCommonObj: common = new common();
    var query, dataFiltered;

    if (this.props.serviceline == strings.allServiceLine && this.props.location == strings.allLocation)
      query = "?$select=ID,Title,Description,ServiceArea,Location,ADDepartment,EmployeeName/FirstName,EmployeeName/LastName&$expand=EmployeeName/ID,AttachmentFiles/ServerRelativeUrl&$filter=ApprovalStatus eq 'Approved'&$expand=AttachmentFiles&$orderby=PublishDate desc&$top=1"; //ApprovalStatus
    else if (this.props.serviceline == strings.allServiceLine && this.props.location != strings.allLocation)
      query = "?$select=ID,Title,Description,ServiceArea,Location,ADDepartment,EmployeeName/FirstName,EmployeeName/LastName&$expand=EmployeeName/ID,AttachmentFiles/ServerRelativeUrl&$expand=AttachmentFiles&$filter=TaxCatchAll/Term eq '" + this.props.location + "' and ApprovalStatus eq 'Approved'&$orderby=PublishDate desc&$top=1";
    else if (this.props.serviceline != strings.allServiceLine && this.props.location == strings.allLocation)
      query = "?$select=ID,Title,Description,ServiceArea,Location,ADDepartment,EmployeeName/FirstName,EmployeeName/LastName&$expand=EmployeeName/ID,AttachmentFiles/ServerRelativeUrl&$expand=AttachmentFiles&$filter=TaxCatchAll/Term eq '" + this.props.serviceline + "' and ApprovalStatus eq 'Approved'&$orderby=PublishDate desc&$top=1";
    else if (this.props.serviceline != strings.allServiceLine && this.props.location != strings.allLocation)
      query = "?$select=ID,Title,Description,ServiceArea,Location,ADDepartment,EmployeeName/FirstName,EmployeeName/LastName&$expand=EmployeeName/ID,AttachmentFiles/ServerRelativeUrl&$expand=AttachmentFiles&$filter=TaxCatchAll/Term eq '" + this.props.serviceline + "' and TaxCatchAll/Term eq '" + this.props.location + "'and ApprovalStatus eq 'Approved'&$orderby=PublishDate desc&$top=1";


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
                  "Title": myservice.Title,
                  "Description": myservice.Description,
                  "ID": myservice.ID,
                  "AttachmentFiles": [{ ServerRelativeUrl: myservice.ServerRelativeUrl }],
                  "EmployeeName": { FirstName: myservice.FirstName, LastName: myservice.LastName },
                  "ADDepartment": myservice.ADDepartment,
                  "Location": myservice.Location

                });
              });
              res.data.value.forEach(otherservice => {
                orderservice.push({
                  "Title": otherservice.Title,
                  "Description": otherservice.Description,
                  "ID": otherservice.ID,
                  "AttachmentFiles": [{ ServerRelativeUrl: otherservice.ServerRelativeUrl }],
                  "EmployeeName": { FirstName: otherservice.FirstName, LastName: otherservice.LastName },
                  "ADDepartment": otherservice.ADDepartment,
                  "Location": otherservice.Location
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
          items: [{
            ID: 0,
            "Title": `${this.props.serviceline} ' Employee's story not in your location`,
            "Description": "",
            "AttachmentFiles": [{
              ServerRelativeUrl: ''
            }],
            EmployeeName: { FirstName: '', LastName: '' },
            ADDepartment: [{ Label: '' }],
            Location: [{ Label: '' }]
          }],
          isLoading: false,
          ReqID: 0
        });
      }
    }).catch(error => {
      console.log(error);
    });
  }

  public render(): React.ReactElement<IEmployeeStoriesProps> {
    var listID = this.props.listId;
    const siteTextStyles: ITextStyles = {
      root: {
        fontWeight: FontWeights.semibold,
        fontFamily: 'proxima-nova,arial',
        color: NeutralColors.black,
        overflow: 'hidden'
      },
    };
    const readmore: ITextStyles = {
      root: {
        color: NeutralColors.gray100,
        fontFamily: 'proxima-nova,arial',
      },
    };
    const cardTokens: ICardTokens = { childrenMargin: 5, childrenGap: 5, boxShadow: 'none', minWidth: '100%', height: '185px' };
    const sectionStackTokens: IStackTokens = { childrenGap: 20 };
    const defaultFontStyle: ITextStyles = {
      root: {
        fontFamily: 'proxima-nova, arial',
        color: "#838383",
        display: 'block'
      },
    };
    const defaultreadMoreFontStyle: ITextStyles = {
      root: {
        fontFamily: 'proxima-nova, arial',
        color: "#191717!important",
        display: 'block'
      },
    };
    
    var SiteUrl = this.props.siteUrl;
    const cardsectionstyle: ICardSectionStyles = {
      root: {
        maxWidth: '85%',
        display: 'inline-block'
      },
    };
    var queryParameters = new UrlQueryParameterCollection(window.location.href);
    if (parseInt(queryParameters.getValue("RID")) > 0) {
      return (<EmployeeStoriesDisplay graphClient={this.props.graphClient}
        siteUrl={this.props.siteUrl}
        listId={this.props.listId}
        serviceline={this.props.serviceline}
        location={this.props.location}
      />);
    } else {
      return (
        <div className={styles.employeeStories}>
          <div className={styles.container}>
            <h2 >EMPLOYEE STORIES / PARTNER'S SPEAK</h2>
            {(this.state.isLoading) ? <Loader message="Please wait..." />
              :
              (this.state.items[0].Title === "No Employee Story Available")
                ? <Label>{this.state.items[0].Title}</Label>
                :
                <div>
                  {this.state.items.map(function (item, key) {
                    return (<div>
                      <Stack tokens={sectionStackTokens}>
                        <Card aria-label="Clickable horizontal card " horizontal tokens={cardTokens}>
                          <Card.Section styles={cardsectionstyle}>
                            <Text variant="large" styles={siteTextStyles} className={styles.title}> {item.Title} </Text>
                            <div dangerouslySetInnerHTML={{ __html: item.Description }} className={styles.description}></div>
                            <Text variant="small" styles={defaultreadMoreFontStyle}>
                              <Link
                                href={`${SiteUrl}/SitePages/Display.aspx?ListName=${listID}&ItemID=${item.ID}`}
                                data-interception="off" target="_blank" rel="noopener noreferrer" styles={readmore}
                              >Read More</Link>
                            </Text>
                            <Text variant="small" styles={defaultFontStyle}>{item.EmployeeName.FirstName} {item.EmployeeName.LastName} ({item.ADDepartment[0].Label})</Text>
                            <Text variant="small" styles={defaultFontStyle}>{item.Location[0].Label}</Text>
                          </Card.Section>
                          <Card.Item >{/*fill   */}
                            <Image src={item.AttachmentFiles[0].ServerRelativeUrl} alt="Placeholder image." style={{ width: '160px' }} />
                          </Card.Item>
                        </Card>
                      </Stack>
                      <div className="ms-Grid-row">
                        <div className="ms-Grid-col ms-sm12 ms-md12">
                          <Link href={`${SiteUrl}/SitePages/Search.aspx?q=${strings.searchString}`} target="_blank" data-interception="off" className={styles.viewAll}>
                            View All
                      </Link>
                        </div>
                      </div>
                    </div>
                    )
                  })}
                </div>
            }
          </div>
        </div>
      );
    }
  }
}
