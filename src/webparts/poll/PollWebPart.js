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
var strings = require("PollWebPartStrings");
var Poll_1 = require("./components/Poll");
var PropertyFieldColorPickerMini_1 = require("sp-client-custom-fields/lib/PropertyFieldColorPickerMini");
var PropertyFieldFontPicker_1 = require("sp-client-custom-fields/lib/PropertyFieldFontPicker");
var PropertyFieldFontSizePicker_1 = require("sp-client-custom-fields/lib/PropertyFieldFontSizePicker");
var PropertyFieldSPListPicker_1 = require("sp-client-custom-fields/lib/PropertyFieldSPListPicker");
var PollWebPart = /** @class */ (function (_super) {
    __extends(PollWebPart, _super);
    function PollWebPart(context) {
        var _this = _super.call(this) || this;
        //Hack: to invoke correctly the onPropertyChange function outside this class
        //we need to bind this object on it first
        _this.onPropertyPaneFieldChanged = _this.onPropertyPaneFieldChanged.bind(_this);
        return _this;
    }
    PollWebPart.prototype.render = function () {
        var element = React.createElement(Poll_1.default, {
            surveyList: this.properties.surveyList,
            font: this.properties.font,
            size: this.properties.size,
            color: this.properties.color,
            chartType: this.properties.chartType,
            forceVoteToViewResults: this.properties.forceVoteToViewResults,
            context: this.context
        });
        ReactDom.render(element, this.domElement);
    };
    PollWebPart.prototype.onDispose = function () {
        ReactDom.unmountComponentAtNode(this.domElement);
    };
    Object.defineProperty(PollWebPart.prototype, "dataVersion", {
        get: function () {
            return sp_core_library_1.Version.parse('1.0');
        },
        enumerable: true,
        configurable: true
    });
    PollWebPart.prototype.getPropertyPaneConfiguration = function () {
        return {
            pages: [
                {
                    header: {
                        description: strings.PropertyPaneDescription
                    },
                    displayGroupsAsAccordion: true,
                    groups: [
                        {
                            groupName: strings.EffectGroupName,
                            groupFields: [
                                PropertyFieldSPListPicker_1.PropertyFieldSPListPicker('surveyList', {
                                    label: strings.surveyList,
                                    selectedList: this.properties.surveyList,
                                    includeHidden: false,
                                    baseTemplate: 102,
                                    orderBy: PropertyFieldSPListPicker_1.PropertyFieldSPListPickerOrderBy.Title,
                                    onPropertyChange: this.onPropertyPaneFieldChanged,
                                    render: this.render.bind(this),
                                    disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                                    context: this.context,
                                    properties: this.properties,
                                    key: 'simplePollListField'
                                }),
                                sp_webpart_base_1.PropertyPaneDropdown('chartType', {
                                    label: strings.chartType,
                                    options: [
                                        { key: 'pie', text: 'Pie chart' },
                                        { key: 'horizontalBar', text: 'Bar chart' }
                                    ]
                                }),
                                sp_webpart_base_1.PropertyPaneToggle('forceVoteToViewResults', {
                                    label: strings.forceVoteToViewResults
                                })
                            ]
                        },
                        {
                            groupName: strings.BasicGroupName,
                            groupFields: [
                                PropertyFieldFontPicker_1.PropertyFieldFontPicker('font', {
                                    label: strings.FontFieldLabel,
                                    useSafeFont: true,
                                    previewFonts: true,
                                    initialValue: this.properties.font,
                                    onPropertyChange: this.onPropertyPaneFieldChanged,
                                    render: this.render.bind(this),
                                    disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                                    properties: this.properties,
                                    key: 'simplePollFontField'
                                }),
                                PropertyFieldFontSizePicker_1.PropertyFieldFontSizePicker('size', {
                                    label: strings.FontSizeFieldLabel,
                                    usePixels: true,
                                    preview: true,
                                    initialValue: this.properties.size,
                                    onPropertyChange: this.onPropertyPaneFieldChanged,
                                    render: this.render.bind(this),
                                    disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                                    properties: this.properties,
                                    key: 'simplePollSizeField'
                                }),
                                PropertyFieldColorPickerMini_1.PropertyFieldColorPickerMini('color', {
                                    label: strings.ColorFieldLabel,
                                    initialColor: this.properties.color,
                                    onPropertyChange: this.onPropertyPaneFieldChanged,
                                    render: this.render.bind(this),
                                    disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                                    properties: this.properties,
                                    key: 'simplePollColorField'
                                })
                            ]
                        }
                    ]
                }
            ]
        };
    };
    return PollWebPart;
}(sp_webpart_base_1.BaseClientSideWebPart));
exports.default = PollWebPart;
//# sourceMappingURL=PollWebPart.js.map