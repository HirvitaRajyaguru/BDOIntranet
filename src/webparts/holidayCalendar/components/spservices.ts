import { WebPartContext } from "@microsoft/sp-webpart-base";
import { sp, Web, PermissionKind } from '@pnp/sp';
import { RegionalSettings } from "@pnp/sp/regional-settings";
import { IData } from './IData';
import * as moment from 'moment';
import { SiteUser } from "@pnp/sp/src/siteusers";
import axios from 'axios';

export default class Spservices {
  //constructor(private context: WebPartContext) {
  //  // Setuo Context to PnPjs and MSGraph
  //  sp.setup({
  //    spfxContext: this.context
  //  });
  //}

  public async getSiteTimeZoneHours(siteUrl: string): Promise<number> {
    let numberHours: number = 0;
    let siteTimeZoneBias: number;
    let siteTimeZoneDaylightBias: number;
    let currentDateTimeOffSet: number = new Date().getTimezoneOffset() / 60;

    try {
      const siteRegionalSettings: any = await this.getSiteRegionalSettingsTimeZone(siteUrl);
      // Calculate  hour to current site
      siteTimeZoneBias = siteRegionalSettings.Information.Bias;
      siteTimeZoneDaylightBias = siteRegionalSettings.Information.DaylightBias;

      // Formula to calculate the number of  hours need to get UTC Date.
      // numberHours = (siteTimeZoneBias / 60) + (siteTimeZoneDaylightBias / 60) - currentDateTimeOffSet;
      if (siteTimeZoneBias >= 0) {
        numberHours = ((siteTimeZoneBias / 60) - currentDateTimeOffSet) + siteTimeZoneDaylightBias / 60;
      } else {
        numberHours = ((siteTimeZoneBias / 60) - currentDateTimeOffSet);
      }
    }
    catch (error) {
      return Promise.reject(error);
    }
    return numberHours;
  }

  public async getChoiceFieldOptions(siteUrl: string, listId: string, fieldInternalName: string): Promise<{ key: string, text: string }[]> {
    let fieldOptions: { key: string, text: string }[] = [];
    try {
      const web = new Web(siteUrl);
      const results = await web.lists.getById(listId)
        .fields
        .getByInternalNameOrTitle(fieldInternalName)
        .select("Title", "InternalName", "Choices")
        .get();
      if (results && results.Choices.length > 0) {
        for (const option of results.Choices) {
          fieldOptions.push({
            key: option,
            text: option
          });
        }
      }
    } catch (error) {
      return Promise.reject(error);
    }
    return fieldOptions;
  }

  public async colorGenerate() {

    var hexValues = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e"];
    var newColor = "#";

    for (var i = 0; i < 6; i++) {
      var x = Math.round(Math.random() * 14);

      var y = hexValues[x];
      newColor += y;
    }
    return newColor;
  }

