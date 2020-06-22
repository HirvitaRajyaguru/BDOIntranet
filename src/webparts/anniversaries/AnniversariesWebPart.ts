import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  IPropertyPaneDropdownOption,
  PropertyPaneDropdown,
  PropertyPaneCheckbox
} from '@microsoft/sp-webpart-base';

import * as strings from 'AnniversariesWebPartStrings';
import Anniversaries from './components/Anniversaries';
import { IAnniversaryProps } from './components/IAnniversariesProps';
import { MSGraphClient, SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import { IAnniversariesWebPartProps, ISPList, ISPLists } from './IAnniversariesWebPartProps';

export interface IAnniversariesWebPartProps {
  description: string;
  currentUserEmail: string;
}


export default class AnniversariesWebPart extends BaseClientSideWebPart<IAnniversariesWebPartProps> {

  public onInit<T>(): Promise<T> {

    this.fetchOptions()
      .then((data) => {
        this._listsInThisSite = data;
      });

    return Promise.resolve();
  }

  private _listsInThisSite: IPropertyPaneDropdownOption[] = [];
  public render(): void {
    this.context.msGraphClientFactory.getClient().then((msGraphClient: MSGraphClient) => {
      const element: React.ReactElement<IAnniversaryProps> = React.createElement(
        Anniversaries,
        {
          siteurl: this.context.pageContext.web.absoluteUrl,
          msGraphClient: msGraphClient,
          currentUserEmail: this.context.pageContext.user.email,
          listId: this.properties.listId,
          Practices: this.properties.Practices,
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
                PropertyPaneCheckbox('Practices', {
                  text:'Practice Wise?', //strings.SelectedPrectices,
                  checked: this.properties.Practices
                })
               
              ]
            }
          ]
        }
      ]
    };
  }
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
