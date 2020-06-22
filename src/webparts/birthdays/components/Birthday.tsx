import * as React from 'react';
import styles from './Birthdays.module.scss';
import { IBirthdaysProps } from './IBirthdaysProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { IBirthdayState } from './IBirthdayState';
import Common from '../../common/common';
import { Loader } from '../../common/Loading';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import 'react-tabs/style/react-tabs.css';
import { sp, Web, Items } from 'sp-pnp-js';
import { CurrentUser } from 'sp-pnp-js/lib/sharepoint/siteusers';
import { any } from 'prop-types';
import * as strings from 'BirthdaysWebPartStrings';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { Stack } from 'office-ui-fabric-react';
import { Persona, PersonaSize } from 'office-ui-fabric-react/lib/Persona';
import { Link } from 'office-ui-fabric-react/lib/components/Link';
import { mergeStyles, mergeStyleSets } from 'office-ui-fabric-react/lib/Styling';
import { FontSizes } from '@uifabric/fluent-theme/lib/fluent/FluentType';
import { IIconStyles, Image, Text, ITextStyles } from 'office-ui-fabric-react';
const iconclassNames = mergeStyleSets({
  birthdaywish: [{ fontSize: FontSizes.size18 }],
});
const siteTextStyles: ITextStyles = {
  root: {
    bottom: '0',
    position: 'absolute',
    right: '5px'
  },
};
const iconClass = mergeStyles({
  fontWeight: '700',
  pointerEvents: 'none',
  padding: '2px 0 0',
  verticalAlign: 'middle'
});
const classNames = mergeStyleSets({
  red: [{ color: 'red' ,fill:'red'}, iconClass],

});
export default class Birthday extends React.Component<IBirthdaysProps, IBirthdayState> {
  public web = new Web(strings.siteUrl);

  public constructor(props: IBirthdaysProps, state: IBirthdayState) {
    super(props);
    //Initialize the State
    this.state = {
      isLoading: true,
      items: [
        {
          Display: 'No Birthday today',
          Email: "",
          Department: "",
          DOB: '',
          City: '',
          JoiningDate: '',
          // ServiceLine: '',
          showbutton: false,
          value: "",
          liked: false,
          likeCount: 0,
        }
      ],
      currentUserId: null,
      likes: 0
    };

    this.ShowHideFunction = this.ShowHideFunction.bind(this);
    this.ChangeDataFunction = this.ChangeDataFunction.bind(this);
    this.clearData = this.clearData.bind(this);
  }

  public async componentDidMount() {
    //Get Current logged in User-Id
    this.web = new Web(this.props.siteurl);
    await this.web.currentUser.get().then((r: CurrentUser) => {
      this.setState({
        currentUserId: r["Id"]
      });
    });
    this.getCurrentUserLocationServiceLine();
    this.web = new Web(this.props.siteurl);
  }

  //will call it whenever props are changed
  public componentWillReceiveProps(nextProps): void {
    this.getCurrentUserLocationServiceLine();
    this.web = new Web(this.props.siteurl);
  }
  //get user's Current location 
  public async getCurrentUserLocationServiceLine() {
    await this.props.msGraphClient.api('/me/city')  //get current user's profile
      .get((error: any, city: any, rawResponse?: any) => {
        //# TODO change Department to serviceline and officelocation to City
        this.props.msGraphClient.api('/me/department')  //get current user's department
          .get((ServiceLineerror: any, sericeLine: any, ServiceLinerawResponse?: any) => {
            this.GetItemsForBirthday(city.value, sericeLine.value);
          });
      });
  }

