"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var Insights_module_scss_1 = require("./Insights.module.scss");
var react_moment_1 = require("react-moment");
require("moment-timezone");
var common_1 = require("../../common/common");
var Loading_1 = require("../../common/Loading");
var logo = require('../assets/r-arrow.png');
var Insights = /** @class */ (function (_super) {
    __extends(Insights, _super);
    function Insights(props, state) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            isLoading: true,
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
    Insights.prototype.GetItemsFromInsights = function () {
        var _this = this;
        var yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        var Url = this.props.siteurl;
        var method = 'get items for Insights';
        var listId = this.props.listId;
        var newCommonObj = new common_1.default();
        var query;
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
                this.setState({
                    isLoading: false
                });
                return [2 /*return*/];
            });
        }); }).catch(function (error) {
            console.log(error);
        });
    };
    Insights.prototype.render = function () {
        console.log(this.state);
        return (React.createElement("div", { className: Insights_module_scss_1.default.insights },
            React.createElement("div", { className: Insights_module_scss_1.default.container },
                React.createElement("h2", { className: Insights_module_scss_1.default.tableCaptionStyle }, "Knowledge Hub"),
                React.createElement("div", null,
                    React.createElement("img", { className: Insights_module_scss_1.default.imageStyle, src: this.props.imageURL })),
                (this.state.isLoading) ? React.createElement(Loading_1.Loader, { message: "Please wait..." }) :
                    (this.state.items[0].Title === "No Insights to display.")
                        ?
                            React.createElement("div", { className: Insights_module_scss_1.default.tableStyle },
                                React.createElement("div", { className: Insights_module_scss_1.default.rowStyle },
                                    React.createElement("div", { className: Insights_module_scss_1.default.announceblk },
                                        React.createElement("div", { className: Insights_module_scss_1.default.dateStyle }, React.createElement(react_moment_1.default, { format: "MMM DD " }, new Date())),
                                        React.createElement("div", { className: Insights_module_scss_1.default.CellStyle }, this.state.items[0].Title))))
                        :
                            React.createElement("div", { className: Insights_module_scss_1.default.tableStyle },
                                React.createElement("div", null, this.state.items.map(function (item, key) {
                                    return (React.createElement("div", { className: Insights_module_scss_1.default.rowStyle, key: key },
                                        React.createElement("div", { className: Insights_module_scss_1.default.announceblk },
                                            React.createElement("div", { className: Insights_module_scss_1.default.dateStyle }, React.createElement(react_moment_1.default, { format: "MMM DD " }, item.AnnouncementDate)),
                                            React.createElement("div", { className: Insights_module_scss_1.default.CellStyle },
                                                item.Title,
                                                React.createElement("a", { href: "item.RespectivePageLink.Url", target: "_blank" },
                                                    React.createElement("img", { src: "" + logo })),
                                                React.createElement("div", { className: Insights_module_scss_1.default.descriptionaStyle }, item.Description)))));
                                }))))));
    };
    return Insights;
}(React.Component));
exports.default = Insights;
//# sourceMappingURL=Insights.js.map