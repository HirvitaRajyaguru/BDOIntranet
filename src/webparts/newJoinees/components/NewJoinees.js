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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var NewJoinees_module_scss_1 = require("./NewJoinees.module.scss");
var common_1 = require("../../common/common");
var Persona_1 = require("office-ui-fabric-react/lib/Persona");
var Styling_1 = require("office-ui-fabric-react/lib/Styling");
require("slick-carousel/slick/slick.css");
require("slick-carousel/slick/slick-theme.css");
var react_slick_1 = require("react-slick");
var office_ui_fabric_react_1 = require("office-ui-fabric-react");
var customCoinClass = Styling_1.mergeStyles({
    borderRadius: 20,
    display: 'block'
});
var NewJoinees = /** @class */ (function (_super) {
    __extends(NewJoinees, _super);
    function NewJoinees(props, state) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            items: [
                {
                    FullName: "",
                    Email: "",
                    DateofJoining: "",
                    Status: ""
                }
            ]
        };
        return _this;
    }
    NewJoinees.prototype.componentDidMount = function () {
        this.GetItemsForNewJoinee();
    };
    NewJoinees.prototype.GetItemsForNewJoinee = function () {
        var _this = this;
        var newCommonObj = new common_1.default();
        var listName = 'EmployeeMaster';
        var url = this.props.siteUrl;
        var method = 'get items for new Joinee';
        var query = "?$top=5 &$orderby=ID desc & $Filter=Status eq 'Active'";
        newCommonObj.getDataFromList(url, listName, query, method).then(function (res) {
            if (res.data.value.length > 0) {
                var items = res.data.value;
                _this.setState({ items: items });
            }
        }).catch(function (error) {
            console.log('error while getting data');
            console.log(error);
        });
    };
    NewJoinees.prototype._onRenderCoin = function (props) {
        var coinSize = props.coinSize, imageAlt = props.imageAlt, imageUrl = props.imageUrl;
        return React.createElement("img", { src: imageUrl, alt: imageAlt, width: coinSize, height: coinSize, className: customCoinClass });
    };
    NewJoinees.prototype.render = function () {
        var _this = this;
        var settings = {
            dots: true,
            infinite: true,
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 4000,
            nextArrow: React.createElement(SampleNextArrow, null),
            prevArrow: React.createElement(SamplePrevArrow, null)
        };
        return (React.createElement("div", { className: NewJoinees_module_scss_1.default.newJoinees },
            React.createElement("div", { className: NewJoinees_module_scss_1.default.container },
                React.createElement("div", { className: NewJoinees_module_scss_1.default.row },
                    React.createElement("div", { className: NewJoinees_module_scss_1.default.column },
                        React.createElement(react_slick_1.default, __assign({}, settings), this.state.items.map(function (item, key) {
                            return (React.createElement("div", { key: key },
                                React.createElement(Persona_1.Persona, { text: item.FullName, secondaryText: item.DateofJoining, size: Persona_1.PersonaSize.size72, coinSize: 72, onRenderCoin: _this._onRenderCoin, imageUrl: _this.props.siteUrl + "/_layouts/15/userphoto.aspx?size=L&accountname=" + item.Email }),
                                React.createElement(office_ui_fabric_react_1.Button, { title: "Wish" },
                                    React.createElement(office_ui_fabric_react_1.Icon, { iconName: 'Greetingcard' }))));
                        })))))));
    };
    return NewJoinees;
}(React.Component));
exports.default = NewJoinees;
function SampleNextArrow(props) {
    var className = props.className, style = props.style, onClick = props.onClick;
    return (React.createElement("div", { className: className, style: __assign({}, style, { display: "block", marginRight: "-51px" }), onClick: onClick }));
}
function SamplePrevArrow(props) {
    var className = props.className, style = props.style, onClick = props.onClick;
    return (React.createElement("div", { className: className, style: __assign({}, style, { display: "block", marginLeft: "492px" }), onClick: onClick }));
}
//# sourceMappingURL=NewJoinees.js.map