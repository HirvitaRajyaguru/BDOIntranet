import * as React from 'react';
import styles from './EventDetails.module.scss';
import { IEventDetailsProps } from './IEventDetailsProps';
import { escape } from '@microsoft/sp-lodash-subset';
import Moment from 'react-moment';
import 'moment-timezone';
import axios from 'axios';
import common from '../../common/common';
import { Loader } from '../../common/Loading';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { IEventDetailsState } from './IEventDetailsState';
export default class EventDetails extends React.Component<IEventDetailsProps, IEventDetailsState> {
  constructor(props: IEventDetailsProps, state: IEventDetailsState) {
    super(props);

    this.state = {
      isLoading: true,
      items: [
        {
          EventOwner: {
            JobTitle: '',
            FirstName: '',
            LastName: '',
          },
          Location: '',
          Title: 'No Events',
          EventDate: null,
          EndDate: null
        }
      ]
    };
  }

  public componentDidMount(): void {
    this.loadData();
  }
  public componentWillReceiveProps(nextProps): void {
    this.loadData();
  }
  // Load the Event Details from Calender by filtering date of today.  
  private loadData(): void {

    var yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    var Url = this.props.siteUrl;
    var method = 'get items for Event';
    var listName = 'Events';
    let newCommonObj: common = new common();
    var query;
    query = `?$select=EventOwner/JobTitle,EventOwner/FirstName,EventOwner/LastName,EventOwner/EMail,Location,Title,EventDate,EndDate&$expand=EventOwner/Id&$Filter=EventDate ge datetime'${yesterday.toISOString()}'`;//$filter=EventOwner/FirstName eq Name
    newCommonObj.getDataFromList(Url, listName, query, method).then(async (res) => {
      if (res.data.value != undefined && res.data.value != null) {
        this.setState({ items: res.data.value });
      }
      this.setState({
        isLoading: false
      });
    }).catch(error => {
      console.log(error);
    });
  }

  public render(): React.ReactElement<IEventDetailsProps> {


    return (
      <div className={ styles.eventDetails }>
        {
          (this.state.isLoading) ? <Loader message="Please wait..." /> :
             // Check that data is not empty
            (this.state.items.length <= 0)
              ?
              //If Data is empty then Show Message that NO Events are there
              <div className={styles.container}>
                <h2>EVENTS</h2>
                <div className="ms-Grid">
                  <div className="ms-Grid">
                    <div className="ms-Grid-col ms-sm9 ms-md9">
                      <h3>No Events</h3>
                    </div>
                  </div>
                </div>
              </div>
              :
              //Show Event Details
              <div className={styles.container}>
                <h2>EVENTS</h2>
                  {this.state.items.map((item, key) => {
                    return (<div className="ms-Grid">
                      <div className="ms-Grid">
                        <div className="ms-Grid-col ms-sm9 ms-md9">
                          <h3>{item.Title}</h3>
                        </div>
                        <div className={`ms-Grid-col ms-sm3 ms-md3 ${styles.floatright}`}>
                          <p>{item.Location}</p>
                        </div>
                      </div>
                      <div className="ms-Grid-row">
                        <div className="ms-Grid-col ms-sm9 ms-md9">
                          <p>{item.EventOwner.FirstName} {item.EventOwner.LastName}</p>
                          <p>{item.EventOwner.JobTitle}</p>

                        </div>
                        <div className={`ms-Grid-col ms-sm3 ms-md3 ${styles.floatright}`}>
                          <p >{<Moment format="DD MMM YYYY">{item.EventDate}</Moment>}</p>
                          <p>{<Moment format="hh:mm A">{item.EventDate}</Moment>}-{<Moment format="hh:mm A">{item.EndDate}</Moment>}</p>
                        </div>
                      </div>
                        <hr/>
                    </div>);
                  })}
                
              </div>
        }
      </div>
    );
  }
}
