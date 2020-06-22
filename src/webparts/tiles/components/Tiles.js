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
var Tiles_module_scss_1 = require("./Tiles.module.scss");
var TilesItem_1 = require("./TilesItem");
var sp_http_1 = require("@microsoft/sp-http");
var Tiles = /** @class */ (function (_super) {
    __extends(Tiles, _super);
    function Tiles(props, state) {
        var _this = _super.call(this, props) || this;
        _this.state = { listData: [] };
        return _this;
    }
    Tiles.prototype.componentDidMount = function () {
        this.loadData();
    };
    Tiles.prototype.loadData = function () {
        var _this = this;
        this.props.spHttpClient.get(this.props.siteUrl + "/_api/Web/Lists(guid'" + this.props.listId + "')/Items?$top=" + this.props.numberOfItems, sp_http_1.SPHttpClient.configurations.v1)
            .then(function (response) {
            return response.json();
        })
            .then(function (items) {
            var listItems = [];
            for (var i = 0; i < items.value.length; i++) {
                listItems.push({
                    Title: items.value[i].Title,
                    Description: items.value[i].Description,
                    ImageUrl: items.value[i].BackgroundImageLocation.Url,
                    LinkUrl: items.value[i].LinkLocation.Url
                });
            }
            _this.setState({ listData: listItems });
        }, function (err) {
            console.log(err);
        });
    };
    Tiles.prototype.componentDidUpdate = function (prevProps, prevState, prevContext) {
        if (prevProps.numberOfItems != this.props.numberOfItems
            || prevProps.listId != this.props.listId && (this.props.numberOfItems && this.props.listId)) {
            this.loadData();
        }
    };
    Tiles.prototype.render = function () {
        return (React.createElement("div", { className: Tiles_module_scss_1.default.tiles },
            React.createElement("div", { className: Tiles_module_scss_1.default.container },
                this.state.listData.map(function (item) {
                    return React.createElement(TilesItem_1.default, { title: item.Title, description: item.Description, imageUrl: item.ImageUrl, href: item.LinkUrl });
                }),
                React.createElement("div", { style: { clear: 'both' } }))));
    };
    return Tiles;
}(React.Component));
exports.default = Tiles;
//# sourceMappingURL=Tiles.js.map