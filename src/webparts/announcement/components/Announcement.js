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
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var Announcement_module_scss_1 = require("./Announcement.module.scss");
var react_moment_1 = require("react-moment");
require("moment-timezone");
var common_1 = require("../../common/common");
var logo = require('../assets/r-arrow.png');
var Announcement = /** @class */ (function (_super) {
    __extends(Announcement, _super);
    function Announcement(props, state) {
        var _this = _super.call(this, props) || this;
        var today = new Date();
        _this.state = {
            items: [
                {
                    "Title": "",
                    "Description": "",
                    "AnnouncementDate": null,
                    "ExpiryDate": null,
                }
            ]
        };
        return _this;
    }
    Announcement.prototype.componentDidMount = function () {
        this.GetItemsFromAnnouncement();
    };
    Announcement.prototype.GetItemsFromAnnouncement = function () {
        var _this = this;
        var today = new Date();
        var todaydate = today.getDate();
        var todaymonth = today.getMonth() + 1;
        var newCommonObj = new common_1.default();
        var Url = this.props.siteurl;
        var listName = 'AnnouncementList';
        var method = 'get items for Holiday';
        var query = '?$top=1000';
        newCommonObj.getDataFromList(Url, listName, query, method).then(function (res) {
            if (res.data.value != undefined && res.data.value != null) {
                var dataFiltered = res.data.value.filter(function (data) { return new Date(data.ExpiryDate) >= new Date(); }
                //(data => todaymonth != new Date(data.ExpiryDate).getMonth() + 1 && todaydate != new Date(data.ExpiryDate).getDate())  
                );
                _this.setState({ items: dataFiltered });
            }
        }).catch(function (error) {
            console.log('error while getting data');
            console.log(error);
        });
    };
    Announcement.prototype.render = function () {
        return (React.createElement("div", { className: Announcement_module_scss_1.default.announcement },
            React.createElement("div", { className: Announcement_module_scss_1.default.panelStyle },
                React.createElement("h2", { className: Announcement_module_scss_1.default.tableCaptionStyle }, "Announcements"),
                React.createElement("div", { className: Announcement_module_scss_1.default.tableStyle },
                    this.state.items.map(function (item, key) {
                        var dateformat = item.AnnouncementDate;
                        var format = item.ExpiryDate;
                        return (React.createElement("div", { className: Announcement_module_scss_1.default.rowStyle, key: key },
                            React.createElement("div", { className: Announcement_module_scss_1.default.announceblk },
                                React.createElement("div", { className: Announcement_module_scss_1.default.dateStyle }, React.createElement(react_moment_1.default, { format: "MMM DD " }, dateformat)),
                                React.createElement("div", { className: Announcement_module_scss_1.default.CellStyle },
                                    item.Title,
                                    React.createElement("img", { src: "" + logo }),
                                    React.createElement("div", { className: Announcement_module_scss_1.default.descriptionaStyle }, item.Description)))));
                    }),
                    ","))));
    };
    return Announcement;
}(React.Component));
exports.default = Announcement;
//# sourceMappingURL=Announcement.js.map