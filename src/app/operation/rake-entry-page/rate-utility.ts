export function renameKeys(originalObject, keyNameMapping) {
    const modifiedObject = {};

    for (const oldKey in originalObject) {
        if (originalObject.hasOwnProperty(oldKey)) {
            const newKey = keyNameMapping[oldKey] || oldKey;
            modifiedObject[newKey] = originalObject[oldKey];
        }
    }

    return modifiedObject;
}