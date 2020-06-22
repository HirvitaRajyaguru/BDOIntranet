import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart, IPropertyPaneConfiguration, PropertyPaneSlider, PropertyPaneDropdown,
  PropertyPaneCheckbox, PropertyPaneToggle, IPropertyPaneDropdownOption
} from '@microsoft/sp-webpart-base';
import * as strings from 'EmployeeStoriesWebPartStrings';
import EmployeeStories from './components/EmployeeStories';
import { IEmployeeStoriesProps } from './components/IEmployeeStoriesProps';
import { MSGraphClient } from '@microsoft/sp-http';
import { IODataList } from '@microsoft/sp-odata-types';
import { IEmployeeStoriesWebPartProps, ISPLists, ISPList } from './IEmployeeStoriesWebPartProps';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';


export default class EmployeeStoriesWebPart extends BaseClientSideWebPart <IEmployeeStoriesWebPartProps> {

  public onInit<T>(): Promise<T> {

    this.fetchOptions()
      .then((data) => {
        this._listsInThisSite = data;
      });
    this.fetchServiceLineOption()
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
    this.context.msGraphClientFactory.getClient()
      .then((client: MSGraphClient): void => {

    const element: React.ReactElement<IEmployeeStoriesProps> = React.createElement(
      EmployeeStories,
      {
        siteUrl: this.context.pageContext.web.absoluteUrl,
        listId: this.properties.listId,
        graphClient: client,
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
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneDropdown('listId', {
                  label: strings.selectedListNameFieldLabel,
                  options: this._listsInThisSite
                }),
                PropertyPaneDropdown('serviceline', {
                  label: strings.SelectedServiceline,
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

  private fetchServiceLineOption(): Promise<IPropertyPaneDropdownOption[]> {
    var url = this.context.pageContext.web.absoluteUrl + `/_api/web/lists/GetByTitle('ServiceLines')/items`;

    return this.fetchLists(url).then((response) => {
      var options: Array<IPropertyPaneDropdownOption> = new Array<IPropertyPaneDropdownOption>();
      response.value.forEach((list: IODataList) => {
        console.log("Found list with title = " + list.Title);
        options.push({ key: list.Title, text: list.Title });
        // console.log(options);
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
