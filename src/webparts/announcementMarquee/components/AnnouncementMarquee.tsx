import * as React from 'react';
import styles from './AnnouncementMarquee.module.scss';
import { IAnnouncementMarqueeProps } from './IAnnouncementMarqueeProps';
import { escape } from '@microsoft/sp-lodash-subset';
import Common from '../../common/common';

export interface IAnnouncementMarqueeState {

  items: [
    {
      "Description": string,
      "Title": string;
    }];
}

export default class AnnouncementMarquee extends React.Component<IAnnouncementMarqueeProps, IAnnouncementMarqueeState> {
  public constructor(props: IAnnouncementMarqueeProps, state: IAnnouncementMarqueeState) {
    super(props);
    //Initialize the State
    this.state = {
      items: [
        {
          "Description": "",
          "Title": ""
        }
      ]
    };
  }

  public componentDidMount(): void {
    this.GetAnnouncementData();
  }
  public componentWillReceiveProps(nextProps): void {
    this.GetAnnouncementData();
  }
  //get Announcement using listId which selected from property pane
  private GetAnnouncementData(): void {
    let objCommon: Common = new Common();
    var method = 'get items for Announcement Marquee';
    var query;
    if (this.props.Practices == true) //Filter based On Practices and orderBy
      query = `?$orderby=Modified desc&$top=1`;
    else
      query = `?$orderby=Modified desc&$top=1`;
    objCommon.getDataFromListUsingGuid(this.props.siteurl, this.props.listId, query, method).then(async (res) => { //Code Review: Don't declare unnecessary variables
      if (res.data.value != undefined && res.data.value != null) {
        //response not null then setState this Response
        this.setState({ items: res.data.value });
      }
    }).catch(error => {
      console.log('error while getting data');
      console.log(error);
    });
  }
  public render(): React.ReactElement<IAnnouncementMarqueeProps> {
    return (
      <div className={styles.announcementMarquee}>
        <div className={styles.container}>
          <div>
            {this.state.items.map(function (item, key) {
              return (<div>
                <div className={styles.marquee}>
                  <div>
                    <span>{item.Description}</span></div>
                </div>
              </div>)
            })}
          </div>
        </div>
      </div>
    );
  }
}
