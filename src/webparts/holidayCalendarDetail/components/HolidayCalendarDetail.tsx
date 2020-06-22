import * as React from 'react';
import styles from './HolidayCalendarDetail.module.scss';
import * as strings from 'HolidayCalendarDetailWebPartStrings';
import { IHolidayCalendarDetailProps } from './IHolidayCalendarDetailProps';
import { IHolidayCalendarDetailState } from './IHolidayCalendarDetailState';
import { escape } from '@microsoft/sp-lodash-subset';
import Common from '../../common/common';
import { Loader } from '../../common/Loading';
import { Dropdown, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';

const options: IDropdownOption[] = [
  { key: 'Spain', text: 'Spain' },
  { key: 'Office 1', text: 'Office 1' },
  { key: 'Pune', text: 'Pune' }
];
export default class HolidayCalendarDetail extends React.Component<IHolidayCalendarDetailProps, IHolidayCalendarDetailState> {
  public constructor(props: IHolidayCalendarDetailProps) {
    super(props);
    //Initialize the State
    this.state = {
      isLoading: true,
      items: [
        {
          Title: "No Upcoming Holiday",
          Location: "",
          DateOfHoliday: "",
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
    var Url = this.props.siteUrl;
    var listId = this.props.listId;
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
    var Url = this.props.siteUrl;
    var listId = this.props.listId;
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
          items: [{ Title: "Search Not Found", Location: "", DateOfHoliday: (new Date()).toString() }]
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
  public render(): React.ReactElement<IHolidayCalendarDetailProps> {
    return (
      <div className={styles.holidayCalendarDetail}>
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
                                <div className={styles.box}>

                                  <div className={styles.datedisplay} > {(new Date(item.DateOfHoliday).toDateString().substring(8, 10))}</div>
                                  <div className={styles.dateinline}>
                                    <div className={styles.titledisplay} > {(new Date(item.DateOfHoliday).toDateString().substring(4, 7))}</div>
                                    <div className={styles.titlesub} > {(new Date(item.DateOfHoliday).toDateString().substring(11, 15))}</div>
                                  </div>
                                </div>
                              </div>
                              <div className="ms-Grid-col md-sm6 md-md6">
                                <div className={styles.titledetails} > {item.Title}</div>
                                <div className={styles.titledetails} > {item.Location}</div>
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
