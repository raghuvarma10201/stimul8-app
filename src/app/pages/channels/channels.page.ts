import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { CommonService } from 'src/app/services/common.service';
import { ErrorHandlingService } from 'src/app/services/error-handling.service';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-channels',
  templateUrl: './channels.page.html',
  styleUrls: ['./channels.page.scss'],
})
export class ChannelsPage implements OnInit {

  groupedChannels: any[] = [];
  loading = false;
  welcomeMessageList: any[] = [];
constructor( private commonService: CommonService, private cdr: ChangeDetectorRef, private errorHandlingService: ErrorHandlingService, private loader: LoaderService, private router: Router ) { }

  ngOnInit() {
    this.getAllChannels();
  }

  getAllChannels() {
    this.loading = true; // Set loading flag
    this.loader.loadingPresent();
    this.commonService
      .getAllChannelsData()
      .pipe(finalize(() => {
        this.loader.loadingDismiss();
        this.loading = false; // Reset flag after dismissing loader
        this.cdr.detectChanges();
      }))
      .subscribe({
        next: (response: any) => {
         
          if (response.data?.length > 0) {
            this.groupedChannels = response.data
              .map((group: any[], index: number) => {
                if (group.length > 0) {
                  return {
                    name: `Group ${index + 1}`, // You can customize group naming
                    channels: group.sort((a: any, b: any) =>
                      a.name.localeCompare(b.name)
                    ),
                  };
                }
                return null;
              })
              .filter(Boolean); // Remove null entries (i.e., empty groups)
          } else {
            this.groupedChannels = [];
            this.getWelcomeMessageData();
          }
          this.cdr.detectChanges();
        },
        error: (error) => {
          this.errorHandlingService.handleError(
            error,
            'ChannelsPage.getAllChannels'
          );
        },
      });
  }
  getWelcomeMessageData() {
    this.loader.loadingPresent();
    this.commonService
      .getWelcomeMessage()
      .pipe(
        finalize(() => this.loader.loadingDismiss())
      )
      .subscribe({
        next: (response: any) => {
          if (response?.length > 0) {
            this.welcomeMessageList = response;
           
            this.cdr.detectChanges();
          }
        },
        error: (error) => {
          this.errorHandlingService.handleError(
            error,
            'ChannelsPage.getWelcomeMessageData'
          );
        },
      });
  }

  goToChannel(channel: any) {
    console.log('Navigating to channel:', channel);
    // Example: this.router.navigate(['/channel-detail', channel.id]);
  }

  onCreateChannel() {
    console.log('Create Channel button clicked');
    this.router.navigate(['/create/channel']);
    // Example: Navigate to channel creation page
    // this.router.navigate(['/create-channel']);
  }
  

}
