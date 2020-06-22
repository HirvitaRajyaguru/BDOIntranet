import * as React from 'react';
import styles from './NewJoinees.module.scss';
import { INewJoineesProps } from './INewJoineesProps';
import { escape } from '@microsoft/sp-lodash-subset';

import Common from '../../common/common';
import { INewJoineeState } from './INewJoineeState';
import { mergeStyles } from 'office-ui-fabric-react/lib/Styling';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { Button, Icon } from 'office-ui-fabric-react';

import { sp, Items } from 'sp-pnp-js';
//import { CurrentUser } from '@pnp/sp/src/siteusers';
import axios from 'axios';

const commentIcon: any = require('../assets/comment.png');
const likeIcon: any = require('../assets/like-fill.png');
const dislikeIcon: any = require('../assets/like.png');


export default class NewJoinees extends React.Component<INewJoineesProps, INewJoineeState> {
  public constructor(props: INewJoineesProps, state: INewJoineeState) {
    super(props);
    //Initialize the State
    this.state = {
      items: [
        {
          FullName: "No New Joinee is there",
          Email: "",
          DateofJoining: "",
          Status: "",
          Designation: "",
          userLocation: "",
          showbutton: false,
          value: "",
          ID: 0,
          liked: false,
          LikeFlag: null,
          likeCount: 0,
          DateOfBirth: ""
        }
      ],
      currentUserId: null,
      likes: 0,
      updated: false
    };

    sp.web.currentUser.get().then((r: any) => {
      this.setState({
        //  currentUserId: r["Id"]
      })
    });

    this.ShowHideFunction = this.ShowHideFunction.bind(this);
    this.ChangeDataFunction = this.ChangeDataFunction.bind(this);
    this.clearData = this.clearData.bind(this);
  }

  public componentDidMount() {
    this.GetItemsForNewJoinee();
  }
  //get item from employee Master List for New Joinee
  public GetItemsForNewJoinee() {
    let newCommonObj: Common = new Common();
    var listName = 'EmployeeMaster';
    var url = this.props.siteUrl;
    var method = 'get items for new Joinee';
    var query = `?$top=5 &$orderby=ID desc &$Filter=Status eq 'Active'`; //Filter Based on ID and Status
    newCommonObj.getDataFromList(url, listName, query, method).then(async res => {
      if (res.data.value.length > 0) {
        const items = res.data.value;
         this.setState({ items });
      }

      var liked = [];
      var counter = 0;
      var IsLikeIdExists = [];
      var LikeCountResponse;
      let commonObj: Common = new Common();
      var items = this.state.items;

      await axios.get(`${this.props.siteUrl}/_api/web/lists/getbytitle('BirthdayLikeCount')/items()?$filter=(LikeFlag eq 1)`).then(Response => {
        Response.data.value.forEach(element => {
          if (IsLikeIdExists.indexOf(element.EmployeeNameId) === -1) {
            IsLikeIdExists.push(element.EmployeeNameId);
          }
        });
      });


      await commonObj.getDataFromList(this.props.siteUrl, 'BirthdayLikeCount', '', "Get Birthday Like Count").then(async (res) => {
        for (let i = 0; i < items.length; i++) {
          let userId = await commonObj.getUserIdByEmail(items[i].Email, this.props.siteUrl);
          if (res != null && res.data != null && res.data.value != null && res.data.value.length > 0) {
            let likedItems = res.data.value.filter(e => e.EmployeeNameId == userId && e.LikeById == this.state.currentUserId && e.LikeFlag == true);
            if (likedItems.length > 0) {
              liked.push(counter);
            }
            counter++;
          }

        }

      });

      for (let index = 0; index < liked.length; index++) {
        items[liked[index]].liked = true;
        this.setState({
          //  items: items
        });
      }

    }).catch(error => {
      console.log('error while getting data');
      console.log(error);
    });
  }

  // _onRenderCoin(props: IPersonaProps): JSX.Element {
  //   const { coinSize, imageAlt, imageUrl } = props;
  //   return <img src={imageUrl} alt={imageAlt} width={coinSize} height={coinSize} className={customCoinClass} />;
  // }


  ShowHideFunction(e) {
    var allItems = this.state.items;
    if (!allItems[e.target.name].showbutton) {
      allItems[e.target.name].showbutton = true;
    }
    else {
      allItems[e.target.name].showbutton = false;

    }
    this.setState({
      // items: allItems
    });
  }

  clearData(e) {
    var allItems = this.state.items;
    allItems[e.target.name].value = "";
    allItems[e.target.name].showbutton = false;
    this.setState({
      items: allItems
    });

  }

  public ChangeDataFunction(e) {
    var allItems = this.state.items;
    allItems[e.target.name].value = e.target.value;
    // this.setState({ items: allItems });
  }

