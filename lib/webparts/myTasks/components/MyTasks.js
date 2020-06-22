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
import TaskItem from "./TaskItem";
import 'moment-timezone';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import OpenTask from './OpenTask';
import CloseTask from './CloseTask';
var MyTasks = /** @class */ (function (_super) {
    __extends(MyTasks, _super);
    function MyTasks(props) {
        var _this = _super.call(this, props) || this;
        //Initialize the State
        _this.state = {
            tasks: [],
            NoTasks: "No Tasks Available"
        };
        return _this;
    }
    MyTasks.prototype.componentDidMount = function () {
        this.GetItemsPlanner();
        console.log(this.props.completedRequest);
    };
    MyTasks.prototype.componentWillReceiveProps = function (nextProps) {
        console.log(nextProps.completedRequest);
    };
    MyTasks.prototype.GetItemsPlanner = function () {
        var _this = this;
        var today = new Date();
        var apiUrl = '/me/planner/tasks';
        this.props.graphClient
            .api(apiUrl)
            .get(function (error, tasksResponse, rawResponse) {
            console.log('tasksResponse', tasksResponse);
            var allTasks = tasksResponse.value;
            var plannerTasks = allTasks.filter(function (e) { return e.percentComplete != 100; }).sort(function (a, b) {
                return new Date(a.dueDateTime).getDate() - new Date(b.dueDateTime).getDate();
            }).slice(0, 5);
            _this.setState({ tasks: plannerTasks });
        });
    };
    MyTasks.prototype.render = function () {
        return (React.createElement("div", { className: styles.myTasks },
            React.createElement("div", { className: styles.panelStyle },
                React.createElement("h2", { className: styles.tableCaptionStyle }, "My Tasks"),
                this.props.completedRequest == true ? (React.createElement(Tabs, { className: styles.tab },
                    React.createElement(TabList, null,
                        React.createElement(Tab, null, "Open"),
                        React.createElement(Tab, null, "Close")),
                    React.createElement(TabPanel, null,
                        React.createElement(OpenTask, { graphClient: this.props.graphClient, completedRequest: this.props.completedRequest })),
                    React.createElement(TabPanel, null,
                        React.createElement(CloseTask, { graphClient: this.props.graphClient, completedRequest: this.props.completedRequest })))) : (React.createElement("div", { className: styles.myTasks }, this.state.tasks.length <= 0 ? (React.createElement("div", { className: styles.tableStyle },
                    React.createElement("div", { className: styles.rowStyle },
                        React.createElement("div", { className: styles.announceblk },
                            React.createElement("div", { className: styles.CellStyle }, this.state.NoTasks))))) : (React.createElement("div", { className: styles.tableStyle }, this.state.tasks.map(function (item, key) {
                    return (React.createElement(TaskItem, { Title: item.title, DueDate: item.dueDateTime, Id: item.id, Description: "" }));
                }))))))));
    };
    return MyTasks;
}(React.Component));
export default MyTasks;
//# sourceMappingURL=MyTasks.js.map