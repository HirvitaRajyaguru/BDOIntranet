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
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
import * as React from 'react';
import styles from './SportsScore.module.scss';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import RSlider from "react-slick";
import { Loader } from '../../common/Loading';
import axios from 'axios';
// Functional component for slider.
function NextArrow(props) {
    var className = props.className, style = props.style, onClick = props.onClick;
    return (React.createElement("div", { className: className, style: __assign({}, style, { display: "block", background: "#000", right: "0", top: "10px" }), onClick: onClick }));
}
function PrevArrow(props) {
    var className = props.className, style = props.style, onClick = props.onClick;
    return (React.createElement("div", { className: className, style: __assign({}, style, { display: "block", background: "#000", left: "92%", top: "10px", position: "absolute", zIndex: "1" }), onClick: onClick }));
}
var SportsScore = /** @class */ (function (_super) {
    __extends(SportsScore, _super);
    function SportsScore(props, state) {
        var _this = _super.call(this, props) || this;
        //Initialize the State
        _this.state = {
            isLoading: true,
            items: [{
                    "id": "",
                    "title": "No matches Today",
                }]
        };
        return _this;
    }
    SportsScore.prototype.componentDidMount = function () {
        this.LoadData();
    };
    //Load data from the api and set the state
    SportsScore.prototype.LoadData = function () {
        var reactHandler = this;
        axios.post('https://prod-07.centralindia.logic.azure.com:443/workflows/0e30ba1729fe4b5ba3a6593ac832d31c/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=AmIdCXHW0nmZtq85S5WiZKEEiJ3O7St9l1BHBKIS95A', {
            url: "http://static.cricinfo.com/rss/livescores.xml"
        })
            .then(function (response) {
            reactHandler.setState({
                items: response.data,
                isLoading: false,
            });
            console.log(response);
        })
            .catch(function (error) {
            console.log("Error fatching the feed.");
            console.log(error);
        });
    };
    SportsScore.prototype.render = function () {
        // Settings for the slider
        var settings = {
            dots: false,
            infinite: true,
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 3000,
            nextArrow: React.createElement(NextArrow, null),
            prevArrow: React.createElement(PrevArrow, null),
            focusOnSelect: true,
            pauseOnHover: true
        };
        var teams = [];
        var team1;
        var team2;
        return (React.createElement("div", { className: styles.sportsScore },
            React.createElement("div", { className: styles.container },
                React.createElement("h2", null, "Live Cricket Score"),
                // Display loading until data is loaded.
                (this.state.isLoading)
                    ? React.createElement(Loader, { message: "Please wait..." })
                    :
                        React.createElement("div", { className: styles.row },
                            React.createElement("div", { className: styles.column },
                                React.createElement(RSlider, __assign({}, settings), this.state.items.map(function (item, key) {
                                    // Fatch the team name and team score from discription 
                                    teams = [];
                                    //Devide the teams and fatch the team name 
                                    teams = item.title.split(' v ');
                                    team1 = teams[0].split(/[0-9]/)[0];
                                    team2 = teams[1].split(/[0-9]/)[0];
                                    return (React.createElement("div", { key: key },
                                        React.createElement("h3", null, team1 + " v/s " + team2),
                                        React.createElement("hr", null),
                                        React.createElement("div", { className: styles.scoredetails },
                                            React.createElement("a", { href: item.id, target: "_blank" }, item.title),
                                            React.createElement("div", { className: styles.details }, teams[0]),
                                            React.createElement("div", { className: styles.details }, teams[1]))));
                                })))))));
    };
    return SportsScore;
}(React.Component));
export default SportsScore;
//# sourceMappingURL=SportsScore.js.map