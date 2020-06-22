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
import styles from './StarPerformers.module.scss';
import common from '../../common/common';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { Link } from 'office-ui-fabric-react';
import AllStarPerformers from './AllStarPerformers';
var StarPerformers = /** @class */ (function (_super) {
    __extends(StarPerformers, _super);
    function StarPerformers(props, state) {
        var _this = _super.call(this, props) || this;
        //Initialize the State
        _this.state = {
            items: [
                {
                    EmployeeName: {
                        EMail: '',
                        FirstName: '',
                        LastName: ''
                    },
                    AwardName: 'No Award to Display',
                    ExpiryDate: '',
                }
            ]
        };
        return _this;
    }
    StarPerformers.prototype.componentDidMount = function () {
        this.getStarPerformarRecord();
    };
    StarPerformers.prototype.componentWillReceiveProps = function (nextProps) {
        this.getStarPerformarRecord();
    };
    //get StarPerformer's data
    StarPerformers.prototype.getStarPerformarRecord = function () {
        var _this = this;
        var yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        var Url = this.props.siteUrl;
        var method = 'get items for Star Performars';
        var listId = this.props.listId;
        var newCommonObj = new common();
        var query;
        if (this.props.Practices == true) //filter by expiryDate and Practices
            query = "?$select=EmployeeName/EMail,EmployeeName/FirstName,EmployeeName/LastName,EmployeeName/EMail,AwardName,ExpiryDate&$expand=EmployeeName/Id&$Filter=(ExpiryDate ge datetime'" + yesterday.toISOString() + "') and (Practices/Practices eq 'P1')";
        else
            query = "?$select=EmployeeName/EMail,EmployeeName/FirstName,EmployeeName/LastName,EmployeeName/EMail,AwardName,ExpiryDate&$expand=EmployeeName/Id&$Filter=(ExpiryDate ge datetime'" + yesterday.toISOString() + "')";
        newCommonObj.getDataFromListUsingGuid(Url, listId, query, method).then(function (res) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (res.data.value != undefined && res.data.value != null) {
                    //response not null then setState this Response
                    this.setState({ items: res.data.value });
                }
                return [2 /*return*/];
            });
        }); }).catch(function (error) {
            console.log(error);
        });
    };
    StarPerformers.prototype.render = function () {
        var _this = this;
        //property of Slider
        var settings = {
            dots: true,
            infinite: true,
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: Number(this.props.numberOfSeconds + '000'),
            nextArrow: React.createElement(SampleNextArrow, null),
            prevArrow: React.createElement(SamplePrevArrow, null)
        };
        return (React.createElement("div", { className: styles.starPerformers }, (this.props.Homepage == true) ? (React.createElement("div", { className: styles.container },
            React.createElement("h2", null, "STAR PERFORMERS"),
            // If data is null then will show message of "No Award to Display"
            (this.state.items[0].AwardName === "No Award to Display")
                ?
                    React.createElement("div", { className: "ms-Grid-row" },
                        React.createElement("div", { className: "ms-Grid-col ms-sm3 ms-md3" },
                            React.createElement("img", { src: this.props.siteUrl + "/_layouts/15/userphoto.aspx?size=L", style: { width: '100px' } })),
                        React.createElement("div", { className: "ms-Grid-col ms-sm9 ms-md9" },
                            React.createElement("div", null,
                                React.createElement("h3", null, " No Award to Display"))))
                :
                    React.createElement(Slider, __assign({}, settings), this.state.items.map(function (item, key) {
                        return (React.createElement("div", { className: "ms-Grid-row" },
                            _this.props.IsImage == true ? (React.createElement("div", { className: "ms-Grid-col ms-sm3 ms-md3" },
                                React.createElement("img", { src: _this.props.siteUrl + "/_layouts/15/userphoto.aspx?size=L&accountname=" + item.EmployeeName.EMail, style: { width: '100px' } }))) : (React.createElement("div", null)),
                            React.createElement("div", { className: "ms-Grid-col ms-sm9 ms-md9" },
                                React.createElement("div", null,
                                    React.createElement("h3", null,
                                        " ",
                                        item.EmployeeName.FirstName,
                                        " ",
                                        item.EmployeeName.LastName),
                                    React.createElement("p", null,
                                        " ",
                                        item.AwardName)))));
                    })),
            React.createElement(Link, { href: this.props.siteUrl + "/SitePages/Star-Performers.aspx", target: "_blank", className: styles.viewAll }, "View More"))) :
            (React.createElement(AllStarPerformers, { siteUrl: this.props.siteUrl, listId: this.props.listId, numberOfSeconds: this.props.numberOfSeconds, Practices: this.props.Practices, Homepage: this.props.Homepage, IsImage: this.props.IsImage }))));
    };
    return StarPerformers;
}(React.Component));
export default StarPerformers;
function SampleNextArrow(props) {
    var className = props.className, style = props.style, onClick = props.onClick;
    return (React.createElement("div", { className: className, style: __assign({}, style, { display: "block", background: "black", right: "0", top: "10px" }), onClick: onClick }));
}
function SamplePrevArrow(props) {
    var className = props.className, style = props.style, onClick = props.onClick;
    return (React.createElement("div", { className: className, style: __assign({}, style, { display: "block", background: "black", left: "92%", top: "10px", position: "absolute", zIndex: "1" }), onClick: onClick }));
}
//# sourceMappingURL=StarPerformers.js.map