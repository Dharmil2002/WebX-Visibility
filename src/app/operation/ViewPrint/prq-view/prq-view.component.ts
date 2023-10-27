import { Component, OnInit, Renderer2 } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-prq-view",
  templateUrl: "./prq-view.component.html",
})
export class PrqViewComponent implements OnInit {
  constructor(private renderer: Renderer2 ,private router: ActivatedRoute) {
    this.renderer.setStyle(
      document.querySelector("nav.navbar"),
      "display",
      "none"
    ); // Hide Navbar
    this.renderer.setStyle(
      document.querySelector("#leftsidebar"),
      "display",
      "none"
    ); //Hide Sidebars

    this.router.queryParams.subscribe((params) => {
      const PRQno = params["PRQno"];
    });
  }

  ngOnInit(): void {}
}
