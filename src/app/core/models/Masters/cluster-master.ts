export class ClusterMaster {
    clusterCode: string
    clusterName: string;
    pincode: any
    tableNo: any;
    city: string;
    clusterType: any;
    activeFlag: any;
    _id:string;
    constructor(ClusterMaster) {
      {
        this.clusterCode = ClusterMaster.clusterCode || '';
        this.clusterName = ClusterMaster.clusterName || '';
        this.pincode = ClusterMaster.pinCode || '';
        this.tableNo = ClusterMaster.tableNo || '';
        this.city = ClusterMaster.city || '';
        this.clusterType = ClusterMaster.clusterType || '';
        this.activeFlag = ClusterMaster.activeFlag || false;
      }
    }
  }