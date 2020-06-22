import * as React from 'react';
import styles from './Newsletters.module.scss';
import { INewslettersProps } from './INewslettersProps';
import { escape } from '@microsoft/sp-lodash-subset';
import axios from 'axios';

export interface INewsStates {
  items: [{
    "title": string,
    "description": string,
    "url": string
  }]
}

export default class Newsletters extends React.Component<INewslettersProps, INewsStates> {

  public constructor(props: INewslettersProps, state: INewsStates) {
    super(props);
    //Initialize the State
    this.state = {
      items: [{
        "title": null,
        "description": null,
        "url": null
      }]
    };
  }

  public componentDidMount() {
      this.getNewsfromNewsAPI();
  }
    //get data from news api
    public getNewsfromNewsAPI() {    
    axios.get(`https://newsapi.org/v2/top-headlines?sortedBy=publishedAt&country=in&category=business&pageSize=5&apiKey=15fad485feb34f559b338424b93a0f00`)
      .then(res => {
        console.log(res.data.articles);
        this.setState({
          items: res.data.articles // set the URL response in the items state 
        });
      })
      .catch(error => {
        console.log(error); 
      });
  }

  public render(): React.ReactElement<INewslettersProps> {
    return (
      <div className={styles.newsletters}>
      <div className={styles.container}>
        <div className={styles.tableStyle} >
          <h2 className={styles.tableCaptionStyle}>News</h2>
          {
            //map data from the item state
            this.state.items.map(function (item, key) {
            return (<div className={styles.rowStyle} key={key}>
              <div className={styles.titleStyle}>
                <a href={item.url} target="_blank">{item.title}</a>
                <div className={styles.descriptionStyle}>
                  {item.description}
                </div>
              </div>
            </div>
            );
            })
          }
        </div>
      </div>
      </div>
    );
  }
}
