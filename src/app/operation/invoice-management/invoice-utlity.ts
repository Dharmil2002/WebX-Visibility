
// Define a function to group and summarize data by a specified key
export async function groupAndSummarize(data, groupByKey, summaryKey, additionalFields) {
  return data.reduce((result, item) => {
    const key = item[groupByKey];
    const value = item[summaryKey] || 0;

    if (!result[key]) {
      result[key] = {
        [groupByKey]: key,
        count: 1,
        [summaryKey]: value,
        ...additionalFields, // Include additional fields
      };
    } else {
      result[key].count++;
      result[key][summaryKey] += value;
      
      // Update additional fields if they exist
      for (const field in additionalFields) {
        if (additionalFields.hasOwnProperty(field)) {
          result[key][field] += item[field] || 0;
        }
      }
    }

    return result;
  }, {});
}


