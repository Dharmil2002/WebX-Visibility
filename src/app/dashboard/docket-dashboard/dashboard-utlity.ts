export async  function searchbilling(masterService) {
    const res =  await masterService.getJsonFileDetails("search").toPromise();
    return res.data
}


// Function to search posts with specific tags
export async function searchMetaData(data, keyWord) {
    return data.filter(Detail => {
        return keyWord.every(key => Detail.tag.includes(key));
    });
}
