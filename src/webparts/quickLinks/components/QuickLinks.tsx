import * as React from 'react';
import styles from './QuickLinks.module.scss';
import { IQuickLinksProps } from './IQuickLinksProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { IQuickLinksState, IlinkDataItem } from './IQuickLinksState';
import { SPHttpClient } from '@microsoft/sp-http';
import { Image, IImageProps, ImageFit } from 'office-ui-fabric-react';
import common from '../../common/common';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

export default class QuickLinks extends React.Component<IQuickLinksProps, IQuickLinksState> {
  constructor(props: IQuickLinksProps, state: IQuickLinksState) {
    super(props);
    //Initialize the State
    this.state = {
      listData: []
     
    };
  }
  public componentDidMount(): void {
    this.getQuickLinks();
  }
  public componentWillReceiveProps(nextprops): void {
    this.getQuickLinks();
  }
  //get quickLink's Link
  private getQuickLinks(): void {
    var Url = this.props.siteUrl;
    var method = 'get items for Tiles';
    var listId = this.props.listId;
    let newCommonObj: common = new common(); //create object of common methodS
    var query = `?$top=5`; //  only top 5 number of items
    newCommonObj.getDataFromListUsingGuid(Url, listId, query, method).then(async (res) => {
      if (res.data.value != undefined && res.data.value != null) {
        //response not null then setState this Response
        const listItems: IlinkDataItem[] = [];
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

  public render(): React.ReactElement<IQuickLinksProps> {
    //property of Slider
    var settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 4,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 4000,
      nextArrow: <SampleNextArrow />,
      prevArrow: <SamplePrevArrow />
    };
    return (
      <div className={styles.quickLinks}>
        <div className={styles.container}>
          <Slider {...settings}>
            {this.state.listData.map((item: IlinkDataItem) => {
              return (<a href={item.LinkUrl} target="_blank" role="listitem">
                <div className={styles.pLinkItemWrapper}>
                  <Image src={item.ImageUrl} shouldFadeIn={true} imageFit={ImageFit.cover} className={styles.pLinkItemImage} />
                </div>
              </a>);
            })
            }
          </Slider>
        </div>
      </div>
    );
  }
}


function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block",background: "black"}}
      onClick={onClick}
    />
  );
}

function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", background: "black" }}
      onClick={onClick}
    />
  );
}

