import * as React from 'react';
import { IPollProps } from './IPollProps';
import { IWebPartContext } from '@microsoft/sp-webpart-base';
export interface IPollState {
    loaded: boolean;
    alreadyVote?: boolean;
    existingAnswer?: string;
    question?: string;
    questionInternalName?: string;
    choices?: string[];
    viewResults?: boolean;
    resultsLoaded?: boolean;
    popupOpened?: boolean;
    popupErrorOpened?: boolean;
    selectedValue?: string;
    results?: number[];
    hideDialog: boolean;
}
export default class Poll extends React.Component<IPollProps, IPollState> {
    private myPageContext;
    private guid;
    constructor(props: IPollProps, context: IWebPartContext);
    render(): JSX.Element;
    private getGuid;
    private s4;
    private onVoteChanged;
    private vote;
    private closeError;
    private closeVote;
    private viewResultsBack;
    private viewResults;
    private getColors;
    private getRandomInitialsColor;
    private loadChart;
    private loadQuestions;
    /**
     * @function
     * Function called when the component did mount
     */
    componentDidMount(): void;
    /**
     * @function
     * Function called when the web part properties has changed
     */
    componentWillReceiveProps(nextProps: IPollProps): void;
}
//# sourceMappingURL=Poll.d.ts.map