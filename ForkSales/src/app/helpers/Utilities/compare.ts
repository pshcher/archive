import { UserManagerBase } from "src/app/models/DTOs/OutDTOs";

export class Util {
    static isEqual(obj1: any, obj2: any, keys: any) {
        for (var i in obj2) {
            if (!obj1.hasOwnProperty(i) || obj2[i] !== obj1[i]) {
                return false;
            }
        }
        for (var i in obj1) {
            if (!obj2.hasOwnProperty(i) || obj2[i] !== obj1[i]) {
                return false;
            }
        }
        return true;
    }

    static replaceNullsWithEmptiyStrings(obj: any): any {
        // I replace all fields that are nulls, check if it upsets fields that have no string types ???
        for (var i in obj) {
            if (obj.hasOwnProperty(i) && !obj[i]) {
                obj[i] = '';
            }
        }

        return obj;
    }
}