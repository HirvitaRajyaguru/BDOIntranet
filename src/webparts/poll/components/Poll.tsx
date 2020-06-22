import * as React from 'react';
import styles from './Poll.module.scss';
import { IPollProps } from './IPollProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { Spinner, SpinnerType } from 'office-ui-fabric-react/lib/Spinner';
import { Dialog, DialogType } from 'office-ui-fabric-react/lib/Dialog';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { Button, ButtonType } from 'office-ui-fabric-react/lib/Button';

import { IWebPartContext } from '@microsoft/sp-webpart-base';
import * as strings from 'PollWebPartStrings';
import { SPSurveyService } from '../SPSurveyService';


var Chart: any = require('chartjs');


export interface IPollState {
  loaded: boolean;
  alreadyVote?: boolean;
  existingAnswer?: string;
  question?: string;
  questionInternalName?: string;
  choices?: string[];
  viewResults?: boolean;
  resultsLoaded?: boolean;
  popupOpened?: boolean;
  popupErrorOpened?: boolean;
  selectedValue?: string;
  results?: number[];
  hideDialog: boolean;
}

export default class Poll extends React.Component<IPollProps, IPollState> {
  private myPageContext: IWebPartContext;
  private guid: string;

  constructor(props: IPollProps, context: IWebPartContext) {
    super(props, context);
    //Save the context
    this.myPageContext = props.context;
    this.guid = this.getGuid();
    //Init the component state
    this.state = {
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

    this.viewResults = this.viewResults.bind(this);
    this.viewResultsBack = this.viewResultsBack.bind(this);
    this.vote = this.vote.bind(this);
    this.closeVote = this.closeVote.bind(this);
    this.closeError = this.closeError.bind(this);
    this.onVoteChanged = this.onVoteChanged.bind(this);
    this.loadQuestions = this.loadQuestions.bind(this);
  }

  public render(): JSX.Element {
    if (this.props.surveyList == null || this.props.surveyList == '') {
      //Display select a list message
      return (
        <div className="ms-MessageBar">
          <div className="ms-MessageBar-content">
            <div className="ms-MessageBar-icon">
              <i className="ms-Icon ms-Icon--Info"></i>
            </div>
            <div className="ms-MessageBar-text">
              {strings.ErrorSelectList}
            </div>
          </div>
        </div>
      );
    }
    else {
      if (this.state.loaded == false) {
        //Display the loading spinner with the Office UI Fabric Spinner control
        return (
          <div className={styles.poll}>
            <div className={styles.workingOnItSpinner}>
              <Spinner type={SpinnerType.normal} />
            </div>
          </div>
        );
      }
      else if (this.state.choices.length == 0) {
        //Display message no items
        return (
          <div className="ms-MessageBar ms-MessageBar--error">
            <div className="ms-MessageBar-content">
              <div className="ms-MessageBar-icon">
                <i className="ms-Icon ms-Icon--ErrorBadge"></i>
              </div>
              <div className="ms-MessageBar-text">
                {strings.ErrorNoItems}
              </div>
            </div>
          </div>
        );
      }
      else {
        //Display the items list
        return (
          <div>

            <Dialog type={DialogType.close} isOpen={this.state.popupOpened} title={strings.ThankYou} onDismiss={this.closeVote}
              containerClassName={''} isDarkOverlay={true} isBlocking={false}>
              <div>
                <div>
                  <Label>{strings.Recorded}</Label>
                </div>
                <div style={{ paddingTop: '20px' }}>
                  <Button onClick={this.closeVote} buttonType={ButtonType.primary}>{strings.OK}</Button>
                </div>
              </div>
            </Dialog>

            <Dialog type={DialogType.close} isOpen={this.state.popupErrorOpened} title={strings.Error} onDismiss={this.closeError}
              containerClassName={''} isDarkOverlay={true} isBlocking={false}>
              <div>
                <div>
                  <Label>{strings.SelectVote}</Label>
                </div>
                <div style={{ paddingTop: '20px' }}>
                  <Button onClick={this.closeError} buttonType={ButtonType.primary}>{strings.OK}</Button>
                </div>
              </div>
            </Dialog>
            <div className={styles.poll}>
              <div className={styles.container}>
                <h2 className={styles.tableCaptionStyle} >Poll</h2>
                <div style={{ border: '1px rgba(218, 215, 215, 0.699) solid', display: this.state.viewResults === true ? 'block' : 'none' }}>
                  <canvas id={this.guid + '-chart'} width="300" height="300"></canvas>
                  <br />
                  <input type='button' value={strings.Back} style={{ border: 0, color: '#FFFFFF', background: '#ed1a3b', padding: '8px 20px', fontSize: '14px', textTransform: "uppercase" }} onClick={this.viewResultsBack} className='custom-button' />


                </div>



                <div style={{ display: this.state.viewResults === true ? 'none' : 'block', margin: '0px', paddingBottom: '15px', color: '#000' }}>
                  <div style={{ margin: '0px', padding: '0', fontSize: '16px', fontWeight: "bold", fontFamily: 'proxima-nova,arial', color: '#666', textAlign:'left' }}>{this.state.question}</div>
                  {this.state.alreadyVote === true ? <div style={{ color: 'green', padding: '10px', fontFamily: 'proxima-nova,arial' }}><strong>{strings.AlreadyVote}</strong></div> : ''}
                  <div style={{ lineHeight: '28px', padding: '15px 0', fontFamily:'proxima-nova,arial' }}>
                    {this.state.choices.map((answer: string, i: number) => {
                      return (
                        <div style={{ fontFamily: 'proxima-nova, arial' }}><input type='radio' defaultChecked={answer == this.state.selectedValue ? true : false} aria-checked={answer == this.state.selectedValue ? true : false} onChange={this.onVoteChanged} disabled={this.state.alreadyVote} name={this.guid} value={answer} /> {answer}</div>
                      );
                    })}
                  </div>
                  <div style={{ paddingTop: '0', marginLeft: '0', fontFamily: 'proxima-nova,arial', fontSize: '12px' }}>
                    {this.state.alreadyVote != true ?
                      <input type='button' onClick={this.vote} style={{ border: 0, color: '#FFFFFF', background: '#ed1a3b', padding: '8px 10px', fontSize: '14px' }} disabled={this.state.alreadyVote} value={strings.Vote} className='custom-button' />
                      : ''}
                    {this.state.alreadyVote != true && this.props.forceVoteToViewResults === false ?
                      <input type='button' value={strings.ViewResults} onClick={this.viewResults} className='ms-Button' />
                      :
                      this.state.alreadyVote != true ?
                        ''
                        :
                        <input type='button' value={strings.ViewResults} onClick={this.viewResults} style={{ border: 0, color: '#FFFFFF', background: '#ed1a3b', padding: '8px 10px', fontSize: '14px'   }} className='custom-button' />
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      }
    }
  }

  private getGuid(): string {
    return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' +
      this.s4() + '-' + this.s4() + this.s4() + this.s4();
  }

  private s4(): string {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }

  private onVoteChanged(elm?: any): void {
    this.setState({
      selectedValue: elm.currentTarget.value
    });
    // this.state.selectedValue = elm.currentTarget.value;
    //this.setState(this.state);
  }

  private vote(elm?: any): void {
    //Check if a value has been selected
    if (this.state.selectedValue == null || this.state.selectedValue == '') {
      this.setState({ popupErrorOpened: true });
      // this.state.popupErrorOpened = true;
      this.setState(this.state);
    }
    else {
      const listService: SPSurveyService = new SPSurveyService(this.props, this.myPageContext);
      listService.postVote(this.props.surveyList, this.state.questionInternalName, this.state.selectedValue).then((response) => {
        this.setState({ popupOpened: true });
        // this.state.popupOpened = true;
        this.setState({ resultsLoaded: false });
        // this.state.resultsLoaded = false;
        this.setState({ results: [] });
        //   this.state.results = [];
        this.setState(this.state);
      });
    }
  }

  private closeError(): void {
    this.setState({ popupErrorOpened: false });
    //this.state.popupErrorOpened = false;
    this.setState(this.state);
  }

  private closeVote(): void {
    this.setState({ popupOpened: false });
    //this.state.popupOpened = false;
    this.setState({ alreadyVote: true });
    this.setState({ hideDialog: true });

    // this.state.alreadyVote = true;
    // this.setState(this.state);

  }

  private viewResultsBack(elm?: any): void {

    this.setState({
      viewResults: false
    }, () => {
      console.log(this.state.viewResults);
    });

  }

  private viewResults(elm?: any): void {
    setTimeout(() => {
      this.setState({ resultsLoaded: false },
        function () {
          console.log("");
        });
    }, 10);
    this.setState({ viewResults: true }, () => {
      console.log("");
    });
    this.setState({ resultsLoaded: false }, () => {
      console.log("");
    });

    this.setState({ viewResults: true }, () => { console.log(this.state.viewResults); });
    this.setState({ resultsLoaded: false }, () => { console.log(this.state.resultsLoaded); });

    if (this.state.resultsLoaded != true) {
      this.setState({ loaded: false });

      const listService: SPSurveyService = new SPSurveyService(this.props, this.myPageContext);
      listService.getResults(this.props.surveyList, this.state.questionInternalName, this.state.choices).then((num: number[]) => {
        // this.state.results = num;
        this.setState({ results: num });
        //  this.state.loaded = true;
        this.setState({ loaded: true });
        this.setState(this.state);
        this.loadChart();
      });
    }
    else {
      this.setState(this.state);
    }
  }

  private getColors(choices: string[]): string[] {
    var res: string[] = [];
    for (var c = 0; c < choices.length; c++) {
      res.push(this.getRandomInitialsColor(c));
    }
    return res;
  }

  private getRandomInitialsColor(index: number): string {
    var num: number = index % 13;
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
  }

  private loadChart(): void {
    var colors: string[] = this.getColors(this.state.choices);
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
          align: 'left',
          fontFamily: "proxima-nova,arial",
          fontSize: 16,
          fontColor: "#666"

        },
        legend: {
          display: true,
          position: 'top',
          labels: {
            fontColor: "#666",
            boxWidth: 15,
            fontSize: 12,
            fontFamily: "proxima-nova,arial"
            
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
          fontFamily: "proxima-nova,arial",
          fontSize: 16,
          align: 'left',
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
  }

  private loadQuestions(props: IPollProps): void {
    if (props.surveyList == null || props.surveyList == '')
      return;

    //Request the survey questions
    const listService: SPSurveyService = new SPSurveyService(props, this.myPageContext);
    listService.getQuestions(props.surveyList).then((response) => {
      var responseVal = response.value;
      if (responseVal == null || responseVal.length == 0)
        return;
      var item = responseVal[0];
      this.setState({ choices: item.Choices });
      this.setState({ question: item.Title });
      this.setState({ questionInternalName: item.StaticName });
      //this.state.choices = item.Choices;
      // this.state.question = item.Title;
      // this.state.questionInternalName = item.StaticName;

      //Request the existing votes to get current user voting status
      listService.getVoteForUser(props.surveyList, item.StaticName, this.myPageContext.pageContext.user.loginName).then((responseVote) => {
        var responseVoteVal = responseVote.value;

        if (responseVoteVal.length > 0) {
          //  this.setState({alreadyVote:true});
          this.setState({
            alreadyVote: true
          }, () => {
            console.log(this.state.alreadyVote);
          });
          this.setState({ selectedValue: responseVoteVal[0].Title });


          // this.state.alreadyVote = true;
          // this.state.selectedValue = responseVoteVal[0].Title;
        }
        else
          // this.state.alreadyVote = false;
          this.setState({ alreadyVote: false });
        this.setState({ loaded: true });
        // this.state.loaded = true;
        this.setState(this.state);
      });
    });
  }


  /**
   * @function
   * Function called when the component did mount
   */
  public componentDidMount(): void {
    this.loadQuestions(this.props);
  }

  /**
   * @function
   * Function called when the web part properties has changed
   */
  public componentWillReceiveProps(nextProps: IPollProps): void {
    // this.state.resultsLoaded = false;
    this.setState({ resultsLoaded: false });
    // this.state.results = [];
    this.setState({ results: [] });
    this.setState(this.state);
    this.loadQuestions(nextProps);
  }


}