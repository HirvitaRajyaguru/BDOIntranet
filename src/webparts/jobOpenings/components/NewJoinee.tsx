import * as React from 'react';
import { escape } from '@microsoft/sp-lodash-subset';
import Common from '../../common/common';
import { Loader } from '../../common/Loading';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import 'react-tabs/style/react-tabs.css';
import { any } from 'prop-types';
import * as strings from 'BirthdaysWebPartStrings';
import { IJobOpeningsProps } from './IJobOpeningsProps';
import { IJobOpeningsState } from './IJobOpeningsState';
import styles from './JobOpenings.module.scss';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { Stack } from 'office-ui-fabric-react';
import { Persona, PersonaSize } from 'office-ui-fabric-react/lib/Persona';
export default class NewJoinee extends React.Component<IJobOpeningsProps, IJobOpeningsState> {

  public constructor(props: IJobOpeningsProps, state: IJobOpeningsState) {
    super(props);
    //Initialize the State
    this.state = {
      isLoading: true,
      items: [
        {
          ID: 0,
          Title: "Currently no job opening is available.",
          JobDescription: "",
          Position:"",
          Created: "",
          Location: [{ Label: '' }],
          ADDepartment: [{ Label: '' }],
          Experience: "",
          Display: 'No New Joiners',
          Email: "",
          Department: "",
          DOB: '',
          City: '',
          JoiningDate: '',
          // ServiceLine: '',
        }
      ],
      ReqID: 0,
    };
  }

  public async componentDidMount() {
    this.getCurrentUserLocationServiceLine();
  }

  //will call it whenever props are changed
  public componentWillReceiveProps(nextProps): void {
    this.getCurrentUserLocationServiceLine();
  }
  //get user's Current location 
  public async getCurrentUserLocationServiceLine() {
    await this.props.graphClient.api('/me/city')  //get current user's profile
      .get((error: any, city: any, rawResponse?: any) => {
        //# TODO change Department to serviceline and officelocation to City
        this.props.graphClient.api('/me/department')  //get current user's department
          .get((ServiceLineerror: any, sericeLine: any, ServiceLinerawResponse?: any) => {
            this.GetItemsForNewJoinee(city.value, sericeLine.value);
          });
      });
  }

