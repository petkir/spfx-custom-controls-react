import * as React from 'react';
import {Nav,INavLink, INavLinkGroup } from 'office-ui-fabric-react/lib/Nav';
import { Spinner } from 'office-ui-fabric-react/lib/components/Spinner';
import { IAsyncNavProps } from './IAsyncNavProps';
import { IAsyncNavState } from './IAsyncNavState';

export default class AsyncNav extends React.Component<IAsyncNavProps, IAsyncNavState> {
    private selectedKey: React.ReactText;
    private topNavgroups : INavLinkGroup[];
    constructor(props: IAsyncNavProps, state: IAsyncNavState) {
        super(props);
        this.selectedKey = props.selectedKey;
    
        this.state = {
          loading: false,
          options: undefined,
          error: undefined
        };
      }
    
      public componentDidMount(): void {
        this.loadOptions();
      }
    
      public componentDidUpdate(prevProps: IAsyncNavProps, prevState: IAsyncNavState): void {
        if (this.props.disabled !== prevProps.disabled ||
          this.props.stateKey !== prevProps.stateKey) {
          this.loadOptions();
        }
      }
private findselectedkey(links:INavLink[], selectedKey:string):boolean
{
  debugger;
  links.forEach((l:INavLink):boolean => {
    if (l.key == selectedKey) {
      l.isExpanded = true; l.selected = true; 
      return true;
    }
    else{
      
      if(l.links)
      {
        let lexp:boolean;
        lexp= this.findselectedkey(l.links,selectedKey);
        l.isExpanded =lexp||l.isExpanded;
      }
      return l.isExpanded;
    }
  });
    return false;
}


      private loadOptions(): void {
        this.setState({
          loading: true,
          error: undefined,
          options: undefined
        });
    
        this.props.loadOptions()
          .then((options: INavLinkGroup[]): void => {
            this.topNavgroups=options;
            if(this.selectedKey)
            {
              options.forEach((o: INavLinkGroup): void => {
                this.findselectedkey(o.links,this.selectedKey.toString());
            });
          }  
            this.setState({
              loading: false,
              error: undefined,
              options: options
            }
          
        );
          }, (error: any): void => {
            this.setState((prevState: IAsyncNavState, props: IAsyncNavProps): IAsyncNavState => {
              prevState.loading = false;
              prevState.error = error;
              return prevState;
            });
          });
      }
    
      private _onRenderLink = (link: any): JSX.Element | null => {
        return (
          <span>
            <span key={ 1 } className='Nav-linkText'>{ link.name }</span>
            { link.status !== undefined ?
              <span key={ 2 } className={ 'Nav-linkFlair ' + 'is-state' + link.status } >
              { [link.status] }</span> :
              null }
          </span>
        );
    }  
    private _onLinkClick=(ev?:React.MouseEvent<HTMLElement>, item?: INavLink):void => 
    {
    
      console.log('link clicked');
      if(ev && item  && item.key)
      {
       this.selectedKey= item.key;
       console.log('slected key set: '+ item.key);
       //if(this.onChanged)
       //{
      //  this.onChanged.bind(this);
      // }
      // this.onChanged(item,1);
        this.onChanged(item);
      
       ev.preventDefault();
       ev.stopPropagation();
     }
     }

      public render(): JSX.Element {
        const loading: JSX.Element = this.state.loading ? <div><Spinner label={'Loading options...'} /></div> : <div />;
        const error: JSX.Element = this.state.error !== undefined ? <div className={'ms-TextField-errorMessage ms-u-slideDownIn20'}>Error while loading items: {this.state.error}</div> : <div />;
        
        return (
          <div>
             { !this.state.loading ?  <Nav 
             groups={ this.topNavgroups }
             onLinkClick={this._onLinkClick}
             selectedKey = {this.selectedKey ? this.selectedKey.toString():null}
            // onRenderLink={ this._onRenderLink }
              /> : null }
             {loading}
            {error}
          </div>
        );
      }
    
      private onChanged(option: INavLink, index?: number): void {
        this.selectedKey = option.key;
        // reset previously selected options
        const options: INavLinkGroup[] = this.state.options;
        options.forEach((o: INavLinkGroup): void => {
          o.links.forEach((l:INavLink):void => {
          if (l.key !== option.key) {l.selected = false; }
          if (l.key == option.key) {l.isExpanded = true;  }
        });
        });
        this.setState((prevState: IAsyncNavState, props: IAsyncNavProps): IAsyncNavState => {
          prevState.options = options;
          return prevState;
        });
        if (this.props.onChanged) {
          this.props.onChanged(option, index);
        }
      }
    }