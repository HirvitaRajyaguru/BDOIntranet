import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart, IPropertyPaneConfiguration, PropertyPaneSlider, PropertyPaneDropdown, PropertyPaneCheckbox, IPropertyPaneDropdownOption } from '@microsoft/sp-webpart-base';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import * as strings from 'HolidayCalendarDetailWebPartStrings';
import HolidayCalendarDetail from './components/HolidayCalendarDetail';
import { IHolidayCalendarDetailProps } from './components/IHolidayCalendarDetailProps';
import { IHolidayCalendarDetailWebPartProps, ISPLists, ISPList } from './IHolidayCalendarDetailWebPartProps';
import { MSGraphClient } from '@microsoft/sp-http';

export default class HolidayCalendarDetailWebPart extends BaseClientSideWebPart<IHolidayCalendarDetailWebPartProps> {

  public onInit<T>(): Promise<T> {

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
        const element: React.ReactElement<IHolidayCalendarDetailProps> = React.createElement(
          HolidayCalendarDetail,
          {
            siteUrl: this.context.pageContext.web.absoluteUrl,
            listId: this.properties.listId,
            searchQuery: this.properties.searchQuery,
            graphClient: client
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
                PropertyPaneDropdown('listId', {
                  label: strings.selectedListNameFieldLabel,
                  options: this._listsInThisSite
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
    var url = this.context.pageContext.web.absoluteUrl + `/_api/web/lists?$filter=BaseTemplate eq 100 and Hidden eq false`; //100 code for Custom List

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

}
