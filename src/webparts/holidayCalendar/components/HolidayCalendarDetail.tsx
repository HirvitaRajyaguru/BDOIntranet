import * as React from 'react';
import styles from './HolidayCalendar.module.scss';
import * as strings from 'HolidayCalendarWebPartStrings';
import { IHolidayCalendarProps } from './IHolidayCalendarProps';
import { IHolidayCalendarState } from './IHolidayCalendarState';
import { escape } from '@microsoft/sp-lodash-subset';
import Common from '../../common/common';
import { Loader } from '../../common/Loading';
import { Dropdown, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';

const options: IDropdownOption[] = [
  { key: 'Spain', text: 'Spain' },
  { key: 'Office 1', text: 'Office 1' },
  { key: 'Pune', text: 'Pune' }
];
export default class HolidayCalendarDetail extends React.Component<IHolidayCalendarProps, IHolidayCalendarState> {
  public constructor(props: IHolidayCalendarProps, state: IHolidayCalendarState) {
    super(props);
    //Initialize the State
    this.state = {
      isLoading: true,
      data:[],
      items: [
        {
          Title: "No Upcoming Holiday",
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
  }
  public async componentDidMount() {
    await this.getCurrentUserLocation();
  }
  //get user's Current location 
  public async getCurrentUserLocation() {
    const response = await this.props.graphClient.api('/me').get((error: any, userResponse: any, rawResponse?: any) => {
      console.log('userResponse.officeLocation == ', userResponse.officeLocation);
      var ADLocation = userResponse.officeLocation;
      this.GetItemsFromHoliday(ADLocation);
    });
  }
  //get Holidays using current location
  public GetItemsFromHoliday(ADLocation) {
    var HolidayHandler = this;
    let newCommonObj: Common = new Common();
    var Url = this.props.siteurl;
    var listId = this.props.holidaylistId;
    var method = 'get items for Holiday';

    newCommonObj.getDataFromListUsingGuid(Url, listId, null, method).then(res => {
      if (res.data.value != undefined && res.data.value != null && res.data.value.length > 0) {
        //response not null then setState this Response
        var dataFiltered = res.data.value.filter(data => ADLocation == data.Location);

        HolidayHandler.setState({
          items: dataFiltered
        });
      }
      this.setState({
        isLoading: false
      });
    }).catch(error => {
      console.log('error while getting data');
      console.log(error);
    });
  }

  private _onChange = (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption): void => {

    let newCommonObj: Common = new Common();
    var Url = this.props.siteurl;
    var listId = this.props.holidaylistId;
    var method = 'get items for Holiday';
    var query = `?$filter=Location eq '${item.key}'`;

    newCommonObj.getDataFromListUsingGuid(Url, listId, query, method).then(res => {
      if (res.data.value != undefined && res.data.value != null && res.data.value.length > 0) {
        //response not null then setState this Response
        this.setState({
          items: res.data.value
        });
      }
      else {
        this.setState({
          items: [{
            Title: "Search Not Found", Location: "", EventDate: new Date(),
            EndDate: new Date()}]
        });
      }
      this.setState({
        isLoading: false
      });
    }).catch(error => {
      console.log('error while getting data');
      console.log(error);
    });
  };
  public render(): React.ReactElement<IHolidayCalendarProps> {
    return (
      <div className={styles.holidayCalendar}>
        <div className={styles.container}>
          <div className={styles.header}>
            HOLIDAY CALENDAR
          </div>
          <div className={styles.search}>
            <Dropdown placeholder="Select Location" className={styles.searchBox}
              options={options} onChange={this._onChange} />
          </div>
          <div className="ms-Grid" dir="ltr" >
            {
              (this.state.isLoading) ? <Loader message="Please wait..." /> :
                (this.state.items.length <= 0)
                  ?
                  <div>
                    <div className="ms-Grid-row">
                      <div className="ms-Grid-col md-sm6 md-md6">
                        <div className={styles.box}>
                        </div>
                      </div>
                      <div className="ms-Grid-col md-sm6 md-md6">
                        <div className={styles.titledetails} > No Holiday to display</div>
                      </div>
                    </div>
                  </div>
                  :
                  <div>
                    {
                      this.state.items.map(function (item, key) {
                        return (
                          <div>
                            <div className="ms-Grid-row">
                              <div className="ms-Grid-col md-sm6 md-md6">
                                {/*  <div className={styles.box}>

                                  <div className={styles.datedisplay} > {(new Date(item.DateOfHoliday).toDateString().substring(8, 10))}</div>
                                  <div className={styles.dateinline}>
                                    <div className={styles.titledisplay} > {(new Date(item.DateOfHoliday).toDateString().substring(4, 7))}</div>
                                    <div className={styles.titlesub} > {(new Date(item.DateOfHoliday).toDateString().substring(11, 15))}</div>
                                  </div>
                                </div> */}
                              </div>
                              <div className="ms-Grid-col md-sm6 md-md6">
                                <div className={styles.titledetail} > {item.Title}</div>
                                <div className={styles.titledetail} > {item.Location}</div>
                              </div>
                            </div>
                          </div>)
                        //}
                      })
                    }
                  </div>
            }
          </div>
        </div>
      </div>
    );
  }
}
