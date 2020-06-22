import * as React from 'react';
import styles from './ImageGallery.module.scss';
import { IImageGalleryProps } from './IImageGalleryProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { Link } from 'office-ui-fabric-react/lib/components/Link';
import { IStyle, Overlay } from 'office-ui-fabric-react';
import common from '../../common/common';
import * as strings from 'ImageGalleryWebPartStrings';
import { Card, CardTitle, CardText, CardImg, CardImgOverlay, CardDeck } from 'reactstrap';
interface IOverlay {
  root: IStyle;
}

const overlayStyles: IOverlay = {
  root: [
    'OverlayExample-content',
    {
      bottom: '0',
      color: 'white',
      left: '0',
      padding: '10px',
      position: 'absolute',
      right: '0',
    },
  ],
};

export interface IImageGalleryState {
  items: [
    {
      "Name": string,
      "Title": string,
      "FileRef": string,
    }];
}

export default class ImageGallery extends React.Component<IImageGalleryProps, IImageGalleryState> {
  public constructor(props: IImageGalleryProps, state: IImageGalleryState) {
    super(props);
    this.state = {
      items: [
        {
          "Name": "",
          "Title": "",
          "FileRef": ""
        }
      ]
    };
  }

  public componentDidMount() {
    this.GetItemsfromLibrary();
  }
  public GetItemsfromLibrary() {
    var method = 'get items from  Media Gallery';
    let newCommonObj: common = new common();
    var query, dataFiltered;
    query = "?$expand = Folder&$select=ID, Title, EncodedAbsUrl, FSObjType, FileRef, FileLeafRef, Folder / ServerRelativeUrl, PublishDate, Status, HomePageDisplay & $orderby=PublishDate desc & $top=5`";

    newCommonObj.getDataFromList(this.props.siteUrl, 'MediaGallery', query, method).then(async (res) => {
      // newCommonObj.getDataFromListUsingGuid(this.props.siteUrl, this.props.listId, query, method).then(async (res) => {
      dataFiltered = res.data.value.filter(
        data => data.FSObjType == 0 && data.Status == 'Approved' && data.HomePageDisplay == 1
      );
      this.setState({ items: dataFiltered });
    })
  }

  public render(): React.ReactElement<IImageGalleryProps> {
    return (
      <div className={styles.imageGallery}>
        <div className={styles.container}>
          <div className="ms-Grid" >
            <div className="ms-Grid-row">
              <div className={`ms-Grid-col ms-md6 ${styles.paddingCol}`}>
                {this.state.items.slice(0, 1).map((item, index) => {
                  return (
                    <Card className={styles.cardWrapper}>
                      <CardImg top width="100%" src={item.FileRef} alt="Card image cap" />

                    </Card>
                  );
                })}
              </div>
              <div className={`ms-Grid-col ms-md3 ${styles.paddingCol}`}>
                <CardDeck>
                  {this.state.items.slice(1, 3).map((item, index) => {
                    return (
                      <Card className={styles.cardWrapper}>
                        <CardImg top width="100%" src={item.FileRef} alt="Card image cap" />

                      </Card>
                    );
                  })}
                </CardDeck>
              </div>
              <div className={`ms-Grid-col ms-md3 ${styles.paddingCol}`}>
                <CardDeck>
                  {this.state.items.slice(3, 5).map((item, index) => {
                    return (
                      <Card className={styles.cardWrapper}>
                        <CardImg top width="100%" src={item.FileRef} alt="Card image cap" />

                      </Card>
                    );
                  })}
                </CardDeck>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
/* <div className={styles.margin}>
            {this.state.items.map(function (item, key) {
              return (<div>
                <Card className={styles.cardWrapper}>
                  <CardImg top width="100%" src={item.FileRef} alt="Card image cap" />
                </Card>
              </div>
              )
            })}
          </div>*/
