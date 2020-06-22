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
var office_ui_fabric_react_1 = require("office-ui-fabric-react");
var QuickLinks = /** @class */ (function (_super) {
    __extends(QuickLinks, _super);
    function QuickLinks(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            hovering: false
        };
        return _this;
    }
    QuickLinks.prototype.render = function () {
        return (React.createElement("a", { href: this.props.href, target: "_top", role: "listitem" },
            React.createElement("div", null,
                React.createElement(office_ui_fabric_react_1.Image, { src: this.props.imageUrl, shouldFadeIn: true, imageFit: office_ui_fabric_react_1.ImageFit.cover }))));
    };
    return QuickLinks;
}(React.Component));
exports.default = QuickLinks;
//# sourceMappingURL=QuickLinksItem.js.map