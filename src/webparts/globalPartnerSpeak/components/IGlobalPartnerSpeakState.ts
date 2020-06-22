export interface IGlobalPartnerSpeakState {
  images: [{
    Image: {
      "Url": string,
      "Description": string
    }
  }];
    
  items: [
    {

      Title: string;
      Description: string;
      ID: Number;
    }
  ];
  ReqID: Number;
  isLoading: boolean;
}
