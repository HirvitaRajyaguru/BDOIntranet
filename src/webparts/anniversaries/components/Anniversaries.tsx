import * as React from 'react';
import styles from './Anniversaries.module.scss';
import { IAnniversaryProps } from './IAnniversariesProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { IAnniversaryState } from './IAnniversaryState';
import Common from '../../common/common';
import { Loader } from '../../common/Loading';
import { CurrentUser } from '@pnp/sp/src/siteusers';
// import { mergeStyles } from 'office-ui-fabric-react/lib/Styling';
import { IPersonaProps, IPersonaSharedProps, Persona, PersonaSize, PersonaPresence } from 'office-ui-fabric-react/lib/Persona';

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import RSlider from "react-slick";

import { sp, Items } from 'sp-pnp-js';
//import { CurrentUser } from '@pnp/sp/src/siteusers';
import axios from 'axios';

const commentIcon: any = require('../assets/comment.png');
const likeIcon: any = require('../assets/like-fill.png');
const dislikeIcon: any = require('../assets/like.png');

// const customCoinClass = mergeStyles({
//   borderRadius: 0,
//   display: 'block',
//   height: '75px',
//   width: '100px'
// });

//var getyear = new Date().getFullYear();

export default class Anniversaries extends React.Component<IAnniversaryProps, IAnniversaryState> {
  public constructor(props: IAnniversaryProps, state: IAnniversaryState) {
    super(props);
    //Initialize the State
    this.state = {
      isLoading: true,
      items: [
        {
          FullName: "No Anniversary today",
          DateOfBirth: "",
          Status: "",
          Email: "",
          Designation: "",
          userLocation: "",
          showbutton: false,
          value: "",
          ID: 0,
          liked: false,
          likeCount: 0,
          DateOfJoining: ""
        }
      ],
      currentUserId: null,
      likes: 0,
      updated: false
    };
    //Get Current logged in User-Id
    sp.web.currentUser.get().then((r: CurrentUser) => {
      console.log(r["Id"]);
      this.setState({

        currentUserId: r["Id"]
      })
    });

    this.ShowHideFunction = this.ShowHideFunction.bind(this);
    this.ChangeDataFunction = this.ChangeDataFunction.bind(this);
    this.clearData = this.clearData.bind(this);
  }


  public async componentDidMount() {
    console.log('..componentDidMount');
    this.GetItemsForAnniversary();
    //GetDataUsingGraphAPI()


  }

  //will call it whenever props are changed
  public componentWillReceiveProps(nextProps): void {
    this.GetItemsForAnniversary();
  }
  public componentWillUnmount() {
    // clearInterval(intervalID);
  }

  ////Get User Profile data from Azure AD using Graph API
  private async GetDataUsingGraphAPI() {
    await this.props.msGraphClient
      .api(`/users?$filter=givenName eq 'Pooja'`)
      .get().then(res => {
        console.log('userResponse', res);
        return res;
      }).catch(error => {
        console.log(error);
      });
  }

   //Will Fetch the Anniversary data from EmployeeMaster Sharepoint List
  public GetItemsForAnniversary() {
    let newCommonObj: Common = new Common();
    var url = this.props.siteurl;
    var method = 'get items for Birthday';
   // var listname = 'EmployeeMaster';
    var listId = this.props.listId;
    var query = '?$top=1000';
    if (this.props.Practices == true) 
      var query = '?$top=1000';
    else
      var query = '?$top=1000';

      newCommonObj.getDataFromListUsingGuid(url, listId , query, method).then(async (res) => {
        if (res.data.value != undefined && res.data.value != null) {
          ////Get Birthday Data
          var dataFiltered = res.data.value.filter(data => new Date(data.DateOfJoining).getDate() == new Date().getDate() && new Date(data.DateOfJoining).getMonth() == new Date().getMonth() && data.Status == "Active");

          ////Get Anniversary Data
          // let resultData;
          // var anniversaryData = res.data.value.filter(data => {
          //   if (data.Status == 'Active' && new Date(data.DateOfJoining).getDate() == new Date().getDate() && new Date(data.DateOfJoining).getMonth() == new Date().getMonth() && new Date(data.DateOfJoining).getFullYear() != new Date().getFullYear()) {
          //     resultData = {
          //       ...data,
          //       totalYearsOfExp: (getyear) - (new Date(data.DateOfJoining).getFullYear())
          //     }
          //     return resultData;
          //   }
          // });

          // var query = `?$top=5&$orderby=ID desc`;


          if (dataFiltered != undefined && dataFiltered != null && dataFiltered.length > 0) {
            this.setState({
              items: dataFiltered
            });

            ////Get Like count from BirthdayLikeCount list
            await this.getLikeCount(this.state.items);

            ////call get count after every 2 second
            // setInterval(this.getLikeCountInterval.bind(this), 2000);



            let commonObj: Common = new Common();
            var items = this.state.items;
            ////Get is liked or not by current user to all slide users
            await commonObj.getDataFromList(this.props.siteurl, 'AnniversaryLikeCount', '', "Get Anniversary Like Count").then(async (res) => {
              for (let i = 0; i < items.length; i++) {
                let userId = await commonObj.getUserIdByEmail(items[i].Email, this.props.siteurl);
                if (res != null && res.data != null && res.data.value != null && res.data.value.length > 0) {
                  let likedItems = res.data.value.filter(e => e.EmployeeNameId == userId && e.LikeById == this.state.currentUserId && e.LikeFlag == true);
                  if (likedItems.length > 0) {
                    items[i].liked = true;
                  }
                }
              }
              this.setState({
                items: items
              });
            });
          }
          this.setState({
            isLoading: false
          });
        }
      }).catch(error => {
        console.log('error while getting data');
        console.log(error);
      });
    
  }

