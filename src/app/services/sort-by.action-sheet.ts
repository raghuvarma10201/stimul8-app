import { Injectable } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';

@Injectable({
    providedIn: 'root',
})
export class SortByService {
    selectedSort: string = '';
    sortObject: any = {};

    constructor(private actionSheetCtrl: ActionSheetController) { }

    async presentSortBySheetTransfers(onSelect: (value: any) => void) {
        const options = [
          {
            text: 'Date -- Newest First',
            key: 'created_desc',
            value: { 'tst.created_on': 'desc' }
          },
          {
            text: 'Date -- Oldest First',
            key: 'created_asc',
            value: { 'tst.created_on': 'asc' }
          }
        ];
      
        const buttons = options.map(option => ({
          text: option.text,
          icon: this.selectedSort === option.key ? 'radio-button-on' : 'radio-button-off',
          role: this.selectedSort === option.key ? 'selected' : undefined,
          handler: () => {
            this.selectedSort = option.key;
            this.sortObject = option.value;
            console.log(this.sortObject);
            onSelect(this.sortObject);
          }
        }));
      
        const actionSheet = await this.actionSheetCtrl.create({
          header: 'Sort By',
          cssClass: 'sort-action-sheet',
          buttons: [
            ...buttons,
            {
              text: 'Cancel',
              role: 'cancel',
              icon: 'close'
            }
          ]
        });
      
        await actionSheet.present();
    }
    async presentSortBySheetRequests(onSelect: (value: any) => void) {
        const options = [
          {
            text: 'Date -- Newest First',
            key: 'created_desc',
            value: { 'request_list.created_on': 'desc' }
          },
          {
            text: 'Date -- Oldest First',
            key: 'created_asc',
            value: { 'request_list.created_on': 'asc' }
          }
        ];
      
        const buttons = options.map(option => ({
          text: option.text,
          icon: this.selectedSort === option.key ? 'radio-button-on' : 'radio-button-off',
          role: this.selectedSort === option.key ? 'selected' : undefined,
          handler: () => {
            this.selectedSort = option.key;
            this.sortObject = option.value;
            onSelect(this.sortObject);
          }
        }));
      
        const actionSheet = await this.actionSheetCtrl.create({
          header: 'Sort By',
          cssClass: 'sort-action-sheet',
          buttons: [
            ...buttons,
            {
              text: 'Cancel',
              role: 'cancel',
              icon: 'close'
            }
          ]
        });
      
        await actionSheet.present();
    } 
    async presentSortBySheetPurchaseOrders(onSelect: (value: any) => void) {
        const options = [
          {
            text: 'Date -- Newest First',
            key: 'created_desc',
            value: { 'ts.created_on': 'desc' }
          },
          {
            text: 'Date -- Oldest First',
            key: 'created_asc',
            value: { 'ts.created_on': 'asc' }
          }
        ];
      
        const buttons = options.map(option => ({
          text: option.text,
          icon: this.selectedSort === option.key ? 'radio-button-on' : 'radio-button-off',
          role: this.selectedSort === option.key ? 'selected' : undefined,
          handler: () => {
            this.selectedSort = option.key;
            this.sortObject = option.value;
            onSelect(this.sortObject);
          }
        }));
      
        const actionSheet = await this.actionSheetCtrl.create({
          header: 'Sort By',
          cssClass: 'sort-action-sheet',
          buttons: [
            ...buttons,
            {
              text: 'Cancel',
              role: 'cancel',
              icon: 'close'
            }
          ]
        });
      
        await actionSheet.present();
    }    
}
