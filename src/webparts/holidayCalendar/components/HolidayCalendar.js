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
var HolidayCalendar_module_scss_1 = require("./HolidayCalendar.module.scss");
var common_1 = require("../../common/common");
var Loading_1 = require("../../common/Loading");
var Link_1 = require("office-ui-fabric-react/lib/components/Link");
var HolidayCalendar = /** @class */ (function (_super) {
    __extends(HolidayCalendar, _super);
    function HolidayCalendar(props) {
        var _this = _super.call(this, props) || this;
        //Initialize the State
        _this.state = {
            isLoading: true,
            items: [
                {
                    Title: "No Holiday to display",
                    Location: "",
                    DateOfHoliday: "",
                    userLocation: "",
                }
            ],
        };
        return _this;
    }
    HolidayCalendar.prototype.componentDidMount = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getCurrentUserLocation()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    //get user's Current location 
    HolidayCalendar.prototype.getCurrentUserLocation = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.props.graphClient.api('/me').get(function (error, userResponse, rawResponse) {
                            console.log('userResponse.officeLocation == ', userResponse.officeLocation);
                            var ADLocation = userResponse.officeLocation;
                            _this.GetItemsFromHoliday(ADLocation);
                        })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    //get Holidays using current location
    HolidayCalendar.prototype.GetItemsFromHoliday = function (ADLocation) {
        var _this = this;
        var HolidayHandler = this;
        var newCommonObj = new common_1.default();
        var Url = this.props.siteurl;
        var listId = this.props.listId;
        var method = 'get items for Holiday';
        var query = '?$top=1000';
        newCommonObj.getDataFromListUsingGuid(Url, listId, query, method).then(function (res) {
            if (res.data.value != undefined && res.data.value != null && res.data.value.length > 0) {
                //response not null then setState this Response
                var dataFiltered = res.data.value.filter(function (data) { return ADLocation == data.Location; });
                HolidayHandler.setState({
                    items: dataFiltered
                });
            }
            _this.setState({
                isLoading: false
            });
        }).catch(function (error) {
            console.log('error while getting data');
            console.log(error);
        });
    };
    HolidayCalendar.prototype.render = function () {
        return (React.createElement("div", { className: HolidayCalendar_module_scss_1.default.holidayCalendar },
            React.createElement("div", { className: HolidayCalendar_module_scss_1.default.container },
                React.createElement("div", { className: HolidayCalendar_module_scss_1.default.header }, "HOLIDAY CALENDAR"),
                React.createElement("div", { className: "ms-Grid", dir: "ltr" }, (this.state.isLoading) ? React.createElement(Loading_1.Loader, { message: "Please wait..." }) :
                    (this.state.items.length <= 0)
                        ?
                            React.createElement("div", null,
                                React.createElement("div", { className: "ms-Grid-row" },
                                    React.createElement("div", { className: "ms-Grid-col md-sm6 md-md6" },
                                        React.createElement("div", { className: HolidayCalendar_module_scss_1.default.titledetails }, " No Holiday to display"))))
                        :
                            React.createElement("div", null, this.state.items.map(function (item, key) {
                                return (React.createElement("div", null,
                                    React.createElement("div", { className: "ms-Grid-row" },
                                        React.createElement("div", { className: "ms-Grid-col md-sm6 md-md6" },
                                            React.createElement("div", { className: HolidayCalendar_module_scss_1.default.box },
                                                React.createElement("div", { className: HolidayCalendar_module_scss_1.default.datedisplay },
                                                    " ",
                                                    (new Date(item.DateOfHoliday).toDateString().substring(8, 10))),
                                                React.createElement("div", { className: HolidayCalendar_module_scss_1.default.dateinline },
                                                    React.createElement("div", { className: HolidayCalendar_module_scss_1.default.titledisplay },
                                                        " ",
                                                        (new Date(item.DateOfHoliday).toDateString().substring(4, 7))),
                                                    React.createElement("div", { className: HolidayCalendar_module_scss_1.default.titlesub },
                                                        " ",
                                                        (new Date(item.DateOfHoliday).toDateString().substring(11, 15)))))),
                                        React.createElement("div", { className: "ms-Grid-col md-sm6 md-md6" },
                                            React.createElement("div", { className: HolidayCalendar_module_scss_1.default.titledetails },
                                                " ",
                                                item.Title)))));
                                //}
                            }))),
                React.createElement(Link_1.Link, { href: this.props.siteurl + "/SitePages/Holidays.aspx", target: '_blank', className: HolidayCalendar_module_scss_1.default.viewAll }, "view more"))));
    };
    return HolidayCalendar;
}(React.Component));
exports.default = HolidayCalendar;
//# sourceMappingURL=HolidayCalendar.js.map