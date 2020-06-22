import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'PartnerSpeakDetailsWebPartStrings';
import PartnerSpeakDetails from './components/PartnerSpeakDetails';
import { IPartnerSpeakDetailsProps } from './components/IPartnerSpeakDetailsProps';

export interface IPartnerSpeakDetailsWebPartProps {
  description: string;
  siteUrl: string;
  ListName: string;
}

export default class PartnerSpeakDetailsWebPart extends BaseClientSideWebPart <IPartnerSpeakDetailsWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IPartnerSpeakDetailsProps> = React.createElement(
      PartnerSpeakDetails,
      {
        description: this.properties.description,
        siteUrl: this.context.pageContext.web.absoluteUrl,
        ListName: "PartnersSpeak",
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