  public render(): React.ReactElement<INewJoineesProps> {
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
      <div className={styles.newJoinees}>
        {
          // If data is null then will show message of "No New Joinee is there"

          (this.state.items[0].FullName === "No New Joinee is there")
            ?
            <div className={styles.container}>
              <h2>Welcome aboard</h2>


              <div className="ms-Grid-row">
                <div className="ms-Grid-col ms-sm3 ms-md3">
                  <img src={`${this.props.siteUrl}/_layouts/15/userphoto.aspx?size=L`} style={{ width: '100px' }} />
                </div>
                <div className="ms-Grid-col ms-sm9 ms-md9">
                  <div className={styles.birthdaydetails}>
                    <h3> No New Joinee is there </h3>
                  </div>
                </div>
              </div>
            </div>
            :
            <div className={styles.container}>
              <h2>Welcome aboard</h2>
              <Slider {...settings}>
                {
                  this.state.items.map((item, key) => {
                    return (
                      <div key={key} className={styles.birthdaypeople}>
                        <div className="ms-Grid-row">
                          <div className="ms-Grid-col ms-sm3 ms-md3">
                            <img src={`${this.props.siteUrl}/_layouts/15/userphoto.aspx?size=L&accountname=${item.Email}`} style={{ width: '100px' }} />
                          </div>
                          <div className="ms-Grid-col ms-sm9 ms-md9">
                            <div className={styles.birthdaydetails}>
                              <h3> {item.FullName} </h3>
                              <p> Software Engineer</p>
                              <p> Mumbai</p>
                              <p>
                                <button id={`${counter}`} onClick={(event) => this.alertme(item.Email, event, item.ID)}>
                                  <img src={`${likeIcon}`} className={styles.like} />
                                  {/* <img src={`${dislikeIcon}`} className={styles.like} /> */}
                                  {/* {(item.likeCount)} */}
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
                          secondaryText={item.DateofJoining}
                          size={PersonaSize.size72}
                          coinSize={72}
                          onRenderCoin={this._onRenderCoin}
                          imageUrl={`${this.props.siteUrl}/_layouts/15/userphoto.aspx?size=L&accountname=${item.Email}`} />
                        <Button title="Wish"><Icon iconName='Greetingcard' ></Icon></Button> */}
                      </div>
                    )
                  })
                }
              </Slider>
            </div>
        }
      </div>

    );
  }

  public async alertme(userEmail, event, ids) {
    let commonObj: Common = new Common();
    var tid = event.target.id;
    let userId = await commonObj.getUserIdByEmail(userEmail, this.props.siteUrl);
    var allItems = this.state.items;
    if (!this.state.items[tid].liked) {

      // allItems[tid].likeCount++;
      this.GetLikeFlag(userId, this.state.currentUserId).then(res => {
        console.log(res);
        if (res.length > 0) {
          res.forEach(element => {
            var id = element.Id;
            sp.web.lists.getByTitle('BirthdayLikeCount').items.getById(id).update({
              'LikeFlag': true,
            });
          });
          allItems[tid].liked = true;

          this.setState({
            // items: allItems,
          });
        }
        else {

          sp.web.lists.getByTitle("BirthdayLikeCount").items.add({
            //'Title': "Birthday",
            LikeFlag: true,
            LikeById: Number(this.state.currentUserId),
            EmployeeNameId: Number(userId),
          }).then(res => {

            allItems[tid].liked = true;
            this.setState({
              //  items: allItems,
            });
          }).catch(error => {

            alert('Error while creating the item: ' + error);
          });
        }
      });
    } else {
      // allItems[tid].likeCount--;
      this.GetLikeFlag(userId, this.state.currentUserId).then(res => {
        if (res != null && res.length > 0) {
          res.forEach(element => {
            var id = element.Id;
            console.log("listid" + id);
            sp.web.lists.getByTitle('BirthdayLikeCount').items.getById(id).update({
              'LikeFlag': false,
            });
          });
        }
        allItems[tid].liked = false;
        this.setState({
          // items: allItems,
        });
      });
    }
  }

  private GetLikeFlag(eId, currentUserId): Promise<any> {
    return axios.get(`${this.props.siteUrl}/_api/web/lists/getbytitle('BirthdayLikeCount')/items`).then(response => {
      return response.data.value.filter(e => e.EmployeeNameId == eId && e.LikeById == currentUserId)
    });
  }

  public SendData(BirthdayPerson, msg, e) {
    var res = msg.charAt(0);
    if (msg != null && res != (e.which == 32)) {
      sp.web.currentUser.get().then((r) => {
        var createdBy = r["Title"];

        sp.web.lists.getByTitle("BirthdayWishes").items.add({
          'Title': BirthdayPerson,
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
}

function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", background: "#000", right: "10px", top: "10px" }}
      onClick={onClick}
    />
  );
}

function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", background: "#000", left: "92%", top: "10px", position: "absolute", zIndex: "1" }}
      onClick={onClick}
    />
  );
}
