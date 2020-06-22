import * as React from 'react';
import styles from './Insights.module.scss';
import { IInsightsProps } from './IInsightsProps';
import { escape } from '@microsoft/sp-lodash-subset';
import Moment from 'react-moment';
import 'moment-timezone';
import common from '../../common/common';
import { Loader } from '../../common/Loading';
import { UrlQueryParameterCollection } from '@microsoft/sp-core-library';
import * as strings from 'InsightsWebPartStrings';

export interface IInsightsState {
  isLoading: boolean;
  AttachmentFiles: [{
    ServerRelativeUrl: string
  }],
  "AlertDate": Date,
  "Title": string,
  "Description": string
}

export default class InsightsID extends React.Component<IInsightsProps, IInsightsState> {
  public constructor(props: IInsightsProps, state: IInsightsState) {
    super(props);
    //Initialize the State
    this.state = {
      isLoading: true,
      AttachmentFiles: [{
        ServerRelativeUrl: '/_layouts/15/userphoto.aspx?size=L'
      }],
      //State items that containe insight's information
      "AlertDate": null,
      "Title": "No Insight",
      "Description": "No Insight"

    };
  }

  public componentDidMount() {
    this.GetItemsForInsightUsingID();
  }

  public GetItemsForInsightUsingID() {
    var method = 'get items for Insights';
    let newCommonObj: common = new common();
    var queryParameters = new UrlQueryParameterCollection(window.location.href);
    const queryID: number = parseInt(queryParameters.getValue("LID"));
    var query = `?$select=*,AttachmentFiles/ServerRelativeUrl&$expand=AttachmentFiles&$Filter= ID eq ${queryID}`;
    //Type is Newsletter or Insights
    if (queryParameters.getValue("Type") == strings.TypeInsights) {
      newCommonObj.getDataFromListUsingGuid(this.props.siteurl, this.props.listId, query, method).then(async (res) => {
        if (res.data.value.length > 0) {
          this.setState({
            AlertDate: res.data.value[0].AlertDate,
            Title: res.data.value[0].Title,
            Description: res.data.value[0].Description,
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
    else if (queryParameters.getValue("Type") == strings.TypeNewsletter) {
      newCommonObj.getDataFromListUsingGuid(this.props.siteurl, this.props.newslistId, query, method).then(async (news) => {
        if (news.data.value.length > 0) {
          this.setState({
            AlertDate: news.data.value[0].PublishedDate,
            Title: news.data.value[0].Title,
            Description: news.data.value[0].Description,
            isLoading: false
          });
          if (news.data.value[0].AttachmentFiles.length == 0) {
            this.setState({ AttachmentFiles: [{ ServerRelativeUrl: "/_layouts/15/userphoto.aspx?size=L" }] });
          } else {
            this.setState({ AttachmentFiles: [{ ServerRelativeUrl: news.data.value[0].AttachmentFiles[0].ServerRelativeUrl }] });
          }
        }
      }).catch(error => {
        console.log(error);
      });
    }
    else if (queryParameters.getValue("Type") == strings.TypeThought) {
      newCommonObj.getDataFromListUsingGuid(this.props.siteurl, this.props.thoughtleadershiplistId, query, method).then(async (localthought) => {
        if (localthought.data.value.length > 0) {
          this.setState({
            AlertDate: localthought.data.value[0].Modified,
            Title: localthought.data.value[0].Title,
            Description: localthought.data.value[0].Description,
            isLoading: false

          });
          if (localthought.data.value[0].AttachmentFiles.length == 0) {
            this.setState({ AttachmentFiles: [{ ServerRelativeUrl: "/_layouts/15/userphoto.aspx?size=L" }] });
          } else {
            this.setState({ AttachmentFiles: [{ ServerRelativeUrl: localthought.data.value[0].AttachmentFiles[0].ServerRelativeUrl }] });
          }
        }
      }).catch(error => {
        console.log(error);
      });
    }
    else if (queryParameters.getValue("Type") == strings.TypeGlobalThought) {
      newCommonObj.getDataFromListUsingGuid(this.props.siteurl, this.props.globalthoughtleadershiplistId, query, method).then(async (globalthought) => {
        if (globalthought.data.value.length > 0) {
          this.setState({
            AlertDate: globalthought.data.value[0].Modified,
            Title: globalthought.data.value[0].Title,
            Description: globalthought.data.value[0].Description,
            isLoading: false

          });
          if (globalthought.data.value[0].AttachmentFiles.length == 0) {
            this.setState({ AttachmentFiles: [{ ServerRelativeUrl: "/_layouts/15/userphoto.aspx?size=L" }] });
          } else {
            this.setState({ AttachmentFiles: [{ ServerRelativeUrl: globalthought.data.value[0].AttachmentFiles[0].ServerRelativeUrl }] });
          }
        }
      }).catch(error => {
        console.log(error);
      });
    }
    //else if (queryParameters.getValue("Type") == strings.TypeGlobalThought) {
    //  newCommonObj.getDataFromListUsingGuid(this.props.siteurl, 'GlobalThoughtLeadership', query, method).then(async (globalthought) => {
    //    if (globalthought.data.value.length > 0) {
    //      this.setState({
    //        AlertDate: globalthought.data.value[0].Modified,
    //        Title: globalthought.data.value[0].Title,
    //        Description: globalthought.data.value[0].Description,
    //        isLoading: false

    //      });
    //      if (globalthought.data.value[0].AttachmentFiles.length == 0) {
    //        this.setState({ AttachmentFiles: [{ ServerRelativeUrl: "/_layouts/15/userphoto.aspx?size=L" }] });
    //      } else {
    //        this.setState({ AttachmentFiles: [{ ServerRelativeUrl: globalthought.data.value[0].AttachmentFiles[0].ServerRelativeUrl }] });
    //      }
    //    }
    //  }).catch(error => {
    //    console.log(error);
    //  });
    //}
    //else {
    //  newCommonObj.getDataFromList(this.props.siteurl, 'Newsletters', query, method).then(async (news) => {
    //    if (news.data.value.length > 0) {
    //      this.setState({
    //        AlertDate: news.data.value[0].PublishedDate,
    //        Title: news.data.value[0].Title,
    //        Description: news.data.value[0].Description,
    //        isLoading: false 
    //      });
    //      if (news.data.value[0].AttachmentFiles.length == 0) {
    //        this.setState({ AttachmentFiles: [{ ServerRelativeUrl: "/_layouts/15/userphoto.aspx?size=L" }]});
    //      } else {
    //        this.setState({ AttachmentFiles: [{ ServerRelativeUrl: news.data.value[0].AttachmentFiles[0].ServerRelativeUrl }] });
    //      }
    //    }
    //  }).catch(error => {
    //    console.log(error);
    //  });
    //}
  }
  public render(): React.ReactElement<IInsightsProps> {
    return (
      <div className={styles.insights}>
        <div >
          <h2 >{new UrlQueryParameterCollection(window.location.href).getValue("Type")} </h2>

          <div >
            <h3>{this.state.Title}</h3>

            <div style={{ paddingTop: '2px' }}><img src={this.state.AttachmentFiles[0].ServerRelativeUrl} className={styles.imageStyle} /></div>
            <div className={styles.fontweight} dangerouslySetInnerHTML={{ __html: this.state.Description }}></div>
          </div>

        </div>
      </div>)
  }
}
