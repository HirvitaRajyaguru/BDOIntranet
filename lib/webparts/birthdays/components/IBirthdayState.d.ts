export interface IBirthdayState {
    isLoading: boolean;
    items: [{
        FullName: string;
        DateOfBirth: string;
        Status: string;
        Email: string;
        Designation: string;
        userLocation: string;
        showbutton: boolean;
        value: string;
        ID: number;
        liked: boolean;
        likeCount: number;
        DateOfJoining: string;
    }];
    currentUserId: number;
    likes: number;
    sliced: boolean;
    records: string;
}
//# sourceMappingURL=IBirthdayState.d.ts.map