  public async getEvents(siteUrl: string, holidaylistId: string, eventlistId: string, eventStartDate: Date, eventEndDate: Date, location): Promise<IData[]> {

    let events: IData[] = [];
    if (!siteUrl) {
      return [];
    }
    try {
      // Get Regional Settings TimeZone Hours to UTC
      const siteTimeZoneHours: number = await this.getSiteTimeZoneHours(siteUrl);
      // Get Category Field Choices
      const categoryDropdownOption = ["Holiday", "Event"];//await this.getChoiceFieldOptions(siteUrl, holidaylistId, 'Category');
      let categoryColor: { category: string, color: string }[] = [];
      for (const cat of categoryDropdownOption) {
        categoryColor.push({ category: cat, color: await this.colorGenerate() });
      }

      const web = new Web(siteUrl);
      const holidayresults = await web.lists.getById(holidaylistId).usingCaching().renderListDataAsStream(
        {
          ViewXml: `<View><ViewFields><FieldRef Name='RecurrenceData'/><FieldRef Name='Duration'/><FieldRef Name='Author'/><FieldRef Name='Category'/><FieldRef Name='Description'/><FieldRef Name='ParticipantsPicker'/><FieldRef Name='Geolocation'/><FieldRef Name='ID'/><FieldRef Name='EndDate'/><FieldRef Name='EventDate'/><FieldRef Name='ID'/><FieldRef Name='Location'/><FieldRef Name='Title'/><FieldRef Name='fAllDayEvent'/><FieldRef Name='EventType'/><FieldRef Name='UID' /><FieldRef Name='fRecurrence' /></ViewFields>
          <Query>
          <Where>
            <And>
              <Eq>
                 <FieldRef Name='LocationCity' />
                 <Value Type='TaxonomyFieldType'>${location}</Value>
             </Eq>
              <And>
                <Eq>
                   <FieldRef Name='ApprovalStatus' />
                   <Value Type='Choice'>Approved</Value>
               </Eq>
                <And>
                  <Geq>
                    <FieldRef Name='EventDate' />
                    <Value IncludeTimeValue='false' Type='DateTime'>${moment(eventStartDate).format('YYYY-MM-DD')}</Value>
                  </Geq>
                  <Leq>
                    <FieldRef Name='EventDate' />
                    <Value IncludeTimeValue='false' Type='DateTime'>${moment(eventEndDate).format('YYYY-MM-DD')}</Value>
                  </Leq>
                </And>
               </And>
            </And>
          </Where>
          </Query>
          <RowLimit Paged=\"FALSE\">2000</RowLimit>
          </View>`
        }
      );
      const eventresults = await web.lists.getById(eventlistId).usingCaching().renderListDataAsStream(
        {
          ViewXml: `<View><ViewFields><FieldRef Name='RecurrenceData'/><FieldRef Name='Duration'/><FieldRef Name='Author'/><FieldRef Name='Category'/><FieldRef Name='Description'/><FieldRef Name='ParticipantsPicker'/><FieldRef Name='Geolocation'/><FieldRef Name='ID'/><FieldRef Name='EndDate'/><FieldRef Name='EventDate'/><FieldRef Name='ID'/><FieldRef Name='Location'/><FieldRef Name='Title'/><FieldRef Name='fAllDayEvent'/><FieldRef Name='EventType'/><FieldRef Name='UID' /><FieldRef Name='fRecurrence' /></ViewFields>
          <Query>
          <Where>
              <And>
                <Eq>
                   <FieldRef Name='ApprovalStatus' />
                   <Value Type='Choice'>Approved</Value>
               </Eq>
                <And>
                  <Geq>
                    <FieldRef Name='EventDate' />
                    <Value IncludeTimeValue='false' Type='DateTime'>${moment(eventStartDate).format('YYYY-MM-DD')}</Value>
                  </Geq>
                  <Leq>
                    <FieldRef Name='EventDate' />
                    <Value IncludeTimeValue='false' Type='DateTime'>${moment(eventEndDate).format('YYYY-MM-DD')}</Value>
                  </Leq>
                </And>
              </And>
          </Where>
          </Query>
          <RowLimit Paged=\"FALSE\">2000</RowLimit>
          </View>`
        }
      );
      if ((holidayresults && holidayresults.Row.length > 0) || (eventresults && eventresults.Row.length > 0)) {
        let event: any = '';
        let allEventHoliday = [];
        if (holidayresults.Row.length > 0) {
          holidayresults.Row.forEach(async (holiday) => {
            allEventHoliday.push({
              Type: "Holiday"
              , Author: [{ id: holiday.Author[0].id, title: holiday.Author[0].title, email: holiday.Author[0].email, sip: holiday.Author[0].sip, picture: holiday.Author[0].picture }]
              , Category: holiday.Category
              , ContentType: holiday.ContentType
              , Description: holiday.Description
              , Duration: holiday.Duration
              , EndDate: holiday.EndDate
              , EventCanceled: holiday.EventCanceled
              , EventDate: holiday.EventDate
              , EventType: holiday.EventType
              , FSObjType: holiday.FSObjType
              , FolderChildCount: holiday.FolderChildCount
              , Geolocation: holiday.Geolocation
              , ID: holiday.ID
              , ItemChildCount: holiday.ItemChildCount
              , Location: holiday.Location
              , MasterSeriesItemID: holiday.MasterSeriesItemID
              , ParticipantsPicker: holiday.ParticipantsPicker
              , PermMask: holiday.PermMask
              , RecurrenceData: holiday.RecurrenceData
              , RecurrenceID: holiday.RecurrenceID
              , TimeZone: holiday.TimeZone
              , Title: decodeURIComponent(holiday.Title)
              , UID: holiday.UID
              , Workspace: holiday.Workspace
              , WorkspaceLink: holiday.WorkspaceLink
              , XMLTZone: holiday.XMLTZone
              , fAllDayEvent: holiday.fAllDayEvent
              , fRecurrence: holiday.fRecurrence
              , listName: holidaylistId
            });
          });
        }
        if (eventresults.Row.length > 0) {
          eventresults.Row.forEach(async (event) => {
            allEventHoliday.push({
              Type: "Event"
              , Author: [{ id: event.Author[0].id, title: event.Author[0].title, email: event.Author[0].email, sip: event.Author[0].sip, picture: event.Author[0].picture }]
              , Category: event.Category
              , ContentType: event.ContentType
              , Description: event.Description
              , Duration: event.Duration
              , EndDate: event.EndDate
              , EventCanceled: event.EventCanceled
              , EventDate: event.EventDate
              , EventType: event.EventType
              , FSObjType: event.FSObjType
              , FolderChildCount: event.FolderChildCount
              , Geolocation: event.Geolocation
              , ID: event.ID
              , ItemChildCount: event.ItemChildCount
              , Location: event.Location
              , MasterSeriesItemID: event.MasterSeriesItemID
              , ParticipantsPicker: event.ParticipantsPicker
              , PermMask: event.PermMask
              , RecurrenceData: event.RecurrenceData
              , RecurrenceID: event.RecurrenceID
              , TimeZone: event.TimeZone
              , Title: encodeURIComponent(event.Title.replace(/&amp;/g, "&"))
              , UID: event.UID
              , Workspace: event.Workspace
              , WorkspaceLink: event.WorkspaceLink
              , XMLTZone: event.XMLTZone
              , fAllDayEvent: event.fAllDayEvent
              , fRecurrence: event.fRecurrence
              , listName: eventlistId
            });
          });
        }
        for (event of allEventHoliday) {
          const initialsArray: string[] = event.Author[0].title.split(' ');
          const initials: string = initialsArray[0].charAt(0) + initialsArray[initialsArray.length - 1].charAt(0);
          //const userPictureUrl = await this.getUserProfilePictureUrl(`i:0#.f|membership|${event.Author[0].email}`);
          const eventdate = await this.GetFormattedDate(event.EventDate);
          const enddate = await this.GetFormattedDate(event.EndDate);
          const attendees: number[] = [];
          const first: number = event.Geolocation.indexOf('(') + 1;
          const last: number = event.Geolocation.indexOf(')');
          const geo = event.Geolocation.substring(first, last);
          const geolocation = geo.split(' ');
          const CategoryColorValue: any[] = categoryColor.filter((value) => {
            return value.category == event.Type;
          });
          for (const attendee of event.ParticipantsPicker) {
            attendees.push(parseInt(attendee.id));
          }
          events.push({
            Id: event.ID,
            ID: event.ID,
            EventType: event.EventType,
            title: decodeURIComponent(event.Title),
            Description: event.Description,
            EventDate: new Date(eventdate),
            EndDate: new Date(enddate),//new Date(moment(event.EndDate).subtract(siteTimeZoneHours, 'hour').toISOString()),
            location: event.Location,
            ownerEmail: event.Author[0].email,
            ownerPhoto: `${siteUrl}/_layouts/15/userphoto.aspx?accountname=${event.Author[0].email}`,
            ownerInitial: initials,
            color: CategoryColorValue.length > 0 ? CategoryColorValue[0].color : '#1a75ff', // blue default
            ownerName: event.Author[0].title,
            attendes: attendees,
            fAllDayEvent: false,
            geolocation: { Longitude: parseFloat(geolocation[0]), Latitude: parseFloat(geolocation[1]) },
            Category: event.Category,
            Duration: event.Duration,
            RecurrenceData: event.RecurrenceData ? event.RecurrenceData : "",
            fRecurrence: event.fRecurrence,
            RecurrenceID: event.RecurrenceID ? moment(event.RecurrenceID).subtract(siteTimeZoneHours, 'hour').toISOString() : undefined,
            MasterSeriesItemID: event.MasterSeriesItemID,
            UID: event.UID.replace("{", "").replace("}", ""),
            listName: event.listName
          });
        }
      }
      // Return Data
      return events;
    } catch (error) {
      console.dir(error);
      return Promise.reject(error);
    }
  }

  public async getUserProfilePictureUrl(loginName: string) {
    let results: any = null;
    try {
      results = await sp.profiles.usingCaching().getPropertiesFor(loginName);
    } catch (error) {
      results = null;
    }
    return results.PictureUrl;
  }

  public async getSiteRegionalSettingsTimeZone(siteUrl: string) {
    let regionalSettings;
    try {
      const web = new Web(siteUrl);
      regionalSettings = await web.regionalSettings.timeZone.usingCaching().get();

    } catch (error) {
      return Promise.reject(error);
    }
    return regionalSettings;
  }

  public async GetFormattedDate(date) {
    return date.substring(3, 5) + "-" + date.substring(0, 2) + "-" + date.substring(6, 10) + " " + date.substring(11, 16);
  }

  private async getListName(siteUrl: string, listId: string) {
    var restUrl = siteUrl + "/_api/Web/Lists(guid'" + listId + "')?$select=Title";
    var listName;
    await axios.get(restUrl)
      .then(res => {
        listName = res.data.Title;

      }).catch(error => {
        console.log(error);
        listName = "Event";
      });
    return listName;
  }
}
