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
import { BaseClientSideWebPart, PropertyPaneSlider, PropertyPaneDropdown } from '@microsoft/sp-webpart-base';
import * as strings from 'QuickLinksWebPartStrings';
import QuickLinks from './components/QuickLinks';
import { SPHttpClient } from '@microsoft/sp-http';
var QuickLinksWebPart = /** @class */ (function (_super) {
    __extends(QuickLinksWebPart, _super);
    function QuickLinksWebPart() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._listsInThisSite = [];
        return _this;
    }
    QuickLinksWebPart.prototype.onInit = function () {
        var _this = this;
        this.fetchOptions()
            .then(function (data) {
            _this._listsInThisSite = data;
        });
        return Promise.resolve();
    };
    QuickLinksWebPart.prototype.render = function () {
        var element = React.createElement(QuickLinks, {
            siteUrl: this.context.pageContext.web.absoluteUrl,
            listId: this.properties.listId,
            practices: this.properties.practices,
            numberOfSeconds: this.properties.numberOfSeconds
        });
        ReactDom.render(element, this.domElement);
    };
    QuickLinksWebPart.prototype.onDispose = function () {
        ReactDom.unmountComponentAtNode(this.domElement);
    };
    Object.defineProperty(QuickLinksWebPart.prototype, "dataVersion", {
        get: function () {
            return Version.parse('1.0');
        },
        enumerable: true,
        configurable: true
    });
    QuickLinksWebPart.prototype.getPropertyPaneConfiguration = function () {
        return {
            pages: [
                {
                    groups: [
                        {
                            groupFields: [
                                PropertyPaneDropdown('listId', {
                                    label: strings.selectedListNameFieldLabel,
                                    options: this._listsInThisSite
                                }),
                                PropertyPaneSlider('numberOfSeconds', {
                                    label: strings.NumberOfSecondFieldLabel,
                                    min: 4,
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
    QuickLinksWebPart.prototype.fetchLists = function (url) {
        return this.context.spHttpClient.get(url, SPHttpClient.configurations.v1).then(function (response) {
            if (response.ok) {
                return response.json();
            }
            else {
                console.log("WARNING - failed to hit URL " + url + ". Error = " + response.statusText);
                return null;
            }
        });
    };
    //get option of ListName with ListId
    QuickLinksWebPart.prototype.fetchOptions = function () {
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
    return QuickLinksWebPart;
}(BaseClientSideWebPart));
export default QuickLinksWebPart;
//# sourceMappingURL=QuickLinksWebPart.js.map