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
import * as strings from 'AnnouncementMarqueeWebPartStrings';
import AnnouncementMarquee from './components/AnnouncementMarquee';
import { SPHttpClient } from '@microsoft/sp-http';
//export interface IAnnouncementMarqueeWebPartProps {
//  listName: string;
//}
var AnnouncementMarqueeWebPart = /** @class */ (function (_super) {
    __extends(AnnouncementMarqueeWebPart, _super);
    function AnnouncementMarqueeWebPart() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._listsInThisSite = [];
        return _this;
    }
    AnnouncementMarqueeWebPart.prototype.onInit = function () {
        var _this = this;
        this.fetchOptions()
            .then(function (data) {
            _this._listsInThisSite = data;
        });
        return Promise.resolve();
    };
    AnnouncementMarqueeWebPart.prototype.render = function () {
        var element = React.createElement(AnnouncementMarquee, {
            siteurl: this.context.pageContext.web.absoluteUrl,
            listId: this.properties.listId,
            spHttpClient: this.context.spHttpClient,
            Practices: this.properties.Practices
        });
        ReactDom.render(element, this.domElement);
    };
    AnnouncementMarqueeWebPart.prototype.onDispose = function () {
        ReactDom.unmountComponentAtNode(this.domElement);
    };
    Object.defineProperty(AnnouncementMarqueeWebPart.prototype, "dataVersion", {
        get: function () {
            return Version.parse('1.0');
        },
        enumerable: true,
        configurable: true
    });
    AnnouncementMarqueeWebPart.prototype.getPropertyPaneConfiguration = function () {
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
                                })
                            ]
                        }
                    ]
                }
            ]
        };
    };
    AnnouncementMarqueeWebPart.prototype.fetchLists = function (url) {
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
    AnnouncementMarqueeWebPart.prototype.fetchOptions = function () {
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
    return AnnouncementMarqueeWebPart;
}(BaseClientSideWebPart));
export default AnnouncementMarqueeWebPart;
//# sourceMappingURL=AnnouncementMarqueeWebPart.js.map