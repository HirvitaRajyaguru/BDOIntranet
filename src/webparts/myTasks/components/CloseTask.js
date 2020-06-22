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
var MyTasks_module_scss_1 = require("./MyTasks.module.scss");
require("moment-timezone");
var TaskItem_1 = require("./TaskItem");
var CloseTask = /** @class */ (function (_super) {
    __extends(CloseTask, _super);
    function CloseTask(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            tasks: [],
            NoTasks: "No Tasks Available"
        };
        return _this;
    }
    CloseTask.prototype.componentDidMount = function () {
        this.GetItemsPlanner();
    };
    CloseTask.prototype.GetItemsPlanner = function () {
        var _this = this;
        var today = new Date();
        var apiUrl = '/me/planner/tasks';
        this.props.graphClient
            .api(apiUrl)
            .get(function (error, tasksResponse, rawResponse) {
            console.log('tasksResponse', tasksResponse);
            var allTasks = tasksResponse.value;
            var plannerTasks = allTasks.filter(function (e) { return e.percentComplete == 100; }).sort(function (a, b) {
                return new Date(a.dueDateTime).getDate() - new Date(b.dueDateTime).getDate();
            }).slice(0, 10);
            _this.setState({ tasks: plannerTasks });
        });
    };
    CloseTask.prototype.render = function () {
        return (React.createElement("div", { className: MyTasks_module_scss_1.default.myTasks }, this.state.tasks.length <= 0 ? (React.createElement("div", { className: MyTasks_module_scss_1.default.tableStyle },
            React.createElement("div", { className: MyTasks_module_scss_1.default.rowStyle },
                React.createElement("div", { className: MyTasks_module_scss_1.default.announceblk },
                    React.createElement("div", { className: MyTasks_module_scss_1.default.CellStyle }, this.state.NoTasks))))) : (React.createElement("div", { className: MyTasks_module_scss_1.default.tableStyle }, this.state.tasks.map(function (item, key) {
            return (React.createElement(TaskItem_1.default, { Title: item.title, DueDate: item.dueDateTime, Id: item.id, Description: "" }));
        })))));
    };
    return CloseTask;
}(React.Component));
exports.default = CloseTask;
//# sourceMappingURL=CloseTask.js.map