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
import { BaseClientSideWebPart, PropertyPaneDropdown, PropertyPaneToggle } from '@microsoft/sp-webpart-base';
import * as strings from 'HolidayCalendarWebPartStrings';
import { SPHttpClient } from '@microsoft/sp-http';
import HolidayCalendar from './components/HolidayCalendar';
var HolidayCalendarWebPart = /** @class */ (function (_super) {
    __extends(HolidayCalendarWebPart, _super);
    function HolidayCalendarWebPart() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._listsInThisSite = [];
        return _this;
    }
    HolidayCalendarWebPart.prototype.onInit = function () {
        var _this = this;
        this.fetchOptions()
            .then(function (data) {
            _this._listsInThisSite = data;
        });
        return Promise.resolve();
    };
    HolidayCalendarWebPart.prototype.render = function () {
        var _this = this;
        this.context.msGraphClientFactory.getClient()
            .then(function (client) {
            var element = React.createElement(HolidayCalendar, {
                siteurl: _this.context.pageContext.web.absoluteUrl,
                listId: _this.properties.listId,
                graphClient: client,
                Homepage: _this.properties.Homepage
            });
            ReactDom.render(element, _this.domElement);
        });
    };
    HolidayCalendarWebPart.prototype.onDispose = function () {
        ReactDom.unmountComponentAtNode(this.domElement);
    };
    Object.defineProperty(HolidayCalendarWebPart.prototype, "dataVersion", {
        get: function () {
            return Version.parse('1.0');
        },
        enumerable: true,
        configurable: true
    });
    HolidayCalendarWebPart.prototype.getPropertyPaneConfiguration = function () {
        return {
            pages: [
                {
                    groups: [
                        {
                            groupFields: [
                                PropertyPaneDropdown('listId', {
                                    label: strings.ListFieldLabel,
                                    options: this._listsInThisSite
                                }),
                                PropertyPaneToggle('Homepage', {
                                    label: strings.Homepage
                                })
                            ]
                        }
                    ]
                }
            ]
        };
    };
    /**
     *  fetch List Options
     * @param url
     */
    HolidayCalendarWebPart.prototype.fetchOptions = function () {
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
    HolidayCalendarWebPart.prototype.fetchLists = function (url) {
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
    return HolidayCalendarWebPart;
}(BaseClientSideWebPart));
export default HolidayCalendarWebPart;
//# sourceMappingURL=HolidayCalendarWebPart.js.map