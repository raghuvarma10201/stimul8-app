import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ChatMessage } from '../pages/chat/chat.interface';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  private messagesSubject = new BehaviorSubject<ChatMessage[]>([]);
  messages$ = this.messagesSubject.asObservable();
  apiUrl: string = environment.apiUrl;
  languageEvent: Subject<object> = new Subject<object>();
  constructor(private http: HttpClient) { }
  
  headers = new HttpHeaders({
    'Cache-Control': 'no-cache',
    Pragma: 'no-cache',
    Expires: '0',
  });

  getWelcomeMessage(): Observable<any> {
    return this.http
      .get<any>(environment.messagesUrl + 'welcome-messages')
      .pipe(catchError(this.handleError));
  }
  getAllChannelsData(): Observable<any> {
    return this.http
      .get<any>(environment.channelsurl + 'grouped', { headers: this.headers })
      .pipe(catchError(this.handleError));
  }
  getChannelById(id: any): Observable<any> {
    return this.http
      .get<any>(environment.apiUrl + 'channels/' + id, {
        headers: this.headers,
      })
      .pipe(catchError(this.handleError));
  }
  getChannelHistory(channelID: any, body: any): Observable<any> {
    return this.http
      .post<any>(
        environment.messagesUrl + 'channels/' + channelID + '/history',
        body
      )
      .pipe(catchError(this.handleError));
  }
  addMessage(message: ChatMessage, currentMessages: ChatMessage[]): void {
    const updatedMessages = [...currentMessages, message];
    this.messagesSubject.next(updatedMessages);
  }
  getDataByEntityId(entityUrl: string, entityId: any): Observable<any> {
    return this.http
      .get<any>(environment.apiUrl + entityUrl + '/' + entityId)
      .pipe(catchError(this.handleError));
  }
  sendUserMessage(channelID: any, data: any): Observable<any> {
    return this.http
      .post<any>(
        environment.messagesUrl +
          'channels/' +
          channelID +
          '/message-without-attachment',
        data
      )
      .pipe(catchError(this.handleError));
  }

  sendUserMessageWithAttachment(channelID: any, data: any): Observable<any> {
    return this.http
      .post<any>(
        environment.messagesUrl +
          'channels/' +
          channelID +
          '/message-with-attachment',
        data
      )
      .pipe(catchError(this.handleError));
  }

  createEntity(entityType: string, entityData: any): Observable<any> {
    return this.http
      .post<any>(environment.apiUrl + entityType + 's', entityData, { headers: this.headers })
      .pipe(catchError(this.handleError));
  }
  goodResponse(intractionId: any): Observable<any> {
    return this.http
      .post<any>(
        environment.apiUrl +
          'interaction-history/' +
          intractionId +
          '/mark-as-good-response',
        null
      )
      .pipe(catchError(this.handleError));
  }

  badResponse(intractionId: any, payload: any): Observable<any> {
    return this.http
      .post<any>(
        environment.apiUrl +
          'interaction-history/' +
          intractionId +
          '/mark-as-bad-response',
        payload
      )
      .pipe(catchError(this.handleError));
  }
  handleError(error: HttpErrorResponse) {
    return throwError(error);
  }

}
