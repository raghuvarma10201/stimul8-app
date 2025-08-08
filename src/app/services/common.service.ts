import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, catchError, from, map, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ChatMessage } from '../pages/chat/chat.interface';
import { Http } from '@capacitor-community/http';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  private messagesSubject = new BehaviorSubject<ChatMessage[]>([]);
  messages$ = this.messagesSubject.asObservable();
  apiUrl: string = environment.apiUrl;
  private baseUrl = " https://rainbow.exwyn.com"; 
  languageEvent: Subject<object> = new Subject<object>();
  constructor(private http: HttpClient) { }
  private headers = {
    'Content-Type': 'application/json'
    // Add Authorization or other headers if needed
  };

  getWelcomeMessage(): Observable<any> {
    return this.http.get(`${this.baseUrl}/welcome-messages`)
      .pipe(map((res: any) => res.data), catchError(this.handleError));
  }

  getAllChannelsData(): Observable<any> {
    return this.http.get(`${this.baseUrl}/channels/grouped`)
      .pipe(map((res: any) => res.data), catchError(this.handleError));
  }

  getChannelById(id: any): Observable<any> {
    return this.http.get(`${this.baseUrl}/channels/${id}`)
      .pipe(map((res: any) => res.data), catchError(this.handleError));
  }

  getChannelHistory(channelID: any, body: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/channels/${channelID}/history`, body)
      .pipe(map((res: any) => res.data), catchError(this.handleError));
  }

  sendUserMessage(channelID: any, data: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/channels/${channelID}/message`, data)
      .pipe(map((res: any) => res.data), catchError(this.handleError));
  }

  sendUserMessageWithAttachment(channelID: any, formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/channels/${channelID}/message-with-attachment`, formData)
      .pipe(map((res: any) => res.data), catchError(this.handleError));
  }

  createEntity(entityType: string, entityData: any): Observable<any> {
    console.log('POST payload:', entityData);
    return this.http.post(`${this.baseUrl}/metadata/${entityType}`, entityData)
      .pipe(map((res: any) => res.data), catchError(this.handleError));
  }

  goodResponse(interactionId: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/interaction-history/${interactionId}/good`, {})
      .pipe(map((res: any) => res.data), catchError(this.handleError));
  }

  badResponse(interactionId: any, payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/interaction-history/${interactionId}/bad`, payload)
      .pipe(map((res: any) => res.data), catchError(this.handleError));
  }
  addMessage(message: ChatMessage, currentMessages: ChatMessage[]): void {
    const updatedMessages = [...currentMessages, message];
    this.messagesSubject.next(updatedMessages);
  }
  getDataByEntityId(entityUrl: string, entityId: any): Observable<any> {
  return this.http.get(`${this.baseUrl}/entity/${entityUrl}/${entityId}`)
    .pipe(map((res: any) => res.data), catchError(this.handleError));
  }
  private handleError(error: any) {
    return throwError(error);
  }


}
