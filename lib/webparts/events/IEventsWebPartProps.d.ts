import { IDateTimeFieldValue } from '@pnp/spfx-property-controls/lib/PropertyFieldDateTimePicker';
export interface IEventsWebPartProps {
    listId: string;
    eventStartDate: IDateTimeFieldValue;
    eventEndDate: IDateTimeFieldValue;
    Practices: boolean;
    Homepage: boolean;
}
export interface ISPList {
    Title: string;
    Id: string;
}
export interface ISPLists {
    value: ISPList[];
}
//# sourceMappingURL=IEventsWebPartProps.d.ts.map