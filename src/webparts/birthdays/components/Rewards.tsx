import * as React from 'react';
import styles from './Birthdays.module.scss';
import { IBirthdaysProps } from './IBirthdaysProps';
import { escape } from '@microsoft/sp-lodash-subset';
import common from '../../common/common';
import { Loader } from '../../common/Loading';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from 'office-ui-fabric-react';
import * as strings from 'BirthdaysWebPartStrings';
import { sp, Web, Items } from 'sp-pnp-js';
import { CurrentUser } from 'sp-pnp-js/lib/sharepoint/siteusers';
import Common from '../../common/common';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { Stack } from 'office-ui-fabric-react';
import { Persona, PersonaSize } from 'office-ui-fabric-react/lib/Persona';
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
  red: [{ color: 'red', fill: 'red' }, iconClass],

});
const commentIcon: any = require('../assets/comment.png');
const likeIcon: any = require('../assets/like-fill.png');
const dislikeIcon: any = require('../assets/like.png');
export interface IRewardsState {
  items: [
    {
      EmployeeName: {
        EMail: string,
        FirstName: string,
        LastName: string
      },
      AwardType: string;
      AwardDate: string;
      showbutton: boolean;
      value: string;
      liked: boolean;
      likeCount: number;
    }
  ];
  isLoading: boolean;
  currentUserId: number,
  likes: number
}

