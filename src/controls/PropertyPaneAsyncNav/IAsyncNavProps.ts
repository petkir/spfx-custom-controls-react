import {Nav,INavLink, INavLinkGroup } 
 from 'office-ui-fabric-react/lib/Nav';

export interface IAsyncNavProps {
    label: string;
    loadOptions: () => Promise<INavLinkGroup[]>;
    onChanged: (option: INavLink, index?: number) => void;
    selectedKey: string | number;
    disabled: boolean;
    stateKey: string;
    
  }