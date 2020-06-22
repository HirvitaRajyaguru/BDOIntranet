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
import { BaseClientSideWebPart, PropertyPaneTextField } from '@microsoft/sp-webpart-base';
import * as strings from 'NewJoineesWebPartStrings';
import NewJoinees from './components/NewJoinees';
var NewJoineesWebPart = /** @class */ (function (_super) {
    __extends(NewJoineesWebPart, _super);
    function NewJoineesWebPart() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NewJoineesWebPart.prototype.render = function () {
        var _this = this;
        this.context.msGraphClientFactory.getClient().then(function (msGraphClient) {
            var element = React.createElement(NewJoinees, {
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
            return Version.parse('1.0');
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
                                PropertyPaneTextField('description', {
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
}(BaseClientSideWebPart));
export default NewJoineesWebPart;
//# sourceMappingURL=NewJoineesWebPart.js.map