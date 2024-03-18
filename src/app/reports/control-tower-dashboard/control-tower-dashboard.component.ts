import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-control-tower-dashboard',
  templateUrl: './control-tower-dashboard.component.html'
})
export class ControlTowerDashboardComponent implements OnInit { 
  @Input() exr=""
  externalLink: SafeResourceUrl;
  constructor(private route: ActivatedRoute, private sanitizer: DomSanitizer,private router: Router) { 
    this.route.queryParams.subscribe(params => {
      const externalLink = params['externalLink'];
      this.externalLink = this.sanitizer.bypassSecurityTrustResourceUrl(externalLink);
  });
  }

  ngOnInit(): void {
  }

}
