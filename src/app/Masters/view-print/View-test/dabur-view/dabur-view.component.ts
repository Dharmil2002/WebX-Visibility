import { Component, OnInit, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-dabur-view',
  templateUrl: './dabur-view.component.html'
})
export class DaburViewComponent implements OnInit {

  constructor(
    private renderer: Renderer2,
  ) { 
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
  }

  ngOnInit(): void {
  }

}
