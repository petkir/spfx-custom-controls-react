import { INavLinkGroup } from "office-ui-fabric-react/lib/Nav";

export interface IPropertyPaneAsyncNavProps {
    label: string;
    key:string;
    loadOptions: () => Promise<INavLinkGroup[]>;
    onPropertyChange?: (propertyPath: string, newValue: any) => void;
    selectedKey: string | number;
    disabled?: boolean;

    //onRender?:(ele:HTMLElement)=>void;
  }