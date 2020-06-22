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
var strings = require("AnnouncementMarqueeWebPartStrings");
var AnnouncementMarquee_1 = require("./components/AnnouncementMarquee");
var AnnouncementMarqueeWebPart = /** @class */ (function (_super) {
    __extends(AnnouncementMarqueeWebPart, _super);
    function AnnouncementMarqueeWebPart() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AnnouncementMarqueeWebPart.prototype.render = function () {
        var element = React.createElement(AnnouncementMarquee_1.default, {
            siteurl: this.context.pageContext.web.absoluteUrl,
            listName: this.properties.listName
        });
        ReactDom.render(element, this.domElement);
    };
    AnnouncementMarqueeWebPart.prototype.onDispose = function () {
        ReactDom.unmountComponentAtNode(this.domElement);
    };
    Object.defineProperty(AnnouncementMarqueeWebPart.prototype, "dataVersion", {
        get: function () {
            return sp_core_library_1.Version.parse('1.0');
        },
        enumerable: true,
        configurable: true
    });
    AnnouncementMarqueeWebPart.prototype.getPropertyPaneConfiguration = function () {
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
    return AnnouncementMarqueeWebPart;
}(sp_webpart_base_1.BaseClientSideWebPart));
exports.default = AnnouncementMarqueeWebPart;
//# sourceMappingURL=AnnouncementMarqueeWebPart.js.map