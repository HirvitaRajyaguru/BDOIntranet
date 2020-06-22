import axios from 'axios';
import { ItemAddResult, Web, sp } from "sp-pnp-js";

export default class Common {
  //get recors from list using listname and queryparameter
  public getDataFromList(Url, listName, query, method): Promise<any> {
    var url = null;
    if (query == null)
      url = Url + `/_api/web/lists/GetByTitle('` + listName + `')/items`;
    else
      url = Url + `/_api/web/lists/GetByTitle('` + listName + `')/items` + query;
    return axios.get(url)
      .then(res => {
        if (res.data.value != undefined && res.data.value != null) {
          return res;
        }
      }).catch(error => {
        this.SaveErrorInList(Url, method, error);
      });
  }

  //get uer location using thier ID
  public async getUserLocation(siteUrl, userIds) {
    var url = siteUrl + "/_api/web/getuserbyid(" + userIds + ")";

    var location = "";
    await axios.get(url)
      .then(async (res) => {
        var loginName = res.data.LoginName.replace("#", "%23");
        var userUrl = siteUrl + "/_api/SP.UserProfiles.PeopleManager/GetPropertiesFor(accountName=@v)?@v='" + loginName + "'";
        return await axios.get(userUrl)
          .then(res => {
            if (res.data.UserProfileProperties != null && res.data.UserProfileProperties.length > 0) {
              res.data.UserProfileProperties.filter(userProp => {
                if (userProp.Key == "SPS-Location") {
                  location = userProp.Value;
                }
              });
            }
          })
          .catch(error => {
            console.log(error);
          });
      })
      .catch(error => {
        console.log(error);
      });
    return location;
  }

  //save errorin lists
  public SaveErrorInList(Url, methodName, activityoccur) {
    let web = new Web(Url);
    web.lists.getByTitle('ErrorLog').items.add({
      Title: methodName,
      Description: String(JSON.stringify(activityoccur))
    }).then((result: ItemAddResult) => {
      console.log("Error Log saved successfully");

    }).catch(error => {
      console.log("error while adding an Error Log");
    });
  }

  //get current user's location
  public getCurrentUserLocation(siteUrl) {
    var userUrl = siteUrl + "/_api/SP.UserProfiles.PeopleManager/GetPropertiesFor";
    return axios.get(userUrl)
      .then(res => {
        if (res.data.UserProfileProperties != null && res.data.UserProfileProperties.length > 0) {
          res.data.UserProfileProperties.filter(userProp => {
            if (userProp.Key == "SPS-Location") {
              return userProp.Value;
            }
          });
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  //get userId by login user's email
  //# TODO :- change siteUrl
  public getUserIdByEmail(email: string,siteUrl): Promise<any> {
    let web = new Web(siteUrl);
    return web.ensureUser(email).
      then(result => {
        return result.data.Id;
      });
  }

  //get records from list using listId and queryparameters
  //listId get from propertyPane
  public getDataFromListUsingGuid(Url, listId, query, method): Promise<any> {
    var url = null;
    if (query == null)
      url = Url + `/_api/Web/Lists(guid'` + listId + `')/Items`;
    else
      url = Url + `/_api/Web/Lists(guid'` + listId + `')/Items` + query;
    return axios.get(url)
      .then(res => {
        if (res.data.value != undefined && res.data.value != null) {
          return res;
        }
      }).catch(error => {
        console.log(error);
      });
  }

  //get current user's location and ServiceLine
  public getUserLocationAndServiceline(graphClient): Promise<any> {
    let response = []; var locationAndServiceline;
    return graphClient.api('/me')  //get current user's profile
      .get((error: any, userResponse: any, rawResponse?: any) => {
        //# TODO change Department to serviceline and officelocation to City
        graphClient.api('/me/department')  //get current user's department
          .get((error: any, department: any, rawResponse?: any) => {
            response.push({ location: userResponse.officeLocation, serviceline: department.value });
            locationAndServiceline = response;
            return locationAndServiceline;
          });
      });
  }
}
