import { INavLinkGroup } from "office-ui-fabric-react/lib/Nav";


export interface IAsyncNavState {
    loading: boolean;
    options: INavLinkGroup[];
    error: string;
  }