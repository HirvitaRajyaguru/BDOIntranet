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
var Tiles_module_scss_1 = require("./Tiles.module.scss");
var office_ui_fabric_react_1 = require("office-ui-fabric-react");
var Tiles = /** @class */ (function (_super) {
    __extends(Tiles, _super);
    function Tiles(props, state) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            hovering: false
        };
        return _this;
    }
    Tiles.prototype.mouseOver = function (event) {
        this.setState({ hovering: true });
    };
    Tiles.prototype.mouseOut = function (event) {
        this.setState({ hovering: false });
    };
    Tiles.prototype.render = function () {
        return (React.createElement("a", { href: this.props.href, target: "_blank", role: "listitem", onMouseOver: this.mouseOver.bind(this), onMouseOut: this.mouseOut.bind(this) },
            React.createElement("div", { className: Tiles_module_scss_1.default.pLinkItemWrapper },
                React.createElement(office_ui_fabric_react_1.Image, { className: Tiles_module_scss_1.default.pLinkItemImage, src: this.props.imageUrl, shouldFadeIn: true, imageFit: office_ui_fabric_react_1.ImageFit.cover }))));
    };
    return Tiles;
}(React.Component));
exports.default = Tiles;
//# sourceMappingURL=TilesItem.js.map