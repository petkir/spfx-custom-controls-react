import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneDropdown
} from '@microsoft/sp-webpart-base';

import { update, get } from '@microsoft/sp-lodash-subset';
import * as strings from 'TestControlWebPartStrings';
import TestControl from './components/TestControl';
import { ITestControlProps } from './components/ITestControlProps';

import { PropertyPaneAsyncNav } from '../../controls/PropertyPaneAsyncNav/PropertyPaneAsyncNav';
import { INavLinkGroup } from 'office-ui-fabric-react/lib/Nav';



export interface ITestControlWebPartProps {
  description: string;
  NavKey:string;
  Dropdown:string;
}

export default class TestControlWebPart extends BaseClientSideWebPart<ITestControlWebPartProps> {

  public render(): void {
    const element: React.ReactElement<ITestControlProps > = React.createElement(
      TestControl,
      {
        description: this.properties.description,
        navkey:this.properties.NavKey,
        ddvalue:this.properties.Dropdown
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }
  private loadNavigation(): Promise<INavLinkGroup[]> {
    return new Promise<INavLinkGroup[]>((resolve: (options: INavLinkGroup[]) => void, reject: (error: any) => void) => {
  console.log('current Dropdown value'+this.properties.Dropdown);
  let ddtext:string = '';
  
  let key:string = '';
  if((window as any).loadedkey) 
    key= (window as any).loadedkey;
  
  if(this.properties.Dropdown) 
    ddtext=this.properties.Dropdown;

  if(!window.hasOwnProperty('loaded') || !window["loaded"] || key !== ddtext)
{ //load
  (window as any).loaded = false;
  var navitems : INavLinkGroup[] = [
    { 
       //name:'MyTestGroup',
       
       links:[
         {name:'Test1'+ddtext,url:'Test1',key:'1',
          links: [
            {name:'sublink1'+ddtext,url:'sublink1',key:'11'},
            {name:'sublink2'+ddtext,url:'sublink2',key:'12'}]
           },
         {name:'Test2'+ddtext,url:'Test2',key:'2',
         links: [
          {name:'sublink1'+ddtext,url:'sublink1',key:'21'},
          {name:'sublink2'+ddtext,url:'sublink2',key:'22'}]
         }        
      ]
      
    }
  ];
  (window as any).loadedData = navitems;
  (window as any).loaded = true;
  (window as any).loadedkey = ddtext;
  setTimeout(() => {
    resolve((window as any).loadedData as INavLinkGroup[]);
  }, 2000);
}else{
  
    setTimeout(() => {
      resolve((window as any).loadedData as INavLinkGroup[]);
    }, 0);
  
}
    });
  }
  
  private onNavigationChange(propertyPath: string, newValue: any): void {
    const oldValue: any = get(this.properties, propertyPath);
    // store new value in web part properties
    update(this.properties, propertyPath, (): any => { return newValue.key; });
    // refresh web part
    this.render();
  }
  
  protected onPropertyPaneFieldChanged(propertyPath: string, oldValue: any, newValue: any)
  {
    if(propertyPath==='NavKey' && newValue)
    {
      console.log('new itemkey selected '+newValue );
    }
    if (propertyPath==='Dropdown' && newValue)
    {
      super.onPropertyPaneFieldChanged(propertyPath, oldValue, newValue);
      // get previously selected item
      const previousItem: string = this.properties.NavKey;
      // reset selected item
      this.properties.NavKey = undefined;
      // push new item value
      this.onPropertyPaneFieldChanged('NavKey', previousItem, this.properties.NavKey);
    
    // this.context.statusRenderer.displayLoadingIndicator(this.domElement, 'lists');
    this.context.propertyPane.refresh();
    //this.context.statusRenderer.clearLoadingIndicator(this.domElement);
    this.render();
  }
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
                }),
                PropertyPaneDropdown('Dropdown',{
                  label:'Dropdown',
                  options:[{ key:'Test1',text:'Test1' },
                  { key:'Test2',text:'Test2' },
                  { key:'Test3',text:'Test3' },
                  ]
                }),
                new PropertyPaneAsyncNav('NavKey', {
                  label: 'MyDemo Text',
                  key:'Key1',
                  loadOptions: this.loadNavigation.bind(this),
                  onPropertyChange: this.onNavigationChange.bind(this),
                  selectedKey: this.properties.NavKey
                })
                 
                
              ]
            }
          ]
        }
      ]
    };
  }
}
