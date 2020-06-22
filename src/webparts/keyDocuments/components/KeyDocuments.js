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
var KeyDocuments_module_scss_1 = require("./KeyDocuments.module.scss");
var Link_1 = require("office-ui-fabric-react/lib/components/Link");
var common_1 = require("../../common/common");
var logo = require('../assets/logo.png');
var excel = require('../assets/excel.png');
var pdf = require('../assets/pdf.png');
var word = require('../assets/word.png');
var KeyDocuments = /** @class */ (function (_super) {
    __extends(KeyDocuments, _super);
    function KeyDocuments(props, state) {
        var _this = _super.call(this, props) || this;
        //get Key Documents
        _this.GetItemsForDocuments = function () {
            var newCommonObj = new common_1.default();
            var listName = 'Documents';
            var url = _this.props.siteurl;
            var query = "?$select=File,File_x0020_Type&$expand=File&$top=4";
            var method = 'get items for Documents';
            newCommonObj.getDataFromList(url, listName, query, method).then(function (res) {
                if (res.data.value != undefined && res.data.value != null) {
                    if (res.data.value.length > 0) {
                        //response not null then setState this Response
                        var items = res.data.value;
                        _this.setState({ items: items });
                    }
                }
            }).catch(function (error) {
                console.log('error while getting data');
                console.log(error);
            });
        };
        //Initialize the State
        _this.state = {
            items: [
                {
                    File: {
                        Name: "",
                        LinkingUri: "",
                        //FileRef: "",
                        File_x0020_Type: ""
                    },
                    File_x0020_Type: ""
                }
            ]
        };
        return _this;
    }
    KeyDocuments.prototype.componentDidMount = function () {
        this.GetItemsForDocuments();
    };
    KeyDocuments.prototype.render = function () {
        return (React.createElement("div", { className: KeyDocuments_module_scss_1.default.keyDocuments },
            React.createElement("div", { className: KeyDocuments_module_scss_1.default.container },
                React.createElement("h2", { className: KeyDocuments_module_scss_1.default.header }, "KEY DOCUMENTS"),
                React.createElement("div", { className: "ms-Grid " + KeyDocuments_module_scss_1.default.keyblk, dir: "ltr" }, this.state.items.map(function (item, key) {
                    return (React.createElement("div", { className: "ms-Grid-row" },
                        React.createElement("div", { className: "ms-Grid-col ms-sm1 ms-md1 " + KeyDocuments_module_scss_1.default.docimg }, item.File_x0020_Type == 'xlsx' ? (React.createElement("img", { src: "" + excel })) :
                            item.File_x0020_Type == 'pdf' ?
                                (React.createElement("img", { src: "" + pdf }))
                                : (React.createElement("img", { src: "" + word }))),
                        React.createElement("div", { className: "ms-Grid-col ms-sm10 ms-md10 filename" },
                            React.createElement(Link_1.Link, { href: "" + item.File.LinkingUri, target: '_blank', className: KeyDocuments_module_scss_1.default.text }, item.File.Name))));
                })))));
    };
    return KeyDocuments;
}(React.Component));
exports.default = KeyDocuments;
//# sourceMappingURL=KeyDocuments.js.map