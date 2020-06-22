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
import styles from './NewJoinees.module.scss';
import Common from '../../common/common';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { sp } from 'sp-pnp-js';
//import { CurrentUser } from '@pnp/sp/src/siteusers';
import axios from 'axios';
var commentIcon = require('../assets/comment.png');
var likeIcon = require('../assets/like-fill.png');
var dislikeIcon = require('../assets/like.png');
var NewJoinees = /** @class */ (function (_super) {
    __extends(NewJoinees, _super);
    function NewJoinees(props, state) {
        var _this = _super.call(this, props) || this;
        //Initialize the State
        _this.state = {
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
        sp.web.currentUser.get().then(function (r) {
            _this.setState({
            //  currentUserId: r["Id"]
            });
        });
        _this.ShowHideFunction = _this.ShowHideFunction.bind(_this);
        _this.ChangeDataFunction = _this.ChangeDataFunction.bind(_this);
        _this.clearData = _this.clearData.bind(_this);
        return _this;
    }
    NewJoinees.prototype.componentDidMount = function () {
        this.GetItemsForNewJoinee();
    };
    //get item from employee Master List for New Joinee
    NewJoinees.prototype.GetItemsForNewJoinee = function () {
        var _this = this;
        var newCommonObj = new Common();
        var listName = 'EmployeeMaster';
        var url = this.props.siteUrl;
        var method = 'get items for new Joinee';
        var query = "?$top=5 &$orderby=ID desc & $Filter=Status eq 'Active'"; //Filter Based on ID and Status
        newCommonObj.getDataFromList(url, listName, query, method).then(function (res) { return __awaiter(_this, void 0, void 0, function () {
            var items_1, liked, counter, IsLikeIdExists, LikeCountResponse, commonObj, items, index;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (res.data.value.length > 0) {
                            items_1 = res.data.value;
                            // this.setState({ items });
                        }
                        liked = [];
                        counter = 0;
                        IsLikeIdExists = [];
                        commonObj = new Common();
                        items = this.state.items;
                        return [4 /*yield*/, axios.get(this.props.siteUrl + "/_api/web/lists/getbytitle('BirthdayLikeCount')/items()?$filter=(LikeFlag eq 1)").then(function (Response) {
                                Response.data.value.forEach(function (element) {
                                    if (IsLikeIdExists.indexOf(element.EmployeeNameId) === -1) {
                                        IsLikeIdExists.push(element.EmployeeNameId);
                                    }
                                });
                            })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, commonObj.getDataFromList(this.props.siteUrl, 'BirthdayLikeCount', '', "Get Birthday Like Count").then(function (res) { return __awaiter(_this, void 0, void 0, function () {
                                var _loop_1, i;
                                var _this = this;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            _loop_1 = function (i) {
                                                var userId, likedItems;
                                                return __generator(this, function (_a) {
                                                    switch (_a.label) {
                                                        case 0: return [4 /*yield*/, commonObj.getUserIdByEmail(items[i].Email)];
                                                        case 1:
                                                            userId = _a.sent();
                                                            if (res != null && res.data != null && res.data.value != null && res.data.value.length > 0) {
                                                                likedItems = res.data.value.filter(function (e) { return e.EmployeeNameId == userId && e.LikeById == _this.state.currentUserId && e.LikeFlag == true; });
                                                                if (likedItems.length > 0) {
                                                                    liked.push(counter);
                                                                }
                                                                counter++;
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
                                        case 4: return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 2:
                        _a.sent();
                        for (index = 0; index < liked.length; index++) {
                            items[liked[index]].liked = true;
                            this.setState({
                            //  items: items
                            });
                        }
                        return [2 /*return*/];
                }
            });
        }); }).catch(function (error) {
            console.log('error while getting data');
            console.log(error);
        });
    };
    // _onRenderCoin(props: IPersonaProps): JSX.Element {
    //   const { coinSize, imageAlt, imageUrl } = props;
    //   return <img src={imageUrl} alt={imageAlt} width={coinSize} height={coinSize} className={customCoinClass} />;
    // }
    NewJoinees.prototype.ShowHideFunction = function (e) {
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
    };
    NewJoinees.prototype.clearData = function (e) {
        var allItems = this.state.items;
        allItems[e.target.name].value = "";
        allItems[e.target.name].showbutton = false;
        this.setState({
            items: allItems
        });
    };
    NewJoinees.prototype.ChangeDataFunction = function (e) {
        var allItems = this.state.items;
        allItems[e.target.name].value = e.target.value;
        // this.setState({ items: allItems });
    };
    NewJoinees.prototype.render = function () {
        var _this = this;
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
            nextArrow: React.createElement(SampleNextArrow, null),
            prevArrow: React.createElement(SamplePrevArrow, null),
            focusOnSelect: true,
            pauseOnHover: true
        };
        return (React.createElement("div", { className: styles.newJoinees }, 
        // If data is null then will show message of "No New Joinee is there"
        (this.state.items[0].FullName === "No New Joinee is there")
            ?
                React.createElement("div", { className: styles.container },
                    React.createElement("h2", null, "Welcome aboard"),
                    React.createElement("div", { className: "ms-Grid-row" },
                        React.createElement("div", { className: "ms-Grid-col ms-sm3 ms-md3" },
                            React.createElement("img", { src: this.props.siteUrl + "/_layouts/15/userphoto.aspx?size=L", style: { width: '100px' } })),
                        React.createElement("div", { className: "ms-Grid-col ms-sm9 ms-md9" },
                            React.createElement("div", { className: styles.birthdaydetails },
                                React.createElement("h3", null, " No New Joinee is there ")))))
            :
                React.createElement("div", { className: styles.container },
                    React.createElement("h2", null, "Welcome aboard"),
                    React.createElement(Slider, __assign({}, settings), this.state.items.map(function (item, key) {
                        return (React.createElement("div", { key: key, className: styles.birthdaypeople },
                            React.createElement("div", { className: "ms-Grid-row" },
                                React.createElement("div", { className: "ms-Grid-col ms-sm3 ms-md3" },
                                    React.createElement("img", { src: _this.props.siteUrl + "/_layouts/15/userphoto.aspx?size=L&accountname=" + item.Email, style: { width: '100px' } })),
                                React.createElement("div", { className: "ms-Grid-col ms-sm9 ms-md9" },
                                    React.createElement("div", { className: styles.birthdaydetails },
                                        React.createElement("h3", null,
                                            " ",
                                            item.FullName,
                                            " "),
                                        React.createElement("p", null, " Software Engineer"),
                                        React.createElement("p", null, " Mumbai"),
                                        React.createElement("p", null,
                                            React.createElement("button", { id: "" + counter, onClick: function (event) { return _this.alertme(item.Email, event, item.ID); } },
                                                React.createElement("img", { src: "" + likeIcon, className: styles.like })),
                                            React.createElement("button", { name: "" + counter, type: "button", onClick: function () { _this.ShowHideFunction(event); } },
                                                React.createElement("img", { src: "" + commentIcon, className: styles.comment }))),
                                        React.createElement("p", null,
                                            React.createElement("div", { className: styles.birthdaybtnshow, hidden: !item.showbutton ? true : false },
                                                React.createElement("textarea", { name: "" + counter, typeof: "comment", onChange: _this.ChangeDataFunction, value: item.value }),
                                                React.createElement("button", { name: "" + counter, type: "button", className: styles.button, onClick: function () { _this.SendData(item.FullName, item.value, event); } }, "Wish"),
                                                React.createElement("button", { name: "" + counter++, type: "button", className: styles.button, onClick: function () { _this.clearData(event); } }, "Clear"))))))));
                    })))));
    };
    NewJoinees.prototype.alertme = function (userEmail, event, ids) {
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
                        if (!this.state.items[tid].liked) {
                            // allItems[tid].likeCount++;
                            this.GetLikeFlag(userId, this.state.currentUserId).then(function (res) {
                                //  debugger
                                console.log(res);
                                if (res.length > 0) {
                                    res.forEach(function (element) {
                                        var id = element.Id;
                                        sp.web.lists.getByTitle('BirthdayLikeCount').items.getById(id).update({
                                            'LikeFlag': true,
                                        });
                                    });
                                    allItems[tid].liked = true;
                                    _this.setState({
                                    // items: allItems,
                                    });
                                }
                                else {
                                    sp.web.lists.getByTitle("BirthdayLikeCount").items.add({
                                        //'Title': "Birthday",
                                        LikeFlag: true,
                                        LikeById: Number(_this.state.currentUserId),
                                        EmployeeNameId: Number(userId),
                                    }).then(function (res) {
                                        allItems[tid].liked = true;
                                        _this.setState({
                                        //  items: allItems,
                                        });
                                    }).catch(function (error) {
                                        alert('Error while creating the item: ' + error);
                                    });
                                }
                            });
                        }
                        else {
                            // allItems[tid].likeCount--;
                            this.GetLikeFlag(userId, this.state.currentUserId).then(function (res) {
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
                                // items: allItems,
                                });
                            });
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    NewJoinees.prototype.GetLikeFlag = function (eId, currentUserId) {
        return axios.get(this.props.siteUrl + "/_api/web/lists/getbytitle('BirthdayLikeCount')/items").then(function (response) {
            return response.data.value.filter(function (e) { return e.EmployeeNameId == eId && e.LikeById == currentUserId; });
        });
    };
    NewJoinees.prototype.SendData = function (BirthdayPerson, msg, e) {
        var res = msg.charAt(0);
        if (msg != null && res != (e.which == 32)) {
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
    return NewJoinees;
}(React.Component));
export default NewJoinees;
function SampleNextArrow(props) {
    var className = props.className, style = props.style, onClick = props.onClick;
    return (React.createElement("div", { className: className, style: __assign({}, style, { display: "block", background: "#000", right: "10px", top: "10px" }), onClick: onClick }));
}
function SamplePrevArrow(props) {
    var className = props.className, style = props.style, onClick = props.onClick;
    return (React.createElement("div", { className: className, style: __assign({}, style, { display: "block", background: "#000", left: "92%", top: "10px", position: "absolute", zIndex: "1" }), onClick: onClick }));
}
//# sourceMappingURL=NewJoinees.js.map