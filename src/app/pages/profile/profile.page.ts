import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  userData: any;
  siteData: any;
  userSites: any;

  constructor(public router: Router) {
    let userInfo: any = localStorage.getItem('userData');
    let siteInfo: any = localStorage.getItem('selectedSite');

    this.userData = JSON.parse(userInfo);
    this.siteData = JSON.parse(siteInfo);
    this.userSites = this.userData.users_sites;
    console.log(this.userSites);
  }

  ngOnInit() {
  }
  logout() {
    const keysToKeep = ['device_token', 'username', 'password', 'rememberMe', 'app_name', 'app_version'];
    const savedValues = keysToKeep.map(key => ({ key, value: localStorage.getItem(key) }));
    localStorage.clear();
    savedValues.forEach(({ key, value }) => {
      if (value !== null) {
        localStorage.setItem(key, value);
      }
    });
    this.router.navigate(['/login']);
  }
}
