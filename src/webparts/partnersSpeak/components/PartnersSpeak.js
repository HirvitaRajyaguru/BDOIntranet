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
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var PartnersSpeak_module_scss_1 = require("./PartnersSpeak.module.scss");
var Loading_1 = require("../../common/Loading");
var axios_1 = require("axios");
var PartnersSpeak = /** @class */ (function (_super) {
    __extends(PartnersSpeak, _super);
    function PartnersSpeak(props, state) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            isLoading: true,
            speaks: {
                "Title": "No Partner Speak.",
                "Description": "",
                WriterImage: {
                    "Url": null,
                },
                BannerImage: {
                    "Url": null,
                }
            }
        };
        return _this;
    }
    PartnersSpeak.prototype.componentDidMount = function () {
        this.LoadSpeak();
    };
    // Load the partner's speak from the list by filtering that expiryDate is grater or equal the date of today. 
    PartnersSpeak.prototype.LoadSpeak = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, axios_1.default.get(this.props.siteUrl + "/_api/web/Lists(guid'" + this.props.listId + "')/items?$filter=(ExpiryDate ge datetime'" + new Date(new Date().setDate((new Date().getDate() - 1))).toISOString() + "')&$orderby=ID desc")
                            .then(function (res) {
                            // Check that data is not empty and getting the actual result in response.
                            if (res.data.value.length > 0) {
                                //This custom code will return the first 150 characters of the description.
                                var content = res.data.value[0].Description;
                                // This regex is to identify the html and script tag
                                var regex = /(<([^>]+)>)/ig;
                                // Remove the tags from the description.
                                content = content.replace(regex, "");
                                // Trim the discription to the 150 character
                                if (content && content.length >= 150) {
                                    content = content.substring(0, 150) + " ...";
                                }
                                // Replace the new updated description to the response and assign it to the state.
                                res.data.value[0].Description = content;
                                _this.setState({
                                    speaks: res.data.value[0]
                                });
                            }
                            // Set the loading screen to the false
                            _this.setState({
                                isLoading: false
                            });
                        })
                            .catch(function (error) {
                            // Handle the error if any.
                            console.log(error);
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    PartnersSpeak.prototype.render = function () {
        // This function return the loading screen or data based on the state IsLoading
        return (React.createElement("div", { className: PartnersSpeak_module_scss_1.default.partnersSpeak }, (this.state.isLoading) ? React.createElement(Loading_1.Loader, { message: "Please wait..." }) : React.createElement(Speak, { bindoutput: this.state.speaks })));
    };
    return PartnersSpeak;
}(React.Component));
exports.default = PartnersSpeak;
// A functional component which will rander the screen with the data
var Speak = function (props) {
    return (React.createElement("div", { className: PartnersSpeak_module_scss_1.default.container },
        React.createElement("div", { className: PartnersSpeak_module_scss_1.default.row },
            React.createElement("h2", null, "PARTNER'S SPEAK"),
            React.createElement("h3", null, props.bindoutput.Title),
            React.createElement("p", null, props.bindoutput.Description),
            // If data is null then hide the link of read more.
            (props.bindoutput.Title != "No Partner Speak.") ? React.createElement("a", { href: "https://synoverge.sharepoint.com/sites/BDOIntranet/SitePages/partnersSpeak.aspx" },
                React.createElement("span", { className: PartnersSpeak_module_scss_1.default.label }, "Read more")) : "")));
};
//# sourceMappingURL=PartnersSpeak.js.map