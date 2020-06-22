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
import styles from './JobOpenings.module.scss';
import { Link } from "office-ui-fabric-react/lib/components/Link";
import Moment from 'react-moment';
import 'moment-timezone';
import { Loader } from '../../common/Loading';
var resumeupload = require('../assets/resumeupload.png');
import Common from '../../common/common';
var JobOpenings = /** @class */ (function (_super) {
    __extends(JobOpenings, _super);
    function JobOpenings(props) {
        var _this = _super.call(this, props) || this;
        //Initialize the State
        _this.state = {
            isLoading: true,
            items: [
                {
                    Id: 0,
                    Title: "Currently no job opening is available.",
                    Created: null,
                    Location: "",
                    JobDescription: ""
                }
            ],
            counter: 0
        };
        return _this;
    }
    JobOpenings.prototype.componentDidMount = function () {
        this.GetItemsForJobOpening();
    };
    JobOpenings.prototype.GetItemsForJobOpening = function () {
        var _this = this;
        var newCommonObj = new Common();
        var Url = this.props.siteUrl;
        // var listName = 'JobOpenning';
        var listId = this.props.listId;
        var method = 'get items for Jobopenning';
        var query = '?$top=10';
        newCommonObj.getDataFromListUsingGuid(Url, listId, query, method).then(function (res) {
            if (res.data.value != undefined && res.data.value != null) {
                var Code = res.data.value;
            }
            _this.setState({
                items: Code,
                isLoading: false
            });
        }).catch(function (error) {
            console.log('error while getting data');
            console.log(error);
        });
    };
    JobOpenings.prototype.render = function () {
        var siteurl = this.props.siteUrl;
        return (React.createElement("div", { className: styles.jobOpenings },
            React.createElement("div", { className: styles.container },
                React.createElement("div", { className: styles.header }, "JOB OPENINGS"),
                (this.state.isLoading) ? React.createElement(Loader, { message: "Please wait..." }) :
                    (this.state.items[0].Title === "Currently no job opening is available." || this.state.items.length <= 0)
                        ?
                            React.createElement("div", { className: styles.jobitem },
                                React.createElement("div", null,
                                    React.createElement("div", null,
                                        React.createElement("div", { className: styles.Titleheading }, "Currently no job opening is available."))))
                        :
                            React.createElement("div", { className: styles.jobitem },
                                React.createElement("div", null, this.state.items.map(function (item, key) {
                                    var datefor = item.Created;
                                    return (React.createElement("div", null,
                                        item.Title == "" ? (React.createElement("div", { className: styles.Titleheading }, item.Title)) : (React.createElement("div", { className: styles.Titleheading },
                                            React.createElement("a", { href: "item.RespectivePageLink.Url", target: "_blank" },
                                                item.Title,
                                                React.createElement("span", { className: styles.textarrow })),
                                            React.createElement(Link, { href: siteurl + "/SitePages/ResumeUpload.aspx?RID=" + item.Id, "data-interception": "off", target: "_blank", rel: "noopener noreferrer", className: styles.resumeupload },
                                                React.createElement("img", { src: "" + resumeupload, className: styles.resumeupload })))),
                                        React.createElement("div", { className: styles.datedisplay },
                                            React.createElement(Moment, { format: "DD MMM" }, datefor),
                                            " - ",
                                            item.Location),
                                        React.createElement("div", { className: styles.description }, item.JobDescription)));
                                }))))));
    };
    return JobOpenings;
}(React.Component));
export default JobOpenings;
//# sourceMappingURL=JobOpenings.js.map