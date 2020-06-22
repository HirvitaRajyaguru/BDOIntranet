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
import styles from './Newsletters.module.scss';
import axios from 'axios';
var Newsletters = /** @class */ (function (_super) {
    __extends(Newsletters, _super);
    function Newsletters(props, state) {
        var _this = _super.call(this, props) || this;
        //Initialize the State
        _this.state = {
            items: [{
                    "title": null,
                    "description": null,
                    "url": null
                }]
        };
        return _this;
    }
    Newsletters.prototype.componentDidMount = function () {
        this.getNewsfromNewsAPI();
    };
    //get data from news api
    Newsletters.prototype.getNewsfromNewsAPI = function () {
        var _this = this;
        axios.get("https://newsapi.org/v2/top-headlines?sortedBy=publishedAt&country=in&category=business&pageSize=5&apiKey=15fad485feb34f559b338424b93a0f00")
            .then(function (res) {
            console.log(res.data.articles);
            _this.setState({
                items: res.data.articles // set the URL response in the items state 
            });
        })
            .catch(function (error) {
            console.log(error);
        });
    };
    Newsletters.prototype.render = function () {
        return (React.createElement("div", { className: styles.newsletters },
            React.createElement("div", { className: styles.container },
                React.createElement("div", { className: styles.tableStyle },
                    React.createElement("h2", { className: styles.tableCaptionStyle }, "News"),
                    //map data from the item state
                    this.state.items.map(function (item, key) {
                        return (React.createElement("div", { className: styles.rowStyle, key: key },
                            React.createElement("div", { className: styles.titleStyle },
                                React.createElement("a", { href: item.url, target: "_blank" }, item.title),
                                React.createElement("div", { className: styles.descriptionStyle }, item.description))));
                    })))));
    };
    return Newsletters;
}(React.Component));
export default Newsletters;
//# sourceMappingURL=Newsletters.js.map