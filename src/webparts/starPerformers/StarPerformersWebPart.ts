import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart, IPropertyPaneConfiguration, PropertyPaneSlider, PropertyPaneDropdown,
  PropertyPaneCheckbox, PropertyPaneToggle, IPropertyPaneDropdownOption
} from '@microsoft/sp-webpart-base';
import * as strings from 'StarPerformersWebPartStrings';
import StarPerformers from './components/StarPerformers';
import { IStarPerformersProps } from './components/IStarPerformersProps';
import { IStarPerformersWebPartProps, ISPLists, ISPList } from './IStarPerformersWebPartProps';
import { SPHttpClient, SPHttpClientResponse, MSGraphClient } from '@microsoft/sp-http';
import { IODataList } from '@microsoft/sp-odata-types';

export default class StarPerformersWebPart extends BaseClientSideWebPart<IStarPerformersWebPartProps> {

  public onInit<T>(): Promise<T> {
    
    this.fetchOptions()
      .then((data) => {
        this._listsInThisSite = data;
      });
    this.fetchserviceOption()
      .then((servicelineoption) => {
        this._servicelineOptions = servicelineoption;
      });

    return Promise.resolve();
  }

  private _listsInThisSite: IPropertyPaneDropdownOption[] = [];
  private _servicelineOptions: IPropertyPaneDropdownOption[] = [];

  public render(): void {
    this.context.msGraphClientFactory.getClient().then((client: MSGraphClient): void => {
      const element: React.ReactElement<IStarPerformersProps> = React.createElement(
        StarPerformers,
        {
          graphClient: client,
          siteUrl: this.context.pageContext.web.absoluteUrl,
          listId: this.properties.listId,
          IsImage: this.properties.IsImage,
          Homepage: this.properties.Homepage,
          serviceline: this.properties.serviceline
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
                PropertyPaneCheckbox('IsImage', {
                  text: strings.IsImage,
                  checked: this.properties.IsImage
                }),
                PropertyPaneToggle('Homepage', {
                  label: strings.Homepage
                }),
                PropertyPaneDropdown('serviceline', {
                  label: strings.selectedServiceLineFieldLabel,
                  options: this._servicelineOptions
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
  //get serviceLine options from ServiceLine list
  private fetchserviceOption(): Promise<IPropertyPaneDropdownOption[]> {
    var url = this.context.pageContext.web.absoluteUrl + `/_api/web/lists/GetByTitle('ServiceLines')/items`;
    return this.fetchLists(url).then((response) => {
      var options: Array<IPropertyPaneDropdownOption> = new Array<IPropertyPaneDropdownOption>();
      response.value.map((list: IODataList) => {
        options.push({ key: list.Title, text: list.Title });
      });
      return options;
    });
  }
 
}