  //this method is used to show like count every two second
  private async getLikeCountInterval() {
    var anniversaryUsers = this.state.items;
    this.getLikeCount(anniversaryUsers);
    //for (let i = 0; i < bdayUsers.length; i++) {
    //  const likeCountQuery = "?$select=EmployeeName/EMail&$expand=EmployeeName/EMail&$filter=LikeFlag eq 1 and EmployeeName/EMail eq '" + bdayUsers[i].Email + "'";
    //  await commonObj.getDataFromList(this.props.siteurl, 'BirthdayLikeCount', likeCountQuery, "Get Like Count from List").then(async (resLikedItems) => {
    //    bdayUsers[i].likeCount = (resLikedItems != null && resLikedItems.data != null && resLikedItems.data.value != null) ? resLikedItems.data.value.length : 0;
    //  });
    //}
    //this.setState({
    //  items: bdayUsers
    //});
  }

    //Get total Likes AnniversaryPerson wise
  private async getLikeCount(anniversaryUsers) {
    let commonObj: Common = new Common();

    for (let i = 0; i < anniversaryUsers.length; i++) {
      const likeCountQuery = "?$select=EmployeeName/EMail&$expand=EmployeeName/EMail&$filter=LikeFlag eq 1 and EmployeeName/EMail eq '" + anniversaryUsers[i].Email + "'";
      await commonObj.getDataFromList(this.props.siteurl, 'AnniversaryLikeCount', likeCountQuery, "Get Like Count from List").then(async (resLikedItems) => {
        anniversaryUsers[i].likeCount = (resLikedItems != null && resLikedItems.data != null && resLikedItems.data.value != null) ? resLikedItems.data.value.length : 0;
      });
    }
    this.setState({
      items: anniversaryUsers
    });
  }


  // _OnBirthdayWish(eName, email) {
  //   console.log(eName);
  //   console.log(email);
  // }

  // _onRenderCoin(props: IPersonaProps): JSX.Element {
  //   const { coinSize, imageAlt, imageUrl } = props;
  //   return <img src={imageUrl} alt={imageAlt} width={coinSize} height={coinSize} className={customCoinClass} />;
  // }

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

  public render(): React.ReactElement<IAnniversaryProps> {
    var counter = 0;
    //Slider properties
    var settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 3000,
      nextArrow: <SampleNextArrow />,
      prevArrow: <SamplePrevArrow />,
      focusOnSelect: true,
      pauseOnHover: true
    };

