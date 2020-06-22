"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var ReactDom = require("react-dom");
var sp_core_library_1 = require("@microsoft/sp-core-library");
var sp_webpart_base_1 = require("@microsoft/sp-webpart-base");
var PropertyFieldDateTimePicker_1 = require("@pnp/spfx-property-controls/lib/PropertyFieldDateTimePicker");
var strings = require("EventsWebPartStrings");
var Events_1 = require("./components/Events");
var sp_core_library_2 = require("@microsoft/sp-core-library");
var sp_http_1 = require("@microsoft/sp-http");
var moment = require("moment");
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
        var element = React.createElement(Events_1.default, {
            isWorkbench: sp_core_library_2.Environment.type == sp_core_library_2.EnvironmentType.Local,
            siteUrl: this.context.pageContext.web.absoluteUrl,
            listId: this.properties.listId,
            eventStartDate: this.properties.eventStartDate,
            eventEndDate: this.properties.eventEndDate,
            spHttpClient: this.context.spHttpClient,
            Practices: this.properties.Practices,
        });
        ReactDom.render(element, this.domElement);
    };
    EventsWebPart.prototype.onDispose = function () {
        ReactDom.unmountComponentAtNode(this.domElement);
    };
    Object.defineProperty(EventsWebPart.prototype, "dataVersion", {
        get: function () {
            return sp_core_library_1.Version.parse('1.0');
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
                                sp_webpart_base_1.PropertyPaneDropdown('listId', {
                                    label: strings.selectedListNameFieldLabel,
                                    options: this._listsInThisSite
                                }),
                                sp_webpart_base_1.PropertyPaneLabel('eventStartDate', {
                                    text: strings.eventSelectDatesLabel
                                }),
                                PropertyFieldDateTimePicker_1.PropertyFieldDateTimePicker('eventStartDate', {
                                    label: 'From',
                                    initialDate: this.properties.eventStartDate,
                                    dateConvention: PropertyFieldDateTimePicker_1.DateConvention.Date,
                                    onPropertyChange: this.onPropertyPaneFieldChanged,
                                    properties: this.properties,
                                    onGetErrorMessage: this.onEventStartDateValidation,
                                    deferredValidationTime: 0,
                                    key: 'eventStartDateId'
                                }),
                                PropertyFieldDateTimePicker_1.PropertyFieldDateTimePicker('eventEndDate', {
                                    label: 'to',
                                    initialDate: this.properties.eventEndDate,
                                    dateConvention: PropertyFieldDateTimePicker_1.DateConvention.Date,
                                    onPropertyChange: this.onPropertyPaneFieldChanged,
                                    properties: this.properties,
                                    onGetErrorMessage: this.onEventEndDateValidation,
                                    deferredValidationTime: 0,
                                    key: 'eventEndDateId'
                                }),
                                sp_webpart_base_1.PropertyPaneCheckbox('Practices', {
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
    EventsWebPart.prototype.fetchLists = function (url) {
        return this.context.spHttpClient.get(url, sp_http_1.SPHttpClient.configurations.v1).then(function (response) {
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
}(sp_webpart_base_1.BaseClientSideWebPart));
exports.default = EventsWebPart;
//# sourceMappingURL=EventsWebPart.js.map