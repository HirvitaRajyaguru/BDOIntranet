import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart, IPropertyPaneConfiguration, PropertyPaneSlider, PropertyPaneDropdown, IPropertyPaneDropdownOption } from '@microsoft/sp-webpart-base';
import * as strings from 'TilesWebPartStrings';
import Tiles from './components/Tiles';
import { ITilesProps } from './components/ITilesProps';
import { ITilesWebPartProps, ISPLists, ISPList } from './ITilesWebPartProps';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';

export default class TilesWebPart extends BaseClientSideWebPart<ITilesWebPartProps> {
  public onInit<T>(): Promise<T> {
    this.fetchOptions()
      .then((data) => {
        this._listsInThisSite = data;
      });

    return Promise.resolve();
  }

  private _listsInThisSite: IPropertyPaneDropdownOption[] = [];

  public render(): void {
    const element: React.ReactElement<ITilesProps> = React.createElement(
      Tiles,
      {
        siteUrl: this.context.pageContext.web.absoluteUrl,
        numberOfItems: this.properties.numberOfItems,
        listId: this.properties.listId
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
                PropertyPaneSlider('numberOfItems', {
                  label: strings.NumberOfDocumentsFieldLabel,
                  min: 1,
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

  //get option of ListName with ListId
  private fetchOptions(): Promise<IPropertyPaneDropdownOption[]> {
    var url = this.context.pageContext.web.absoluteUrl + `/_api/web/lists?$filter=BaseTemplate eq 170 and Hidden eq false`; //170 code for Promoted List

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
