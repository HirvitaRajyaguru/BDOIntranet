import * as React from 'react';
import { IBirthdaysProps } from './IBirthdaysProps';
import { IBirthdayState } from './IBirthdayState';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
export default class Birthdays extends React.Component<IBirthdaysProps, IBirthdayState> {
    constructor(props: IBirthdaysProps, state: IBirthdayState);
    componentDidMount(): Promise<void>;
    componentWillReceiveProps(nextProps: any): void;
    componentWillUnmount(): void;
    private GetDataUsingGraphAPI;
    GetItemsForBirthday(): void;
    private getLikeCountInterval;
    private getLikeCount;
    ShowHideFunction(e: any): void;
    clearData(e: any): void;
    ChangeDataFunction(e: any): void;
    render(): React.ReactElement<IBirthdaysProps>;
    alertme(userEmail: any, event: any): Promise<void>;
    private GetLikeFlag;
    SendData(BirthdayPerson: any, msg: any, e: any): void;
    private likeDisLikeIcon;
}
//# sourceMappingURL=Birthdays.d.ts.map