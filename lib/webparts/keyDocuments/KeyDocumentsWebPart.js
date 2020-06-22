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
import { BaseClientSideWebPart, PropertyPaneDropdown, PropertyPaneCheckbox } from '@microsoft/sp-webpart-base';
import * as strings from 'KeyDocumentsWebPartStrings';
import KeyDocuments from './components/KeyDocuments';
import { SPHttpClient } from '@microsoft/sp-http';
//export interface IKeyDocumentsWebPartProps {
//  description: string;
//  listName: string;
//}
var KeyDocumentsWebPart = /** @class */ (function (_super) {
    __extends(KeyDocumentsWebPart, _super);
    function KeyDocumentsWebPart() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._listsInThisSite = [];
        return _this;
    }
    KeyDocumentsWebPart.prototype.onInit = function () {
        var _this = this;
        this.fetchOptions()
            .then(function (data) {
            _this._listsInThisSite = data;
        });
        return Promise.resolve();
    };
    KeyDocumentsWebPart.prototype.render = function () {
        var element = React.createElement(KeyDocuments, {
            siteurl: this.context.pageContext.web.absoluteUrl,
            listId: this.properties.listId,
            Practices: this.properties.Practices,
            Homepage: true
        });
        ReactDom.render(element, this.domElement);
    };
    KeyDocumentsWebPart.prototype.onDispose = function () {
        ReactDom.unmountComponentAtNode(this.domElement);
    };
    Object.defineProperty(KeyDocumentsWebPart.prototype, "dataVersion", {
        get: function () {
            return Version.parse('1.0');
        },
        enumerable: true,
        configurable: true
    });
    KeyDocumentsWebPart.prototype.getPropertyPaneConfiguration = function () {
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
                            ]
                        }
                    ]
                }
            ]
        };
    };
    KeyDocumentsWebPart.prototype.fetchOptions = function () {
        var url = this.context.pageContext.web.absoluteUrl + "/_api/web/lists?$filter=BaseTemplate eq 101"; //101 code for Document Library
        return this.fetchLists(url).then(function (response) {
            var options = new Array();
            var lists = response.value;
            lists.forEach(function (list) {
                options.push({ key: list.Id, text: list.Title });
            });
            return options;
        });
    };
    KeyDocumentsWebPart.prototype.fetchLists = function (url) {
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
    return KeyDocumentsWebPart;
}(BaseClientSideWebPart));
export default KeyDocumentsWebPart;
//# sourceMappingURL=KeyDocumentsWebPart.js.map