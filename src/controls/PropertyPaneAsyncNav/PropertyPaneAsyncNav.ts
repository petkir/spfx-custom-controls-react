import { IAsyncNavProps } from "./IAsyncNavProps";
import * as React from 'react';
import * as ReactDom from 'react-dom';
import { IPropertyPaneCustomFieldProps,IPropertyPaneField,PropertyPaneFieldType }from '@microsoft/sp-webpart-base';
import { IPropertyPaneAsyncNavProps } from "./IPropertyPaneAsyncNavProps";
import { INavLinkGroup } from "office-ui-fabric-react/lib/Nav";
import AsyncNav from "./AsyncNav";

export interface IPropertyPaneAsyncNavInternalProps 
extends IPropertyPaneAsyncNavProps, IPropertyPaneCustomFieldProps {
}


export class PropertyPaneAsyncNav implements IPropertyPaneField<IPropertyPaneAsyncNavProps> {
    public type: PropertyPaneFieldType = PropertyPaneFieldType.Custom;
    public targetProperty: string;
    public properties: IPropertyPaneAsyncNavInternalProps;
    private elem: HTMLElement;
  
    constructor(targetProperty: string, properties: IPropertyPaneAsyncNavProps) {
      this.targetProperty = targetProperty;
      this.properties = {
        key: properties.key,
        label: properties.label,
        loadOptions: properties.loadOptions,
        onPropertyChange: properties.onPropertyChange,
        selectedKey: properties.selectedKey,
        disabled: properties.disabled,
        onRender: this.onRender.bind(this)
      };
    }
  
    public render(): void {
      if (!this.elem) {
        return;
      }
  
      this.onRender(this.elem);
    }
  
    private onRender(elem: HTMLElement): void {
      if (!this.elem) {
        this.elem = elem;
      }
  
      const element: React.ReactElement<IAsyncNavProps> = React.createElement(AsyncNav, {
        label: this.properties.label,
        loadOptions: this.properties.loadOptions,
        onChanged: this.onChanged.bind(this),
        selectedKey: this.properties.selectedKey,
        disabled: this.properties.disabled,
        // required to allow the component to be re-rendered by calling this.render() externally
        stateKey: new Date().toString()
      });
      ReactDom.render(element, elem);
    }
  
    private onChanged(option: INavLinkGroup[], index?: number): void 
    {
      if(this.properties.onPropertyChange)
        this.properties.onPropertyChange(this.targetProperty, option);
    }
  }
