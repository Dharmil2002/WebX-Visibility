import { firstValueFrom } from "rxjs";
import * as StorageService from '../core/service/storage.service';
import { StoreKeys } from "../config/myconstants";
export class locationEntitySearch {

  GetGenericMappedAria(RequestData, search, fieldsToSearch) {
    const uniqueValues = new Set();

    const Result = RequestData.reduce((acc, element) => {
      fieldsToSearch.forEach(fieldToSearch => {
        const fieldValue = element[fieldToSearch].toString().toLowerCase();
        if (fieldValue.startsWith(search.toLowerCase()) && !uniqueValues.has(fieldValue)) {
          uniqueValues.add(fieldValue);
          acc.push({ name: element[fieldToSearch].toString(), value: fieldToSearch, });
        }
      });

      // Handle the 'PIN' field separately, as a number
      if (fieldsToSearch.includes('PIN')) {
        const pinValue = element.PIN.toString();
        if (pinValue.startsWith(search) && !uniqueValues.has(pinValue)) {
          uniqueValues.add(pinValue);
          Result.push({ name: pinValue, value: 'PIN' });
        }
      }

      return acc;
    }, []);

    return Result;
  }

  async GetMergedData(PinCodeList, StateList, mergeField, masterService = null, ArialWise = false) {
    const stateListLookup = this.createStateListLookup(StateList, mergeField);
    let mergedArray = this.mergeArrays(PinCodeList.data, stateListLookup, mergeField);

    if (ArialWise) {
      const ariaList = await this.getAriaList(masterService);
      mergedArray = [...mergedArray, ...ariaList];
    }

    return mergedArray;
  }

  createStateListLookup(StateList, mergeField) {
    return StateList.data.reduce((lookup, item) => {
      lookup[item[mergeField]] = item;
      return lookup;
    }, {});
  }

  mergeArrays(pinCodeList, stateListLookup, mergeField) {
    return pinCodeList.map(pinCodeItem => {
      const stateItem = stateListLookup[pinCodeItem[mergeField]];
      return stateItem ? { ...pinCodeItem, ...stateItem, AR: '' } : pinCodeItem;
    });
  }

  async getAriaList(masterService) {
    const AriaRequestBody = {
      companyCode: StorageService.getItem(StoreKeys.CompanyCode),
      filter: {

        cLSTYP: "CLSTYP-0001",
        companyCode: StorageService.getItem(StoreKeys.CompanyCode),
        activeFlag: true,
      },
      collectionName: "cluster_detail",
    };

    const clusterdetail: any = await firstValueFrom(masterService.masterPost("generic/get", AriaRequestBody));
    const ariaList = clusterdetail.data.map(cluster => ({
      "AR": `${cluster.clusterName}`,
      "_id": "",
      "PIN": 0,
      "ST": "",
      "CT": "",
      "STSN": "",
      "STNM": "",
      "CNTR": "",
      "ZN": "",
      "ISUT": false,
    }));

    return ariaList;
  }



}