export class jsonDataServiceService {
exportData(Data) {
    const json = JSON.stringify(Data);
    const blob = new Blob([json], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'EwaybillDocketDetail.json';
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  }
}