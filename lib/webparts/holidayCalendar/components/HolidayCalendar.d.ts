import * as React from 'react';
import { IHolidayCalendarProps } from './IHolidayCalendarProps';
import { IHolidayCalendarState } from './IHolidayCalendarState';
export default class HolidayCalendar extends React.Component<IHolidayCalendarProps, IHolidayCalendarState> {
    constructor(props: IHolidayCalendarProps);
    componentDidMount(): Promise<void>;
    getCurrentUserLocation(): Promise<void>;
    GetItemsFromHoliday(ADLocation: any): void;
    render(): React.ReactElement<IHolidayCalendarProps>;
}
//# sourceMappingURL=HolidayCalendar.d.ts.map