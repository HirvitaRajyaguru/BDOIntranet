var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart, PropertyPaneToggle } from '@microsoft/sp-webpart-base';
import * as strings from 'MyTasksWebPartStrings';
import MyTasks from './components/MyTasks';
var MyTasksWebPart = /** @class */ (function (_super) {
    __extends(MyTasksWebPart, _super);
    function MyTasksWebPart() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MyTasksWebPart.prototype.render = function () {
        var _this = this;
        this.context.msGraphClientFactory.getClient()
            .then(function (client) {
            var element = React.createElement(MyTasks, {
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
            return Version.parse('1.0');
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
                                PropertyPaneToggle('completedRequest', {
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
}(BaseClientSideWebPart));
export default MyTasksWebPart;
//# sourceMappingURL=MyTasksWebPart.js.map