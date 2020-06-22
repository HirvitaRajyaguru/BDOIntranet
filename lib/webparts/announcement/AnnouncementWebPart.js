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
import * as strings from 'AnnouncementWebPartStrings';
import Announcement from './components/Announcement';
import { SPHttpClient } from '@microsoft/sp-http';
import { sp } from "@pnp/sp";
//export interface IAnnouncementWebPartProps {
//  listName: string;
//}
var AnnouncementWebPart = /** @class */ (function (_super) {
    __extends(AnnouncementWebPart, _super);
    function AnnouncementWebPart() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.listDropdownDisabled = true;
        _this._listsInThisSite = [];
        _this._listsofSite = [];
        return _this;
    }
    AnnouncementWebPart.prototype.onInit = function () {
        var _this = this;
        this.fetchsiteOptions().then(function (sitedata) {
            _this._listsofSite = sitedata;
        });
        if (this.properties.site) {
            this.listDropdownDisabled = false;
            this.fetchOptions()
                .then(function (data) {
                _this._listsInThisSite = data;
            });
        }
        return Promise.resolve();
    };
    AnnouncementWebPart.prototype.render = function () {
        var element = React.createElement(Announcement, {
            siteurl: this.context.pageContext.web.absoluteUrl,
            site: this.properties.site,
            listId: this.properties.listId,
            spHttpClient: this.context.spHttpClient,
            Practices: this.properties.Practices
        });
        ReactDom.render(element, this.domElement);
    };
    AnnouncementWebPart.prototype.onDispose = function () {
        ReactDom.unmountComponentAtNode(this.domElement);
    };
    Object.defineProperty(AnnouncementWebPart.prototype, "dataVersion", {
        get: function () {
            return Version.parse('1.0');
        },
        enumerable: true,
        configurable: true
    });
    AnnouncementWebPart.prototype.getPropertyPaneConfiguration = function () {
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
                                PropertyPaneDropdown('site', {
                                    label: strings.selectedsiteNameFieldLabel,
                                    options: this._listsofSite
                                }),
                                PropertyPaneDropdown('listId', {
                                    label: strings.selectedListNameFieldLabel,
                                    options: this._listsInThisSite,
                                    disabled: this.listDropdownDisabled
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
    //fetch all sites
    AnnouncementWebPart.prototype.fetchsiteOptions = function () {
        var options = new Array();
        // do a null check of department id
        return sp.search({
            Querytext: "contentclass:STS_Site",
            SelectProperties: ["Title", "SPSiteUrl", "WebTemplate"],
            RefinementFilters: ["departmentid:string(\"{*\",linguistics=off)"],
            RowLimit: 500,
            TrimDuplicates: false
        }).then(function (r) {
            r.PrimarySearchResults.forEach(function (value) {
                options.push({ key: value.SPSiteUrl, text: value.Title });
            });
            return options;
        });
    };
    //fetch option of list based on site
    AnnouncementWebPart.prototype.fetchOptions = function () {
        var url = this.properties.site + "/_api/web/lists?$filter=BaseTemplate eq 100 and Hidden eq false"; //100 code for Custom List
        return this.fetchLists(url).then(function (response) {
            var options = new Array();
            var lists = response.value;
            lists.forEach(function (list) {
                options.push({ key: list.Id, text: list.Title });
            });
            return options;
        });
    };
    AnnouncementWebPart.prototype.fetchLists = function (url) {
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
    return AnnouncementWebPart;
}(BaseClientSideWebPart));
export default AnnouncementWebPart;
//# sourceMappingURL=AnnouncementWebPart.js.map