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
import * as strings from 'BirthdaysWebPartStrings';
import Birthdays from './components/Birthdays';
import { SPHttpClient } from '@microsoft/sp-http';
var BirthdaysWebPart = /** @class */ (function (_super) {
    __extends(BirthdaysWebPart, _super);
    function BirthdaysWebPart() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._listsInThisSite = [];
        return _this;
    }
    BirthdaysWebPart.prototype.onInit = function () {
        var _this = this;
        this.fetchOptions()
            .then(function (data) {
            _this._listsInThisSite = data;
        });
        return Promise.resolve();
    };
    BirthdaysWebPart.prototype.render = function () {
        var _this = this;
        this.context.msGraphClientFactory.getClient().then(function (msGraphClient) {
            var element = React.createElement(Birthdays, {
                siteurl: _this.context.pageContext.web.absoluteUrl,
                msGraphClient: msGraphClient,
                currentUserEmail: _this.context.pageContext.user.email,
                listId: _this.properties.listId,
                Practices: _this.properties.Practices,
                records: _this.properties.records,
            });
            ReactDom.render(element, _this.domElement);
        });
    };
    BirthdaysWebPart.prototype.onDispose = function () {
        ReactDom.unmountComponentAtNode(this.domElement);
    };
    Object.defineProperty(BirthdaysWebPart.prototype, "dataVersion", {
        get: function () {
            return Version.parse('1.0');
        },
        enumerable: true,
        configurable: true
    });
    BirthdaysWebPart.prototype.getPropertyPaneConfiguration = function () {
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
                                PropertyPaneDropdown('listId', {
                                    label: strings.selectedListNameFieldLabel,
                                    options: this._listsInThisSite
                                }),
                                PropertyPaneCheckbox('Practices', {
                                    text: 'Practice Wise?',
                                    checked: this.properties.Practices
                                }),
                                PropertyPaneDropdown('records', {
                                    label: strings.numberOfRecords,
                                    options: [
                                        {
                                            key: "All",
                                            text: "All"
                                        },
                                        {
                                            key: "3",
                                            text: "3"
                                        }
                                    ]
                                }),
                            ]
                        }
                    ]
                }
            ]
        };
    };
    BirthdaysWebPart.prototype.fetchOptions = function () {
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
    BirthdaysWebPart.prototype.fetchLists = function (url) {
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
    return BirthdaysWebPart;
}(BaseClientSideWebPart));
export default BirthdaysWebPart;
//# sourceMappingURL=BirthdaysWebPart.js.map