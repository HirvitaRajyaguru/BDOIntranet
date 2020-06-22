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
import styles from './OpenRequests.module.scss';
import 'moment-timezone';
var OpenRequests = /** @class */ (function (_super) {
    __extends(OpenRequests, _super);
    function OpenRequests() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    OpenRequests.prototype.render = function () {
        return (React.createElement("div", { className: styles.openRequests },
            React.createElement("div", { className: styles.panelStyle },
                React.createElement("h2", { className: styles.tableCaptionStyle }, "Open Requests"),
                React.createElement("div", { className: styles.tableStyle },
                    React.createElement("div", { className: styles.rowStyle },
                        React.createElement("div", { className: styles.announceblk },
                            React.createElement("div", { className: styles.dateStyle }, "Feb 28"),
                            React.createElement("div", { className: styles.CellStyle },
                                React.createElement("a", { href: "item.RespectivePageLink.Url", target: "_blank" },
                                    "Task 1",
                                    React.createElement("span", { className: styles.textarrow })),
                                React.createElement("div", { className: styles.descriptionaStyle }, "Task Description for check")))),
                    React.createElement("div", { className: styles.rowStyle },
                        React.createElement("div", { className: styles.announceblk },
                            React.createElement("div", { className: styles.dateStyle }, "Feb 28"),
                            React.createElement("div", { className: styles.CellStyle },
                                React.createElement("a", { href: "item.RespectivePageLink.Url", target: "_blank" },
                                    "Task 2",
                                    React.createElement("span", { className: styles.textarrow })),
                                React.createElement("div", { className: styles.descriptionaStyle }, "Task Description for check")))),
                    React.createElement("div", { className: styles.rowStyle },
                        React.createElement("div", { className: styles.announceblk },
                            React.createElement("div", { className: styles.dateStyle }, "Feb 28"),
                            React.createElement("div", { className: styles.CellStyle },
                                React.createElement("a", { href: "item.RespectivePageLink.Url", target: "_blank" },
                                    "Task 3",
                                    React.createElement("span", { className: styles.textarrow })),
                                React.createElement("div", { className: styles.descriptionaStyle }, "Task Description for check")))),
                    React.createElement("div", { className: styles.rowStyle },
                        React.createElement("div", { className: styles.announceblk },
                            React.createElement("div", { className: styles.dateStyle }, "Feb 28"),
                            React.createElement("div", { className: styles.CellStyle },
                                React.createElement("a", { href: "item.RespectivePageLink.Url", target: "_blank" },
                                    "Task 4",
                                    React.createElement("span", { className: styles.textarrow })),
                                React.createElement("div", { className: styles.descriptionaStyle }, "Task Description for check")))),
                    React.createElement("div", { className: styles.rowStyle },
                        React.createElement("div", { className: styles.announceblk },
                            React.createElement("div", { className: styles.dateStyle }, "Feb 28"),
                            React.createElement("div", { className: styles.CellStyle },
                                React.createElement("a", { href: "item.RespectivePageLink.Url", target: "_blank" },
                                    "Task 5",
                                    React.createElement("span", { className: styles.textarrow })),
                                React.createElement("div", { className: styles.descriptionaStyle }, "Task Description for check"))))))));
    };
    return OpenRequests;
}(React.Component));
export default OpenRequests;
//# sourceMappingURL=OpenRequests.js.map