    return (
      <div className={styles.anniversaries} >
        {(this.state.isLoading) ? <Loader message="Please wait..." /> :
          (this.state.items[0].FullName === "No Anniversary today")
            ?//If No Anniversaries are there it will show message of-"No Anniversaries today"
            <div>
              <h2>Happy Anniversary</h2>
              <div className="ms-Grid-row">
                <div className="ms-Grid-col ms-sm3 ms-md3">
                  <img src={`${this.props.siteurl}/_layouts/15/userphoto.aspx?size=L`} style={{ width: '100px' }} />
                </div>
                <div className="ms-Grid-col ms-sm9 ms-md9">
                  <div className={styles.birthdaydetails}>
                    <h3> No Anniversary today </h3>
                  </div>
                </div>
              </div>
            </div>
            ://If any Anniversary date is matched with today's date will Load the Birthday details of person and show in webpart
            <div className={styles.container}>
              <RSlider {...settings}>
                {
                  this.state.items.map((item, key) => {
                    return (
                      <div key={key} className={styles.birthdaypeople}>
                        <h2>Happy Anniversary</h2>
                        <div className="ms-Grid-row">
                          <div className="ms-Grid-col ms-sm3 ms-md3">
                            <img src={`${this.props.siteurl}/_layouts/15/userphoto.aspx?size=L&accountname=${item.Email}`} style={{ width: '100px' }} />
                          </div>
                          <div className="ms-Grid-col ms-sm9 ms-md9">
                            <div className={styles.birthdaydetails}>
                              <h3> {item.FullName} </h3>
                              <p> {item.Designation}</p>
                              <p> {item.userLocation}</p>
                              <p hidden={item.Email != "" ? false : true}>
                                <span>{item.likeCount}</span>
                                <button id={`${counter}`} onClick={(event) => this.alertme(item.Email, event)}>
                                  {this.likeDisLikeIcon(item.liked)}
                                </button>
                                <button name={`${counter}`} type="button" onClick={() => { this.ShowHideFunction(event) }}>
                                  <img src={`${commentIcon}`} className={styles.comment} />
                                </button>
                              </p>
                              <p>
                                <div className={styles.birthdaybtnshow} hidden={!item.showbutton ? true : false} >
                                  <textarea name={`${counter}`} typeof="comment" onChange={this.ChangeDataFunction} value={item.value}></textarea>
                                  <button name={`${counter}`} type="button" className={styles.button} onClick={() => { this.SendData(item.FullName, item.value, event) }}>Wish</button>
                                  <button name={`${counter++}`} type="button" className={styles.button} onClick={() => { this.clearData(event) }}>Clear</button>
                                </div>
                              </p>
                            </div>
                          </div>
                        </div>
                        {/* <Persona
                      text={item.FullName}
                      secondaryText="Software Engineer"
                      tertiaryText="Mumbai"
                      size={PersonaSize.size100}
                      coinSize={100}
                      onRenderCoin={this._onRenderCoin}
                      imageUrl={`${this.props.siteurl}/_layouts/15/userphoto.aspx?size=L&accountname=${item.Email}`} /> */}
                        {/* <Button onClick={() => this._OnBirthdayWish(item.FullName, item.Email)} title="Wish"><Icon iconName='BirthdayCake' ></Icon></Button> */}
                      </div>
                    )
                  })
                }
              </RSlider>
            </div>
        }
      </div>
    );
  }
    //By clicking LikeButton will store data of AnniversaryPerson,LikedBy person  with LikeFlag value true and unlike will set LikeFlag value false in in AnniversaryLikeCount sharepoint list
  public async alertme(userEmail, event) {
    let commonObj: Common = new Common();
    var tid = event.target.id;//Element Sequance Number
    let userId = await commonObj.getUserIdByEmail(userEmail, this.props.siteurl);//AnniversaryPerson
    var allItems = this.state.items;
    if (!this.state.items[tid].liked) {

      allItems[tid].likeCount++;//getting count of total likes of a bdayPerson and adding one 
      await this.GetLikeFlag(userEmail, this.props.currentUserEmail).then(res => {
        console.log(res);
        if (res.length > 0) {
          res.forEach(element => {
            var id = element.Id;
          //Update LikeFlag value to true in sharepoint List of AnniversaryLikeCount if current user click on like button
            sp.web.lists.getByTitle('AnniversaryLikeCount').items.getById(id).update({
              'LikeFlag': true,
            });
          });
          allItems[tid].liked = true;//change item liked state to true 

          this.setState({
            items: allItems,
          });
        }
        else {
          //If current user click on like button first time will add a new record and store that data in AnniversaryLikeCount list
          sp.web.lists.getByTitle("AnniversaryLikeCount").items.add({
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
      //If current user already clicked on like button it will Update LikeFlag value to false in sharepoint List of AnniversaryLikeCount
      allItems[tid].likeCount--;
      await this.GetLikeFlag(userEmail, this.props.currentUserEmail).then(res => {
        if (res != null && res.length > 0) {
          res.forEach(element => {
            var id = element.Id;
            console.log("listid" + id);
            sp.web.lists.getByTitle('AnniversaryLikeCount').items.getById(id).update({
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
    return commonObj.getDataFromList(this.props.siteurl, 'AnniversaryLikeCount', isLikedQuery, "Get Liked or not from List").then(async (resLikedItems) => {
      return resLikedItems.data.value;
    });

    // return axios.get(`${this.props.siteurl}/_api/web/lists/getbytitle('BirthdayLikeCount')/items`).then(response => {
    //   return response.data.value.filter(e => e.EmployeeNameId == eId && e.LikeById == currentUserId)
    // });
  }

  //This will store Details of AnniversaryPerson Name ,Wished By,Message in AnniversaryWishes sharepoint List
  public SendData(AnniversaryPerson, msg, e) {
    var res = msg.charAt(0);
    if (msg != null && res != (e.which == 32)) {//message should not be null or First charactor of message should not be space 
      sp.web.currentUser.get().then((r) => {
        var createdBy = r["Title"];

        sp.web.lists.getByTitle("AnniversaryWishes").items.add({
          'Title': AnniversaryPerson,
          'WishedBy': createdBy,
          'Wishes': msg,
        })
      });
      this.clearData(e);
      alert("data saved successfully");
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


function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", background: "#000", right: "0", top: "10px" }}
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
        ...style, display: "block", background: "#000", left: "92%", top: "10px", position: "absolute", zIndex: "1"
      }}
      onClick={onClick}
    />
  );
}


