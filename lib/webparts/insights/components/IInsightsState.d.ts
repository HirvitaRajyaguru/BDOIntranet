export interface IInsightsState {
    isLoading: boolean;
    images: [{
        Image: {
            "Url": string;
            "Description": string;
        };
    }];
    items: [{
        "AnnouncementDate": Date;
        "ExpiryDate": Date;
        "Title": string;
        "Description": string;
        RespectivePageLink: {
            Url: string;
        };
    }];
}
//# sourceMappingURL=IInsightsState.d.ts.map