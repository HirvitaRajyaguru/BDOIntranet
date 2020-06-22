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
import { BaseClientSideWebPart, PropertyPaneDropdown, PropertyPaneCheckbox, PropertyPaneLabel, PropertyPaneToggle } from '@microsoft/sp-webpart-base';
import { PropertyFieldDateTimePicker, DateConvention } from '@pnp/spfx-property-controls/lib/PropertyFieldDateTimePicker';
import * as strings from 'EventsWebPartStrings';
import Events from './components/Events';
import { Environment, EnvironmentType } from '@microsoft/sp-core-library';
import { SPHttpClient } from '@microsoft/sp-http';
import * as moment from 'moment';
var EventsWebPart = /** @class */ (function (_super) {
    __extends(EventsWebPart, _super);
    function EventsWebPart() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._listsInThisSite = [];
        return _this;
    }
    EventsWebPart.prototype.onInit = function () {
        var _this = this;
        if (!this.properties.eventStartDate) {
            this.properties.eventStartDate = { value: moment().subtract(2, 'years').startOf('month').toDate(), displayValue: moment().format('ddd MMM MM YYYY') };
        }
        if (!this.properties.eventEndDate) {
            this.properties.eventEndDate = { value: moment().add(20, 'years').endOf('month').toDate(), displayValue: moment().format('ddd MMM MM YYYY') };
        }
        this.fetchOptions()
            .then(function (data) {
            _this._listsInThisSite = data;
        });
        return Promise.resolve();
    };
    EventsWebPart.prototype.render = function () {
        var element = React.createElement(Events, {
            isWorkbench: Environment.type == EnvironmentType.Local,
            siteUrl: this.context.pageContext.web.absoluteUrl,
            listId: this.properties.listId,
            eventStartDate: this.properties.eventStartDate,
            eventEndDate: this.properties.eventEndDate,
            spHttpClient: this.context.spHttpClient,
            Practices: this.properties.Practices,
            Homepage: this.properties.Homepage
        });
        ReactDom.render(element, this.domElement);
    };
    EventsWebPart.prototype.onDispose = function () {
        ReactDom.unmountComponentAtNode(this.domElement);
    };
    Object.defineProperty(EventsWebPart.prototype, "dataVersion", {
        get: function () {
            return Version.parse('1.0');
        },
        enumerable: true,
        configurable: true
    });
    EventsWebPart.prototype.getPropertyPaneConfiguration = function () {
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
                                PropertyPaneLabel('eventStartDate', {
                                    text: strings.eventSelectDatesLabel
                                }),
                                PropertyFieldDateTimePicker('eventStartDate', {
                                    label: 'From',
                                    initialDate: this.properties.eventStartDate,
                                    dateConvention: DateConvention.Date,
                                    onPropertyChange: this.onPropertyPaneFieldChanged,
                                    properties: this.properties,
                                    onGetErrorMessage: this.onEventStartDateValidation,
                                    deferredValidationTime: 0,
                                    key: 'eventStartDateId'
                                }),
                                PropertyFieldDateTimePicker('eventEndDate', {
                                    label: 'to',
                                    initialDate: this.properties.eventEndDate,
                                    dateConvention: DateConvention.Date,
                                    onPropertyChange: this.onPropertyPaneFieldChanged,
                                    properties: this.properties,
                                    onGetErrorMessage: this.onEventEndDateValidation,
                                    deferredValidationTime: 0,
                                    key: 'eventEndDateId'
                                }),
                                PropertyPaneCheckbox('Practices', {
                                    text: strings.SelectedPrectices,
                                    checked: this.properties.Practices
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
    EventsWebPart.prototype.fetchLists = function (url) {
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
    EventsWebPart.prototype.fetchOptions = function () {
        var url = this.context.pageContext.web.absoluteUrl + "/_api/web/lists?$filter=BaseTemplate eq 106 and Hidden eq false"; //106 code for Event List
        return this.fetchLists(url).then(function (response) {
            var options = new Array();
            var lists = response.value;
            lists.forEach(function (list) {
                options.push({ key: list.Id, text: list.Title });
            });
            return options;
        });
    };
    EventsWebPart.prototype.onEventStartDateValidation = function (date) {
        if (date && this.properties.eventEndDate.value) {
            if (moment(date).isAfter(moment(this.properties.eventEndDate.value))) {
                return strings.SartDateValidationMessage;
            }
        }
        return '';
    };
    EventsWebPart.prototype.onEventEndDateValidation = function (date) {
        if (date && this.properties.eventEndDate.value) {
            if (moment(date).isBefore(moment(this.properties.eventStartDate.value))) {
                return strings.EnDateValidationMessage;
            }
        }
        return '';
    };
    return EventsWebPart;
}(BaseClientSideWebPart));
export default EventsWebPart;
//# sourceMappingURL=EventsWebPart.js.map