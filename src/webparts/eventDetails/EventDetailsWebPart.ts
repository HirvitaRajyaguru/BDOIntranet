import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart, IPropertyPaneConfiguration, PropertyPaneDropdown, PropertyPaneCheckbox, IPropertyPaneDropdownOption, PropertyPaneLabel} from '@microsoft/sp-webpart-base';
import { PropertyFieldDateTimePicker, DateConvention, TimeConvention, IDateTimeFieldValue } from '@pnp/spfx-property-controls/lib/PropertyFieldDateTimePicker';
import * as strings from 'EventDetailsWebPartStrings';
import EventDetails from './components/EventDetails';
import { IEventDetailsProps } from './components/IEventDetailsProps';
import { IEventDetailsWebPartProps,ISPLists, ISPList } from './IEventDetailsWebPartProps';
import { Environment, EnvironmentType } from '@microsoft/sp-core-library';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import * as moment from 'moment';
export default class EventDetailsWebPart extends BaseClientSideWebPart<IEventDetailsWebPartProps> {

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
    const element: React.ReactElement<IEventDetailsProps> = React.createElement(
      EventDetails,
      {
        isWorkbench: Environment.type == EnvironmentType.Local,
        siteUrl: this.context.pageContext.web.absoluteUrl,
        listId: this.properties.listId,
        eventStartDate: this.properties.eventStartDate,
        eventEndDate: this.properties.eventEndDate,
        spHttpClient: this.context.spHttpClient,
        Practices: this.properties.Practices,
      }
    );

    ReactDom.render(element, this.domElement);
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
                PropertyPaneDropdown('listId', {
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
                PropertyPaneCheckbox('Practices', {
                  text: strings.SelectedPrectices,
                  checked: this.properties.Practices
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
        options.push({ key: list.Id, text: list.Title });
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
}
