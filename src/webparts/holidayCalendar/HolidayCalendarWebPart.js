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
var strings = require("HolidayCalendarWebPartStrings");
var HolidayCalendar_1 = require("./components/HolidayCalendar");
var HolidayCalendarWebPart = /** @class */ (function (_super) {
    __extends(HolidayCalendarWebPart, _super);
    function HolidayCalendarWebPart() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    HolidayCalendarWebPart.prototype.render = function () {
        var _this = this;
        this.context.msGraphClientFactory.getClient()
            .then(function (client) {
            var element = React.createElement(HolidayCalendar_1.default, {
                siteurl: _this.context.pageContext.web.absoluteUrl,
                listName: _this.properties.listName,
                graphClient: client
            });
            ReactDom.render(element, _this.domElement);
        });
    };
    HolidayCalendarWebPart.prototype.onDispose = function () {
        ReactDom.unmountComponentAtNode(this.domElement);
    };
    Object.defineProperty(HolidayCalendarWebPart.prototype, "dataVersion", {
        get: function () {
            return sp_core_library_1.Version.parse('1.0');
        },
        enumerable: true,
        configurable: true
    });
    HolidayCalendarWebPart.prototype.getPropertyPaneConfiguration = function () {
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
    return HolidayCalendarWebPart;
}(sp_webpart_base_1.BaseClientSideWebPart));
exports.default = HolidayCalendarWebPart;
//# sourceMappingURL=HolidayCalendarWebPart.js.map