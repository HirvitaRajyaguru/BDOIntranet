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
var strings = require("MyTasksWebPartStrings");
var MyTasks_1 = require("./components/MyTasks");
var MyTasksWebPart = /** @class */ (function (_super) {
    __extends(MyTasksWebPart, _super);
    function MyTasksWebPart() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MyTasksWebPart.prototype.render = function () {
        var _this = this;
        this.context.msGraphClientFactory.getClient()
            .then(function (client) {
            var element = React.createElement(MyTasks_1.default, {
                graphClient: client,
                completedRequest: _this.properties.completedRequest
            });
            ReactDom.render(element, _this.domElement);
        });
    };
    MyTasksWebPart.prototype.onDispose = function () {
        ReactDom.unmountComponentAtNode(this.domElement);
    };
    Object.defineProperty(MyTasksWebPart.prototype, "dataVersion", {
        get: function () {
            return sp_core_library_1.Version.parse('1.0');
        },
        enumerable: true,
        configurable: true
    });
    MyTasksWebPart.prototype.getPropertyPaneConfiguration = function () {
        return {
            pages: [
                {
                    groups: [
                        {
                            groupFields: [
                                sp_webpart_base_1.PropertyPaneToggle('completedRequest', {
                                    label: strings.completedRequest
                                })
                            ]
                        }
                    ]
                }
            ]
        };
    };
    return MyTasksWebPart;
}(sp_webpart_base_1.BaseClientSideWebPart));
exports.default = MyTasksWebPart;
//# sourceMappingURL=MyTasksWebPart.js.map