import * as React from 'react';
import { Redirect } from 'react-router-dom';
import styles from './HolidayCalendar.module.scss';
import { IHolidayCalendarProps } from './IHolidayCalendarProps';
import { IHolidayCalendarState } from './IHolidayCalendarState';
import HolidayCalendarDetail from './HolidayCalendarDetail';
import { escape } from '@microsoft/sp-lodash-subset';
import Common from '../../common/common';
import { IODataUser } from '@microsoft/sp-odata-types';
import { Loader } from '../../common/Loading';
import { Link } from 'office-ui-fabric-react/lib/components/Link';
import BigCalendar from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
require('./calendar.css');
import * as moment from 'moment';
import { Customizer } from 'office-ui-fabric-react';
import * as strings from 'HolidayCalendarWebPartStrings';
import Spservices from './spservices';
import { IData } from './IData';
import { Image, Stack, IStackTokens, Text, ITextStyles, IStackStyles } from 'office-ui-fabric-react';

const localizer = BigCalendar.momentLocalizer(moment);

export default class HolidayCalendar extends React.Component<IHolidayCalendarProps, IHolidayCalendarState> {
  private spService: Spservices = null;
  public constructor(props: IHolidayCalendarProps) {
    super(props);
    //Initialize the State
    this.state = {
      isLoading: true,
      data: [],
      items: [
        {
          Title: '',
          Location: '',
          EventDate: new Date(),  //Start Time
          EndDate: new Date(),
          Description: '',
          Duration: 0,
          ownerInitial: '',
          ownerPhoto: '',
          ownerEmail: '',
          ownerName: '',
          Id: 0,
          ID: 0,
          color: '',
          fAllDayEvent: true,
          geolocation: { Longitude: 0, Latitude: 0, },
          Category: '',
          RecurrenceData: '',
          fRecurrence: '',
          EventType: '',
          UID: '',
          RecurrenceID: '',
          MasterSeriesItemID: '',
        }
      ],
    };
    this.onSelectEvent = this.onSelectEvent.bind(this);
  }
  public async componentDidMount() {
    await this.getCurrentUserLocation();
  }
  public async componentWillReceiveProps(nextProps) {
    await this.getCurrentUserLocation();
  }

  //get user's Current location
  public async getCurrentUserLocation() {
    await this.props.graphClient.api('/me/city')  //get current user's profile
      .get((error: any, userResponse: any, rawResponse?: any) => {
        //# TODO change officelocation to City
        this.GetItemsFromHoliday(userResponse.value);
      });
  }
  //get Holidays using current location
  public async GetItemsFromHoliday(location) {
    this.spService = new Spservices();
    var eventsandHolidays: IData[] = await this.spService.getEvents(escape(this.props.siteurl), escape(this.props.holidaylistId), escape(this.props.eventlistId), this.props.eventStartDate.value, this.props.eventEndDate.value, location);
    this.setState({ isLoading: false, data: eventsandHolidays });
  }
  public eventStyleGetter(event, start, end, isSelected): any {

    let style: any = {
      backgroundColor: 'white',
      borderRadius: '0px',
      opacity: 1,
      color: event.color,
      borderWidth: '1.1px',
      borderStyle: 'solid',
      borderColor: event.color,
      borderLeftWidth: '6px',
      display: 'block'
    };
    return {
      style: style
    };
  }
  /**
     *
     * @param {*} date
     * @memberof Calendar
     */
  public dayPropGetter(date: Date) {
    return {
      className: styles.dayPropGetter
    };
  }
  private onSelectEvent(event: any) {
    console.log(event);
    window.open(`${this.props.siteurl}/SitePages/Display.aspx?ListName=${event.listName}&ItemID=${event.ID}`,"_blank");
   
  }
  public render(): React.ReactElement<IHolidayCalendarProps> {
    // Styles definition
    const stackStyles: IStackStyles = {
      root: {
        padding:10,
      },
    };
    return (
      <Stack styles={stackStyles}>
        <div className={styles.holidayCalendar}>
          <div className={styles.container}>
            <div className={styles.header}>
              CALENDAR
            </div>
            <BigCalendar
              dayPropGetter={this.dayPropGetter}
              localizer={localizer}
              events={this.state.data}
              startAccessor="EventDate"
              endAccessor="EndDate"
              eventPropGetter={this.eventStyleGetter}
              defaultDate={moment().startOf('day').toDate()}
              onSelectEvent={this.onSelectEvent}
              messages={
                {
                  'today': 'Today',
                  'previous': 'Previous',
                  'next': 'Next',
                  'month': 'Month',
                  'week': 'Week',
                  'day': 'Day',
                  'showMore': total => `+${total} 'showMore'`
                }
              }
            />
          </div>
        </div>
      </Stack>
    );
  }
}
