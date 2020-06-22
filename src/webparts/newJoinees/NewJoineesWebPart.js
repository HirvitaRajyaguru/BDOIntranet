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
var strings = require("NewJoineesWebPartStrings");
var NewJoinees_1 = require("./components/NewJoinees");
var NewJoineesWebPart = /** @class */ (function (_super) {
    __extends(NewJoineesWebPart, _super);
    function NewJoineesWebPart() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NewJoineesWebPart.prototype.render = function () {
        var _this = this;
        this.context.msGraphClientFactory.getClient().then(function (msGraphClient) {
            var element = React.createElement(NewJoinees_1.default, {
                siteUrl: _this.context.pageContext.web.absoluteUrl,
                msGraphClient: msGraphClient
            });
            ReactDom.render(element, _this.domElement);
        });
    };
    NewJoineesWebPart.prototype.onDispose = function () {
        ReactDom.unmountComponentAtNode(this.domElement);
    };
    Object.defineProperty(NewJoineesWebPart.prototype, "dataVersion", {
        get: function () {
            return sp_core_library_1.Version.parse('1.0');
        },
        enumerable: true,
        configurable: true
    });
    NewJoineesWebPart.prototype.getPropertyPaneConfiguration = function () {
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
                                sp_webpart_base_1.PropertyPaneTextField('description', {
                                    label: strings.DescriptionFieldLabel
                                })
                            ]
                        }
                    ]
                }
            ]
        };
    };
    return NewJoineesWebPart;
}(sp_webpart_base_1.BaseClientSideWebPart));
exports.default = NewJoineesWebPart;
//# sourceMappingURL=NewJoineesWebPart.js.map