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
import * as React from "react";
import styles from "./MyTasks.module.scss";
import { MSGraphClient } from "@microsoft/sp-http";
import Moment from "react-moment";
import "moment-timezone";
var taskUrl = "https://tasks.office.com/synoverge.onmicrosoft.com/Home/Task/TaskID";
var TaskItem = /** @class */ (function (_super) {
    __extends(TaskItem, _super);
    function TaskItem(props) {
        var _this = _super.call(this, props) || this;
        //Initialize the State
        _this.state = {
            Description: _this.props.Description,
            Title: _this.props.Title,
            DueDate: _this.props.DueDate,
            Id: _this.props.Id
        };
        return _this;
    }
    TaskItem.prototype.componentDidMount = function () {
        this.getTaskDescription(this.props.Id);
    };
    TaskItem.prototype.getTaskDescription = function (id) {
        var _this = this;
        MSGraphClient.prototype
            .api("/planner/tasks/" + id + "/details")
            .get(function (error, tasksResponse, rawResponse) {
            _this.setState({ Description: tasksResponse.description });
        });
    };
    TaskItem.prototype.render = function () {
        if (!this.state.Description)
            React.createElement("div", null, "waiting...");
        return (React.createElement("div", { className: styles.rowStyle },
            React.createElement("div", { className: styles.announceblk },
                React.createElement("div", { className: styles.dueDateStyle }, React.createElement(Moment, { format: "MMM DD " }, this.state.DueDate)),
                React.createElement("div", { className: styles.CellStyle },
                    React.createElement("a", { href: taskUrl.replace("TaskID", this.state.Id), target: "_blank" },
                        " ",
                        this.state.Title,
                        React.createElement("span", { className: styles.textarrow }),
                        " "),
                    React.createElement("div", { className: styles.descriptionaStyle }, this.state.Description)))));
    };
    return TaskItem;
}(React.Component));
export default TaskItem;
//# sourceMappingURL=TaskItem.js.map