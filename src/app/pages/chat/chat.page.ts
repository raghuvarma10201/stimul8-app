import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import {
  ActionSheetController,
  InfiniteScrollCustomEvent,
  IonContent,
  NavController,
} from "@ionic/angular";
import { catchError, EMPTY, finalize, Subject, takeUntil } from "rxjs";
import { AuthService } from "src/app/services/auth.service";
import { CommonService } from "src/app/services/common.service";
import { LoaderService } from "src/app/services/loader.service";
import { SharedService } from "src/app/services/shared.service";
import { ToastService } from "src/app/services/toast.service";
import { environment } from "src/environments/environment";
import {
  ApiError,
  ApiResponse,
  BotMessage,
  Channel,
  ChannelHistoryResponse,
  ChannelResponse,
  ChatMessage,
  TextMessage,
  UploadedFile,
} from "./chat.interface";
import demodata from "../../../assets/data/testdemo.json";
import { NotificationMessages } from "src/app/shared/notification.enum";
import { HttpClient } from "@angular/common/http";
import { ErrorHandlingService } from "src/app/services/error-handling.service";

@Component({
  selector: "app-chat",
  templateUrl: "./chat.page.html",
  styleUrls: ["./chat.page.scss"],
})
export class ChatPage implements OnInit {
  @ViewChild("chatContainer") private chatContainer!: ElementRef;
  @ViewChild("channelTitleSection") channelTitleSection!: ElementRef;
  @ViewChild("chatType") chatType!: ElementRef;
  @ViewChild("fileInput") fileInput!: ElementRef;
  @ViewChild(IonContent, { static: false }) content!: IonContent;

  chatForm: FormGroup;
  channelForm: FormGroup = new FormGroup({});
  staticChatData = demodata;
  loading: boolean = false;
  chatMessages: ChatMessage[] = [
    {
      type: "",
      text: "" as string | TextMessage,
      sender: "bot",
      timestamp: new Date(),
      files: [],
      feedback: {
        reason: "",
        comment: "",
        is_good: false,
        is_bad: false,
      },
    },
  ];

  errorMsg: string = "";
  pageName: string = "channels";
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
  channelSearchQuery: string = "";
  actionType: string = "";
  originalFormValues: Channel = {} as Channel;

  // ============================================
  // UI State and Flags
  // ============================================
  chatMessagesHeight: number = 360;
  currentMessage: ChatMessage = {
    type: "",
    text: "" as string | TextMessage,
    sender: "bot",
    timestamp: new Date(),
    files: [],
    feedback: {
      reason: "",
      comment: "",
      is_good: false,
      is_bad: false,
    },
  };
  isButtonDisabled = false;
  channelId: string = "";
  isDefaultContext: boolean = false;
  welcomeMessageList: string[] = [];
  isLoading: boolean = true;
  isCopied: boolean = false;
  isSubmitted: boolean = false;
  disableAutoScroll: boolean = false;
  responseText = "";
  displayedResponse: string = "";
  typingInterval: number = 0;

  // ============================================
  // File Upload Related
  // ============================================
  uploadedFiles: UploadedFile[] = [];
  fileTypeLabel: string = "";

  // ============================================
  // Dropdown Options
  // ============================================
  usedForOptions: { value: string; name: string }[] = [
    { value: "vendor", name: "IAM Solution" },
    { value: "iam-process", name: "IAM Process" },
    { value: "iam-initiative", name: "IAM Initiative" },
  ];
  availableSelectedNameOptions: { value: string; name: string }[] = [];
  selectedNameOptions: { [key: string]: string[] } = {};
  selectedChannel: Channel = {} as Channel;
  isChannelAction: boolean = false;

  entityName: string = "Channel";
  duplicateEntityName: string = "";
  showIcons: boolean = false;
  isResponseAction: boolean = false;
  isResendAction: boolean = false;
  copiedMessageId: number = -1;
  goodResponseIndex: number = -1;
  badResponseIndex: number = -1;
  showToast: boolean = false;
  showErrorToast: boolean = false;
  errorToastMessage: string = "";
  inlineToastMessage: string = "";
  selectedFeedback: { responseId: string } = { responseId: "" };
  selectedFeedbackMessageIndex: number = -1;
  feedbackForm: FormGroup | undefined;
  dynamicChartId: string = "";

