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
var strings = require("EmployeeProfileWebPartStrings");
var EmployeeProfile_1 = require("./components/EmployeeProfile");
var EmployeeProfileWebPart = /** @class */ (function (_super) {
    __extends(EmployeeProfileWebPart, _super);
    function EmployeeProfileWebPart() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    EmployeeProfileWebPart.prototype.render = function () {
        var element = React.createElement(EmployeeProfile_1.default, {
            description: this.properties.description
        });
        ReactDom.render(element, this.domElement);
    };
    EmployeeProfileWebPart.prototype.onDispose = function () {
        ReactDom.unmountComponentAtNode(this.domElement);
    };
    Object.defineProperty(EmployeeProfileWebPart.prototype, "dataVersion", {
        get: function () {
            return sp_core_library_1.Version.parse('1.0');
        },
        enumerable: true,
        configurable: true
    });
    EmployeeProfileWebPart.prototype.getPropertyPaneConfiguration = function () {
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
    return EmployeeProfileWebPart;
}(sp_webpart_base_1.BaseClientSideWebPart));
exports.default = EmployeeProfileWebPart;
//# sourceMappingURL=EmployeeProfileWebPart.js.map