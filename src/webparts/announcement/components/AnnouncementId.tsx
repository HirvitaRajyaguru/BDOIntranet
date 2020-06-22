import * as React from 'react';
import styles from './Announcement.module.scss';
import { IAnnouncementProps } from './IAnnouncementProps';
import { escape } from '@microsoft/sp-lodash-subset';
import Moment from 'react-moment';
import 'moment-timezone';
import Common from '../../common/common';
import { Loader } from '../../common/Loading';
import { UrlQueryParameterCollection } from '@microsoft/sp-core-library';

export interface IAnnouncementState {
  isLoading: boolean;
  AttachmentFiles: [{
    ServerRelativeUrl: string
  }]
  Title: string,
  Description: string,
  AnnouncementDate: Date,
}
export default class AnnouncementId extends React.Component<IAnnouncementProps, IAnnouncementState> {
  public constructor(props: IAnnouncementProps, state: IAnnouncementState) {
    super(props);
    //Initialize the State
    this.state = {
      isLoading: true,
      AttachmentFiles: [{
        ServerRelativeUrl: '/_layouts/15/userphoto.aspx?size=L'
      }],
      Title: '',
      Description: '',
      AnnouncementDate: null,
    };
  }

  public componentDidMount() {
    this.GetItemsForAnnouncementUsingID();
  }

  public GetItemsForAnnouncementUsingID() {
    var method = 'get items for Announcement';
    let newCommonObj: Common = new Common();
    var queryParameters = new UrlQueryParameterCollection(window.location.href);
    const queryID: number = parseInt(queryParameters.getValue("Announcement"));
    var query = `?$select=*,AttachmentFiles/ServerRelativeUrl&$expand=AttachmentFiles&$Filter= ID eq ${queryID}`;

    newCommonObj.getDataFromListUsingGuid(this.props.siteurl, this.props.listId, query, method).then(async (res) => {
      if (res.data.value.length > 0) {
        this.setState({
          Title: res.data.value[0].Title,
          Description: res.data.value[0].Description,
          AnnouncementDate: res.data.value[0].AnnouncementDate,
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
  public render(): React.ReactElement<IAnnouncementProps> {
    return (
      <div className={styles.announcement}>
        <div>
          <h2>Announcement</h2>
          {
            (this.state.isLoading) ? <Loader message="Please wait..." /> :
              <div>

                <h3>{this.state.Title}</h3>
                <div className={styles.fontweight}>
                  {<Moment format="DD MMMM YYYY">
                    {this.state.AnnouncementDate}</Moment>}
                </div>
                <div style={{ paddingTop: '2px' }}><img src={this.state.AttachmentFiles[0].ServerRelativeUrl} className={styles.imageStyle} /></div>
                <div className={styles.fontweight} dangerouslySetInnerHTML={{ __html: this.state.Description }}></div>
              </div>
          }
        </div>
      </div>)
  }
}
