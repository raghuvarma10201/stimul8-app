import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  menuItems = [
    {
      label: 'Channels',
      route: '/channels',
      icon: 'assets/images/icons/channels.gif'
     
    },
    {
      label: 'Templates',
      route: '/templates',
      icon: 'assets/images/icons/templates.gif'
     
    },
    {
      label: 'Runbooks',
      route: '/runbooks',
      icon: 'assets/images/icons/runbook.gif'
     
    },
    {
      label: 'Agents',
      route: '/agents',
      icon: 'assets/images/icons/agents.gif'
      
    },
    {
      label: 'Tools',
      route: '/tools',
      icon: 'assets/images/icons/tools.gif'
    },
    {
      label: 'Vendors',
      route: '/vendors',
      icon: 'assets/images/icons/vendors.gif'
    },
    {
      label: 'My Profile',
      route: '/profile',
      icon: 'assets/images/icons/myprofile.gif'
    }
  ];
  

  constructor(private alertController: AlertController,private authService: AuthService) {
    
  }
  hasPermission(permission: string): boolean {
    return this.authService.hasPermission(permission);
  }

  ngOnInit() {
    
  }
}
