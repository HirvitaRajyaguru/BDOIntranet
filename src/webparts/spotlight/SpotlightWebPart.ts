import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart, IPropertyPaneConfiguration, PropertyPaneSlider, PropertyPaneToggle,
  PropertyPaneDropdown, PropertyPaneCheckbox, IPropertyPaneDropdownOption
} from '@microsoft/sp-webpart-base';

import * as strings from 'SpotlightWebPartStrings';
import Spotlight from './components/Spotlight';
import { ISpotlightProps } from './components/ISpotlightProps';
import { ISpotlightWebPartProps, ISPLists, ISPList } from './ISpotlightWebPartProps';
import { SPHttpClient, SPHttpClientResponse, MSGraphClient } from '@microsoft/sp-http';
import { IODataList } from '@microsoft/sp-odata-types';

export default class SpotlightWebPart extends BaseClientSideWebPart<ISpotlightWebPartProps> {

  public onInit<T>(): Promise<T> {
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
        this._locationOptions = locationoption;
      });
    return Promise.resolve();
  }
  private _locationOptions: IPropertyPaneDropdownOption[] = [];
  private _listsInThisSite: IPropertyPaneDropdownOption[] = [];
  private _servicelineOptions: IPropertyPaneDropdownOption[] = [];
  public render(): void {
    this.context.msGraphClientFactory.getClient().then((client: MSGraphClient): void => {
      const element: React.ReactElement<ISpotlightProps> = React.createElement(
        Spotlight,
        {
          graphClient: client,
          siteUrl: this.context.pageContext.web.absoluteUrl,
          listId: this.properties.listId,
          numberOfSeconds: this.properties.numberOfSeconds,
          serviceline: this.properties.serviceline,
          location: this.properties.location,
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
                PropertyPaneSlider('numberOfSeconds', {
                  label: strings.NumberOfSecondFieldLabel,
                  min: 4,
                  max: 10,
                  step: 1
                }),
                PropertyPaneDropdown('serviceline', {
                  label: strings.selectedServiceLineFieldLabel,
                  options: this._servicelineOptions
                }),
                PropertyPaneDropdown('location', {
                  label: strings.selectedLocationFieldLabel,
                  options: this._locationOptions
                })
              ]
            }
          ]
        }
      ]
    };
  }

  //get option of ListName with ListId
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
  //get serviceLine options from ServiceLine list
  private fetchserviceOption(): Promise<IPropertyPaneDropdownOption[]> {
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
      response.value.forEach((location: IODataList) => {
        options.push({ key: location.Title, text: location.Title });
      });
      return options;
    });
  }
}
