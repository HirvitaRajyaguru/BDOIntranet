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
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import * as React from 'react';
import styles from './QuickLinks.module.scss';
import { Image, ImageFit } from 'office-ui-fabric-react';
import common from '../../common/common';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
var QuickLinks = /** @class */ (function (_super) {
    __extends(QuickLinks, _super);
    function QuickLinks(props, state) {
        var _this = _super.call(this, props) || this;
        //Initialize the State
        _this.state = {
            listData: []
        };
        return _this;
    }
    QuickLinks.prototype.componentDidMount = function () {
        this.getQuickLinks();
    };
    QuickLinks.prototype.componentWillReceiveProps = function (nextprops) {
        this.getQuickLinks();
    };
    //get quickLink's Link
    QuickLinks.prototype.getQuickLinks = function () {
        var _this = this;
        var Url = this.props.siteUrl;
        var method = 'get items for Tiles';
        var listId = this.props.listId;
        var newCommonObj = new common(); //create object of common methodS
        var query = "?$top=5"; //  only top 5 number of items
        newCommonObj.getDataFromListUsingGuid(Url, listId, query, method).then(function (res) { return __awaiter(_this, void 0, void 0, function () {
            var listItems, i;
            return __generator(this, function (_a) {
                if (res.data.value != undefined && res.data.value != null) {
                    listItems = [];
                    for (i = 0; i < res.data.value.length; i++) {
                        listItems.push({
                            Title: res.data.value[i].Title,
                            Description: res.data.value[i].Description,
                            ImageUrl: res.data.value[i].BackgroundImageLocation.Url,
                            LinkUrl: res.data.value[i].LinkLocation.Url
                        });
                    }
                    this.setState({ listData: listItems });
                }
                return [2 /*return*/];
            });
        }); }).catch(function (error) {
            console.log(error);
        });
    };
    QuickLinks.prototype.render = function () {
        //property of Slider
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
        return (React.createElement("div", { className: styles.quickLinks },
            React.createElement("div", { className: styles.container },
                React.createElement(Slider, __assign({}, settings), this.state.listData.map(function (item) {
                    return (React.createElement("a", { href: item.LinkUrl, target: "_blank", role: "listitem" },
                        React.createElement("div", { className: styles.pLinkItemWrapper },
                            React.createElement(Image, { src: item.ImageUrl, shouldFadeIn: true, imageFit: ImageFit.cover, className: styles.pLinkItemImage }))));
                })))));
    };
    return QuickLinks;
}(React.Component));
export default QuickLinks;
function SampleNextArrow(props) {
    var className = props.className, style = props.style, onClick = props.onClick;
    return (React.createElement("div", { className: className, style: __assign({}, style, { display: "block", background: "black" }), onClick: onClick }));
}
function SamplePrevArrow(props) {
    var className = props.className, style = props.style, onClick = props.onClick;
    return (React.createElement("div", { className: className, style: __assign({}, style, { display: "block", background: "black" }), onClick: onClick }));
}
//# sourceMappingURL=QuickLinks.js.map