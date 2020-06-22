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
var PromptedLinks_module_scss_1 = require("./PromptedLinks.module.scss");
var sp_lodash_subset_1 = require("@microsoft/sp-lodash-subset");
var PromptedLinks = /** @class */ (function (_super) {
    __extends(PromptedLinks, _super);
    function PromptedLinks() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PromptedLinks.prototype.render = function () {
        return (React.createElement("div", { className: PromptedLinks_module_scss_1.default.promptedLinks },
            React.createElement("div", { className: PromptedLinks_module_scss_1.default.container },
                React.createElement("div", { className: PromptedLinks_module_scss_1.default.row },
                    React.createElement("div", { className: PromptedLinks_module_scss_1.default.column },
                        React.createElement("span", { className: PromptedLinks_module_scss_1.default.title }, "Welcome to SharePoint!"),
                        React.createElement("p", { className: PromptedLinks_module_scss_1.default.subTitle }, "Customize SharePoint experiences using Web Parts."),
                        React.createElement("p", { className: PromptedLinks_module_scss_1.default.description }, sp_lodash_subset_1.escape(this.props.description)),
                        React.createElement("a", { href: "https://aka.ms/spfx", className: PromptedLinks_module_scss_1.default.button },
                            React.createElement("span", { className: PromptedLinks_module_scss_1.default.label }, "Learn more")))))));
    };
    return PromptedLinks;
}(React.Component));
exports.default = PromptedLinks;
//# sourceMappingURL=PromptedLinks.js.map