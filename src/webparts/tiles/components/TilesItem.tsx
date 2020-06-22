import * as React from 'react';
import styles from './Tiles.module.scss';
import { Image, IImageProps, ImageFit } from 'office-ui-fabric-react';
import { escape } from '@microsoft/sp-lodash-subset';

export interface ITileItemProps {
  imageUrl: string;
  title: string;
  description: string;
  href: string;
}

export default class Tiles extends React.Component<ITileItemProps, {}> {
  constructor(props: ITileItemProps) {
    super(props);
  }

  public render(): React.ReactElement<ITileItemProps> {
    return (<a href={this.props.href} target="_blank" role="listitem" >
      <div className={styles.pLinkItemWrapper}>
        <Image className={styles.pLinkItemImage} src={this.props.imageUrl} shouldFadeIn={true} imageFit={ImageFit.cover} />

      </div>
    </a>);
  }
}
