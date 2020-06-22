export interface IPartnersSpeakState {
  images: [{
    Image: {
      "Url": string,
      "Description": string
    }
  }];

  items: [
    {
      ID: Number;
      Title: string;
      Description: string;
    }
  ];
  ReqID: Number;
  isLoading: boolean;
}
