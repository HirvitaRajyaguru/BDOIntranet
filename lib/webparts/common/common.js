var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import axios from 'axios';
import { Web, sp } from "sp-pnp-js";
var Common = /** @class */ (function () {
    function Common() {
    }
    //get recors from list using listname and queryparameter
    Common.prototype.getDataFromList = function (Url, listName, query, method) {
        var _this = this;
        var url = null;
        if (query == null)
            url = Url + "/_api/web/lists/GetByTitle('" + listName + "')/items";
        else
            url = Url + "/_api/web/lists/GetByTitle('" + listName + "')/items" + query;
        return axios.get(url)
            .then(function (res) {
            if (res.data.value != undefined && res.data.value != null) {
                return res;
            }
        }).catch(function (error) {
            _this.SaveErrorInList(Url, method, error);
        });
    };
    //get uer location using thier ID
    Common.prototype.getUserLocation = function (siteUrl, userIds) {
        return __awaiter(this, void 0, void 0, function () {
            var url, location;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = siteUrl + "/_api/web/getuserbyid(" + userIds + ")";
                        location = "";
                        return [4 /*yield*/, axios.get(url)
                                .then(function (res) { return __awaiter(_this, void 0, void 0, function () {
                                var loginName, userUrl;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            loginName = res.data.LoginName.replace("#", "%23");
                                            userUrl = siteUrl + "/_api/SP.UserProfiles.PeopleManager/GetPropertiesFor(accountName=@v)?@v='" + loginName + "'";
                                            return [4 /*yield*/, axios.get(userUrl)
                                                    .then(function (res) {
                                                    if (res.data.UserProfileProperties != null && res.data.UserProfileProperties.length > 0) {
                                                        res.data.UserProfileProperties.filter(function (userProp) {
                                                            if (userProp.Key == "SPS-Location") {
                                                                location = userProp.Value;
                                                            }
                                                        });
                                                    }
                                                })
                                                    .catch(function (error) {
                                                    console.log(error);
                                                })];
                                        case 1: return [2 /*return*/, _a.sent()];
                                    }
                                });
                            }); })
                                .catch(function (error) {
                                console.log(error);
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, location];
                }
            });
        });
    };
    //save errorin lists
    Common.prototype.SaveErrorInList = function (Url, methodName, activityoccur) {
        var web = new Web(Url);
        web.lists.getByTitle('ErrorLog').items.add({
            Title: methodName,
            Description: String(JSON.stringify(activityoccur))
        }).then(function (result) {
            console.log("Error Log saved successfully");
        }).catch(function (error) {
            console.log("error while adding an Error Log");
        });
    };
    //get current user's location
    Common.prototype.getCurrentUserLocation = function (siteUrl) {
        var userUrl = siteUrl + "/_api/SP.UserProfiles.PeopleManager/GetPropertiesFor";
        return axios.get(userUrl)
            .then(function (res) {
            if (res.data.UserProfileProperties != null && res.data.UserProfileProperties.length > 0) {
                res.data.UserProfileProperties.filter(function (userProp) {
                    if (userProp.Key == "SPS-Location") {
                        return userProp.Value;
                    }
                });
            }
        })
            .catch(function (error) {
            console.log(error);
        });
    };
    //get userId by login user's email
    Common.prototype.getUserIdByEmail = function (email) {
        return sp.web.ensureUser(email).
            then(function (result) {
            return result.data.Id;
        });
    };
    //get records from list using listId and queryparameters
    //listId get from propertyPane
    Common.prototype.getDataFromListUsingGuid = function (Url, listId, query, method) {
        var url = null;
        if (query == null)
            url = Url + "/_api/Web/Lists(guid'" + listId + "')/Items";
        else
            url = Url + "/_api/Web/Lists(guid'" + listId + "')/Items" + query;
        return axios.get(url)
            .then(function (res) {
            if (res.data.value != undefined && res.data.value != null) {
                return res;
            }
        }).catch(function (error) {
            console.log(error);
        });
    };
    return Common;
}());
export default Common;
//# sourceMappingURL=common.js.map