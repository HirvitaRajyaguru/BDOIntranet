var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import * as React from 'react';
import styles from './Birthdays.module.scss';
import Common from '../../common/common';
import { Loader } from '../../common/Loading';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { sp, Web } from 'sp-pnp-js';
var commentIcon = require('../assets/comment.png');
var likeIcon = require('../assets/like-fill.png');
var dislikeIcon = require('../assets/like.png');
var celebrationIcon = require('../assets/celebration.png');
// const customCoinClass = mergeStyles({
//   borderRadius: 0,
//   display: 'block',
//   height: '75px',
//   width: '100px'
// });
//var getyear = new Date().getFullYear();
var Birthdays = /** @class */ (function (_super) {
    __extends(Birthdays, _super);
    function Birthdays(props, state) {
        var _this = _super.call(this, props) || this;
        console.log(_this.props.records);
        //Initialize the State
        _this.state = {
            isLoading: true,
            items: [
                {
                    FullName: "No Birthday today",
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
            sliced: false,
            records: _this.props.records,
        };
        _this.ShowHideFunction = _this.ShowHideFunction.bind(_this);
        _this.ChangeDataFunction = _this.ChangeDataFunction.bind(_this);
        _this.clearData = _this.clearData.bind(_this);
        return _this;
    }
    Birthdays.prototype.componentDidMount = function () {
        return __awaiter(this, void 0, void 0, function () {
            var web;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('..componentDidMount');
                        console.log(this.state.records);
                        web = new Web(this.props.siteurl);
                        return [4 /*yield*/, web.currentUser.get().then(function (r) {
                                _this.setState({
                                    currentUserId: r["Id"]
                                });
                            })];
                    case 1:
                        _a.sent();
                        this.GetItemsForBirthday();
                        return [2 /*return*/];
                }
            });
        });
    };
    //will call it whenever props are changed
    Birthdays.prototype.componentWillReceiveProps = function (nextProps) {
        debugger;
        this.setState({
            records: nextProps.records
        });
        this.GetItemsForBirthday();
    };
    Birthdays.prototype.componentWillUnmount = function () {
        // clearInterval(intervalID);
    };
    ////Get User Profile data from Azure AD using Graph API
    Birthdays.prototype.GetDataUsingGraphAPI = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.props.msGraphClient
                            .api("/users")
                            .get().then(function (res) {
                            console.log('userResponse', res);
                            debugger;
                            return res;
                        }).catch(function (error) {
                            console.log(error);
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    //Will Fetch the Birthday data from EmployeeMaster Sharepoint List
    Birthdays.prototype.GetItemsForBirthday = function () {
        var _this = this;
        var newCommonObj = new Common();
        var url = this.props.siteurl;
        var method = 'get items for Birthday';
        //var listname = 'EmployeeMaster';
        var listId = this.props.listId;
        if (this.props.Practices == true)
            var query = '?$top=1000';
        else
            var query = '?$top=1000';
        newCommonObj.getDataFromListUsingGuid(url, listId, query, method).then(function (res) { return __awaiter(_this, void 0, void 0, function () {
            var dataFiltered, commonObj_1, items;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(res.data.value != undefined && res.data.value != null)) return [3 /*break*/, 4];
                        dataFiltered = res.data.value.filter(function (data) { return new Date(data.DateOfBirth).getDate() == new Date().getDate() && new Date(data.DateOfBirth).getMonth() == new Date().getMonth() && data.Status == "Active"; });
                        if (!(dataFiltered != undefined && dataFiltered != null && dataFiltered.length > 0)) return [3 /*break*/, 3];
                        if (dataFiltered.length > this.state.records) {
                            dataFiltered = dataFiltered.slice(0, 3);
                            this.setState({
                                sliced: true
                            });
                        }
                        this.setState({
                            items: dataFiltered
                        });
                        ////Get Like count from BirthdayLikeCount list
                        return [4 /*yield*/, this.getLikeCount(this.state.items)];
                    case 1:
                        ////Get Like count from BirthdayLikeCount list
                        _a.sent();
                        commonObj_1 = new Common();
                        items = this.state.items;
                        ////Get Bithday is-liked or not by current user for all Birthday Persons in slider
                        return [4 /*yield*/, commonObj_1.getDataFromList(this.props.siteurl, 'BirthdayLikeCount', '', "Get Birthday Like Count").then(function (res) { return __awaiter(_this, void 0, void 0, function () {
                                var _loop_1, i;
                                var _this = this;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            _loop_1 = function (i) {
                                                var userId, likedItems;
                                                return __generator(this, function (_a) {
                                                    switch (_a.label) {
                                                        case 0: return [4 /*yield*/, commonObj_1.getUserIdByEmail(items[i].Email)];
                                                        case 1:
                                                            userId = _a.sent();
                                                            if (res != null && res.data != null && res.data.value != null && res.data.value.length > 0) {
                                                                likedItems = res.data.value.filter(function (e) { return e.EmployeeNameId == userId && e.LikeById == _this.state.currentUserId && e.LikeFlag == true; });
                                                                if (likedItems.length > 0) {
                                                                    items[i].liked = true;
                                                                }
                                                            }
                                                            return [2 /*return*/];
                                                    }
                                                });
                                            };
                                            i = 0;
                                            _a.label = 1;
                                        case 1:
                                            if (!(i < items.length)) return [3 /*break*/, 4];
                                            return [5 /*yield**/, _loop_1(i)];
                                        case 2:
                                            _a.sent();
                                            _a.label = 3;
                                        case 3:
                                            i++;
                                            return [3 /*break*/, 1];
                                        case 4:
                                            this.setState({
                                                items: items
                                            });
                                            return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 2:
                        ////Get Bithday is-liked or not by current user for all Birthday Persons in slider
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        this.setState({
                            isLoading: false
                        });
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        }); }).catch(function (error) {
            console.log('error while getting data');
            console.log(error);
        });
    };
    //this method is used to show like count every two second
    Birthdays.prototype.getLikeCountInterval = function () {
        return __awaiter(this, void 0, void 0, function () {
            var bdayUsers;
            return __generator(this, function (_a) {
                bdayUsers = this.state.items;
                this.getLikeCount(bdayUsers);
                return [2 /*return*/];
            });
        });
    };
    //Get total Likes BirthdayPerson personwise
    Birthdays.prototype.getLikeCount = function (bdayUsers) {
        return __awaiter(this, void 0, void 0, function () {
            var commonObj, _loop_2, this_1, i;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        commonObj = new Common();
                        _loop_2 = function (i) {
                            var likeCountQuery;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        likeCountQuery = "?$select=EmployeeName/EMail&$expand=EmployeeName/EMail&$filter=LikeFlag eq 1 and EmployeeName/EMail eq '" + bdayUsers[i].Email + "'";
                                        return [4 /*yield*/, commonObj.getDataFromList(this_1.props.siteurl, 'BirthdayLikeCount', likeCountQuery, "Get Like Count from List").then(function (resLikedItems) { return __awaiter(_this, void 0, void 0, function () {
                                                return __generator(this, function (_a) {
                                                    bdayUsers[i].likeCount = (resLikedItems != null && resLikedItems.data != null && resLikedItems.data.value != null) ? resLikedItems.data.value.length : 0;
                                                    return [2 /*return*/];
                                                });
                                            }); })];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < bdayUsers.length)) return [3 /*break*/, 4];
                        return [5 /*yield**/, _loop_2(i)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4:
                        this.setState({
                            items: bdayUsers
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    // _OnBirthdayWish(eName, email) {
    //   console.log(eName);
    //   console.log(email);
    // }
    // _onRenderCoin(props: IPersonaProps): JSX.Element {
    //   const { coinSize, imageAlt, imageUrl } = props;
    //   return <img src={imageUrl} alt={imageAlt} width={coinSize} height={coinSize} className={customCoinClass} />;
    // }
    ////Comment ToogleButton to show/hide Textarea and sendButton
    Birthdays.prototype.ShowHideFunction = function (e) {
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
    };
    //Clear comment Textarea 
    Birthdays.prototype.clearData = function (e) {
        var allItems = this.state.items;
        allItems[e.target.name].value = "";
        allItems[e.target.name].showbutton = false;
        this.setState({
            items: allItems
        });
    };
    //all the textbox value will store in setstate value variable whenever new text is entered in textbox and reset state value
    Birthdays.prototype.ChangeDataFunction = function (e) {
        var allItems = this.state.items;
        allItems[e.target.name].value = e.target.value;
        this.setState({ items: allItems });
    };
    Birthdays.prototype.render = function () {
        var _this = this;
        var counter = 0;
        return (React.createElement("div", { className: styles.birthdays }, (this.state.isLoading) ? React.createElement(Loader, { message: "Please wait..." }) :
            (this.state.items[0].FullName === "No Birthday today")
                ? //If No Birthdays are there it will show message of-"No Birthday today"
                    React.createElement("div", null,
                        React.createElement("h2", null, "Happy Birthday"),
                        React.createElement("div", { className: "ms-Grid-row" },
                            React.createElement("div", { className: "ms-Grid-col ms-sm3 ms-md3" },
                                React.createElement("img", { src: this.props.siteurl + "/_layouts/15/userphoto.aspx?size=L", style: { width: '100px' } })),
                            React.createElement("div", { className: "ms-Grid-col ms-sm9 ms-md9" },
                                React.createElement("div", { className: styles.birthdaydetails },
                                    React.createElement("h3", null, " No Birthday today ")))))
                : //If any Birthday date is matched with today's date will Load the Birthday details of person and show in webpart
                    React.createElement("div", { className: styles.container },
                        React.createElement("h2", null, "Happy Birthday"),
                        this.state.items.map(function (item, key) {
                            return (React.createElement("div", null,
                                React.createElement("div", { key: key, className: styles.birthdaypeople },
                                    React.createElement("div", { className: "ms-Grid-row" },
                                        React.createElement("div", { className: "ms-Grid-col ms-sm9 ms-md9" },
                                            React.createElement("div", { className: styles.birthdaydetails },
                                                React.createElement("h3", null,
                                                    " ",
                                                    item.FullName,
                                                    " "),
                                                React.createElement("p", null,
                                                    " ",
                                                    item.Designation),
                                                React.createElement("p", null,
                                                    " ",
                                                    item.userLocation),
                                                React.createElement("p", { hidden: item.Email != "" ? false : true },
                                                    React.createElement("span", null, item.likeCount),
                                                    React.createElement("button", { id: "" + counter, onClick: function (event) { return _this.alertme(item.Email, event); } }, _this.likeDisLikeIcon(item.liked)),
                                                    React.createElement("button", { name: "" + counter, type: "button", onClick: function () { _this.ShowHideFunction(event); } },
                                                        React.createElement("img", { src: "" + commentIcon, className: styles.comment }))),
                                                React.createElement("p", null,
                                                    React.createElement("div", { className: styles.birthdaybtnshow, hidden: !item.showbutton ? true : false },
                                                        React.createElement("textarea", { name: "" + counter, typeof: "comment", onChange: _this.ChangeDataFunction, value: item.value }),
                                                        React.createElement("button", { name: "" + counter, type: "button", className: styles.button, onClick: function () { _this.SendData(item.FullName, item.value, event); } }, "Wish"),
                                                        React.createElement("button", { name: "" + counter++, type: "button", className: styles.button, onClick: function () { _this.clearData(event); } }, "Clear")))))))));
                        }),
                        (this.state.records != "All" && this.state.sliced) ? React.createElement("a", { href: "#" }, "view more") : "")));
    };
    //By clicking LikeButton will store data of BirthdayPerson,LikedBy person  with LikeFlag value true and unlike will set LikeFlag value false in in BirthdayLikeCount sharepoint list
    Birthdays.prototype.alertme = function (userEmail, event) {
        return __awaiter(this, void 0, void 0, function () {
            var commonObj, tid, userId, allItems;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        commonObj = new Common();
                        tid = event.target.id;
                        return [4 /*yield*/, commonObj.getUserIdByEmail(userEmail)];
                    case 1:
                        userId = _a.sent();
                        allItems = this.state.items;
                        if (!!this.state.items[tid].liked) return [3 /*break*/, 3];
                        allItems[tid].likeCount++; //getting count of total likes of a bdayPerson and adding one 
                        return [4 /*yield*/, this.GetLikeFlag(userEmail, this.props.currentUserEmail).then(function (res) {
                                console.log(res);
                                if (res.length > 0) {
                                    res.forEach(function (element) {
                                        var id = element.Id;
                                        //Update LikeFlag value to true in sharepoint List of BirthdayLikeCount if current user click on like button
                                        sp.web.lists.getByTitle('BirthdayLikeCount').items.getById(id).update({
                                            'LikeFlag': true,
                                        });
                                    });
                                    allItems[tid].liked = true; //change item liked state to true 
                                    _this.setState({
                                        items: allItems,
                                    });
                                }
                                else {
                                    //If current user click on like button first time will add a new record and store that data in BirthdayLikeCount list
                                    sp.web.lists.getByTitle("BirthdayLikeCount").items.add({
                                        LikeFlag: true,
                                        LikeById: _this.state.currentUserId,
                                        EmployeeNameId: userId,
                                    }).then(function (res) {
                                        allItems[tid].liked = true;
                                        _this.setState({
                                            items: allItems,
                                        });
                                    }).catch(function (error) {
                                        alert('Error while creating the item: ' + error);
                                    });
                                }
                            })];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 3:
                        //If current user already clicked on like button it will Update LikeFlag value to false in sharepoint List of BirthdayLikeCount
                        allItems[tid].likeCount--; //getting count of total likes of a bdayPerson and substrating one 
                        return [4 /*yield*/, this.GetLikeFlag(userEmail, this.props.currentUserEmail).then(function (res) {
                                if (res != null && res.length > 0) {
                                    res.forEach(function (element) {
                                        var id = element.Id;
                                        console.log("listid" + id);
                                        sp.web.lists.getByTitle('BirthdayLikeCount').items.getById(id).update({
                                            'LikeFlag': false,
                                        });
                                    });
                                }
                                allItems[tid].liked = false;
                                _this.setState({
                                    items: allItems,
                                });
                            })];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    //Check for already Liked By Current User For the Person
    Birthdays.prototype.GetLikeFlag = function (empEmail, currentUserEmail) {
        var _this = this;
        var commonObj = new Common();
        var isLikedQuery = "?$select=Id,EmployeeName/EMail,LikeBy/EMail&$expand=EmployeeName/EMail,LikeBy/EMail&$filter=EmployeeName/EMail eq '" + empEmail + "' and LikeBy/EMail eq '" + currentUserEmail + "'";
        return commonObj.getDataFromList(this.props.siteurl, 'BirthdayLikeCount', isLikedQuery, "Get Liked or not from List").then(function (resLikedItems) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, resLikedItems.data.value];
            });
        }); });
        // return axios.get(`${this.props.siteurl}/_api/web/lists/getbytitle('BirthdayLikeCount')/items`).then(response => {
        //   return response.data.value.filter(e => e.EmployeeNameId == eId && e.LikeById == currentUserId)
        // });
    };
    //This will store Details of Bdyperson Name ,Wished By,BdayMessage in BirthdayWishes sharepoint List
    Birthdays.prototype.SendData = function (BirthdayPerson, msg, e) {
        var res = msg.charAt(0);
        if (msg != null && res != (e.which == 32)) { //message should not be null or First charactor of message should not be space 
            sp.web.currentUser.get().then(function (r) {
                var createdBy = r["Title"];
                sp.web.lists.getByTitle("BirthdayWishes").items.add({
                    'Title': BirthdayPerson,
                    'WishedBy': createdBy,
                    'Wishes': msg,
                });
            });
            this.clearData(e);
            alert("data saved successfully");
        }
        else {
            alert("Space is not allowed at first char");
        }
    };
    Birthdays.prototype.likeDisLikeIcon = function (isLiked) {
        if (isLiked) {
            return (React.createElement("img", { src: "" + likeIcon, className: styles.like }));
        }
        else {
            return (React.createElement("img", { src: "" + dislikeIcon, className: styles.like }));
        }
    };
    return Birthdays;
}(React.Component));
export default Birthdays;
function SampleNextArrow(props) {
    var className = props.className, style = props.style, onClick = props.onClick;
    return (React.createElement("div", { className: className, style: __assign({}, style, { display: "block", background: "#000", right: "0", top: "10px" }), onClick: onClick }));
}
function SamplePrevArrow(props) {
    var className = props.className, style = props.style, onClick = props.onClick;
    return (React.createElement("div", { className: className, style: __assign({}, style, { display: "block", background: "#000", left: "92%", top: "10px", position: "absolute", zIndex: "1" }), onClick: onClick }));
}
//# sourceMappingURL=Birthdays.js.map