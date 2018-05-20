import * as React from 'react';
import styles from './TestControl.module.scss';
import { ITestControlProps } from './ITestControlProps';
import { escape } from '@microsoft/sp-lodash-subset';

export default class TestControl extends React.Component<ITestControlProps, {}> {
  public render(): React.ReactElement<ITestControlProps> {
    return (
      <div className={ styles.testControl }>
        <div className={ styles.container }>
          <div className={ styles.row }>
            <div className={ styles.column }>
              <span className={ styles.title }>Welcome to SharePoint!</span>
              <p className={ styles.subTitle }>Customize SharePoint experiences using Web Parts.</p>
              <p className={ styles.description }>{escape(this.props.description)}</p>
              <p className={ styles.description }>{escape(this.props.navkey)}</p>
              <p className={ styles.description }>{escape(this.props.ddvalue)}</p>
              <a href="https://aka.ms/spfx" className={ styles.button }>
                <span className={ styles.label }>Learn more</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
