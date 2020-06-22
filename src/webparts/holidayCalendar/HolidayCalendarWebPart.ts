import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart, PropertyPaneLabel,IPropertyPaneConfiguration, PropertyPaneSlider, PropertyPaneDropdown, PropertyPaneToggle,PropertyPaneCheckbox, IPropertyPaneDropdownOption } from '@microsoft/sp-webpart-base';
import { PropertyFieldDateTimePicker, DateConvention } from '@pnp/spfx-property-controls/lib/PropertyFieldDateTimePicker';
import * as strings from 'HolidayCalendarWebPartStrings';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import HolidayCalendar from './components/HolidayCalendar';
import { IHolidayCalendarProps } from './components/IHolidayCalendarProps';
import { MSGraphClient } from '@microsoft/sp-http';
import * as moment from 'moment';
import { IODataList } from '@microsoft/sp-odata-types';
import { IHolidayCalendarWebPartProps, ISPList, ISPLists} from './IHolidayCalendarWebPartProps';
export default class HolidayCalendarWebPart extends BaseClientSideWebPart<IHolidayCalendarWebPartProps> {

  public onInit<T>(): Promise<T> {
    if (!this.properties.eventStartDate) {
      this.properties.eventStartDate = { value: moment().subtract(2, 'years').startOf('month').toDate(), displayValue: moment().format('ddd MMM MM YYYY') };
    }
    if (!this.properties.eventEndDate) {
      this.properties.eventEndDate = { value: moment().add(20, 'years').endOf('month').toDate(), displayValue: moment().format('ddd MMM MM YYYY') };
    }
    this.fetchOptions()
      .then((data) => {
        this._listsInThisSite = data;
      });
    return Promise.resolve();
  }

  private _listsInThisSite: IPropertyPaneDropdownOption[] = [];

  public render(): void {
    this.context.msGraphClientFactory.getClient()
      .then((client: MSGraphClient): void => {
        const element: React.ReactElement<IHolidayCalendarProps> = React.createElement(
          HolidayCalendar,
          {
            siteurl: this.context.pageContext.web.absoluteUrl,
            holidaylistId: this.properties.holidaylistId,
            eventlistId: this.properties.eventlistId,
            graphClient: client,
            eventStartDate: this.properties.eventStartDate,
            eventEndDate: this.properties.eventEndDate
          }
        );

        ReactDom.render(element, this.domElement);
      });
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          groups: [
            {
              groupFields: [
                PropertyPaneDropdown('holidaylistId', {
                  label: strings.HolidayListFieldLabel,
                  options: this._listsInThisSite
                }),
                PropertyPaneDropdown('eventlistId', {
                  label: strings.EventListFieldLabel,
                  options: this._listsInThisSite
                }),
                PropertyPaneLabel('eventStartDate', {
                  text: strings.eventSelectDatesLabel
                }),
                PropertyFieldDateTimePicker('eventStartDate', {
                  label: 'From',
                  initialDate: this.properties.eventStartDate,
                  dateConvention: DateConvention.Date,
                  onPropertyChange: this.onPropertyPaneFieldChanged,
                  properties: this.properties,
                  onGetErrorMessage: this.onEventStartDateValidation,
                  deferredValidationTime: 0,
                  key: 'eventStartDateId'
                }),
                PropertyFieldDateTimePicker('eventEndDate', {
                  label: 'to',
                  initialDate: this.properties.eventEndDate,
                  dateConvention: DateConvention.Date,
                  onPropertyChange: this.onPropertyPaneFieldChanged,
                  properties: this.properties,
                  onGetErrorMessage: this.onEventEndDateValidation,
                  deferredValidationTime: 0,
                  key: 'eventEndDateId'
                })
              ]
            }
          ]
        }
      ]
    };
  }

  /**
   *  fetch List Options
   * @param url
   */

  private fetchOptions(): Promise<IPropertyPaneDropdownOption[]> {
    var url = this.context.pageContext.web.absoluteUrl + `/_api/web/lists?$filter=BaseTemplate eq 106 and Hidden eq false`; //106 code for Event List

    return this.fetchLists(url).then((response) => {
      var options: Array<IPropertyPaneDropdownOption> = new Array<IPropertyPaneDropdownOption>();
      var lists: ISPList[] = response.value;
      lists.forEach((list: ISPList) => {
        options.push({ key: list.Id, text: list.Title });
      });

      return options;
    });
  }

  private fetchLists(url: string): Promise<ISPLists> {
    return this.context.spHttpClient.get(url, SPHttpClient.configurations.v1).then((response: SPHttpClientResponse) => {
      if (response.ok) {
        return response.json();
      } else {
        console.log("WARNING - failed to hit URL " + url + ". Error = " + response.statusText);
        return null;
      }
    });
  }

  private onEventStartDateValidation(date: string) {
    if (date && this.properties.eventEndDate.value) {
      if (moment(date).isAfter(moment(this.properties.eventEndDate.value))) {
        return strings.SartDateValidationMessage;
      }
    }
    return '';
  }

  private onEventEndDateValidation(date: string) {
    if (date && this.properties.eventEndDate.value) {
      if (moment(date).isBefore(moment(this.properties.eventStartDate.value))) {
        return strings.EnDateValidationMessage;
      }
    }
    return '';
  }
  
}
