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
var sp_property_pane_1 = require("@microsoft/sp-property-pane");
var sp_webpart_base_1 = require("@microsoft/sp-webpart-base");
var strings = require("PartnerSpeakDetailsWebPartStrings");
var PartnerSpeakDetails_1 = require("./components/PartnerSpeakDetails");
var PartnerSpeakDetailsWebPart = /** @class */ (function (_super) {
    __extends(PartnerSpeakDetailsWebPart, _super);
    function PartnerSpeakDetailsWebPart() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PartnerSpeakDetailsWebPart.prototype.render = function () {
        var element = React.createElement(PartnerSpeakDetails_1.default, {
            description: this.properties.description,
            siteUrl: this.context.pageContext.web.absoluteUrl,
            ListName: "PartnerSpeak",
        });
        ReactDom.render(element, this.domElement);
    };
    PartnerSpeakDetailsWebPart.prototype.onDispose = function () {
        ReactDom.unmountComponentAtNode(this.domElement);
    };
    Object.defineProperty(PartnerSpeakDetailsWebPart.prototype, "dataVersion", {
        get: function () {
            return sp_core_library_1.Version.parse('1.0');
        },
        enumerable: true,
        configurable: true
    });
    PartnerSpeakDetailsWebPart.prototype.getPropertyPaneConfiguration = function () {
        return {
            pages: [
                {
                    header: {
                        description: strings.PropertyPaneDescription
                    },
                    groups: [
                        {
                            groupName: strings.BasicGroupName,
                            groupFields: [
                                sp_property_pane_1.PropertyPaneTextField('description', {
                                    label: strings.DescriptionFieldLabel
                                })
                            ]
                        }
                    ]
                }
            ]
        };
    };
    return PartnerSpeakDetailsWebPart;
}(sp_webpart_base_1.BaseClientSideWebPart));
exports.default = PartnerSpeakDetailsWebPart;
//# sourceMappingURL=PartnerSpeakDetailsWebPart.js.map