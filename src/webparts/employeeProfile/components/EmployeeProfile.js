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
var jsPDF = require("jspdf"); //npm install jspdf@1.4.1 --save, npm i @types/jspdf --save use in same sequence
var html2canvas_1 = require("html2canvas"); //npm i  html2canvas --save use this to install
var sp_pnp_js_1 = require("sp-pnp-js");
require("./tablestyle.css");
var siteUrl = "https://synoverge.sharepoint.com/sites/BDO-QA/";
var web = new sp_pnp_js_1.Web(siteUrl);
var EmployeeProfile = /** @class */ (function (_super) {
    __extends(EmployeeProfile, _super);
    function EmployeeProfile(props) {
        return _super.call(this, props) || this;
    }
    EmployeeProfile.prototype.render = function () {
        return (React.createElement("div", null,
            React.createElement("div", { id: "mypdf" },
                React.createElement("br", null),
                React.createElement("table", null,
                    React.createElement("tbody", null,
                        React.createElement("tr", null,
                            React.createElement("th", null, "Name"),
                            React.createElement("th", null, "City"),
                            React.createElement("th", null, "Country")),
                        React.createElement("tr", null,
                            React.createElement("td", null, "Madhan Thurai"),
                            React.createElement("td", null, "Chennai"),
                            React.createElement("td", null, "India")),
                        React.createElement("tr", null,
                            React.createElement("td", null, "Reghu"),
                            React.createElement("td", null, "Madurai"),
                            React.createElement("td", null, "India")),
                        React.createElement("tr", null,
                            React.createElement("td", null, "Ananth"),
                            React.createElement("td", null, "Nagercoil"),
                            React.createElement("td", null, "India")),
                        React.createElement("tr", null,
                            React.createElement("td", null, "Vanitha"),
                            React.createElement("td", null, "Cuddalore"),
                            React.createElement("td", null, "India")),
                        React.createElement("tr", null,
                            React.createElement("td", null, "Boopathi"),
                            React.createElement("td", null, "Dindigul"),
                            React.createElement("td", null, "India")),
                        React.createElement("tr", null,
                            React.createElement("td", null, "Risha"),
                            React.createElement("td", null, "Tirunelveli"),
                            React.createElement("td", null, "India"))))),
            React.createElement("button", { onClick: this.PrintDocument }, "Generate Pdf ")));
    };
    EmployeeProfile.prototype.PrintDocument = function () {
        var myinput = document.getElementById("mypdf");
        var mynewpdf = new jsPDF("p", "mm", "a4");
        html2canvas_1.default(myinput).then(function (canvas) {
            var imgWidth = 200;
            var pageHeight = 290;
            var imgHeight = (canvas.height * imgWidth) / canvas.width;
            var heightLeft = imgHeight;
            var imgData = canvas.toDataURL("image/png");
            var position = 0;
            mynewpdf.addImage(imgData, "JPEG", 5, position, imgWidth, imgHeight);
            web
                .getFolderByServerRelativeUrl("/sites/BDO-QA/Shared%20Documents")
                .files.add("test.pdf", mynewpdf.output("arraybuffer"), true);
        });
        location.href = 'http://www.google.com';
    };
    return EmployeeProfile;
}(React.Component));
exports.default = EmployeeProfile;
//# sourceMappingURL=EmployeeProfile.js.map