export interface IAnniversaryState {
    items: [{
        FullName: string;
        DateOfJoining: string;
        Status: string;
        Email: string;
        Designation: string;
        userLocation: string;
        showbutton: boolean;
        value: string;
        ID: number;
        liked: boolean;
        likeCount: number;
        DateOfBirth: string;
    }];
    currentUserId: number;
    likes: number;
    updated: boolean;
    isLoading: boolean;
}
//# sourceMappingURL=IAnniversaryState.d.ts.map