  //Will Fetch the Birthday data from EmployeeMaster Sharepoint List
  public async GetItemsForBirthday(location, serviceLine) {
    let newCommonObj: Common = new Common();
    var method = 'get items for Birthday';
    newCommonObj.getDataFromListUsingGuid(this.props.siteurl, this.props.listId, null, method).then(async (res) => {
      if (res.data.value != undefined && res.data.value != null) {
        ////Get Birthday Data
        var userData = JSON.parse(res.data.value[0].Details);
        var serviceusers;
        var serviceVise;
        var dataFiltered;
        dataFiltered = userData.filter(data => new Date(data.DOB).getDate() == new Date().getDate() && new Date(data.DOB).getMonth() == new Date().getMonth());
        //dataFiltered== whose Birthday is today without  service Line and Location
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
                  Display: 'No Birthday today',
                  Email: "",
                  Department: "",
                  DOB: '',
                  City: '',
                  JoiningDate: '',
                  // ServiceLine: '',
                  showbutton: false,
                  value: "",
                  liked: false,
                  likeCount: 0,
                }
              ], isLoading: false
            });
          }
          ////Get Like count from BirthdayLikeCount list
          await this.getLikeCount(this.state.items);

          let commonObj: Common = new Common();
          var items = this.state.items;
          ////Get Bithday is-liked or not by current user for all Birthday Persons in slider
          await commonObj.getDataFromList(this.props.siteurl, strings.BirthdayLikeCountList, '', "Get Birthday Like Count").then(async (res) => {
            for (let i = 0; i < items.length; i++) {
              let userId = await commonObj.getUserIdByEmail(items[i].Email, this.props.siteurl);//BirthdayPerson 
              if (res != null && res.data != null && res.data.value != null && res.data.value.length > 0) {
                let likedItems = res.data.value.filter(e => e.EmployeeNameId == userId && e.LikeById == this.state.currentUserId && e.LikeFlag == true);
                if (likedItems.length > 0) {
                  items[i].liked = true;
                }
              }
            }
            this.setState({
              items: items, isLoading: false
            });
          });
        }
        else {
          this.setState({
            items: [
              {
                Display: 'No Birthday today',
                Email: "",
                Department: "",
                DOB: '',
                City: '',
                JoiningDate: '',
                // ServiceLine: '',
                showbutton: false,
                value: "",
                liked: false,
                likeCount: 0,
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
  //this method is used to show like count every two second
  private async getLikeCountInterval() {
    var bdayUsers = this.state.items;
    this.getLikeCount(bdayUsers);
  }

  //Get total Likes BirthdayPerson personwise
  private async getLikeCount(bdayUsers) {
    let commonObj: Common = new Common();

    for (let i = 0; i < bdayUsers.length; i++) {
      const likeCountQuery = "?$select=EmployeeName/EMail&$expand=EmployeeName/EMail&$filter=LikeFlag eq 1 and EmployeeName/EMail eq '" + bdayUsers[i].Email + "'";
      await commonObj.getDataFromList(this.props.siteurl, strings.BirthdayLikeCountList, likeCountQuery, "Get Like Count from List").then(async (resLikedItems) => {
        bdayUsers[i].likeCount = (resLikedItems != null && resLikedItems.data != null && resLikedItems.data.value != null) ? resLikedItems.data.value.length : 0;
      });
    }
    this.setState({
      items: bdayUsers
    });
  }

  ////Comment ToogleButton to show/hide Textarea and sendButton
  ShowHideFunction(e) {
    var allItems = this.state.items;
    if (!allItems[e.target.name].showbutton) {
      allItems[e.target.name].showbutton = true;
    }
    else {
      allItems[e.target.name].showbutton = false;
    }
    this.setState({
      items: allItems
    });
  }
  //Clear comment Textarea 
  clearData(e) {
    var allItems = this.state.items;

    allItems[e.target.name].value = "";
    allItems[e.target.name].showbutton = false;
    this.setState({
      items: allItems
    });
  }
  //all the textbox value will store in setstate value variable whenever new text is entered in textbox and reset state value
  public ChangeDataFunction(e) {
    var allItems = this.state.items;
    allItems[e.target.name].value = e.target.value;
    this.setState({ items: allItems });
  }


  public render(): React.ReactElement<IBirthdaysProps> {
    var counter = 0;
    return (
      <div className={styles.birthdays} >
        <div className={styles.containertab}>
          {/*<h2>Happy Birthday</h2>*/}
          {(this.state.isLoading) ? <Loader message="Please wait..." /> :
            (this.state.items[0].Display === "No Birthday today")
              ?//If No Birthdays are there it will show message of-"No Birthday today"
              <div>
                <Persona
                  primaryText={this.state.items[0].Display}
                  imageUrl={`${this.props.siteurl}/_layouts/15/userphoto.aspx?size=L`}
                  imageAlt='No Birthday'
                  size={PersonaSize.size48}
                />
              </div>
              ://If any Birthday date is matched with today's date will Load the Birthday details of person and show in webpart
              <div className={styles.verticalscroll} id={styles["style-2"]}>
                {
                  this.state.items.map((item, key) => {
                    return (
                      <div>
                        <Persona
                          primaryText={item.Display}
                          secondaryText={`${item.Department} ${item.City}`}
                          tertiaryText={item.City}
                          imageUrl={`${this.props.siteurl}/_layouts/15/userphoto.aspx?size=L&accountname=${item.Email}`}
                          imageAlt={item.Display}
                          size={PersonaSize.size48}
                        />
                        <p hidden={item.Email != "" ? false : true}>
                          {/* <span>{item.likeCount}</span>*/}
                          <button id={`${counter}`} className={styles.button} onClick={(event) => this.alertme(item.Email, event)}>{/*if already liked display dislike icon or else like icon*/}
                            {(item.liked) ? <Icon iconName="LikeSolid" className={classNames.red}  /> : <Icon iconName="Like" />} <span> {item.likeCount} Likes</span>
                          </button >
                          <button name={`${counter}`} className={`${styles.button}`} type="button" onClick={() => { this.ShowHideFunction(event) }}>
                            {/* <img src={`${commentIcon}`} className={styles.comment} />*/}
                            <Icon iconName="Comment" /><span> Comments</span>
                          </button>
                        </p>
                        <p>
                          <div className={styles.birthdaybtnshow} hidden={!item.showbutton ? true : false} >
                            <textarea name={`${counter}`} typeof="comment" onChange={this.ChangeDataFunction} value={item.value}></textarea>
                            <button name={`${counter}`} type="button" className={styles.wishbutton} onClick={() => { this.SendData(item.Display, item.Email, item.value, event) }}>Wish</button>
                            <button name={`${counter++}`} type="button" className={styles.clearbutton} onClick={() => { this.clearData(event) }}>Clear</button>
                          </div>
                        </p>

                      </div>
                    );
                  })
                }
              </div>
          }
          <Link href={`${this.props.siteurl}/SitePages/${strings.pageName}`} target="_blank" data-interception="off" styles={siteTextStyles}><Icon iconName="BirthdayCake" className={iconclassNames.birthdaywish} /></Link>
        </div>
      </div>
    );
  }
  //By clicking LikeButton will store data of BirthdayPerson,LikedBy person  with LikeFlag value true and unlike will set LikeFlag value false in in BirthdayLikeCount sharepoint list
  public async alertme(userEmail, event) {
    let commonObj: Common = new Common();
    var tid = event.target.id;//Element Sequance Number
    let userId = await commonObj.getUserIdByEmail(userEmail, this.props.siteurl);//BirthdayPerson 
    var allItems = this.state.items;
    if (!this.state.items[tid].liked) {

      allItems[tid].likeCount++;//getting count of total likes of a bdayPerson and adding one 
      await this.GetLikeFlag(userEmail, this.props.currentUserEmail).then(res => {
        if (res.length > 0) {
          res.forEach(element => {
            var id = element.Id;
            //Update LikeFlag value to true in sharepoint List of BirthdayLikeCount if current user click on like button
            this.web.lists.getByTitle(strings.BirthdayLikeCountList).items.getById(id).update({
              'LikeFlag': true,
            });
          });
          allItems[tid].liked = true;//change item liked state to true 

          this.setState({
            items: allItems,
          });
        }
        else {
          //If current user click on like button first time will add a new record and store that data in BirthdayLikeCount list
          this.web.lists.getByTitle(strings.BirthdayLikeCountList).items.add({
            LikeFlag: true,
            LikeById: this.state.currentUserId,
            EmployeeNameId: userId,
          }).then(res => {
            allItems[tid].liked = true;
            this.setState({
              items: allItems,
            });
          }).catch(error => {

            alert('Error while creating the item: ' + error);
          });
        }
      });
    } else {
      //If current user already clicked on like button it will Update LikeFlag value to false in sharepoint List of BirthdayLikeCount
      allItems[tid].likeCount--;//getting count of total likes of a bdayPerson and substrating one 
      await this.GetLikeFlag(userEmail, this.props.currentUserEmail).then(res => {
        if (res != null && res.length > 0) {
          res.forEach(element => {
            var id = element.Id;
            this.web.lists.getByTitle(strings.BirthdayLikeCountList).items.getById(id).update({
              'LikeFlag': false,
            });
          });
        }
        allItems[tid].liked = false;
        this.setState({
          items: allItems,
        });
      });
    }
  }
  private GetLikeFlag(empEmail, currentUserEmail): Promise<any> {

    let commonObj: Common = new Common();
    const isLikedQuery = "?$select=Id,EmployeeName/EMail,LikeBy/EMail&$expand=EmployeeName/EMail,LikeBy/EMail&$filter=EmployeeName/EMail eq '" + empEmail + "' and LikeBy/EMail eq '" + currentUserEmail + "'";
    return commonObj.getDataFromList(this.props.siteurl, strings.BirthdayLikeCountList, isLikedQuery, "Get Liked or not from List").then(async (resLikedItems) => {
      return resLikedItems.data.value;
    });

    // return axios.get(`${this.props.siteurl}/_api/web/lists/getbytitle(strings.BirthdayLikeCountList)/items`).then(response => {
    //   return response.data.value.filter(e => e.EmployeeNameId == eId && e.LikeById == currentUserId)
    // });
  }
  //This will store Details of Bdyperson Name ,Wished By,BdayMessage in BirthdayWishes sharepoint List
  public async SendData(BirthdayPerson, userEmail, msg, e) {
    let commonObj: Common = new Common();
    var res = msg.charAt(0);
    let userId = await commonObj.getUserIdByEmail(userEmail, this.props.siteurl);//BirthdayPerson 
    if (msg != null && res != (e.which == 32)) {//message should not be null or First charactor of message should not be space 
      this.web.currentUser.get().then((r) => {
        var createdBy = r["Title"];

        this.web.lists.getByTitle("BirthdayWishes").items.add({
          'Title': BirthdayPerson,
          'EmployeeNameId': userId,
          'WishedBy': createdBy,
          'Wishes': msg,
        })
      });
      this.clearData(e);
      // alert(strings.commentSave + "" + BirthdayPerson);
    } else {
      alert("Space is not allowed at first char");
    }
  }
  //Check for already Liked By Current User For the Person
}
{ /*<button id={`${counter}`} className={styles.button} onClick={(event) => this.alertme(item.Email, event)}>
{ (item.liked) ? <Icon iconName="Dislike" /> : <Icon iconName="Like" /> } <span> {item.likeCount} Likes</span>
                          </button >*/} {/*if already liked display dislike icon or else like icon*/ }
