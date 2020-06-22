import * as React from 'react';
import { INewJoineesProps } from './INewJoineesProps';
import { INewJoineeState } from './INewJoineeState';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
export default class NewJoinees extends React.Component<INewJoineesProps, INewJoineeState> {
    constructor(props: INewJoineesProps, state: INewJoineeState);
    componentDidMount(): void;
    GetItemsForNewJoinee(): void;
    ShowHideFunction(e: any): void;
    clearData(e: any): void;
    ChangeDataFunction(e: any): void;
    render(): React.ReactElement<INewJoineesProps>;
    alertme(userEmail: any, event: any, ids: any): Promise<void>;
    private GetLikeFlag;
    SendData(BirthdayPerson: any, msg: any, e: any): void;
}
//# sourceMappingURL=NewJoinees.d.ts.map