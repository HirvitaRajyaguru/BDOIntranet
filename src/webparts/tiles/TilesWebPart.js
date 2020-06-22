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
var strings = require("TilesWebPartStrings");
var Tiles_1 = require("./components/Tiles");
var sp_core_library_2 = require("@microsoft/sp-core-library");
var sp_http_1 = require("@microsoft/sp-http");
var TilesWebPart = /** @class */ (function (_super) {
    __extends(TilesWebPart, _super);
    function TilesWebPart() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._listsInThisSite = [];
        return _this;
    }
    TilesWebPart.prototype.onInit = function () {
        var _this = this;
        this.fetchOptions()
            .then(function (data) {
            _this._listsInThisSite = data;
        });
        return Promise.resolve();
    };
    TilesWebPart.prototype.render = function () {
        var element = React.createElement(Tiles_1.default, {
            isWorkbench: sp_core_library_2.Environment.type == sp_core_library_2.EnvironmentType.Local,
            siteUrl: this.context.pageContext.web.absoluteUrl,
            numberOfItems: this.properties.numberOfItems,
            listId: this.properties.listId,
            spHttpClient: this.context.spHttpClient
        });
        ReactDom.render(element, this.domElement);
    };
    TilesWebPart.prototype.onDispose = function () {
        ReactDom.unmountComponentAtNode(this.domElement);
    };
    Object.defineProperty(TilesWebPart.prototype, "dataVersion", {
        get: function () {
            return sp_core_library_1.Version.parse('1.0');
        },
        enumerable: true,
        configurable: true
    });
    TilesWebPart.prototype.getPropertyPaneConfiguration = function () {
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
                                sp_webpart_base_1.PropertyPaneSlider('numberOfItems', {
                                    label: strings.NumberOfDocumentsFieldLabel,
                                    min: 1,
                                    max: 10,
                                    step: 1
                                })
                            ]
                        }
                    ]
                }
            ]
        };
    };
    TilesWebPart.prototype.fetchLists = function (url) {
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
    TilesWebPart.prototype.fetchOptions = function () {
        var url = this.context.pageContext.web.absoluteUrl + "/_api/web/lists?$filter=BaseTemplate eq 170 and Hidden eq false"; //170 code for Promoted List
        return this.fetchLists(url).then(function (response) {
            var options = new Array();
            var lists = response.value;
            lists.forEach(function (list) {
                options.push({ key: list.Id, text: list.Title });
            });
            return options;
        });
    };
    return TilesWebPart;
}(sp_webpart_base_1.BaseClientSideWebPart));
exports.default = TilesWebPart;
//# sourceMappingURL=TilesWebPart.js.map