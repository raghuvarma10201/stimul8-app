import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {


  constructor(private alertController: AlertController,private authService: AuthService) {
    
  }
  hasPermission(permission: string): boolean {
    return this.authService.hasPermission(permission);
  }

  ngOnInit() {
    
  }
}
