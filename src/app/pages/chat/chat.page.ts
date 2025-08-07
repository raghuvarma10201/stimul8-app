import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ActionSheetController, InfiniteScrollCustomEvent, NavController } from '@ionic/angular';
import { finalize, Subject, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { LoaderService } from 'src/app/services/loader.service';
import { SharedService } from 'src/app/services/shared.service';
import { ToastService } from 'src/app/services/toast.service';
import { environment } from 'src/environments/environment';
import { ApiError, Channel, ChannelHistoryResponse, ChannelResponse, ChatMessage, TextMessage, UploadedFile } from './chat.interface';
import demodata from '../../../assets/data/testdemo.json'
import { NotificationMessages } from 'src/app/shared/notification.enum';
import { HttpClient } from '@angular/common/http';
import { ErrorHandlingService } from 'src/app/services/error-handling.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  @ViewChild('chatContainer') private chatContainer!: ElementRef;
  @ViewChild('channelTitleSection') channelTitleSection!: ElementRef;
  @ViewChild('chatType') chatType!: ElementRef;
  @ViewChild('fileInput') fileInput!: ElementRef;

  chatForm: FormGroup | undefined;
  channelForm: FormGroup = new FormGroup({});
  staticChatData = demodata;

  messages = [
    {
      own: false,
      author: 'JD',
      avatar: 'assets/user1.png',
      content: 'Failed to get response from documentation service: HTTPConnectionPool(...)',
      time: '8:23 PM',
      error: '',
    },
    {
      own: true,
      author: 'JD',
      avatar: 'assets/user2.png',
      content: 'show bar chart',
      time: '8:23 PM',
      error: '',
    },
    // More messages...
  ];
  newMessage = '';

  chatMessages: ChatMessage[] = [
    {
      type: '',
      text: '' as string | TextMessage,
      sender: 'bot',
      timestamp: new Date(),
      files: [],
      feedback: {
        reason: '',
        comment: '',
        is_good: false,
        is_bad: false,
      },
    },
  ];

  errorMsg: string = '';
  pageName: string = 'channels';
  // modalReference: NgbModalRef | null = null;
  modalSelectedData: Channel = {} as Channel;
  dataIsExist: boolean = false;
  selectedData: Channel = {} as Channel;
  isUserScrolling: boolean = false;
  messageValid: boolean = false;
  isAtBottom: boolean = true;
  showChart: boolean = false;
  channels: Channel[] = [];
  groupedChannels: Channel[][] = [];
  isTabSection: boolean = true;
  isEditMode: boolean = false;
  isCopy: boolean = false;
  cannedMessages: string[] = [];
  channelSearchQuery: string = '';
  actionType: string = '';
  originalFormValues: Channel = {} as Channel;

  // ============================================
  // UI State and Flags
  // ============================================
  chatMessagesHeight: number = 360;
  currentMessage: ChatMessage = {
    type: '',
    text: '' as string | TextMessage,
    sender: 'bot',
    timestamp: new Date(),
    files: [],
    feedback: {
      reason: '',
      comment: '',
      is_good: false,
      is_bad: false,
    },
  };
  isButtonDisabled = false;
  channelId: string = '';
  isDefaultContext: boolean = false;
  welcomeMessageList: string[] = [];
  isLoading: boolean = true;
  isCopied: boolean = false;
  isSubmitted: boolean = false;
  disableAutoScroll: boolean = false;
  responseText = '';
  displayedResponse: string = '';
  typingInterval: number = 0;

  // ============================================
  // File Upload Related
  // ============================================
  uploadedFiles: UploadedFile[] = [];
  fileTypeLabel: string = '';

  // ============================================
  // Dropdown Options
  // ============================================
  usedForOptions: { value: string; name: string }[] = [
    { value: 'vendor', name: 'IAM Solution' },
    { value: 'iam-process', name: 'IAM Process' },
    { value: 'iam-initiative', name: 'IAM Initiative' },
  ];
  availableSelectedNameOptions: { value: string; name: string }[] = [];
  selectedNameOptions: { [key: string]: string[] } = {};
  selectedChannel: Channel = {} as Channel;
  isChannelAction: boolean = false;

  entityName: string = 'Channel';
  duplicateEntityName: string = '';
  showIcons: boolean = false;
  isResponseAction: boolean = false;
  isResendAction: boolean = false;
  copiedMessageId: number = -1;
  goodResponseIndex: number = -1;
  badResponseIndex: number = -1;
  showToast: boolean = false;
  showErrorToast: boolean = false;
  errorToastMessage: string = '';
  inlineToastMessage: string = '';
  selectedFeedback: { responseId: string } = { responseId: '' };
  selectedFeedbackMessageIndex: number = -1;
  feedbackForm: FormGroup | undefined;
  dynamicChartId: string = '';

  // ============================================
  // Feedback Modal Reference
  // ============================================
  feedbackReasons: { controlName: string; label: string }[] = [
    {
      controlName: 'factual-inaccuracy',
      label: NotificationMessages.FEEDBACK_Factual_Inaccuracy,
    },
    {
      controlName: 'irrelevant-or-off-topic',
      label: NotificationMessages.FEEDBACK_Irrelevant_or_off_topic,
    },
    {
      controlName: 'repetitive-or-looping',
      label: NotificationMessages.FEEDBACK_Repetitive_or_looping,
    },
    {
      controlName: 'missing-context-assumption',
      label: NotificationMessages.FEEDBACK_Missing_context_assumptions,
    },
    {
      controlName: 'vague-or-ambiguous',
      label: NotificationMessages.FEEDBACK_Vague_or_ambiguous,
    },
    {
      controlName: 'misunderstood-question',
      label: NotificationMessages.FEEDBACK_Misunderstood_question,
    },
    {
      controlName: 'low-utility-unactionable',
      label: NotificationMessages.FEEDBACK_Low_utility_unactionable,
    },
    { controlName: 'other', label: NotificationMessages.FEEDBACK_Other },
  ];

  canvasMap: { [chartId: string]: HTMLCanvasElement } = {};
  private readonly destroy$ = new Subject<void>();
  constructor(
    private fb: FormBuilder,
    public router: Router,
    public loaderService: LoaderService,
    private toastService: ToastService,
    private commonService: CommonService,
    private http: HttpClient,
    private activatedRouteService: ActivatedRoute,
    private errorHandlingService: ErrorHandlingService,
    private navCtrl: NavController, private actionSheetCtrl: ActionSheetController,
    private cdr: ChangeDetectorRef,
    private renderer: Renderer2,
    private authService: AuthService

  ) {

  }

  ngOnInit() {
    const savedChannelId = localStorage.getItem('selectedChannelId');
    if (savedChannelId) {
      this.channelId = savedChannelId;
    }

    // Use takeUntil for all subscriptions
    this.fetchWelcomeMessagesList();
    this.fetchChannels();
    this.loadSelectedNameOptions();

    this.commonService.messages$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (messages) => {
        this.chatMessages = messages;
        this.cdr.markForCheck();
      },
      error: (error) => {
        alert();
        this.errorHandlingService.handleError(error, 'ChatComponent.ngOnInit');
      },
    });
  }
  ionViewDidEnter() {

  }
  /**
 * Loads selected name options from JSON data
 */
  loadSelectedNameOptions(): void {
    this.http.get<any>('assets/data.json').subscribe(
      (data) => {
        this.selectedNameOptions = data;
      },
      (error) => {
        //this.logger.error('Error loading JSON data:', error);
      }
    );
  }
  sendMessage() {
    if (!this.newMessage.trim()) return;
    this.messages.push({
      own: true,
      author: 'You',
      avatar: 'assets/my_avatar.png',
      content: this.newMessage,
      time: (new Date()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      error: '',
    });
    this.newMessage = '';
  }
  async fetchWelcomeMessagesList() {
    await this.loaderService.loadingPresent();
    this.commonService.getWelcomeMessage().pipe(finalize(() => {
      this.loaderService.loadingDismiss();
    })).subscribe((res: any) => {
      console.log("Res", res);
      if (res.length > 0) {
        this.welcomeMessageList = res;
        this.cannedMessages = res;
        this.loaderService.loadingDismiss();
      }
      else {
        this.loaderService.loadingDismiss();
        this.toastService.showError(res.message, "Error");
      }
    }, error => {
      this.loaderService.loadingDismiss();
      this.errorMsg = error.error.message;
      this.toastService.showError(this.errorMsg, "Error");
    })
  }
  async fetchChannels() {
    await this.loaderService.loadingPresent();
    this.commonService.getAllChannelsData().pipe(finalize(() => {
      this.loaderService.loadingDismiss();
    })).subscribe((response: any) => {
      if (response.data?.length > 0) {
        this.loaderService.loadingDismiss();
        this.groupedChannels = response.data;

        // Select first channel from first group if no channel is selected
        if ((!this.selectedChannel || Object.keys(this.selectedChannel).length === 0) &&
          this.groupedChannels.length > 0) {
          // Find first non-empty group
          const firstNonEmptyGroup = this.groupedChannels.find(group => group.length > 0);

          // Get first channel from first non-empty group
          if (firstNonEmptyGroup && firstNonEmptyGroup.length > 0) {
            const firstChannel = firstNonEmptyGroup[0];
            if (firstChannel && firstChannel.id) {
              this.channelHandler(firstChannel.id);
            }
          }
        }

      }
      else {
        this.loaderService.loadingDismiss();
        this.toastService.showError('vxcvxcvxvxcv', "Error");
      }
    }, error => {
      this.loaderService.loadingDismiss();
      this.errorMsg = error.error.message;
      this.toastService.showError('sadasdasd', "Error");
    })
  }
  /**
 * Handles channel selection and initialization
 * @param channelId - The ID of the channel to handle
 */
  channelHandler(channelId: string): void {
    this.loaderService.loadingDismiss();
    if (!channelId) {
      //this.logger.error('Channel ID is required');
      this.loaderService.loadingDismiss();
      return;
    }

    //this.logger.debug('channelHandler------', channelId);
    // this.spinner.show();
    // this.isLoading = true;
    this.chatMessages = [];
    this.cannedMessages = [];

    this.isChannelAction = true;
    this.isResponseAction = false;
    this.getChannelInfo(channelId).subscribe({
      next: (data: ChannelResponse) => {
        this.selectedChannel = data;

        if (data.id) {
          localStorage.setItem('selectedChannelId', data.id);
        }

        const payload = {};
        this.calculateChatMessagesHeight();

        this.commonService
          .getChannelHistory(data.id, payload)
          .pipe(
            takeUntil(this.destroy$),
            finalize(() => {
              this.isLoading = false;
              this.loaderService.loadingDismiss();
              // this.spinner.hide();
              // this.modalReference?.close();
              // this.resetForm();
              // this.cdr.detectChanges();
            })
          )
          .subscribe({
            next: (res: any) => {
              if (res.data.length > 0) {
                res.data.forEach((obj: ChannelHistoryResponse) => {
                  const { response, request, id, feedback } = obj;

                  if (request) {
                    this.chatMessages.push({
                      text: request.message,
                      timestamp: request.date,
                      sender: 'user',
                      files: Array.isArray(request.data) ? request.data : [],
                    });
                  }

                  if (response) {
                    let responseText = response.response;
                    if (responseText !== 'None') {
                      responseText = responseText
                        .replace(/[{}"]/g, '')
                        .replace(/\\n/g, '\n');
                    }

                    this.chatMessages.push({
                      text: responseText,
                      timestamp: response.date,
                      sender: 'bot',
                      responseId: id,
                      feedback: feedback,
                      error: false,
                    });
                  }
                });
                //this.cdr.detectChanges();
                setTimeout(() => this.scrollToBottom(true), 0);
                this.isResponseAction = true;
              }
            },
            error: (error: ApiError) => {
              //this.spinner.hide();
              this.errorMsg = error.detail || '';
              this.toastService.showError(
                NotificationMessages.FETCH_ERROR_MESSAGE,
                'Error'
              );
              this.isResponseAction = true;
            },
            complete: () => {
              this.isResponseAction = true;
              this.isLoading = false;
              //this.cdr.detectChanges();
            },
          });
      },
      error: (error: ApiError) => {
        //this.spinner.hide();
        //this.logger.error('Error fetching channel info:', error);
        this.isResponseAction = true;
      },
    });
  }

  /**
  * Gets channel information by ID
  * @param channelId - The ID of the channel to fetch
  * @returns Observable with channel data
  */
  getChannelInfo(channelId: string) {
    this.loaderService.loadingDismiss();
    return this.commonService.getChannelById(channelId);
  }

  calculateChatMessagesHeight() {
    this.loaderService.loadingDismiss();
    if (this.channelTitleSection && this.chatType && this.chatContainer) {
      const channelTitleHeight =
        this.channelTitleSection.nativeElement.offsetHeight;
      const chatTypeHeight = this.chatType.nativeElement.offsetHeight;
      const windowHeight = window.innerHeight;
      this.chatMessagesHeight = windowHeight - (chatTypeHeight + 100);
      //this.cdr.detectChanges();
    } else {
      const chatTypeHeight = this.chatType.nativeElement.offsetHeight;
      const windowHeight = window.innerHeight;
      this.chatMessagesHeight = windowHeight - (chatTypeHeight + 80);
    }
  }

  /**
 * Scrolls the chat container to the bottom
 * @param forceScroll - Whether to force scroll regardless of current position
 */
  scrollToBottom(forceScroll = false): void {
    this.cdr.detectChanges();
    this.loaderService.loadingDismiss();
    if (this.chatContainer) {
      if (this.isAtBottom || forceScroll) {
        setTimeout(() => {
          this.renderer.setProperty(
            this.chatContainer.nativeElement,
            'scrollTop',
            this.chatContainer.nativeElement.scrollHeight
          );
          this.isAtBottom = true;
          this.disableAutoScroll = false;
          this.cdr.markForCheck();
        }, 200);
      }
    }
  }
  navigateToDisplayPage(nocId: any) {
    if (nocId) {
      this.router.navigate(['/noc-details', nocId]);
    } else {
      console.warn('Please select a date and time first!');
    }
  }

  logout() {
    this.authService.logout();
  }

}
