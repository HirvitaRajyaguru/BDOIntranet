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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var UploadJobResume_module_scss_1 = require("./UploadJobResume.module.scss");
var sp_core_library_1 = require("@microsoft/sp-core-library");
var Dialog_1 = require("office-ui-fabric-react/lib/Dialog");
var Button_1 = require("office-ui-fabric-react/lib/Button");
var Label_1 = require("office-ui-fabric-react/lib/Label");
var common_1 = require("../../common/common");
var sp_pnp_js_1 = require("sp-pnp-js");
var UploadJobResume = /** @class */ (function (_super) {
    __extends(UploadJobResume, _super);
    function UploadJobResume(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            items: [
                {
                    Title: "",
                    JobDescription: "Test",
                    Experience: "Test description",
                    Id: 0
                }
            ],
            Success: "",
            popupOpened: false,
            hideDialog: true
        };
        _this.filesave = _this.filesave.bind(_this);
        _this.closeDialog = _this.closeDialog.bind(_this);
        return _this;
    }
    UploadJobResume.prototype.componentDidMount = function () {
        var _this = this;
        var queryParms = new sp_core_library_1.UrlQueryParameterCollection(window.location.href);
        var ID = queryParms.getValue("RID");
        var url = this.props.siteurl;
        var method = 'get items for UploadResume';
        var listname = 'Jobopening';
        var query = "?$Filter=Id eq " + ID;
        var newCommonObj = new common_1.default();
        newCommonObj.getDataFromList(url, listname, query, method).then(function (res) { return __awaiter(_this, void 0, void 0, function () {
            var Jobopeningdata;
            return __generator(this, function (_a) {
                Jobopeningdata = res.data.value;
                this.setState({ items: Jobopeningdata });
                return [2 /*return*/];
            });
        }); })
            .catch(function (error) {
            console.log(error);
        });
    };
    UploadJobResume.prototype.render = function () {
        return (React.createElement("div", null,
            React.createElement(Dialog_1.default, { type: Dialog_1.DialogType.close, isOpen: this.state.popupOpened, title: "Resume Upload", onDismiss: this.closeDialog, containerClassName: '', isDarkOverlay: true, isBlocking: false },
                React.createElement("div", null,
                    React.createElement("div", null,
                        React.createElement(Label_1.Label, null, "Thank You for Referring Candidate")),
                    React.createElement("div", { style: { paddingTop: '20px' } },
                        React.createElement(Button_1.Button, { onClick: this.closeDialog, buttonType: Button_1.ButtonType.primary }, "OK")))),
            React.createElement("div", { className: UploadJobResume_module_scss_1.default.uploadJobResume },
                React.createElement("div", { className: UploadJobResume_module_scss_1.default.container },
                    React.createElement("p", { className: UploadJobResume_module_scss_1.default.header }, "Job Openings Resume Upload"),
                    React.createElement("div", { className: UploadJobResume_module_scss_1.default.item },
                        React.createElement("div", { className: UploadJobResume_module_scss_1.default.jobsection },
                            React.createElement("div", { className: UploadJobResume_module_scss_1.default.jobitem }, this.state.items.map(function (item, key) {
                                return (React.createElement("div", null,
                                    React.createElement("div", { className: "ms-Grid-row" },
                                        React.createElement("div", { className: "ms-Grid-col ms-md3" }, "Designation"),
                                        React.createElement("div", { className: "ms-Grid-col  ms-md9 " },
                                            React.createElement("div", { className: UploadJobResume_module_scss_1.default.subject }, item.Title))),
                                    React.createElement("div", { className: "ms-Grid-row" },
                                        React.createElement("div", { className: "ms-Grid-col ms-md3" }, "Experience"),
                                        React.createElement("div", { className: "ms-Grid-col  ms-md9 " },
                                            React.createElement("div", { className: UploadJobResume_module_scss_1.default.subject }, item.Experience))),
                                    React.createElement("div", { className: "ms-Grid-row" },
                                        React.createElement("div", { className: "ms-Grid-col ms-md3" }, "Job Description"),
                                        React.createElement("div", { className: "ms-Grid-col  ms-md9 " },
                                            React.createElement("div", { className: UploadJobResume_module_scss_1.default.subject }, item.JobDescription)))));
                            })),
                            React.createElement("div", null,
                                React.createElement("div", null,
                                    React.createElement("input", { type: "file", name: "myFile", id: "newfile", accept: ".doc,.docx,.pdf", className: UploadJobResume_module_scss_1.default.chooseFile })),
                                React.createElement("div", null,
                                    React.createElement("br", null),
                                    React.createElement("button", { onClick: this.filesave }, " UploadFile"))),
                            React.createElement("div", { className: UploadJobResume_module_scss_1.default.subject }, this.state.Success)))))));
    };
    UploadJobResume.prototype.closeDialog = function () {
        this.setState({ popupOpened: false, hideDialog: true });
    };
    UploadJobResume.prototype.filesave = function () {
        var _this = this;
        var web = new sp_pnp_js_1.Web(this.props.siteurl);
        var myfile = document.querySelector("#newfile").files[0];
        if (myfile.size <= 10485760) {
            web.getFolderByServerRelativeUrl("/sites/BDOIntranet/JobResumes").files.add(myfile.name, myfile, true).then(function (f) {
                f.file.getItem().then(function (item) {
                    item.update({
                        JobTitle: _this.state.items[0].Title,
                        Experience: _this.state.items[0].Experience
                    }).then(function (myupdate) {
                        _this.setState({ Success: "File Uploaded" });
                        _this.setState({ popupOpened: true });
                    });
                });
            });
        }
        else {
            web.getFolderByServerRelativeUrl("/sites/BDOIntranet/JobResumes")
                .files.addChunked(myfile.name, myfile)
                .then(function (_a) {
                var file = _a.file;
                return file.getItem();
            }).then(function (item) {
                return item.update({
                    JobTitle: _this.state.items[0].Title,
                    Experience: _this.state.items[0].Experience
                }).then(function (myupdate) {
                    _this.setState({ popupOpened: true });
                });
            }).catch(console.log);
        }
    };
    return UploadJobResume;
}(React.Component));
exports.default = UploadJobResume;
//# sourceMappingURL=UploadJobResume.js.map