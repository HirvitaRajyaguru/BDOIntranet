import * as React from 'react';
import { IJobOpeningsProps } from './IJobOpeningsProps';
import { IJobOpeningsState } from './IJobOpeningsState';
import styles from './JobOpenings.module.scss';
import { escape } from '@microsoft/sp-lodash-subset';
import common from '../../common/common';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import 'react-tabs/style/react-tabs.css';
import { any } from 'prop-types';
import { Card, ICardTokens, ICardSectionStyles, ICardSectionTokens } from '@uifabric/react-cards';
import { Icon, Stack, IStackTokens, Text, ITextStyles, StackItem } from 'office-ui-fabric-react';
import { Link } from "office-ui-fabric-react/lib/components/Link";
import 'moment-timezone';
import { FontWeights } from '@uifabric/styling';
import { Loader } from '../../common/Loading';
import * as strings from 'JobOpeningsWebPartStrings';
import none from 'ramda/es/none';
import { NeutralColors } from '@uifabric/fluent-theme/lib/fluent/FluentColors';
export default class JobNewJoineeTab extends React.Component<IJobOpeningsProps, IJobOpeningsState> {

  public constructor(props: IJobOpeningsProps) {
    super(props);
    //Initialize the State
    this.state = {

      items: [
        {
          ID: 0,
          Title: "Currently no job opening is available.",
          JobDescription: "",
          Created: "",
          Location: [{ Label: '' }],
          ADDepartment: [{ Label: '' }],
          Experience: "",
          Position:"",
          Display: 'No New Employee Joine From Last week',
          Email: "",
          Department: "",
          DOB: '',
          City: '',
          JoiningDate: '',
          // ServiceLine: '',
        }
      ],
      ReqID: 0,
      isLoading: true,
    };
  }

  public async componentDidMount() {
    //Get Current logged in User-Id

    this.GetCurrentUserLocation();
  }

