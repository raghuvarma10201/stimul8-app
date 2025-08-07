import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  apiUrl: string = environment.apiUrl;
  languageEvent: Subject<object> = new Subject<object>();
  constructor(private http: HttpClient) { }

  getDefaultSettings(): Observable<any> {
    return this.http.get<any>(environment.apiUrl + "Customer/GetConfigSettings").pipe(catchError(this.handleError));
  }

  getStockItems(payload: any) {
    return this.http.post<any>(environment.apiUrl + "v1/get-site-stock-items", payload).pipe(catchError(this.handleError));
  }
  getConsumableItems(payload: any) {
    return this.http.post<any>(environment.apiUrl + "v1/get-site-consume-items", payload).pipe(catchError(this.handleError));
  }
  getConsumptionList(payload: any) {
    return this.http.post<any>(environment.apiUrl + "v1/get-consumed-site-stock", payload).pipe(catchError(this.handleError));
  }
  getTransferRequests(payload: any) {
    return this.http.post<any>(environment.apiUrl + "v1/get-transfer-list", payload).pipe(catchError(this.handleError));
  }
  getWarehouseTransferRequests(payload: any) {
    return this.http.post<any>(environment.apiUrl + "v1/get-warehouse-transfer-list", payload).pipe(catchError(this.handleError));
  }
  getTransferRequestDetails(payload: any) {
    return this.http.post<any>(environment.apiUrl + "v1/get-transfer-stock-details", payload).pipe(catchError(this.handleError));
  }
  getWarehouseTransferRequestDetails(payload: any) {
    return this.http.post<any>(environment.apiUrl + "v1/get-warehouse-transfer-stock-details", payload).pipe(catchError(this.handleError));
  }
  updateTransferRequestStatus(payload: any) {
    return this.http.post<any>(environment.apiUrl + "v1/update-transfer-request-status", payload).pipe(catchError(this.handleError));
  }
  updateWarehouseTransferRequestStatus(payload: any) {
    return this.http.post<any>(environment.apiUrl + "v1/update-warehouse-transfer-request-status", payload).pipe(catchError(this.handleError));
  }
  getItemsRequestList(payload: any) {
    return this.http.post<any>(environment.apiUrl + "v1/get-request-list", payload).pipe(catchError(this.handleError));
  }
  getRequestItems(payload: any) {
    return this.http.post<any>(environment.apiUrl + "v1/get-request-details", payload).pipe(catchError(this.handleError));
  }
  getPurchaseOrders(payload: any) {
    return this.http.post<any>(environment.apiUrl + "v1/get-purchase-stocks", payload).pipe(catchError(this.handleError));
  }
  getPurchaseOrderItems(payload: any) {
    return this.http.post<any>(environment.apiUrl + "v1/get-purchase-stocks", payload).pipe(catchError(this.handleError));
  }
  getSearchItems(payload: any) {
    return this.http.post<any>(environment.apiUrl + "v1/get-all-item-quantity", payload).pipe(catchError(this.handleError));
  }
  addConsumptionList(payload: any) {
    return this.http.post<any>(environment.apiUrl + "v1/add-consumed-site-stock", payload).pipe(catchError(this.handleError));
  }
  requestStock(payload: any) {
    return this.http.post<any>(environment.apiUrl + "v1/request-stock-items", payload).pipe(catchError(this.handleError));
  }
  addGRNItems(payload: any) {
    return this.http.post<any>(environment.apiUrl + "v1/add-stock-to-site", payload).pipe(catchError(this.handleError));
  }
  getDocumentslist(id: any): Observable<any> {
    const params = new HttpParams().set('nocid', id);
    return this.http.get<any>(environment.apiUrl + "NOC/NocCustomerActionDocList", { params }).pipe(catchError(this.handleError));
  }

  changeScheduleForTrailPit(body: any) {
    return this.http.post<any>(environment.apiUrl + "Customer/ChangeScheduleForTrailPit", body).pipe(catchError(this.handleError));
  }

  acceptTrailPitOrRoadCutting(body: any) {
    return this.http.post<any>(environment.apiUrl + "Customer/AcceptTrailPitOrRoadCutting", body).pipe(catchError(this.handleError));
  }
  uploadImage(payload: any) {
    return this.http.post<any>(environment.apiUrl + "v1/image-upload", payload).pipe(catchError(this.handleError));
  }
  handleError(error: HttpErrorResponse) {
    // let msg = '';
    // if (error.error instanceof ErrorEvent) {
    //   // client-side error
    //   msg = error.error.message;

    // } else {
    //   // server-side error
    //   msg = `Error Code: ${error.status}\nMessage: ${error.message}`;

    // }
    return throwError(error);
  }

}
