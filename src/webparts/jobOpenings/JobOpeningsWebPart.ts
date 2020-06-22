import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart, IPropertyPaneConfiguration, PropertyPaneSlider, PropertyPaneDropdown,
  PropertyPaneCheckbox, PropertyPaneToggle, IPropertyPaneDropdownOption
} from '@microsoft/sp-webpart-base';
import * as strings from 'JobOpeningsWebPartStrings';
import JobOpenings from './components/JobOpenings';
import { IJobOpeningsProps } from './components/IJobOpeningsProps';
import { IJobOpeningsWebpartProps, ISPLists, ISPList } from './IJobOpeningsWebpartProps';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import { MSGraphClient } from '@microsoft/sp-http';
import { IODataList } from '@microsoft/sp-odata-types';

export default class JobOpeningsWebPart extends BaseClientSideWebPart<IJobOpeningsProps> {

  public onInit<T>(): Promise<T> {
    this.fetchOptions()
      .then((data) => {
        this._listsInThisSite = data;
      });
    this.fetchServiceLineOption()
      .then((data) => {
        this._listsofServiceLine = data;
      });
    this.fetchlocationOption()
      .then((locationoption) => {
        this.__locationOptions = locationoption;
      });
    return Promise.resolve();
  }

  private _listsInThisSite: IPropertyPaneDropdownOption[] = [];
  private _listsofServiceLine: IPropertyPaneDropdownOption[] = [];
  private __locationOptions: IPropertyPaneDropdownOption[] = [];

  public render(): void {
    this.context.msGraphClientFactory.getClient()
      .then((client: MSGraphClient): void => {

    const element: React.ReactElement<IJobOpeningsProps> = React.createElement(
      JobOpenings,
      {
        siteUrl: this.context.pageContext.web.absoluteUrl,
        listId: this.properties.listId,
        currentUserEmail: this.context.pageContext.user.email,
        serviceline: this.properties.serviceline,
        graphClient: client,
        location: this.properties.location,
        newjoineelistId: this.properties.newjoineelistId
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
                }),
                PropertyPaneDropdown('newjoineelistId', {
                  label: strings.selectedNewJoineeFieldLabel,
                  options: this._listsInThisSite
                }),
                PropertyPaneDropdown('serviceline', {
                  label: strings.selectedListNameFieldLabel,
                  options: this._listsofServiceLine
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
    var url = this.context.pageContext.web.absoluteUrl + `/_api/web/lists?$filter=BaseTemplate eq 100 and Hidden eq false`; //106 code for Event List

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
        options.push({ key: list.Title, text: list.Title });
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
