import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'StockMgWebPartStrings';
import StockMg, { IStockMgProps } from './components/StockMg';
import { SPBrowser, spfi } from '@pnp/sp';
import { SharePointEnvironment, SPService } from 'spfx-addon';

export interface IStockMgWebPartProps {
  siteUrl: string;
}

export default class StockMgWebPart extends BaseClientSideWebPart<IStockMgWebPartProps> {



  public render(): void {
    const element: React.ReactElement<IStockMgProps > = React.createElement(
      StockMg,
    );

    ReactDom.render(element, this.domElement);
  }

  protected async onInit(): Promise<void> {
    const siteUrl = this.properties.siteUrl ?? this.context.pageContext.web.absoluteUrl.trim();
    const sp = spfi().using(SPBrowser({ baseUrl: siteUrl }));
    SPService.init(sp, siteUrl, this.context.pageContext.cultureInfo.currentCultureName, SharePointEnvironment.SPOnline);
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
