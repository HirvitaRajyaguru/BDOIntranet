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
import styles from './Insights.module.scss';
import Moment from 'react-moment';
import 'moment-timezone';
import common from '../../common/common';
import { Loader } from '../../common/Loading';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import RSlider from "react-slick";
function SampleNextArrow(props) {
    var className = props.className, style = props.style, onClick = props.onClick;
    return (React.createElement("div", { className: className, style: __assign({}, style, { display: "block", background: "#000", right: "0", top: "10px" }), onClick: onClick }));
}
function SamplePrevArrow(props) {
    var className = props.className, style = props.style, onClick = props.onClick;
    return (React.createElement("div", { className: className, style: __assign({}, style, { display: "block", background: "#000", left: "92%", top: "10px", position: "absolute", zIndex: "1" }), onClick: onClick }));
}
var Insights = /** @class */ (function (_super) {
    __extends(Insights, _super);
    function Insights(props, state) {
        var _this = _super.call(this, props) || this;
        //Initialize the State
        _this.state = {
            isLoading: true,
            //State that containd the imagse
            images: [{
                    Image: {
                        "Url": "",
                        "Description": "",
                    }
                }],
            //Columns that are used in the webpart from the list
            items: [
                {
                    "AnnouncementDate": null,
                    "ExpiryDate": null,
                    "Title": "No Insights to display.",
                    "Description": "",
                    RespectivePageLink: {
                        Url: ''
                    }
                }
            ]
        };
        return _this;
    }
    Insights.prototype.componentDidMount = function () {
        this.GetItemsFromInsights();
    };
    Insights.prototype.componentWillReceiveProps = function (nextProps) {
        this.GetItemsFromInsights();
    };
    //get Items of Insights and Banner both
    Insights.prototype.GetItemsFromInsights = function () {
        return __awaiter(this, void 0, void 0, function () {
            var yesterday, Url, method, listId, newCommonObj, query, Url, listName, method;
            var _this = this;
            return __generator(this, function (_a) {
                yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                Url = this.props.siteurl;
                method = 'get items for Insights';
                listId = this.props.listId;
                newCommonObj = new common();
                //filter for expirydate and data will display in descending order, orderby announcement date and it will show top 5 data 
                if (this.props.Practices == true)
                    query = "?$Filter=ExpiryDate ge datetime'" + yesterday.toISOString() + "'&$orderby=AnnouncementDate desc&$top=5";
                else
                    query = "?$Filter=ExpiryDate ge datetime'" + yesterday.toISOString() + "'&$orderby=AnnouncementDate desc&$top=5";
                newCommonObj.getDataFromListUsingGuid(Url, listId, query, method).then(function (res) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        if (res.data.value != undefined && res.data.value != null) {
                            this.setState({ items: res.data.value });
                        }
                        return [2 /*return*/];
                    });
                }); }).catch(function (error) {
                    console.log(error);
                });
                Url = this.props.siteurl;
                listName = 'InsightsBanner';
                method = 'get items for insights banner';
                newCommonObj.getDataFromList(Url, listName, null, method).then(function (res) {
                    console.log(res.data.value);
                    _this.setState({
                        images: res.data.value
                    });
                }).catch(function (error) {
                    console.log('error while getting data');
                    console.log(error);
                });
                // Disable the loading spinner and display the screen
                this.setState({
                    isLoading: false
                });
                return [2 /*return*/];
            });
        });
    };
    Insights.prototype.render = function () {
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
        return (React.createElement("div", { className: styles.insights },
            React.createElement("div", { className: styles.container },
                React.createElement("h2", { className: styles.tableCaptionStyle }, "Knowledge Hub"),
                React.createElement(RSlider, __assign({}, settings), this.state.images.map(function (item, key) {
                    return (React.createElement("div", { key: key },
                        React.createElement("img", { className: styles.imageStyle, src: item.Image.Url, alt: item.Image.Description })));
                })),
                (this.state.isLoading) ? React.createElement(Loader, { message: "Please wait..." }) :
                    (this.state.items[0].Title === "No Insights to display.")
                        ?
                            React.createElement("div", { className: styles.tableStyle },
                                React.createElement("div", { className: styles.rowStyle },
                                    React.createElement("div", { className: styles.announceblk },
                                        React.createElement("div", { className: styles.dateStyle }, React.createElement(Moment, { format: "MMM DD " }, new Date())),
                                        React.createElement("div", { className: styles.CellStyle }, this.state.items[0].Title))))
                        :
                            React.createElement("div", { className: styles.tableStyle },
                                React.createElement("div", null, this.state.items.map(function (item, key) {
                                    return (React.createElement("div", { className: styles.rowStyle, key: key },
                                        React.createElement("div", { className: styles.announceblk },
                                            React.createElement("div", { className: styles.dateStyle }, React.createElement(Moment, { format: "MMM DD " }, item.AnnouncementDate)),
                                            React.createElement("div", { className: styles.CellStyle },
                                                React.createElement("a", { href: item.RespectivePageLink.Url, target: "_blank" },
                                                    item.Title,
                                                    React.createElement("span", { className: styles.textarrow })),
                                                React.createElement("div", { className: styles.descriptionaStyle }, item.Description)))));
                                }))))));
    };
    return Insights;
}(React.Component));
export default Insights;
//# sourceMappingURL=Insights.js.map