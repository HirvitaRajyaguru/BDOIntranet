import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'NewJoineesWebPartStrings';
import NewJoinees from './components/NewJoinees';
import { INewJoineesProps } from './components/INewJoineesProps';
import { MSGraphClient } from '@microsoft/sp-http';

export interface INewJoineesWebPartProps {
  description: string;
}

export default class NewJoineesWebPart extends BaseClientSideWebPart<INewJoineesWebPartProps> {

  public render(): void {
    this.context.msGraphClientFactory.getClient().then((msGraphClient: MSGraphClient) => {
      const element: React.ReactElement<INewJoineesProps> = React.createElement(
        NewJoinees,
        {
          siteUrl: this.context.pageContext.web.absoluteUrl,
          msGraphClient: msGraphClient
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
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
