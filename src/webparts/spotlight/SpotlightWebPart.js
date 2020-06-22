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
var ReactDom = require("react-dom");
var sp_core_library_1 = require("@microsoft/sp-core-library");
var sp_webpart_base_1 = require("@microsoft/sp-webpart-base");
var strings = require("SpotlightWebPartStrings");
var Spotlight_1 = require("./components/Spotlight");
var sp_http_1 = require("@microsoft/sp-http");
var SpotlightWebPart = /** @class */ (function (_super) {
    __extends(SpotlightWebPart, _super);
    function SpotlightWebPart() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._listsInThisSite = [];
        return _this;
    }
    SpotlightWebPart.prototype.onInit = function () {
        var _this = this;
        this.fetchOptions()
            .then(function (data) {
            _this._listsInThisSite = data;
        });
        return Promise.resolve();
    };
    SpotlightWebPart.prototype.render = function () {
        var element = React.createElement(Spotlight_1.default, {
            siteUrl: this.context.pageContext.web.absoluteUrl,
            listId: this.properties.listId,
            numberOfSeconds: this.properties.numberOfSeconds,
            Practices: this.properties.Practices,
            Homepage: this.properties.Homepage
        });
        ReactDom.render(element, this.domElement);
    };
    SpotlightWebPart.prototype.onDispose = function () {
        ReactDom.unmountComponentAtNode(this.domElement);
    };
    Object.defineProperty(SpotlightWebPart.prototype, "dataVersion", {
        get: function () {
            return sp_core_library_1.Version.parse('1.0');
        },
        enumerable: true,
        configurable: true
    });
    SpotlightWebPart.prototype.getPropertyPaneConfiguration = function () {
        return {
            pages: [
                {
                    groups: [
                        {
                            groupFields: [
                                sp_webpart_base_1.PropertyPaneDropdown('listId', {
                                    label: strings.selectedListNameFieldLabel,
                                    options: this._listsInThisSite
                                }),
                                sp_webpart_base_1.PropertyPaneSlider('numberOfSeconds', {
                                    label: strings.NumberOfSecondFieldLabel,
                                    min: 4,
                                    max: 10,
                                    step: 1
                                }),
                                sp_webpart_base_1.PropertyPaneCheckbox('Practices', {
                                    text: strings.SelectedPrectices,
                                    checked: this.properties.Practices
                                }),
                                sp_webpart_base_1.PropertyPaneToggle('Homepage', {
                                    label: strings.Homepage
                                })
                            ]
                        }
                    ]
                }
            ]
        };
    };
    //get option of ListName with ListId
    SpotlightWebPart.prototype.fetchOptions = function () {
        var url = this.context.pageContext.web.absoluteUrl + "/_api/web/lists?$filter=BaseTemplate eq 100 and Hidden eq false"; //100 code for Custom List
        return this.fetchLists(url).then(function (response) {
            var options = new Array();
            var lists = response.value;
            lists.forEach(function (list) {
                options.push({ key: list.Id, text: list.Title });
            });
            return options;
        });
    };
    SpotlightWebPart.prototype.fetchLists = function (url) {
        return this.context.spHttpClient.get(url, sp_http_1.SPHttpClient.configurations.v1).then(function (response) {
            if (response.ok) {
                return response.json();
            }
            else {
                console.log("WARNING - failed to hit URL " + url + ". Error = " + response.statusText);
                return null;
            }
        });
    };
    return SpotlightWebPart;
}(sp_webpart_base_1.BaseClientSideWebPart));
exports.default = SpotlightWebPart;
//# sourceMappingURL=SpotlightWebPart.js.map