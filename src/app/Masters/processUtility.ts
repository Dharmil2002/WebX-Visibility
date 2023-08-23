export function processProperties(data, mapping) {
    data.forEach(property => {
      const propertyMapping = mapping[property.name];
      if (propertyMapping) {
        this[propertyMapping.variable] = property.name;
        this[propertyMapping.status] = property.additionalData.showNameAndValue;
      }
    });
  }