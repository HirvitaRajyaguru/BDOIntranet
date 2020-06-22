export interface IBirthdayState {
  isLoading: boolean;
  items: [
    {
      //  mail: string;
      //  Designation: string;
      //  BirthDate: string;
      Display: string;
      Department: string;
      Email: string;
      City: string;
      DOB: string;
      //   DisplayName: string;
      JoiningDate: string;
      //   ServiceLine: string;
      showbutton: boolean;
      value: string;
      liked: boolean;
      likeCount: number;
    }
  ];
  currentUserId: number,
  likes: number
}
