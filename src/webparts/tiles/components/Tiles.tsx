import * as React from 'react';
import styles from './Tiles.module.scss';
import { ITilesProps } from './ITilesProps';
import { ITilesState, ITilesDataItem } from './ITilesState';
import TilesItem from './TilesItem';
import { escape } from '@microsoft/sp-lodash-subset';
import common from '../../common/common';
export default class Tiles extends React.Component<ITilesProps, ITilesState> {
  constructor(props: ITilesProps, state: ITilesState) {
    super(props);
    //Initialize the State
    this.state = { listData: [] };
  }

  public componentDidMount(): void {
    this.getTiles();
  }
  public componentWillReceiveProps(nextprops): void {
    this.getTiles();
  }
  //get tile's data
  private getTiles(): void {
    var Url = this.props.siteUrl;
    var method = 'get items for Tiles';
    var listId = this.props.listId;
    let newCommonObj: common = new common(); //create object of common methodS
    var query = `?$top=${this.props.numberOfItems}`; //  only top number of items number select from property Pane
    newCommonObj.getDataFromListUsingGuid(Url, listId, query, method).then(async (res) => {
      if (res.data.value != undefined && res.data.value != null) {
        //response not null then setState this Response
        const listItems: ITilesDataItem[] = [];
        for (let i: number = 0; i < res.data.value.length; i++) {
          listItems.push({
            Title: res.data.value[i].Title,
            Description: res.data.value[i].Description,
            ImageUrl: res.data.value[i].BackgroundImageLocation.Url,
            LinkUrl: res.data.value[i].LinkLocation.Url
          });
        }
        this.setState({ listData: listItems });
      }
    }).catch(error => {
      console.log(error);
    });
  }

  public componentDidUpdate(prevProps: ITilesProps, prevState: ITilesState, prevContext: any) {
    if (prevProps.numberOfItems != this.props.numberOfItems
      || prevProps.listId != this.props.listId && (this.props.numberOfItems && this.props.listId)) {
      this.getTiles();
    }
  }

  public render(): React.ReactElement<ITilesProps> {
    return (
      <div className={styles.tiles}>
        <div className={styles.container}>
          {
            this.state.listData.map((item: ITilesDataItem) => {
              return <TilesItem
                title={item.Title}
                description={item.Description}
                imageUrl={item.ImageUrl}
                href={item.LinkUrl} />;
            })
          }

          <div style={{ clear: 'both' }}></div>
        </div>
      </div>
    );
  }
}
