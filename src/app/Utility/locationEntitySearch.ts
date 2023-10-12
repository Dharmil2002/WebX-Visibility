export class locationEntitySearch {
  GetGenericMappedAria(RequestData, search, fieldsToSearch) {
    const uniqueValues = new Set();

    const Result = RequestData.reduce((acc, element) => {
      fieldsToSearch.forEach(fieldToSearch => {
        const fieldValue = element[fieldToSearch].toString().toLowerCase();
        if (fieldValue.startsWith(search.toLowerCase()) && !uniqueValues.has(fieldValue)) {
          uniqueValues.add(fieldValue);
          acc.push({ name: element[fieldToSearch].toString(), value: fieldToSearch });
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

  GetMergedData(PinCodeList, StateList, mergeField) {
    // Create a lookup object for faster access to StateList data
    const stateListLookup = StateList.data.reduce((lookup, item) => {
      lookup[item[mergeField]] = item;
      return lookup;
    }, {});

    // Merge the two JSON arrays based on the specified mergeField
    const mergedArray = PinCodeList.data.map(pinCodeItem => {
      const stateItem = stateListLookup[pinCodeItem[mergeField]];
      return stateItem ? { ...pinCodeItem, ...stateItem } : pinCodeItem;
    });

    return mergedArray;
  }

}