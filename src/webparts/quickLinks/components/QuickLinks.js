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
var QuickLinks_module_scss_1 = require("./QuickLinks.module.scss");
var sp_http_1 = require("@microsoft/sp-http");
var office_ui_fabric_react_1 = require("office-ui-fabric-react");
require("slick-carousel/slick/slick.css");
require("slick-carousel/slick/slick-theme.css");
var react_slick_1 = require("react-slick");
var QuickLinks = /** @class */ (function (_super) {
    __extends(QuickLinks, _super);
    function QuickLinks(props, state) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            listData: []
        };
        return _this;
    }
    QuickLinks.prototype.componentDidMount = function () {
        this.loadData();
    };
    QuickLinks.prototype.loadData = function () {
        var _this = this;
        this.props.spHttpClient.get(this.props.siteUrl + "/_api/Web/Lists(guid'" + this.props.listId + "')/Items?$top=5", sp_http_1.SPHttpClient.configurations.v1)
            .then(function (response) {
            return response.json();
        })
            .then(function (items) {
            var listItems = [];
            for (var i = 0; i < items.value.length; i++) {
                listItems.push({
                    Title: items.value[i].Title,
                    Description: items.value[i].Description,
                    ImageUrl: items.value[i].BackgroundImageLocation.Url,
                    LinkUrl: items.value[i].LinkLocation.Url
                });
            }
            _this.setState({ listData: listItems });
        }, function (err) {
            console.log(err);
        });
    };
    QuickLinks.prototype.render = function () {
        var settings = {
            dots: true,
            infinite: true,
            speed: 500,
            slidesToShow: 4,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 4000,
            nextArrow: React.createElement(SampleNextArrow, null),
            prevArrow: React.createElement(SamplePrevArrow, null)
        };
        return (React.createElement("div", { className: QuickLinks_module_scss_1.default.quickLinks },
            React.createElement("div", { className: QuickLinks_module_scss_1.default.container },
                React.createElement(react_slick_1.default, __assign({}, settings), this.state.listData.map(function (item) {
                    return (React.createElement("a", { href: item.LinkUrl, target: "_top", role: "listitem" },
                        React.createElement("div", { className: QuickLinks_module_scss_1.default.pLinkItemWrapper },
                            React.createElement(office_ui_fabric_react_1.Image, { src: item.ImageUrl, shouldFadeIn: true, imageFit: office_ui_fabric_react_1.ImageFit.cover, className: QuickLinks_module_scss_1.default.pLinkItemImage }))));
                })))));
    };
    return QuickLinks;
}(React.Component));
exports.default = QuickLinks;
function SampleNextArrow(props) {
    var className = props.className, style = props.style, onClick = props.onClick;
    return (React.createElement("div", { className: className, style: __assign({}, style, { display: "block", background: "black" }), onClick: onClick }));
}
function SamplePrevArrow(props) {
    var className = props.className, style = props.style, onClick = props.onClick;
    return (React.createElement("div", { className: className, style: __assign({}, style, { display: "block", background: "black" }), onClick: onClick }));
}
//# sourceMappingURL=QuickLinks.js.map