  //Will Fetch the Birthday data from EmployeeMaster Sharepoint List
  public GetItemsForNewJoinee(location, serviceLine) {
    let newCommonObj: Common = new Common();
    var method = 'get items for New Joinee';
    var serviceline;  //for changing in propertypane
    var serviceusers;
    var serviceVise;
    var dataFiltered;
    newCommonObj.getDataFromListUsingGuid(this.props.siteUrl, this.props.newjoineelistId, null, method).then(async (res) => {
      // newCommonObj.getDataFromList(this.props.siteUrl, "UserMaster", null, "Get Birthday Like Count").then(async (res) => {
      if (res.data.value != undefined && res.data.value != null) {
        ////Get New Joinee Data
        var userdata = JSON.parse(res.data.value[0].Details);
        var userData = userdata.filter(data =>
          data.JoiningDate != "");
        //Filter Joinin from last 8 days and location
        dataFiltered = userData.filter(data =>
          new Date(data.JoiningDate).toISOString() >= new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString());
          if (dataFiltered.length > 0)  //If today is anyone Birthday 
          {
            if (this.props.serviceline == strings.allServiceLine || this.props.location == strings.allLocation) //If in Property Pane selected is All Location or All Serviceline
            {
              if (this.props.serviceline == strings.allServiceLine && this.props.location == strings.allLocation) //If in Property Pane selected is All Location and All Serviceline
              {
                serviceVise = dataFiltered.filter(
                  servicevise => servicevise.Department == serviceLine && servicevise.City == location);//Filter by login user's service line and location
              }
              else if (this.props.serviceline == strings.allServiceLine && this.props.location != strings.allLocation) //If in Property Pane selected is perticular Location and All Serviceline
              {
                dataFiltered = dataFiltered.filter(data => new Date(data.DOB).getDate() == new Date().getDate() && new Date(data.DOB).getMonth() == new Date().getMonth() && data.City == this.props.location);
                serviceVise = dataFiltered.filter(
                  servicevise => servicevise.Department == serviceLine && servicevise.City == this.props.location);//Filter by login user's service line and Property Pane location
              }
              else if (this.props.serviceline != strings.allServiceLine && this.props.location == strings.allLocation) //If in Property Pane selected is perticular Location and All Serviceline
              {
                dataFiltered = dataFiltered.filter(data => new Date(data.DOB).getDate() == new Date().getDate() && new Date(data.DOB).getMonth() == new Date().getMonth() && data.Department == this.props.serviceline);
                serviceVise = dataFiltered.filter(
                  servicevise => servicevise.Department == this.props.serviceline && servicevise.City == location);//Filter by login user's location and property Pane's service line
              }
              if (serviceVise.length > 0) {
                if (serviceVise.length == dataFiltered.length) {//If all filtered data's service line = yur service line
                  serviceusers = serviceVise;
                }
                else {
                  for (var i = 0; i < serviceVise.length; i++) {
                    const index = dataFiltered.indexOf(serviceVise[i]);
                    if (index > -1) {
                      dataFiltered.splice(index, 1);
                    }
                  }
                  let orderservice = [];
                  serviceVise.forEach(myservice => {
                    orderservice.push({
                      Display: myservice.Display,
                      Email: myservice.Email,
                      Department: myservice.Department,
                      DOB: myservice.DOB,
                      City: myservice.City,
                      JoiningDate: myservice.JoiningDate,
                      // ServiceLine: myservice.ServiceLine
                    });
                  });
                  dataFiltered.forEach(otherservice => {
                    orderservice.push({
                      Display: otherservice.Display,
                      Email: otherservice.Email,
                      Department: otherservice.Department,
                      DOB: otherservice.DOB,
                      City: otherservice.City,
                      JoiningDate: otherservice.JoiningDate,
                      //    ServiceLine: otherservice.ServiceLine
                    });
                  });
                  serviceusers = orderservice;
                }
              }
              else {
                serviceusers = dataFiltered;
              }
            }
            else { //in property pane select only one serviceline and one location
              serviceusers = dataFiltered.filter(serviceuser =>
                serviceuser.Department == this.props.serviceline && serviceuser.City == this.props.location);
            }
            if (serviceusers.length > 0) {
              this.setState({
                items: serviceusers, isLoading: false
              });
            }
            else {
              this.setState({
                items: [
                  {
                    ID: 0,
                    Title: "Currently no job opening is available.",
                    JobDescription: "",
                    Created: "",
                    Position:"",
                    Location: [{ Label: '' }],
                    ADDepartment: [{ Label: '' }],
                    Experience: "",
                    Display: 'No New Joiners',
                    Email: "",
                    Department: "",
                    DOB: '',
                    City: '',
                    JoiningDate: '',
                    //   ServiceLine: '',
                  }
                ], isLoading: false
              });
            }
          }
          else {
            this.setState({
              items: [
                {
                  ID: 0,
                  Title: "Currently no job opening is available.",
                  JobDescription: "",
                  Created: "",
                  Position: "",
                  Location: [{ Label: '' }],
                  ADDepartment: [{ Label: '' }],
                  Experience: "",
                  Display: 'No New Joiners',
                  Email: "",
                  Department: "",
                  DOB: '',
                  City: '',
                  JoiningDate: '',
                  //   ServiceLine: '',
                }
              ], isLoading: false
            });
          }
      }
    }).catch(error => {
      console.log('error while getting data');
      console.log(error);
    });
  }

  public render(): React.ReactElement<IJobOpeningsProps> {
    return (
      <div className={styles.jobOpenings} >
        <div className={styles.containertab}>
          {(this.state.isLoading) ? <Loader message="Please wait..." /> :
            (this.state.items[0].Display === "No New Joiners")
              ?//If No New Joinee are there it will show message of-"No New Joinee"
              <div>
                <Persona
                  primaryText={this.state.items[0].Display}
                  imageUrl={`${this.props.siteUrl}/_layouts/15/userphoto.aspx?size=L`}
                  imageAlt='No Birthday'
                  size={PersonaSize.size48}
                />
              </div>
              ://If any New Joinee date is matched with today's date will Load the New Joinee details of person and show in webpart
              <div className={styles.verticalscroll} id={styles["style-2"]}>
                {
                  this.state.items.map((item, key) => {
                    return (
                      <div key={key} >
                        <Persona
                          primaryText={item.Display}
                          secondaryText={`${item.Department} ${item.City}`}
                          tertiaryText={item.City}
                          imageUrl={`${this.props.siteUrl}/_layouts/15/userphoto.aspx?size=L&accountname=${item.Email}`}
                          imageAlt={item.Display}
                          size={PersonaSize.size48}
                        />
                      </div>
                    );
                  })
                }
              </div>
          }
        </div>
      </div>
    );
  }
}


