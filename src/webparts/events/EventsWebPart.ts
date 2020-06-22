import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart, IPropertyPaneConfiguration, PropertyPaneDropdown, IPropertyPaneDropdownOption, PropertyPaneLabel } from '@microsoft/sp-webpart-base';
import { PropertyFieldDateTimePicker, DateConvention } from '@pnp/spfx-property-controls/lib/PropertyFieldDateTimePicker';
import * as strings from 'EventsWebPartStrings';
import Events from './components/Events';
import { IEventsProps } from './components/IEventsProps';
import { IEventsWebPartProps, ISPLists, ISPList } from './IEventsWebPartProps';
import { Environment, EnvironmentType } from '@microsoft/sp-core-library';
import { SPHttpClient, SPHttpClientResponse, MSGraphClient } from '@microsoft/sp-http';
import * as moment from 'moment';
import { IODataList } from '@microsoft/sp-odata-types';
import forEach from 'ramda/es/forEach';

export default class EventsWebPart extends BaseClientSideWebPart<IEventsWebPartProps> {
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
    this.fetchserviceOption()
      .then((servicelineoption) => {
        this._servicelineOptions = servicelineoption;
      });
    this.fetchlocationOption()
      .then((locationoption) => {
        this.__locationOptions = locationoption;
      });
    return Promise.resolve();
  }

  private _listsInThisSite: IPropertyPaneDropdownOption[] = [];
  private _servicelineOptions: IPropertyPaneDropdownOption[] = [];
  private __locationOptions: IPropertyPaneDropdownOption[] = [];

  public render(): void {
    this.context.msGraphClientFactory.getClient().then((client: MSGraphClient): void => {
      const element: React.ReactElement<IEventsProps> = React.createElement(
        Events,
        {
          graphClient: client,
          isWorkbench: Environment.type == EnvironmentType.Local,
          siteUrl: this.context.pageContext.web.absoluteUrl,
          listName: this.properties.listName,
          eventStartDate: this.properties.eventStartDate,
          eventEndDate: this.properties.eventEndDate,
          spHttpClient: this.context.spHttpClient,
          serviceline: this.properties.serviceline,
          location: this.properties.location
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
                PropertyPaneDropdown('listName', {
                  label: strings.selectedListNameFieldLabel,
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
                }),
                PropertyPaneDropdown('serviceline', {
                  label: strings.selectedServiceLineFieldLabel,
                  options: this._servicelineOptions
                }),
                PropertyPaneDropdown('location', {
                  label: strings.selectedLocationFieldLabel,
                  options: this.__locationOptions
                })
              ]
            }
          ]
        }
      ]
    };
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

  private fetchOptions(): Promise<IPropertyPaneDropdownOption[]> {
    var url = this.context.pageContext.web.absoluteUrl + `/_api/web/lists?$filter=BaseTemplate eq 106 and Hidden eq false`; //106 code for Event List

    return this.fetchLists(url).then((response) => {
      var options: Array<IPropertyPaneDropdownOption> = new Array<IPropertyPaneDropdownOption>();
      var lists: ISPList[] = response.value;
      lists.forEach((list: ISPList) => {
        options.push({ key: list.Id, text: list.Title }); //here in key we set Title Reason:-In View more redirect to OOB Calender View
      });

      return options;
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
  //get serviceLine options from ServiceLine list
  private fetchserviceOption(): Promise<IPropertyPaneDropdownOption[]> {
    var url = this.context.pageContext.web.absoluteUrl + `/_api/web/lists/GetByTitle('ServiceLines')/items`;
    return this.fetchLists(url).then((response) => {
      var options: Array<IPropertyPaneDropdownOption> = new Array<IPropertyPaneDropdownOption>();
      response.value.forEach((serviceLine: IODataList) => {
        options.push({ key: serviceLine.Title, text: serviceLine.Title });
      });
      
      return options;
    });
  }
  //get Location options from Location list
  private fetchlocationOption(): Promise<IPropertyPaneDropdownOption[]> {
    var url = this.context.pageContext.web.absoluteUrl + `/_api/web/lists/GetByTitle('Location')/items`;
    return this.fetchLists(url).then((response) => {
      var options: Array<IPropertyPaneDropdownOption> = new Array<IPropertyPaneDropdownOption>();
      response.value.forEach((getlocation: IODataList) => {
        options.push({ key: getlocation.Title, text: getlocation.Title });
      });
      return options;
    });
  }

}
