import * as React from 'react';
import styles from './Spotlight.module.scss';
import { ISpotlightProps } from './ISpotlightProps';
import { escape } from '@microsoft/sp-lodash-subset';
import common from '../../common/common';
import { Loader } from '../../common/Loading';
import { UrlQueryParameterCollection } from '@microsoft/sp-core-library';
import Moment from 'react-moment';
//import '~video-react/dist/video-react.css';
import { Player } from 'video-react';
export interface ISpotlightState {
  isLoading: boolean;
  AttachmentFiles: [{
    ServerRelativeUrl: string
  }];
  Title: string;
  Description: string;
  PublishDate: Date;
  VideoUrl: string;

}
export default class SpotlightID extends React.Component<ISpotlightProps, ISpotlightState> {

  constructor(props: ISpotlightProps, state: ISpotlightState) {
    super(props);
    //Initialize the State
    this.state = {
      isLoading: true,
      AttachmentFiles: [{
        ServerRelativeUrl: ''
      }],
      Title: '',
      Description: '',
      PublishDate: null,
      VideoUrl: ''
    };
  }

  public async componentDidMount() {
    this.GetItemsForSpotlightUsingID();
  }

  public GetItemsForSpotlightUsingID() {
    var method = 'get items for Spotlight';
    let newCommonObj: common = new common();
    var queryParameters = new UrlQueryParameterCollection(window.location.href);
    const queryID: number = parseInt(queryParameters.getValue("SpotlightID"));
    var query = `?$select=*,AttachmentFiles/ServerRelativeUrl&$expand=AttachmentFiles&$Filter= ID eq ${queryID}`;

    newCommonObj.getDataFromListUsingGuid(this.props.siteUrl, this.props.listId, query, method).then(async (res) => {
      if (res.data.value.length > 0) {
        this.setState({
          Title: res.data.value[0].Title,
          Description: res.data.value[0].Description,
          PublishDate: res.data.value[0].PublishDate,
          VideoUrl: res.data.value[0].VideoUrl,
          isLoading: false
        });
        if (res.data.value[0].AttachmentFiles.length == 0) {
          this.setState({ AttachmentFiles: [{ ServerRelativeUrl: "/_layouts/15/userphoto.aspx?size=L" }] });
        } else {
          this.setState({ AttachmentFiles: [{ ServerRelativeUrl: res.data.value[0].AttachmentFiles[0].ServerRelativeUrl }] });
        }
      }
    }).catch(error => {
      console.log(error);
    });
  }
  public render(): React.ReactElement<ISpotlightProps> {
    return (
      <div className={styles.spotlight}>
        <div className={styles.container}>
          <h2>SPOTLIGHTS</h2>
          {
            (this.state.isLoading) ? <Loader message="Please wait..." /> :
              <div>
                <h3>{this.state.Title}</h3>
                <div className={styles.fontweight}>
                  {<Moment format="DD MMMM YYYY">
                    {this.state.PublishDate}</Moment>}
                </div>
                <div style={{ paddingTop: '2px' }}><img src={this.state.AttachmentFiles[0].ServerRelativeUrl} className={styles.imageStyle} /></div>
                <div className={styles.tableStyle}>
                  <div className={styles.fontweight} dangerouslySetInnerHTML={{ __html: this.state.Description }}></div>
                  <Player style={{ width: '100%', height: '200px' }}
                    playsInline
                    poster="/assets/poster.png"
                    src={this.state.VideoUrl}
                  />
                </div>
              </div>
          }
        </div>
      </div>);
  }
}
