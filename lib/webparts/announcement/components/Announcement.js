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
import * as React from 'react';
import styles from './Announcement.module.scss';
import Moment from 'react-moment';
import 'moment-timezone';
import Common from '../../common/common';
import { Loader } from '../../common/Loading';
var Announcement = /** @class */ (function (_super) {
    __extends(Announcement, _super);
    function Announcement(props, state) {
        var _this = _super.call(this, props) || this;
        //var today = new Date()
        //Initialize the State
        _this.state = {
            isLoading: true,
            items: [
                {
                    "Title": "No Announcement Available",
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
    //get Items from AnnouncmentsList for Announcement
    Announcement.prototype.GetItemsFromAnnouncement = function () {
        var _this = this;
        var newCommonObj = new Common();
        var Url = this.props.siteurl;
        var listName = 'AnnouncementList';
        var method = 'get items for Holiday';
        var query = '?$top=1000';
        newCommonObj.getDataFromList(Url, listName, query, method).then(function (res) {
            if (res.data.value != undefined && res.data.value != null) {
                //resposeis not null then filter by expirydate and setState
                var dataFiltered = res.data.value.filter(function (data) { return new Date(data.ExpiryDate).setHours(0, 0, 0, 0) >= new Date().setHours(0, 0, 0, 0); }
                //(data => todaymonth != new Date(data.ExpiryDate).getMonth() + 1 && todaydate != new Date(data.ExpiryDate).getDate())  
                );
                if (dataFiltered.length > 0)
                    _this.setState({ items: dataFiltered });
            }
            _this.setState({
                isLoading: false
            });
        }).catch(function (error) {
            console.log('error while getting data');
            console.log(error);
        });
    };
    Announcement.prototype.render = function () {
        return (React.createElement("div", { className: styles.announcement }, (this.state.isLoading) ? React.createElement(Loader, { message: "Please wait..." })
            :
                (this.state.items[0].Title === "No Announcement Available")
                    ?
                        React.createElement("div", { className: styles.panelStyle },
                            React.createElement("h2", { className: styles.tableCaptionStyle }, "Announcements"),
                            React.createElement("div", { className: styles.tableStyle },
                                React.createElement("div", { className: styles.rowStyle },
                                    React.createElement("div", { className: styles.announceblk },
                                        React.createElement("div", { className: styles.dateStyle }, React.createElement(Moment, { format: "MMM DD " }, new Date())),
                                        React.createElement("div", { className: styles.CellStyle }, this.state.items[0].Title)))))
                    :
                        React.createElement("div", { className: styles.panelStyle },
                            React.createElement("h2", { className: styles.tableCaptionStyle }, "Announcements"),
                            React.createElement("div", { className: styles.tableStyle },
                                this.state.items.map(function (item, key) {
                                    var dateformat = item.AnnouncementDate;
                                    var format = item.ExpiryDate;
                                    return (React.createElement("div", { className: styles.rowStyle, key: key },
                                        React.createElement("div", { className: styles.announceblk },
                                            React.createElement("div", { className: styles.dateStyle }, React.createElement(Moment, { format: "MMM DD " }, dateformat)),
                                            React.createElement("div", { className: styles.CellStyle },
                                                React.createElement("a", { href: "#", target: "_blank" },
                                                    item.Title,
                                                    React.createElement("span", { className: styles.textarrow })),
                                                React.createElement("div", { className: styles.descriptionaStyle }, item.Description)))));
                                }),
                                ","))));
    };
    return Announcement;
}(React.Component));
export default Announcement;
//# sourceMappingURL=Announcement.js.map