  //will call it whenever props are changed
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
            this.GetJobOpeningRecord(department.value, city.value);
          });
      });
  }
  //get Job Opening Record's data
  public GetJobOpeningRecord(serviceLine, location) {
    var method = 'get items for Job Opening';
    var dataFiltered;
    let newCommonObj: common = new common();
    var query;

    if (this.props.serviceline == strings.allServiceLine && this.props.location == strings.allLocation)  //serviceline not selected query is fetch alerts acording to all sericeline and user's location
      query = "?$select=ID,Title,Experience,Position,ADDepartment,Location,ServiceArea,TaxCatchAll/Term&$expand=TaxCatchAll/Term&$filter=ApprovalStatus eq 'Approved'&$orderby=PublishDate desc&$top=2";
    else if (this.props.serviceline == strings.allServiceLine && this.props.location != strings.allLocation)
      query = "?$select=ID,Title,Experience,Position,ADDepartment,Location,ServiceArea,TaxCatchAll/Term&$filter=TaxCatchAll/Term eq '" + this.props.location + "'and ApprovalStatus eq 'Approved'&$expand=TaxCatchAll&$orderby=PublishDate desc&$top=2";
    else if (this.props.serviceline != strings.allServiceLine && this.props.location == strings.allLocation)
      query = "?$select=ID,Title,Experience,Position,ADDepartment,Location,ServiceArea,TaxCatchAll/Term&$filter=TaxCatchAll/Term eq '" + this.props.serviceline + "'and ApprovalStatus eq 'Approved'&$expand=TaxCatchAll&$orderby=PublishDate desc&$top=2";
    else if (this.props.serviceline != strings.allServiceLine && this.props.location != strings.allLocation)//serviceline not selected query is fetch alerts acording to selected sericeline and user's location
      query = "?$select=ID,Title,Experience,Position,ADDepartment,Location,ServiceArea,TaxCatchAll/Term&$filter=TaxCatchAll/Term eq '" + this.props.serviceline + "' and TaxCatchAll/Term eq '" + this.props.location + "'and ApprovalStatus eq 'Approved'&$expand=TaxCatchAll&$orderby=PublishDate desc&$top=2";

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
                  "Experience": myservice.Experience,
                  "ADDepartment": myservice.ADDepartment,
                  "Position": myservice.Position,
                  "Location": myservice.Location,
                  "ID": myservice.ID
                });
              });
              res.data.value.forEach(otherservice => {
                orderservice.push({
                  "Title": otherservice.Title,
                  "Experience": otherservice.Experience,
                  "ADDepartment": otherservice.ADDepartment,
                  "Position": otherservice.Position,
                  "Location": otherservice.Location,
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
          items: [{
            "ID": 0,
            "Title": `Currently no job opening is available.`,
            "JobDescription": "",
            "Created": "",
            "Location": [{ Label: '' }],
            "ADDepartment": [{ Label: '' }],
            "Position": "",
            Experience: "",
            Display: 'No New Employee Joine From Last week',
            Email: "",
            Department: "",
            DOB: '',
            City: '',
            JoiningDate: '',
            // ServiceLine: '',
          }],
          isLoading: false,
          ReqID: 0
        });
      }
    }).catch(error => {
      console.log(error);
    });

  }

  public render(): React.ReactElement<IJobOpeningsProps> {
    const cardTokens: ICardTokens = { childrenMargin: 5, childrenGap: 5, boxShadow: 'none' };//
    const sectionStackTokens: IStackTokens = { childrenGap: 25 };
    const siteTextStyles: ITextStyles = {
      root: {
        fontWeight: FontWeights.semibold,
        fontFamily: 'proxima-nova, arial',
        color: NeutralColors.black
      },
    };
    const DepartmentTextStyles: ITextStyles = {
      root: {
        fontFamily: 'proxima-nova, arial',
        color: NeutralColors.black
      },
    };
    const defaultFontStyle: ITextStyles = {
      root: {
        fontFamily: 'proxima-nova, arial',
        color: NeutralColors.gray90
      },
    };
    const CardSectionTokens: ICardSectionTokens = { padding: 0, childrenGap: 0, margin: 0 };
    const footerCardSectionTokens: ICardSectionTokens = { padding: '0px 0px 0px 12px' };
    const cardSectionStyles: ICardSectionStyles = {
      root: {
        width: '83%'
      },
    };
    const footerCardSectionStyles: ICardSectionStyles = {
      root: {
        alignSelf: 'end',
        borderLeft: '1px solid #F3F2F1',

      },
    };
    let siteurl = this.props.siteUrl;
    return (
      <div className={styles.jobOpenings}>
        <div className={styles.containertab}>
          {
            (this.state.isLoading) ? <Loader message="Please wait..." /> :
              (this.state.items[0].Title == "Currently no job opening is available.")
                ?//If No New Joinee are there it will show message of-"No New Joinee"
                <div>
                  <Stack tokens={sectionStackTokens} padding={5}>
                    <StackItem >
                      <Card aria-label="Clickable horizontal card " horizontal tokens={cardTokens}>
                        <Card.Section tokens={CardSectionTokens}>
                          <Text variant="medium" styles={siteTextStyles}> {this.state.items[0].Title}</Text>
                        </Card.Section>
                      </Card>
                    </StackItem>
                  </Stack>
                </div> : <div>
                  {this.state.items.map(function (item, key) {
                    return (
                      <Stack tokens={sectionStackTokens} padding={5}>
                        <StackItem >
                          <Card aria-label="Clickable horizontal card " horizontal reversed tokens={cardTokens}>
                            <Card.Section tokens={CardSectionTokens} styles={cardSectionStyles}>
                              <Text variant="medium" styles={siteTextStyles}> {item.Title}</Text>
                              <Text variant="medium" styles={DepartmentTextStyles}> {item.Position}</Text>
                              <Text variant="small" styles={defaultFontStyle}>Location: {item.Location[0].Label}</Text>
                              <Text variant="small" styles={defaultFontStyle}>Exp. {item.Experience} year</Text>
                            </Card.Section>

                            <Card.Section styles={footerCardSectionStyles} tokens={footerCardSectionTokens}>
                              <Link
                                href={`${siteurl}/SitePages/ResumeUpload.aspx?RID=${item.ID}`}
                                target="_blank" data-interception="off">
                                <Icon iconName="PeopleAdd" /></Link>

                            </Card.Section>

                          </Card>
                        </StackItem>
                      </Stack>
                    )
                  })}
                  <div className="ms-Grid-row">
                    <div className="ms-Grid-col ms-sm12 ms-md12">
                      <Link href={`${this.props.siteUrl}/SitePages/Jobdetails.aspx`} target='_blank' className={styles.viewAll} data-interception="off">
                        View All
                      </Link>
                    </div>
                  </div>
                </div>
          }
        </div>
      </div>
    );
  }
}

{/* <Card.Section styles={footerCardSectionStyles} tokens={footerCardSectionTokens}>
                        <Stack gap={5}>
                          <Stack.Item align="end"> <Link
                            href={`${siteurl}/SitePages/ResumeUpload.aspx?RID=${item.ID}`}
                            target="_blank" >
                            <Icon iconName="PeopleAdd" /></Link>
                          </Stack.Item>
                        </Stack>
                      </Card.Section>
                       <Stack gap={5}>
                        <Stack.Item align="end"> <Link
                          href={`${siteurl}/SitePages/ResumeUpload.aspx?RID=${item.ID}`}
                          target="_blank" >
                          <Icon iconName="PeopleAdd" /></Link>
                        </Stack.Item>
                      </Stack>
                     <Card.Item styles={footerCardSectionStyles}>{/*fill
<Link
  href={`${siteurl}/SitePages/ResumeUpload.aspx?RID=${item.ID}`}
  target="_blank" >
  <Icon iconName="PeopleAdd" /></Link>
                      </Card.Item >
                       <div className={styles.alignright}>*/}
