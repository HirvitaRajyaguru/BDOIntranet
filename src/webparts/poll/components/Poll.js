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
var Poll_module_scss_1 = require("./Poll.module.scss");
var Spinner_1 = require("office-ui-fabric-react/lib/Spinner");
var Dialog_1 = require("office-ui-fabric-react/lib/Dialog");
var Label_1 = require("office-ui-fabric-react/lib/Label");
var Button_1 = require("office-ui-fabric-react/lib/Button");
var strings = require("PollWebPartStrings");
var SPSurveyService_1 = require("../SPSurveyService");
var Chart = require('chartjs');
var Poll = /** @class */ (function (_super) {
    __extends(Poll, _super);
    function Poll(props, context) {
        var _this = _super.call(this, props, context) || this;
        //Save the context
        _this.myPageContext = props.context;
        _this.guid = _this.getGuid();
        //Init the component state
        _this.state = {
            loaded: false,
            viewResults: false,
            resultsLoaded: false,
            alreadyVote: false,
            choices: [],
            question: '',
            questionInternalName: '',
            existingAnswer: '',
            popupOpened: false,
            popupErrorOpened: false,
            selectedValue: '',
            results: [],
            hideDialog: false
        };
        _this.viewResults = _this.viewResults.bind(_this);
        _this.viewResultsBack = _this.viewResultsBack.bind(_this);
        _this.vote = _this.vote.bind(_this);
        _this.closeVote = _this.closeVote.bind(_this);
        _this.closeError = _this.closeError.bind(_this);
        _this.onVoteChanged = _this.onVoteChanged.bind(_this);
        _this.loadQuestions = _this.loadQuestions.bind(_this);
        return _this;
    }
    Poll.prototype.render = function () {
        var _this = this;
        if (this.props.surveyList == null || this.props.surveyList == '') {
            //Display select a list message
            return (React.createElement("div", { className: "ms-MessageBar" },
                React.createElement("div", { className: "ms-MessageBar-content" },
                    React.createElement("div", { className: "ms-MessageBar-icon" },
                        React.createElement("i", { className: "ms-Icon ms-Icon--Info" })),
                    React.createElement("div", { className: "ms-MessageBar-text" }, strings.ErrorSelectList))));
        }
        else {
            if (this.state.loaded == false) {
                //Display the loading spinner with the Office UI Fabric Spinner control
                return (React.createElement("div", { className: Poll_module_scss_1.default.poll },
                    React.createElement("div", { className: Poll_module_scss_1.default.workingOnItSpinner },
                        React.createElement(Spinner_1.Spinner, { type: Spinner_1.SpinnerType.normal }))));
            }
            else if (this.state.choices.length == 0) {
                //Display message no items
                return (React.createElement("div", { className: "ms-MessageBar ms-MessageBar--error" },
                    React.createElement("div", { className: "ms-MessageBar-content" },
                        React.createElement("div", { className: "ms-MessageBar-icon" },
                            React.createElement("i", { className: "ms-Icon ms-Icon--ErrorBadge" })),
                        React.createElement("div", { className: "ms-MessageBar-text" }, strings.ErrorNoItems))));
            }
            else {
                //Display the items list
                return (React.createElement("div", null,
                    React.createElement(Dialog_1.Dialog, { type: Dialog_1.DialogType.close, isOpen: this.state.popupOpened, title: strings.ThankYou, onDismiss: this.closeVote, containerClassName: '', isDarkOverlay: true, isBlocking: false },
                        React.createElement("div", null,
                            React.createElement("div", null,
                                React.createElement(Label_1.Label, null, strings.Recorded)),
                            React.createElement("div", { style: { paddingTop: '20px' } },
                                React.createElement(Button_1.Button, { onClick: this.closeVote, buttonType: Button_1.ButtonType.primary }, strings.OK)))),
                    React.createElement(Dialog_1.Dialog, { type: Dialog_1.DialogType.close, isOpen: this.state.popupErrorOpened, title: strings.Error, onDismiss: this.closeError, containerClassName: '', isDarkOverlay: true, isBlocking: false },
                        React.createElement("div", null,
                            React.createElement("div", null,
                                React.createElement(Label_1.Label, null, strings.SelectVote)),
                            React.createElement("div", { style: { paddingTop: '20px' } },
                                React.createElement(Button_1.Button, { onClick: this.closeError, buttonType: Button_1.ButtonType.primary }, strings.OK)))),
                    React.createElement("div", { className: Poll_module_scss_1.default.poll },
                        React.createElement("div", { className: Poll_module_scss_1.default.container },
                            React.createElement("h2", { className: Poll_module_scss_1.default.tableCaptionStyle }, "Poll"),
                            React.createElement("div", { style: { border: '1px rgba(218, 215, 215, 0.699) solid', display: this.state.viewResults === true ? 'block' : 'none' } },
                                React.createElement("canvas", { id: this.guid + '-chart', width: "300", height: "300" }),
                                React.createElement("br", null),
                                React.createElement("input", { type: 'button', value: strings.Back, style: { border: 0, color: '#FFFFFF', background: '#ed1a3b', padding: '8px 20px', fontSize: '14px', textTransform: "uppercase" }, onClick: this.viewResultsBack, className: 'custom-button' })),
                            React.createElement("div", { style: { display: this.state.viewResults === true ? 'none' : 'block', margin: '0px', paddingBottom: '15px', color: '#000' } },
                                React.createElement("div", { style: { margin: '0px', padding: '0', fontFamily: 'proxima-nova,arial' } }, this.state.question),
                                this.state.alreadyVote === true ? React.createElement("div", { style: { color: 'green', padding: '10px', fontFamily: 'proxima-nova,arial' } },
                                    React.createElement("strong", null, strings.AlreadyVote)) : '',
                                React.createElement("div", { style: { lineHeight: '28px', padding: '15px 0', fontFamily: 'proxima-nova,arial' } }, this.state.choices.map(function (answer, i) {
                                    return (React.createElement("div", { style: { fontFamily: 'proxima-nova, arial' } },
                                        React.createElement("input", { type: 'radio', defaultChecked: answer == _this.state.selectedValue ? true : false, "aria-checked": answer == _this.state.selectedValue ? true : false, onChange: _this.onVoteChanged, disabled: _this.state.alreadyVote, name: _this.guid, value: answer }),
                                        " ",
                                        answer));
                                })),
                                React.createElement("div", { style: { paddingTop: '0', marginLeft: '0', fontFamily: 'proxima-nova,arial' } },
                                    this.state.alreadyVote != true ?
                                        React.createElement("input", { type: 'button', onClick: this.vote, style: { border: 0, color: '#FFFFFF', background: '#ed1a3b', padding: '8px 20px', fontSize: '14px' }, disabled: this.state.alreadyVote, value: strings.Vote, className: 'custom-button' })
                                        : '',
                                    this.state.alreadyVote != true && this.props.forceVoteToViewResults === false ?
                                        React.createElement("input", { type: 'button', value: strings.ViewResults, onClick: this.viewResults, className: 'ms-Button' })
                                        :
                                            this.state.alreadyVote != true ?
                                                ''
                                                :
                                                    React.createElement("input", { type: 'button', value: strings.ViewResults, onClick: this.viewResults, style: { border: 0, color: '#FFFFFF', background: '#ed1a3b', padding: '8px 20px', fontSize: '14px', textTransform: "uppercase" }, className: 'custom-button' })))))));
            }
        }
    };
    Poll.prototype.getGuid = function () {
        return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' +
            this.s4() + '-' + this.s4() + this.s4() + this.s4();
    };
    Poll.prototype.s4 = function () {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    };
    Poll.prototype.onVoteChanged = function (elm) {
        this.setState({
            selectedValue: elm.currentTarget.value
        });
        // this.state.selectedValue = elm.currentTarget.value;
        //this.setState(this.state);
    };
    Poll.prototype.vote = function (elm) {
        var _this = this;
        //Check if a value has been selected
        if (this.state.selectedValue == null || this.state.selectedValue == '') {
            this.setState({ popupErrorOpened: true });
            // this.state.popupErrorOpened = true;
            this.setState(this.state);
        }
        else {
            var listService = new SPSurveyService_1.SPSurveyService(this.props, this.myPageContext);
            listService.postVote(this.props.surveyList, this.state.questionInternalName, this.state.selectedValue).then(function (response) {
                _this.setState({ popupOpened: true });
                // this.state.popupOpened = true;
                _this.setState({ resultsLoaded: false });
                // this.state.resultsLoaded = false;
                _this.setState({ results: [] });
                //   this.state.results = [];
                _this.setState(_this.state);
            });
        }
    };
    Poll.prototype.closeError = function () {
        this.setState({ popupErrorOpened: false });
        //this.state.popupErrorOpened = false;
        this.setState(this.state);
    };
    Poll.prototype.closeVote = function () {
        this.setState({ popupOpened: false });
        //this.state.popupOpened = false;
        this.setState({ alreadyVote: true });
        this.setState({ hideDialog: true });
        // this.state.alreadyVote = true;
        // this.setState(this.state);
    };
    Poll.prototype.viewResultsBack = function (elm) {
        var _this = this;
        this.setState({
            viewResults: false
        }, function () {
            console.log(_this.state.viewResults);
        });
    };
    Poll.prototype.viewResults = function (elm) {
        var _this = this;
        setTimeout(function () {
            _this.setState({ resultsLoaded: false }, function () {
                console.log("");
            });
        }, 10);
        this.setState({ viewResults: true }, function () {
            console.log("");
        });
        this.setState({ resultsLoaded: false }, function () {
            console.log("");
        });
        this.setState({ viewResults: true }, function () { console.log(_this.state.viewResults); });
        this.setState({ resultsLoaded: false }, function () { console.log(_this.state.resultsLoaded); });
        if (this.state.resultsLoaded != true) {
            this.setState({ loaded: false });
            var listService = new SPSurveyService_1.SPSurveyService(this.props, this.myPageContext);
            listService.getResults(this.props.surveyList, this.state.questionInternalName, this.state.choices).then(function (num) {
                // this.state.results = num;
                _this.setState({ results: num });
                //  this.state.loaded = true;
                _this.setState({ loaded: true });
                _this.setState(_this.state);
                _this.loadChart();
            });
        }
        else {
            this.setState(this.state);
        }
    };
    Poll.prototype.getColors = function (choices) {
        var res = [];
        for (var c = 0; c < choices.length; c++) {
            res.push(this.getRandomInitialsColor(c));
        }
        return res;
    };
    Poll.prototype.getRandomInitialsColor = function (index) {
        var num = index % 13;
        switch (num) {
            case 0: return 'darkBlue';
            case 1: return 'lightGreen';
            case 2: return 'orange';
            case 3: return 'teal';
            case 4: return 'red';
            case 5: return 'green';
            case 6: return 'purple';
            case 7: return 'darkGreen';
            case 8: return 'lightPink';
            case 9: return 'pink';
            case 10: return 'magenta';
            case 11: return 'black';
            case 12: return 'yellow';
            case 13: return 'blue';
            default: return 'blue';
        }
    };
    Poll.prototype.loadChart = function () {
        var colors = this.getColors(this.state.choices);
        if (this.props.chartType == 'pie') {
            var data = {
                labels: this.state.choices,
                datasets: [
                    {
                        data: this.state.results,
                        backgroundColor: colors,
                        hoverBackgroundColor: colors
                    }
                ]
            };
            var options = {
                responsive: false,
                cutoutPercentage: 0,
                animation: {
                    animateRotate: true,
                    animateScale: true
                },
                title: {
                    display: true,
                    text: this.state.question,
                    position: 'top',
                    fontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
                    fontSize: 18,
                    fontColor: "#666"
                },
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        fontColor: "#666",
                        fontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
                        fontSize: 12
                    }
                }
            };
            var ctx = document.getElementById(this.guid + '-chart');
            new Chart(ctx, {
                type: 'pie',
                data: data,
                options: options
            });
        }
        else {
            var data2 = {
                labels: this.state.choices,
                datasets: [
                    {
                        data: this.state.results,
                        backgroundColor: colors,
                        hoverBackgroundColor: colors
                    }
                ]
            };
            var options2 = {
                responsive: false,
                title: {
                    display: true,
                    text: this.state.question,
                    position: 'top',
                    fontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
                    fontSize: 12,
                    fontColor: "#666"
                },
                legend: {
                    display: false
                },
                scales: {
                    xAxes: [{
                            display: true
                        }],
                    yAxes: [{
                            display: true
                        }]
                }
            };
            var ctx2 = document.getElementById(this.guid + '-chart');
            new Chart(ctx2, {
                type: 'horizontalBar',
                data: data2,
                options: options2
            });
        }
        this.setState({ resultsLoaded: true });
        // this.state.resultsLoaded = true;
        this.setState(this.state);
        this.setState({ viewResults: true });
        // this.state.viewResults
    };
    Poll.prototype.loadQuestions = function (props) {
        var _this = this;
        if (props.surveyList == null || props.surveyList == '')
            return;
        //Request the survey questions
        var listService = new SPSurveyService_1.SPSurveyService(props, this.myPageContext);
        listService.getQuestions(props.surveyList).then(function (response) {
            var responseVal = response.value;
            if (responseVal == null || responseVal.length == 0)
                return;
            var item = responseVal[0];
            _this.setState({ choices: item.Choices });
            _this.setState({ question: item.Title });
            _this.setState({ questionInternalName: item.StaticName });
            //this.state.choices = item.Choices;
            // this.state.question = item.Title;
            // this.state.questionInternalName = item.StaticName;
            //Request the existing votes to get current user voting status
            listService.getVoteForUser(props.surveyList, item.StaticName, _this.myPageContext.pageContext.user.loginName).then(function (responseVote) {
                var responseVoteVal = responseVote.value;
                if (responseVoteVal.length > 0) {
                    //  this.setState({alreadyVote:true});
                    _this.setState({
                        alreadyVote: true
                    }, function () {
                        console.log(_this.state.alreadyVote);
                    });
                    _this.setState({ selectedValue: responseVoteVal[0].Title });
                    // this.state.alreadyVote = true;
                    // this.state.selectedValue = responseVoteVal[0].Title;
                }
                else
                    // this.state.alreadyVote = false;
                    _this.setState({ alreadyVote: false });
                _this.setState({ loaded: true });
                // this.state.loaded = true;
                _this.setState(_this.state);
            });
        });
    };
    /**
     * @function
     * Function called when the component did mount
     */
    Poll.prototype.componentDidMount = function () {
        this.loadQuestions(this.props);
    };
    /**
     * @function
     * Function called when the web part properties has changed
     */
    Poll.prototype.componentWillReceiveProps = function (nextProps) {
        // this.state.resultsLoaded = false;
        this.setState({ resultsLoaded: false });
        // this.state.results = [];
        this.setState({ results: [] });
        this.setState(this.state);
        this.loadQuestions(nextProps);
    };
    return Poll;
}(React.Component));
exports.default = Poll;
//# sourceMappingURL=Poll.js.map