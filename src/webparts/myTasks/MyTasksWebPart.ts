import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneToggle
} from '@microsoft/sp-webpart-base';

import * as strings from 'MyTasksWebPartStrings';
import MyTasks from './components/MyTasks';
import { IMyTasksProps } from './components/IMyTasksProps';
import { MSGraphClient } from '@microsoft/sp-http';
import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';
import { IMyTasksWebPartProps } from './IMyTasksWebPartProps';


export default class MyTasksWebPart extends BaseClientSideWebPart<IMyTasksWebPartProps> {

  public render(): void {
    this.context.msGraphClientFactory.getClient()
      .then((client: MSGraphClient): void => {
        const element: React.ReactElement<IMyTasksProps> = React.createElement(
          MyTasks,
          {
            graphClient: client,
            completedRequest: this.properties.completedRequest,
            siteUrl: this.context.pageContext.web.absoluteUrl

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
                PropertyPaneToggle('completedRequest', {
                  label: strings.completedRequest
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