  // ============================================
  // Feedback Modal Reference
  // ============================================
  feedbackReasons: { controlName: string; label: string }[] = [
    {
      controlName: "factual-inaccuracy",
      label: NotificationMessages.FEEDBACK_Factual_Inaccuracy,
    },
    {
      controlName: "irrelevant-or-off-topic",
      label: NotificationMessages.FEEDBACK_Irrelevant_or_off_topic,
    },
    {
      controlName: "repetitive-or-looping",
      label: NotificationMessages.FEEDBACK_Repetitive_or_looping,
    },
    {
      controlName: "missing-context-assumption",
      label: NotificationMessages.FEEDBACK_Missing_context_assumptions,
    },
    {
      controlName: "vague-or-ambiguous",
      label: NotificationMessages.FEEDBACK_Vague_or_ambiguous,
    },
    {
      controlName: "misunderstood-question",
      label: NotificationMessages.FEEDBACK_Misunderstood_question,
    },
    {
      controlName: "low-utility-unactionable",
      label: NotificationMessages.FEEDBACK_Low_utility_unactionable,
    },
    { controlName: "other", label: NotificationMessages.FEEDBACK_Other },
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
    private navCtrl: NavController,
    private actionSheetCtrl: ActionSheetController,
    private cdr: ChangeDetectorRef,
    private renderer: Renderer2,
    private authService: AuthService
  ) {
    this.chatForm = this.fb.group({
      message: [""],
    });
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      const channelId = navigation.extras.state["channelId"];
      this.channelId = channelId;
      console.log("channelId", channelId);
      this.chatMessages = [];
    }
  }

  ngOnInit() {
    this.chatMessages = [];
  }
  ionViewDidEnter() {
    // Use takeUntil for all subscriptions
    this.chatMessages = [];
    this.channelHandler(this.channelId);
    this.loadSelectedNameOptions();

    this.commonService.messages$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (messages) => {
        this.chatMessages = messages;
        this.cdr.markForCheck();
      },
      error: (error) => {
        this.errorHandlingService.handleError(error, "ChatComponent.ngOnInit");
      },
    });
  }

  /**
   * Handles input change events
   * Updates message validation state
   */
  onInputChange(): void {
    const message = this.chatForm.get("message")?.value;
    this.messageValid = message && message.trim().length > 0;
    if (this.messageValid) {
      this.isButtonDisabled = false;
    } else {
      this.isButtonDisabled = true;
    }
  }
  /**
   * Loads selected name options from JSON data
   */
  loadSelectedNameOptions(): void {
    this.http.get<any>("assets/data.json").subscribe(
      (data) => {
        this.selectedNameOptions = data;
      },
      (error) => {
        //this.logger.error('Error loading JSON data:', error);
      }
    );
  }

  /**
   * Sends a message to the chat
   */
  sendMessage(): void {
    this.isResponseAction = false;
    this.isButtonDisabled = true;
    this.isResendAction = false;
    if (this.chatForm.value.message === "") {
      this.isResendAction = true;
    } else {
      this.isResendAction = false;
    }
    const message = this.chatForm.value.message;
    const hasContent = message || this.uploadedFiles.length > 0;

    if (!hasContent) return;

    const formData = new FormData();
    formData.append("message", message || "");

    // Append files to formData
    this.uploadedFiles.forEach((uploadedFile) => {
      formData.append("files", uploadedFile.file);
    });

    // Push user message to chat immediately
    const userMessage: ChatMessage = {
      text: message,
      timestamp: new Date(),
      sender: "user",
      files: this.uploadedFiles.map((uf) => ({
        filename: uf.file.name,
        file: uf.file,
      })),
    };
    this.commonService.addMessage(userMessage, this.chatMessages);

    const botMessage: BotMessage = {
      type: "text", // Set default type
      text: "",
      timestamp: new Date(),
      sender: "bot",
      error: false,
      operationType: "",
      entityType: "",
      entityName: "",
      appID: "",
      data: {
        operation: "",
        entity_type: "",
        entity_id: "",
      },
    };

    this.loaderService.loadingPresent();

    if (this.checkInput(message)) {
      this.handleStaticResponse(message, botMessage);
    } else {
      this.handleApiResponse(formData, botMessage);
    }

    // Reset form and clear files
    this.scrollToBottom();
    this.chatForm.reset();
    this.uploadedFiles = [];
  }

  checkInput(userInput: string): boolean {
    const predefinedStrings = this.staticChatData.allstrings.map(
      (str: string) => str.toLowerCase()
    );
    return predefinedStrings.includes(userInput?.toLowerCase());
  }

  handleStaticResponse(message: string, botMessage: BotMessage) {
    const resIndex = this.staticChatData.allresponse.findIndex(
      (res) => res.message.toLocaleLowerCase() === message.toLocaleLowerCase()
    );

    if (resIndex !== -1) {
      const response = this.staticChatData.allresponse[resIndex];
      if (typeof response.response === "string") {
        botMessage.text = response.response;
      } else {
        botMessage.text = JSON.stringify(response.response);
      }
      botMessage.type = (response?.type as "text" | "form" | "") || "text"; // Set default type to 'text' if undefined
      botMessage.operationType = response?.operationType || "";
      this.currentMessage = botMessage;
      this.chatMessages.push(botMessage);
      this.loaderService.loadingDismiss();

      if (botMessage.type === "text") {
        this.typingAnimation(botMessage.text as string);
      } else if (
        typeof botMessage.text === "object" &&
        "type" in botMessage.text &&
        ((botMessage.text as TextMessage).type === "form" ||
          (botMessage.text as TextMessage).type === "view")
      ) {
        this.handleFormResponse(botMessage as unknown as ApiResponse);
      } else {
        this.isButtonDisabled = false;
      }
    }
    this.displayedResponse = "";
    this.isResponseAction = true;
  }

  private handleApiResponse(formData: FormData, botMessage: BotMessage): void {
    const apiCall =
      this.uploadedFiles.length > 0
        ? this.commonService.sendUserMessageWithAttachment(
          this.selectedChannel.id,
          formData
        )
        : this.commonService.sendUserMessage(this.selectedChannel.id, formData);

    apiCall
      .pipe(
        takeUntil(this.destroy$),
        catchError((error) => {
          this.errorHandlingService.handleError(
            error,
            "ChatComponent.handleApiResponse"
          );
          this.isButtonDisabled = false;
          return EMPTY;
        }),
        finalize(() => {
          this.loaderService.loadingDismiss();
        })
      )
      .subscribe((response) => {
        this.handleApiResponseType(response, botMessage);
      });
  }
  private handleApiResponseType(
    response: ApiResponse,
    botMessage: BotMessage
  ): void {
    // if (!isApiResponse(response)) {
    //   return;
    // }

    switch (response.type) {
      case "text":
        this.handleTextResponse(response as ApiResponse, botMessage);
        break;
      case "form":
        this.handleFormResponse(response as ApiResponse);
        break;
      default:
        this.errorHandlingService.handleError(
          new Error(`Unknown response type: ${String((response as any).type)}`),
          "ChatComponent.handleApiResponseType"
        );
    }
  }
  private handleTextResponse(
    response: ApiResponse,
    botMessage: BotMessage
  ): void {
    if (!response.response) {
      return;
    }
    const responseMsg = response.response;
    botMessage.text = responseMsg;
    botMessage.context_messages = response.context_messages;
    this.currentMessage = botMessage;
    this.chatMessages.push(botMessage);
    this.typingAnimation(responseMsg as string);
  }

  typingAnimation(responseText: string): void {
    let currentText = "";
    let index = 0;

    if (this.typingInterval) {
      clearInterval(this.typingInterval);
    }

    this.displayedResponse = "";
    this.isButtonDisabled = true;
    this.typeMarkdown(responseText);
  }

  async typeMarkdown(content: any) {
    this.isResponseAction = false;
    let currentText = "";
    for (let i = 0; i < content.length; i++) {
      currentText += content[i];
      this.displayedResponse = currentText;
      this.scrollToBottom();
      await this.sleep(10);
      if (i === content.length - 1) {
        this.isResponseAction = true;
      }
    }
    this.isButtonDisabled = false;
  }

  sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  handleGoodResponse(message: any, i: number): void {
    //this.logger.debug('handleGoodResponse', message, i);
    if (
      message.feedback === undefined ||
      (typeof message.feedback === 'object' &&
        Object.keys(message.feedback).length === 0) || // empty object
      !message.feedback?.is_good
    ) {
      this.goodResponse(message, i);
    }
  }

  handleBadResponse(content: any, message: any, i: number): void {
    //this.logger.debug('handleBadResponse', content, message, i);
    if (
      message.feedback === undefined ||
      (typeof message.feedback === 'object' &&
        Object.keys(message.feedback).length === 0) || // empty object
      message.feedback?.is_good === true ||
      message.feedback?.is_good === false
    ) {
      this.badResponse(content, message, i);
    }
  }

  /**
 * Handles good response
 * @param message - The message to handle
 * @param index - The index of the message
 */
  goodResponse(message: any, index: any) {
    const intractionId = message.responseId;
    this.commonService.goodResponse(intractionId).subscribe({
      next: (res) => {
        this.goodResponseIndex = index;
        if (!this.chatMessages[index].feedback) {
          this.chatMessages[index].feedback = {
            reason: '',
            comment: '',
            is_good: false,
            is_bad: false,
          };
        }
        this.chatMessages[index].feedback!.is_good = true;
        this.chatMessages[index].feedback!.is_bad = false;
        this.inlineToastMessage = NotificationMessages.GOOD_RESPONSE;
        this.toastService.showSuccess("", this.inlineToastMessage)
      },
      error: (err) => {
        // handle error
        //this.logger.error('Error occurred', err);
      },
    });
  }

  /**
   * Handles bad response
   * @param content - The content to handle
   * @param message - The message to handle
   * @param index - The index of the message
   */
  badResponse(content: any, message: any, index: any) {

    this.selectedFeedbackMessageIndex = index;

    this.selectedFeedback = message;

  }

  copyToClipboard(message: any, messageId: number): void {
    //this.logger.debug(message, messageId);
    switch (message.type) {
      case 'code':
        navigator.clipboard
          .writeText(message.text.code)
          .then(() => {
            //this.handleCopySuccess(messageId);
          })
          .catch((err) => {
            //this.logger.error('Could not copy code:', err);
          });
        break;

      case 'html':
        navigator.clipboard
          .writeText(message.text)
          .then(() => {
            //this.handleCopySuccess(messageId);
          })
          .catch((err) => {
            // this.logger.error('Could not copy HTML:', err);
          });
        break;

      case 'graph':
        //this.copyGraphAsImage(message, messageId);
        break;

      default:
        if (message.text) {
          navigator.clipboard
            .writeText(message.text)
            .then(() => {
              //this.handleCopySuccess(messageId);
            })
            .catch((err) => {
              //this.logger.error('Could not copy text:', err);
            });
        } else {
          //this.logger.warn('Copy not supported for this message type.');
        }
    }
  }
  private handleFormResponse(response: ApiResponse): void {
    const responseMsg = response.data;
    if (responseMsg) {
      const { operation, entity_type, entity_id } = responseMsg;
      const componentName = this.getComponentName(entity_type.toLowerCase());
      if (operation === "edit") {
        this.commonService
          .getDataByEntityId(`${entity_type.toLowerCase()}s`, entity_id)
          .subscribe((data: ChannelResponse) => {
            this.openEntityDynamicForm(
              response,
              operation,
              "",
              responseMsg,
              data
            );
          });
      } else {
        this.openEntityDynamicForm(
          response,
          operation,
          componentName,
          responseMsg,
          ""
        );
      }
    }
  }
  private getComponentName(sender: string): string {
    switch (sender.toLowerCase()) {
      case "user":
        return "UserComponent";
      default:
        return "UnknownComponent";
    }
  }
  openEntityDynamicForm(
    botMessage: ApiResponse | BotMessage,
    actionType: string,
    component: any,
    data: {
      entity_id: string;
      entity_type: string;
    },
    response: ChannelResponse | string
  ): void { }

  async fetchWelcomeMessagesList() {
    this.loading = true;
    await this.loaderService.loadingPresent();
    this.commonService
      .getWelcomeMessage()
      .pipe(
        finalize(() => {
          this.loaderService.loadingDismiss();
        })
      )
      .subscribe(
        (res: any) => {
          console.log("Res", res);
          if (res.length > 0) {
            this.welcomeMessageList = res;
            this.cannedMessages = res;
            this.loaderService.loadingDismiss();
            this.loading = false;
          } else {
            this.loaderService.loadingDismiss();
            this.toastService.showError(res.message, "Error");
            this.loading = false;
          }
        },
        (error) => {
          this.loaderService.loadingDismiss();
          this.errorMsg = error.error.message;
          this.loading = false;
          this.toastService.showError(this.errorMsg, "Error");
        }
      );
  }
  channelHandler(channelId: string): void {
    channelId = this.channelId;
    this.loaderService.loadingPresent();
    this.loading = true;
    if (!channelId) {
      this.loaderService.loadingDismiss();
      this.loading = false;
      return;
    }
    this.chatMessages = [];
    this.cannedMessages = [];

    this.isChannelAction = true;
    this.isResponseAction = false;
    this.getChannelInfo(channelId).subscribe({
      next: (data: ChannelResponse) => {
        console.log(data);
        this.selectedChannel = data;
        if (data.id) {
          localStorage.setItem("selectedChannelId", data.id);
        }
        const payload = {};
        //this.calculateChatMessagesHeight();
        this.commonService
          .getChannelHistory(data.id, payload)
          .pipe(
            takeUntil(this.destroy$),
            finalize(() => {

              this.cdr.detectChanges();
            })).subscribe({
              next: (res: any) => {
                if (res.data.length > 0) {
                  this.loaderService.loadingDismiss();
                  console.log(res);
                  res.data.forEach((obj: ChannelHistoryResponse) => {
                    const { response, request, id, feedback } = obj;
                    if (request) {
                      this.chatMessages.push({
                        text: request.message,
                        timestamp: request.date,
                        sender: "user",
                        files: Array.isArray(request.data) ? request.data : [],
                      });
                    }
                    if (response) {
                      let responseText = response.response;
                      if (responseText !== "None") {
                        responseText = responseText
                          .replace(/[{}"]/g, "")
                          .replace(/\\n/g, "\n");
                      }
                      this.chatMessages.push({
                        text: responseText,
                        timestamp: response.date,
                        sender: "bot",
                        responseId: id,
                        feedback: feedback,
                        error: false,
                      });
                    }
                  });
                  this.cdr.detectChanges();
                  setTimeout(() => this.scrollToBottom(true), 0);
                  this.isResponseAction = true;
                } else {
                  this.chatMessages = [];
                  this.fetchWelcomeMessagesList();
                }
              },
              error: (error: ApiError) => {
                this.loaderService.loadingDismiss();
                this.errorMsg = error.detail || "";
                this.toastService.showError(
                  NotificationMessages.FETCH_ERROR_MESSAGE,
                  "Error"
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
        this.loaderService.loadingDismiss()
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
    this.content.scrollToBottom(10); // 300ms animation
  }
  navigateToDisplayPage(nocId: any) {
    if (nocId) {
      this.router.navigate(["/noc-details", nocId]);
    } else {
      console.warn("Please select a date and time first!");
    }
  }

  logout() {
    this.authService.logout();
  }
}
