import * as React from 'react';
import { IAnniversaryProps } from './IAnniversariesProps';
import { IAnniversaryState } from './IAnniversaryState';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
export default class Anniversaries extends React.Component<IAnniversaryProps, IAnniversaryState> {
    constructor(props: IAnniversaryProps, state: IAnniversaryState);
    componentDidMount(): Promise<void>;
    componentWillReceiveProps(nextProps: any): void;
    componentWillUnmount(): void;
    private GetDataUsingGraphAPI;
    GetItemsForAnniversary(): void;
    private getLikeCountInterval;
    private getLikeCount;
    ShowHideFunction(e: any): void;
    clearData(e: any): void;
    ChangeDataFunction(e: any): void;
    render(): React.ReactElement<IAnniversaryProps>;
    alertme(userEmail: any, event: any): Promise<void>;
    private GetLikeFlag;
    SendData(AnniversaryPerson: any, msg: any, e: any): void;
    private likeDisLikeIcon;
}
//# sourceMappingURL=Anniversaries.d.ts.map