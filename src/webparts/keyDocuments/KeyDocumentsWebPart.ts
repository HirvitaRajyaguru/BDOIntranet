import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart, IPropertyPaneConfiguration, PropertyPaneSlider, PropertyPaneDropdown, PropertyPaneCheckbox, IPropertyPaneDropdownOption } from '@microsoft/sp-webpart-base';
import * as strings from 'KeyDocumentsWebPartStrings';
import KeyDocuments from './components/KeyDocuments';
import { IKeyDocumentsProps } from './components/IKeyDocumentsProps';
import { IKeyDocumentsWebPartProps, ISPLists, ISPList } from './IKeyDocumentsWebPartProps';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';

//export interface IKeyDocumentsWebPartProps {
//  description: string;
//  listName: string;
//}

export default class KeyDocumentsWebPart extends BaseClientSideWebPart<IKeyDocumentsWebPartProps> {
  public onInit<T>(): Promise<T> {

    this.fetchOptions()
      .then((data) => {
        this._listsInThisSite = data;
      });

    return Promise.resolve();
  }

  private _listsInThisSite: IPropertyPaneDropdownOption[] = [];

  public render(): void {
    const element: React.ReactElement<IKeyDocumentsProps> = React.createElement(
      KeyDocuments,
      {
        siteurl: this.context.pageContext.web.absoluteUrl,
        listId: this.properties.listId,
        Practices: this.properties.Practices,
        Homepage: true
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
                }),


              ]
            }
          ]
        }
      ]
    };
  }
  private fetchOptions(): Promise<IPropertyPaneDropdownOption[]> {
    var url = this.context.pageContext.web.absoluteUrl + `/_api/web/lists?$filter=BaseTemplate eq 101`; //101 code for Document Library

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
