import Moment from 'react-moment';
import 'moment-timezone';
import * as React from 'react';
import styles from './GlobalPartnerSpeak.module.scss';
import { IGlobalPartnerSpeakProps } from './IGlobalPartnerSpeakProps';
import { escape } from '@microsoft/sp-lodash-subset';
//import { IGlobalPartnerSpeakState } from './IGlobalPartnerSpeakState';
import common from '../../common/common';
import { Link } from 'office-ui-fabric-react';
import { UrlQueryParameterCollection } from '@microsoft/sp-core-library';

export interface IGlobalPartnerSpeakState {
  isLoading: boolean;
  image: [{
    ServerRelativeUrl: string
  }]
  items: [{
    "Title": string,
    "Description": string,
    "ID": number
  }];
}

export default class GlobalDisplay extends React.Component<IGlobalPartnerSpeakProps, IGlobalPartnerSpeakState> {
  public constructor(props: IGlobalPartnerSpeakProps, state: IGlobalPartnerSpeakState) {
    super(props);
    //Initialize the State
    this.state = {
      isLoading: true,
      //State images that containe insight's image
      image: [{
        ServerRelativeUrl: '/_layouts/15/userphoto.aspx?size=L'
      }],
      //State items that containe insight's information
      items: [
        {        
          "Title": "No Global Thought Leadership to display.",
          "Description": "",
          "ID": 0
        }
      ]
    };
  }

  public componentDidMount() {
    this.GetGlobalThoughtByID();
  }

  public GetGlobalThoughtByID() {
    var method = 'get items for Global Thought Leadership';
    let newCommonObj: common = new common();
    var queryParameters = new UrlQueryParameterCollection(window.location.href);
    const queryID: number = parseInt(queryParameters.getValue("RID"));
    var query = `?$select=*,AttachmentFiles/ServerRelativeUrl&$expand=AttachmentFiles&$Filter= ID eq ${queryID}`;

    newCommonObj.getDataFromListUsingGuid(this.props.siteUrl, this.props.listId, query, method).then(async (res) => {
      if (res.data.value.length > 0) {
        this.setState({
          items: res.data.value
        });
        var i = 0;
        let images = [];
        for (i = 0; i < res.data.value.length; i++) {
          if (res.data.value[i].AttachmentFiles.length == 0) {
            images.push({ "ServerRelativeUrl": "/_layouts/15/userphoto.aspx?size=L" });
          } else {
            images.push({ "ServerRelativeUrl": res.data.value[i].AttachmentFiles[0].ServerRelativeUrl });
          }
        }
        var imageser;
        imageser = images;
        this.setState({ image: imageser })
      }
    }).catch(error => {
      console.log(error);
    });
  }
  public render(): React.ReactElement<IGlobalPartnerSpeakProps> {
    return (
      <div className={styles.globalPartnerSpeak}>

          <div className={styles.containerpage}>
            <h1>
              Global Thought Leadership:
                  </h1>
                <div>
                  <h2>
                     {this.state.items[0].Title}
                  </h2>
                  <div><img src={this.state.image[0].ServerRelativeUrl} className={styles.imageStyle} /></div>
            <div className={styles.descriptionpage}>
              {this.state.items[0].Description}
                  </div>

                </div>
              
          
          </div>

      </div>)
  }
}
