import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart, IPropertyPaneConfiguration, PropertyPaneSlider, PropertyPaneDropdown, PropertyPaneCheckbox, IPropertyPaneDropdownOption } from '@microsoft/sp-webpart-base';

import * as strings from 'AnnouncementMarqueeWebPartStrings';
import AnnouncementMarquee from './components/AnnouncementMarquee';
import { IAnnouncementMarqueeProps } from './components/IAnnouncementMarqueeProps';
import { IAnnouncementMarqueeWebPartProps, ISPLists, ISPList } from './IAnnouncementMarqueeWebPartProps';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';

//export interface IAnnouncementMarqueeWebPartProps {
//  listName: string;
//}

export default class AnnouncementMarqueeWebPart extends BaseClientSideWebPart<IAnnouncementMarqueeWebPartProps> {
  public onInit<T>(): Promise<T> {
    this.fetchOptions()
      .then((data) => {
        this._listsInThisSite = data;
      });

    return Promise.resolve();
  }
  private _listsInThisSite: IPropertyPaneDropdownOption[] = [];
  public render(): void {
    const element: React.ReactElement<IAnnouncementMarqueeProps > = React.createElement(
      AnnouncementMarquee,
      {
        siteurl: this.context.pageContext.web.absoluteUrl,
        listId: this.properties.listId,
        spHttpClient: this.context.spHttpClient,
        Practices: this.properties.Practices
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
}
