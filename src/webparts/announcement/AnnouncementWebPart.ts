import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart, IPropertyPaneConfiguration, PropertyPaneDropdown, IPropertyPaneDropdownOption } from '@microsoft/sp-webpart-base';
import * as strings from 'AnnouncementWebPartStrings';
import Announcement from './components/Announcement';
import { IAnnouncementProps } from './components/IAnnouncementProps';
import { IAnnouncementWebPartProps, ISPLists, ISPList } from './IAnnouncementWebPartProps';
import { SPHttpClient, SPHttpClientResponse, MSGraphClient } from '@microsoft/sp-http';
import { sp, SearchQuery, SearchResults } from "@pnp/sp";
import { IODataList } from '@microsoft/sp-odata-types';


export default class AnnouncementWebPart extends BaseClientSideWebPart<IAnnouncementWebPartProps> {

  public onInit<T>(): Promise<T> {
    //this.fetchsiteOptions().then((sitedata) => {
    //  this._listsofSite = sitedata;
    //});
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
        this.__locationOptions = locationoption;
      });
    return Promise.resolve();
  }
  private _listsInThisSite: IPropertyPaneDropdownOption[] = [];
  private __locationOptions: IPropertyPaneDropdownOption[] = [];
  private _servicelineOptions: IPropertyPaneDropdownOption[] = [];


  public render(): void {
    this.context.msGraphClientFactory.getClient().then((client: MSGraphClient): void => {
    const element: React.ReactElement<IAnnouncementProps> = React.createElement(
      Announcement,
      {
        siteurl: this.context.pageContext.web.absoluteUrl,
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
                //PropertyPaneDropdown('site', {
                //  label: strings.selectedsiteNameFieldLabel,
                //  options: this._listsofSite
                //}),
                PropertyPaneDropdown('listId', {
                  label: strings.selectedListNameFieldLabel,
                  options: this._listsInThisSite
                }),
                PropertyPaneDropdown('serviceline', {
                  label: strings.selectedServiceLineFieldLabel,
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
  //fetch all sites
  private fetchsiteOptions(): Promise<IPropertyPaneDropdownOption[]> {
    var options: Array<IPropertyPaneDropdownOption> = new Array<IPropertyPaneDropdownOption>();
    // do a null check of department id
    return sp.search(<SearchQuery>{
      Querytext: `contentclass:STS_Site`,
      SelectProperties: ["Title", "SPSiteUrl", "WebTemplate"],
      RefinementFilters: [`departmentid:string("{*",linguistics=off)`],
      RowLimit: 500,
      TrimDuplicates: false
    }).then((r: SearchResults) => {
      r.PrimarySearchResults.forEach((value: any) => {
        options.push({ key: value.SPSiteUrl, text: value.Title });
      });
      return options;
    });
  }
  //fetch option of list based on site
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
  //get serviceLine options from ServiceLine list
  private fetchserviceOption(): Promise<IPropertyPaneDropdownOption[]> {
    var url = this.context.pageContext.web.absoluteUrl + `/_api/web/lists/GetByTitle('ServiceLines')/items`;
    return this.fetchLists(url).then((response) => {
      var options: Array<IPropertyPaneDropdownOption> = new Array<IPropertyPaneDropdownOption>();
      response.value.forEach((serviceLine: IODataList) => {
        options.push({ key: serviceLine.Title, text: serviceLine.Title });
      });
      return options;
    });
  }

  //get Location options from Location list
  private fetchlocationOption(): Promise<IPropertyPaneDropdownOption[]> {
    var url = this.context.pageContext.web.absoluteUrl + `/_api/web/lists/GetByTitle('Location')/items`;
    return this.fetchLists(url).then((response) => {
      var options: Array<IPropertyPaneDropdownOption> = new Array<IPropertyPaneDropdownOption>();
      response.value.forEach((locationget: IODataList) => {
        options.push({ key: locationget.Title, text: locationget.Title });
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
