import * as React from 'react';
import styles from './Surveys.module.scss';
import { ISurveysProps } from './ISurveysProps';
import { escape } from '@microsoft/sp-lodash-subset';

export default class Surveys extends React.Component<ISurveysProps, {}> {
  public render(): React.ReactElement<ISurveysProps> {
    return (
      <div className={ styles.surveys }>
        <div className={ styles.container }>
          <div className={ styles.row }>
            <div className={ styles.column }>
              <span className={ styles.title }>Welcome to SharePoint!</span>
              <p className={ styles.subTitle }>Customize SharePoint experiences using Web Parts.</p>
              <p className={ styles.description }>{escape(this.props.description)}</p>
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
