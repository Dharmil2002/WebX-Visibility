export class ClusterMaster {
    clusterCode: string
    clusterName: string;
    pincode: string
    tableNo: any;
    city: string;
    activeFlag: any;
    id:string;
    constructor(ClusterMaster) {
      {
        this.clusterCode = ClusterMaster.clusterCode || '';
        this.clusterName = ClusterMaster.clusterName || '';
        this.pincode = ClusterMaster.pinCode || '';
        this.tableNo = ClusterMaster.tableNo || '';
        this.city = ClusterMaster.city || '';
        this.activeFlag = ClusterMaster.activeFlag || false;
      }
    }
  }