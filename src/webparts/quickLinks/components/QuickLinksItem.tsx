import * as React from 'react';
import styles from './QuickLinks.module.scss';
import { Image, IImageProps, ImageFit } from 'office-ui-fabric-react';
import { escape } from '@microsoft/sp-lodash-subset';

export interface IlistItemProps {
  imageUrl: string;
  title: string;
  description: string;
  href: string;
}
export interface ITileItemState {
  hovering: boolean;
}
export default class QuickLinks extends React.Component<IlistItemProps, ITileItemState> {
  constructor(props: IlistItemProps) {
    super(props);
    this.state = {
      hovering: false
    };
  }


  public render(): React.ReactElement<IlistItemProps> {
    return (<a href={this.props.href} target="_blank" role="listitem">
      <div >
        <Image src={this.props.imageUrl} shouldFadeIn={true} imageFit={ImageFit.cover} />
      </div>
    </a>);
  }
}
