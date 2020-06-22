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
import { BaseClientSideWebPart, PropertyPaneTextField, PropertyPaneDropdown, PropertyPaneCheckbox } from '@microsoft/sp-webpart-base';
import * as strings from 'InsightsWebPartStrings';
import Insights from './components/Insights';
import { SPHttpClient } from '@microsoft/sp-http';
var InsightsWebPart = /** @class */ (function (_super) {
    __extends(InsightsWebPart, _super);
    function InsightsWebPart() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._listsInThisSite = [];
        return _this;
    }
    InsightsWebPart.prototype.onInit = function () {
        var _this = this;
        this.fetchOptions()
            .then(function (data) {
            _this._listsInThisSite = data;
        });
        return Promise.resolve();
    };
    InsightsWebPart.prototype.render = function () {
        var element = React.createElement(Insights, {
            siteurl: this.context.pageContext.web.absoluteUrl,
            listId: this.properties.listId,
            Practices: this.properties.Practices,
            imageURL: this.properties.imageURL
        });
        ReactDom.render(element, this.domElement);
    };
    InsightsWebPart.prototype.onDispose = function () {
        ReactDom.unmountComponentAtNode(this.domElement);
    };
    Object.defineProperty(InsightsWebPart.prototype, "dataVersion", {
        get: function () {
            return Version.parse('1.0');
        },
        enumerable: true,
        configurable: true
    });
    InsightsWebPart.prototype.getPropertyPaneConfiguration = function () {
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
                                PropertyPaneCheckbox('Practices', {
                                    text: strings.SelectedPrectices,
                                    checked: this.properties.Practices
                                }),
                                //PropertyPane for ImageURL, If the URL changes the image will be changed immediately 
                                PropertyPaneTextField('imageURL', {
                                    label: "ImageURL"
                                })
                            ]
                        }
                    ]
                }
            ]
        };
    };
    InsightsWebPart.prototype.fetchOptions = function () {
        var url = this.context.pageContext.web.absoluteUrl + "/_api/web/lists?$filter=BaseTemplate eq 100 and Hidden eq false"; //100 code for Custom List
        return this.fetchLists(url).then(function (response) {
            var options = new Array();
            var lists = response.value;
            lists.forEach(function (list) {
                options.push({ key: list.Id, text: list.Title });
            });
            return options;
        });
    };
    InsightsWebPart.prototype.fetchLists = function (url) {
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
    return InsightsWebPart;
}(BaseClientSideWebPart));
export default InsightsWebPart;
//# sourceMappingURL=InsightsWebPart.js.map