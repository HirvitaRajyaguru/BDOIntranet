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
var strings = require("KeyDocumentsWebPartStrings");
var KeyDocuments_1 = require("./components/KeyDocuments");
var KeyDocumentsWebPart = /** @class */ (function (_super) {
    __extends(KeyDocumentsWebPart, _super);
    function KeyDocumentsWebPart() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    KeyDocumentsWebPart.prototype.render = function () {
        var element = React.createElement(KeyDocuments_1.default, {
            description: this.properties.description,
            siteurl: this.context.pageContext.web.absoluteUrl,
            listName: this.properties.listName
        });
        ReactDom.render(element, this.domElement);
    };
    KeyDocumentsWebPart.prototype.onDispose = function () {
        ReactDom.unmountComponentAtNode(this.domElement);
    };
    Object.defineProperty(KeyDocumentsWebPart.prototype, "dataVersion", {
        get: function () {
            return sp_core_library_1.Version.parse('1.0');
        },
        enumerable: true,
        configurable: true
    });
    KeyDocumentsWebPart.prototype.getPropertyPaneConfiguration = function () {
        return {
            pages: [
                {
                    groups: [
                        {
                            groupFields: [
                                sp_webpart_base_1.PropertyPaneTextField('listName', {
                                    label: strings.ListFieldLabel
                                })
                            ]
                        }
                    ]
                }
            ]
        };
    };
    return KeyDocumentsWebPart;
}(sp_webpart_base_1.BaseClientSideWebPart));
exports.default = KeyDocumentsWebPart;
//# sourceMappingURL=KeyDocumentsWebPart.js.map