import * as signalR from "@microsoft/signalr";

import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import Swal from "sweetalert2";

@Injectable({
  providedIn: "root",
})
export class SignalRService {
  public data: any = [];

  constructor() {
    if (this.hubConnection) {
      this.hubConnection.stop();
      this.hubConnection = undefined;
    }
  }

  private hubConnection: signalR.HubConnection;

  public startConnection = (url, token) => {
    //let x = token.accessTokenFactory();
    this.hubConnection = new signalR.HubConnectionBuilder()

      .withUrl(url, token)

      .build();

    this.hubConnection
      .start()
      .then(() => console.log("Connection started"))
      .catch((err) => console.log("Error while starting connection: " + err));
  };

  public addTransferChartDataListener = () => {
    let UserId = localStorage.getItem("UserId");
    this.hubConnection.on(UserId, (data: any) => {
      Swal.fire({
        title: "TripUpload Result",
        text: "Trip Uploaded file processing done successfully click below link to Download!",
        icon: "info",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Download it!",
      }).then((result) => {
        if (result.value) {
          Swal.fire(
            "Download!",
            "Your file has been Download Started.",
            "success"
          );
          let link = document.createElement("a");
          link.href = data.ResultFilePath;
          link.click();
        }
      });
    });
  };
}