export default class Rewards extends React.Component<IBirthdaysProps, IRewardsState> {
  public web = new Web(strings.siteUrl);
  constructor(props: IBirthdaysProps, state: IRewardsState) {
    super(props);
    //Initialize the State
    this.state = {
      items: [
        {
          EmployeeName: {
            EMail: '',
            FirstName: strings.NoAward,
            LastName: ''
          },
          AwardType: strings.NoAward,
          AwardDate: '',
          showbutton: false,
          value: "",
          liked: false,
          likeCount: 0,
        }
      ],
      isLoading: true,
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
    this.getCurrentUserLocation();
  }
  public componentWillReceiveProps(nextProps): void {
    this.getCurrentUserLocation();
    this.web = new Web(this.props.siteurl);
  }
  //get user's Current location 
  public async getCurrentUserLocation() {
    await this.props.msGraphClient.api('/me/city')  //get current user's profile
      .get((error: any, city: any, rawResponse?: any) => {
        //# TODO change Department to serviceline and officelocation to City
        this.props.msGraphClient.api('/me/department')  //get current user's ServiceLine
          .get((ServiceLineerror: any, sericeLine: any, ServiceLinerawResponse?: any) => {
            this.getStarPerformarRecord(city.value, sericeLine.value);
          });
      });
  }

  //get StarPerformer's data
  private async getStarPerformarRecord(location, serviceLine) {
    var method = 'get items for Star Performars';
    let newCommonObj: common = new common();
    var query;
    if (this.props.serviceline == strings.allServiceLine && this.props.location == strings.allLocation) //serviceline not selected query is fetch alerts acording to all sericeline and user's location
      query = "?$select=AwardType,ServiceArea,Location,AwardDate,EmployeeName/EMail,EmployeeName/FirstName,EmployeeName/LastName,EmployeeName/EMail&$filter=AwardDate ge '" + new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() + "'and ApprovalStatus eq 'Approved'&$expand=EmployeeName/Id&$orderby=PublishDate desc";
    else if (this.props.serviceline == strings.allServiceLine && this.props.location != strings.allLocation)
      query = "?$select=AwardType,ServiceArea,Location,AwardDate,EmployeeName/EMail,EmployeeName/FirstName,EmployeeName/LastName,EmployeeName/EMail&$filter=TaxCatchAll/Term eq '" + this.props.location + "'and AwardDate ge '" + new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() + "'and ApprovalStatus eq 'Approved'&$expand=EmployeeName/Id&$orderby=PublishDate desc";
    else if (this.props.serviceline != strings.allServiceLine && this.props.location == strings.allLocation)
      query = "?$select=AwardType,ServiceArea,Location,AwardDate,EmployeeName/EMail,EmployeeName/FirstName,EmployeeName/LastName,EmployeeName/EMail&$filter=TaxCatchAll/Term eq '" + this.props.serviceline + "'and AwardDate ge '" + new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() + "'and ApprovalStatus eq 'Approved'&$expand=EmployeeName/Id&$orderby=PublishDate desc";
    else if (this.props.serviceline != strings.allServiceLine && this.props.location != strings.allLocation)//serviceline not selected query is fetch alerts acording to selected sericeline and user's locatio
      query = "?$select=AwardType,ServiceArea,Location,AwardDate,EmployeeName/EMail,EmployeeName/FirstName,EmployeeName/LastName,EmployeeName/EMail&$filter=TaxCatchAll/Term eq '" + this.props.serviceline + "' and TaxCatchAll/Term eq '" + this.props.location + "'and AwardDate ge '" + new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() + "'and ApprovalStatus eq 'Approved'&$expand=EmployeeName/Id&$orderby=PublishDate desc";

    var dataFiltered;
    newCommonObj.getDataFromListUsingGuid(this.props.siteurl, this.props.rewardlistId, query, method).then(async (res) => {
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

        ////Get Like count from BirthdayLikeCount list
        await this.getLikeCount(this.state.items);

        let commonObj: Common = new Common();
        var items = this.state.items;
        ////Get Bithday is-liked or not by current user for all Birthday Persons in slider
        await commonObj.getDataFromList(this.props.siteurl, strings.RewardsLikeCountList, '', "Get Birthday Like Count").then(async (res) => {
          for (let i = 0; i < items.length; i++) {
            let userId = await commonObj.getUserIdByEmail(items[i].EmployeeName.EMail, this.props.siteurl);//BirthdayPerson 
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
          isLoading: false,
          items: [{
            EmployeeName: {
              EMail: '',
              FirstName: '',
              LastName: ''
            },
            AwardType: strings.NoAward,
            AwardDate: '',
            showbutton: false,
            value: "",
            liked: false,
            likeCount: 0,
          }]
        });
      }
    }).catch(error => {
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
      const likeCountQuery = "?$select=EmployeeName/EMail&$expand=EmployeeName/EMail&$filter=LikeFlag eq 1 and EmployeeName/EMail eq '" + bdayUsers[i].EmployeeName.EMail + "'";
      await commonObj.getDataFromList(this.props.siteurl, strings.RewardsLikeCountList, likeCountQuery, "Get Like Count from List").then(async (resLikedItems) => {
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
      <div className={styles.birthdays}>
        <div className={styles.containertab}>
          {
            (this.state.isLoading) ? <Loader message="Please wait..." /> :
              // If data is null then will show message of "No Award to Display"
              (this.state.items[0].AwardType === "No Award to Display")
                ?
                <div >
                  <Persona
                    primaryText={this.state.items[0].AwardType}
                    imageUrl={`${this.props.siteurl}/_layouts/15/userphoto.aspx?size=L`}
                    imageAlt='No Birthday'
                    size={PersonaSize.size48}
                  />
                  </div>
                :
                <div className={styles.verticalscroll} id={styles["style-2"]}>
                  {
                    this.state.items.map((item, key) => {
                      return (
                        <div>
                          <Persona
                            primaryText={`${item.EmployeeName.FirstName} ${item.EmployeeName.LastName}`}
                            secondaryText={item.AwardType}
                            imageUrl={`${this.props.siteurl}/_layouts/15/userphoto.aspx?size=L&accountname=${item.EmployeeName.EMail}`}
                            imageAlt={item.EmployeeName.FirstName}
                            size={PersonaSize.size48}
                          />
                          <p hidden={item.EmployeeName.EMail != "" ? false : true}>
                            {/* <span>{item.likeCount}</span>*/}
                            <button id={`${counter}`} className={styles.button} onClick={(event) => this.alertme(item.EmployeeName.EMail, event)}>{/*if already liked display dislike icon or else like icon*/}
                              {(item.liked) ? <Icon iconName="LikeSolid" className={classNames.red} /> : <Icon iconName="Like" />}<span> {item.likeCount} Likes</span>
                            </button>
                            <button name={`${counter}`} className={styles.button} type="button" onClick={() => { this.ShowHideFunction(event) }}>
                              {/* <img src={`${commentIcon}`} className={styles.comment} />*/}
                              <Icon iconName="Comment" /><span> Comments</span>
                            </button>
                          </p>
                          <p>
                            <div className={styles.birthdaybtnshow} hidden={!item.showbutton ? true : false} >
                              <textarea name={`${counter}`} typeof="comment" onChange={this.ChangeDataFunction} value={item.value}></textarea>
                              <button name={`${counter}`} type="button" className={styles.wishbutton} onClick={() => { this.SendData(item.EmployeeName.FirstName + " " + item.EmployeeName.LastName, item.EmployeeName.EMail, item.value, event) }}>Wish</button>
                              <button name={`${counter++}`} type="button" className={styles.clearbutton} onClick={() => { this.clearData(event) }}>Clear</button>
                           </div>
                          </p>

                        </div>
                      );
                    })
                  }
                </div>
          }
          <Link href={`${this.props.siteurl}/SitePages/Rewardwishes.aspx`} target='_blank' data-interception="off" styles={siteTextStyles}><Icon iconName="BirthdayCake" className={iconclassNames.birthdaywish} data-interception="off" /></Link>
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
            //sp.web.lists.getByTitle(strings.RewardsLikeCountList).items.getById(id).update({
            this.web.lists.getByTitle(strings.RewardsLikeCountList).items.getById(id).update({
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
          this.web.lists.getByTitle(strings.RewardsLikeCountList).items.add({
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
            this.web.lists.getByTitle(strings.RewardsLikeCountList).items.getById(id).update({
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
  //Check for already Liked By Current User For the Person
  private GetLikeFlag(empEmail, currentUserEmail): Promise<any> {

    let commonObj: Common = new Common();
    const isLikedQuery = "?$select=Id,EmployeeName/EMail,LikeBy/EMail&$expand=EmployeeName/EMail,LikeBy/EMail&$filter=EmployeeName/EMail eq '" + empEmail + "' and LikeBy/EMail eq '" + currentUserEmail + "'";
    return commonObj.getDataFromList(this.props.siteurl, strings.RewardsLikeCountList, isLikedQuery, "Get Liked or not from List").then(async (resLikedItems) => {
      return resLikedItems.data.value;
    });

    // return axios.get(`${this.props.siteurl}/_api/web/lists/getbytitle(strings.RewardsLikeCountList)/items`).then(response => {
    //   return response.data.value.filter(e => e.EmployeeNameId == eId && e.LikeById == currentUserId)
    // });
  }
  //This will store Details of Bdyperson Name ,Wished By,BdayMessage in RewardsWishes sharepoint List
  public async SendData(BirthdayPerson, userEmail, msg, e) {
    let commonObj: Common = new Common();
    let userId = await commonObj.getUserIdByEmail(userEmail, this.props.siteurl);//Reward Person 
    var res = msg.charAt(0);
    if (msg != null && res != (e.which == 32)) {//message should not be null or First charactor of message should not be space 
      this.web.currentUser.get().then((r) => {
        var createdBy = r["Title"];

        this.web.lists.getByTitle("RewardsWishes").items.add({
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
  private likeDisLikeIcon(isLiked) {
    if (isLiked) {
      return (
        <img src={`${likeIcon}`} className={styles.like} />
      );
    }
    else {
      return (
        <img src={`${dislikeIcon}`} className={styles.like} />
      );
    }
  }
}

