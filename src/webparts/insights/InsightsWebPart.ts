import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart, IPropertyPaneConfiguration, PropertyPaneDropdown, IPropertyPaneDropdownOption } from '@microsoft/sp-webpart-base';
import * as strings from 'InsightsWebPartStrings';
import Insights from './components/Insights';
import { IInsightsProps } from './components/IInsightsProps';
import { IInsightsWebPartProps, ISPList, ISPLists} from './IInsightsWebPartProps';
import { SPHttpClient, SPHttpClientResponse, MSGraphClient } from '@microsoft/sp-http';
import { IODataList } from '@microsoft/sp-odata-types';

export default class InsightsWebPart extends BaseClientSideWebPart<IInsightsWebPartProps> {

  public onInit<T>(): Promise<T> {

    this.fetchListOptions()
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

  private _listsInThisSite: IPropertyPaneDropdownOption[] = [];
  private _servicelineOptions: IPropertyPaneDropdownOption[] = [];
  private _locationOptions: IPropertyPaneDropdownOption[] = [];

  public render(): void {
    this.context.msGraphClientFactory.getClient().then((client: MSGraphClient): void => {
    const element: React.ReactElement<IInsightsProps > = React.createElement(
      Insights,
      {
        graphClient: client,
        siteurl: this.context.pageContext.web.absoluteUrl,
        listId: this.properties.listId,
        location: this.properties.location,
        serviceline: this.properties.serviceline,
        newslistId: this.properties.newslistId,
        thoughtleadershiplistId: this.properties.thoughtleadershiplistId,
        globalthoughtleadershiplistId: this.properties.globalthoughtleadershiplistId
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
                PropertyPaneDropdown('newslistId', {
                  label: strings.selectedNewsListNameFieldLabel,
                  options: this._listsInThisSite
                }),
                PropertyPaneDropdown('thoughtleadershiplistId', {
                  label: strings.selectedTLListNameFieldLabel,
                  options: this._listsInThisSite
                }),
                PropertyPaneDropdown('globalthoughtleadershiplistId', {
                  label: strings.selectedGTLListNameFieldLabel,
                  options: this._listsInThisSite
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
  //get list from current Site
  private fetchListOptions(): Promise<IPropertyPaneDropdownOption[]> {
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
