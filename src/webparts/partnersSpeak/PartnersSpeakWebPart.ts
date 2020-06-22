import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart, IPropertyPaneConfiguration, PropertyPaneSlider, PropertyPaneDropdown,
  PropertyPaneCheckbox, PropertyPaneToggle, IPropertyPaneDropdownOption
} from '@microsoft/sp-webpart-base';
import * as strings from 'PartnersSpeakWebPartStrings';
import PartnersSpeak from './components/PartnersSpeak';
import { IPartnersSpeakProps } from './components/IPartnersSpeakProps';
import { IPartnersSpeakWebpartProps, ISPLists, ISPList } from './IPartnersSpeakWebpartProps';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import { MSGraphClient } from '@microsoft/sp-http';
import { IODataList } from '@microsoft/sp-odata-types';


export default class PartnersSpeakWebPart extends BaseClientSideWebPart<IPartnersSpeakWebpartProps> {

  public onInit<T>(): Promise<T> {
    this.fetchOptions()
      .then((data) => {
        this._listsInThisSite = data;
      });
    this.fetchServiceline()
      .then((data) => {
        this._listsofServiceline = data;
      });

    return Promise.resolve();
  }

  private _listsInThisSite: IPropertyPaneDropdownOption[] = [];
  private _listsofServiceline: IPropertyPaneDropdownOption[] = [];

  public render(): void {
    this.context.msGraphClientFactory.getClient()
      .then((client: MSGraphClient): void => {

        const element: React.ReactElement<IPartnersSpeakProps> = React.createElement(
          PartnersSpeak,
          {

            siteUrl: this.context.pageContext.web.absoluteUrl,
            listId: this.properties.listId,
            graphClient: client,
            numberOfSeconds: this.properties.numberOfSeconds,
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
                PropertyPaneDropdown('serviceline', {
                  label: strings.selectedListNameFieldLabel,
                  options: this._listsofServiceline
                }),
                PropertyPaneSlider('numberOfSeconds', {
                  label: strings.NumberOfSecondFieldLabel,
                  min: 4,
                  max: 10,
                  step: 1
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

  private fetchServicelineList(url: string): Promise<any> {
    return this.context.spHttpClient.get(url, SPHttpClient.configurations.v1).then((response: SPHttpClientResponse) => {
      if (response.ok) {
        return response.json();
      } else {
        console.log("WARNING - failed to hit URL " + url + ". Error = " + response.statusText);
        return null;
      }
    });
  }
  private fetchServiceline(): Promise<IPropertyPaneDropdownOption[]> {
    var url = this.context.pageContext.web.absoluteUrl + `/_api/web/lists/GetByTitle('ServiceLines')/items`;

    return this.fetchServicelineList(url).then((response) => {
      var options: Array<IPropertyPaneDropdownOption> = new Array<IPropertyPaneDropdownOption>();
      response.value.map((list: IODataList) => {
        console.log("Found list with title = " + list.Title);
        options.push({ key: list.Title, text: list.Title });
        // console.log(options);
      });

      return options;
    });
  }

}
