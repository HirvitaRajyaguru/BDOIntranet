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
import styles from './MyTasks.module.scss';
import 'moment-timezone';
import TaskItem from "./TaskItem";
var CloseTask = /** @class */ (function (_super) {
    __extends(CloseTask, _super);
    function CloseTask(props) {
        var _this = _super.call(this, props) || this;
        //Initialize the State
        _this.state = {
            tasks: [],
            NoTasks: "No Tasks Available"
        };
        return _this;
    }
    CloseTask.prototype.componentDidMount = function () {
        this.GetClosePlannerTask();
    };
    CloseTask.prototype.GetClosePlannerTask = function () {
        var _this = this;
        var apiUrl = '/me/planner/tasks';
        this.props.graphClient
            .api(apiUrl)
            .get(function (error, tasksResponse, rawResponse) {
            var allTasks = tasksResponse.value; //get 10 completed Task
            var plannerTasks = allTasks.filter(function (e) { return e.percentComplete == 100; }).sort(function (a, b) {
                return new Date(a.dueDateTime).getDate() - new Date(b.dueDateTime).getDate();
            }).slice(0, 10);
            _this.setState({ tasks: plannerTasks });
        });
    };
    CloseTask.prototype.render = function () {
        return (React.createElement("div", { className: styles.myTasks }, this.state.tasks.length <= 0 ? (React.createElement("div", { className: styles.tableStyle },
            React.createElement("div", { className: styles.rowStyle },
                React.createElement("div", { className: styles.announceblk },
                    React.createElement("div", { className: styles.CellStyle }, this.state.NoTasks))))) : (React.createElement("div", { className: styles.tableStyle }, this.state.tasks.map(function (item, key) {
            return (React.createElement(TaskItem, { Title: item.title, DueDate: item.dueDateTime, Id: item.id, Description: "" }));
        })))));
    };
    return CloseTask;
}(React.Component));
export default CloseTask;
//# sourceMappingURL=CloseTask.js.map