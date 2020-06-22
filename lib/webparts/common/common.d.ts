export default class Common {
    getDataFromList(Url: any, listName: any, query: any, method: any): Promise<any>;
    getUserLocation(siteUrl: any, userIds: any): Promise<string>;
    SaveErrorInList(Url: any, methodName: any, activityoccur: any): void;
    getCurrentUserLocation(siteUrl: any): Promise<void>;
    getUserIdByEmail(email: string): Promise<any>;
    getDataFromListUsingGuid(Url: any, listId: any, query: any, method: any): Promise<any>;
}
//# sourceMappingURL=common.d.ts.map