import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, catchError, from, of, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SharedService } from './shared.service';
import { jwtDecode } from 'jwt-decode';
import { Http, } from '@capacitor-community/http';
import { CapacitorHttp, HttpOptions } from '@capacitor/core';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  apiUrl: string = environment.apiUrl;
  isloggedIn: boolean = false;
  userData: any;
  private permissionsSubject = new BehaviorSubject<string[]>([]);
  permissions$ = this.permissionsSubject.asObservable();

  private userDataSubject = new BehaviorSubject<string[]>([]);
  userData$ = this.permissionsSubject.asObservable();

  constructor(private http: HttpClient,
    public router: Router,
    public sharedService: SharedService,
  ) {
    this.loadPermissions(); // Automatically load on service init
  }

  // Optionally call this from login or API
  setUserData(perms: string[]) {
    this.userDataSubject.next(perms);
  }

  // Optionally call this from login or API
  setPermissions(perms: string[]) {
    this.permissionsSubject.next(perms);
  }

  // Convenience method for template usage
  hasPermission(permission: string): boolean {
    return this.permissionsSubject.value.includes(permission);
  }
  
   // Convenience method for template usage
   getRole(): string {
    let userData: any = localStorage.getItem('userData');
    if (userData) {
      userData = JSON.parse(userData);
      return userData.role_name.replace(/\s+/g, '').toLowerCase();
    }
    return '';
  }

  private loadPermissions() {
    let userData: any = localStorage.getItem('userData');
    if (userData) {
      userData = JSON.parse(userData);
      console.log(userData.permission_types, "-------------userData");
      this.permissionsSubject.next(userData.permission_types);
    }
  }

  clearPermissions() {
    localStorage.removeItem('user_permissions');
    this.permissionsSubject.next([]);
  }

  // Method to check if user is authenticated (you could use real authentication logic here)
  isAuthenticated(): Observable<boolean> {
    // Replace this logic with actual authentication status checking
    const isLoggedIn = !!localStorage.getItem('userData');  // Example: Check if token exists
    return of(isLoggedIn);
  }
  validateUser(body: any): Observable<any> {
    return this.http.post<any>(environment.apiUrl + "v1/login", body).pipe(catchError(this.handleError));
  }
  getConferenceSettings(body: any): Observable<any> {
    return this.http.post<any>(environment.apiUrl + "getConferenceSettings", body).pipe(catchError(this.handleError));
  }

  forgotPassword(body: any): Observable<any> {
    return this.http.post<any>(environment.apiUrl + "forgotpassword", body).pipe(catchError(this.handleError));

  }
  changePassword(body: any): Observable<any> {
    return this.http.post<any>(environment.apiUrl + "resetpassword", body).pipe(catchError(this.handleError));
  }

  getaccesstoken(authorizationCode: any, creds: any): Observable<any> {
    return from(this.performCapacitorHttpRequest(authorizationCode, creds));
  }

  private async performCapacitorHttpRequest(authorizationCode: any, creds: any): Promise<any> {
    try {
      const url = 'https://stg-id.uaepass.ae/idshub/token';

      // Create form data
      const formData = new URLSearchParams();
      formData.append('grant_type', 'authorization_code');
      formData.append('redirect_uri', 'http://localhost/uaepassverification');
      formData.append('code', authorizationCode);

      // Create HTTP POST request options
      const options: HttpOptions = {
        url: url,
        headers: {
          'Authorization': `Basic cmFrcHNkX21vYmlsZV9zdGFnZTpRNWl1WHdKR0hjbU5zY29E`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: formData.toString(),
      };

      // Send HTTP request using Capacitor Http plugin
      const response = await CapacitorHttp.post(options);

      // Return the data
      return response.data;
    } catch (error) {
      console.error('Error sending form data:', error);
      throw error;
    }
  }

  uaeuserInfo(token: any): Observable<any> {
    return from(this.performUserInfoRequest(token));
  }

  private async performUserInfoRequest(token: any): Promise<any> {
    try {
      const url = 'https://stg-id.uaepass.ae/idshub/userinfo';

      // Create HTTP GET request options
      const options: HttpOptions = {
        url: url,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      };

      // Send HTTP request using Capacitor Http plugin
      const response = await CapacitorHttp.get(options);

      // Return the data
      return response.data;
    } catch (error) {
      console.error('Error getting user info:', error);
      throw error;
    }
  }

  validateuaeUser(body: any): Observable<any> {
    return this.http.post<any>(environment.apiUrl + "Login/LoginWithUAEPass", body).pipe(catchError(this.handleError));
  };

  decodeToken(token: string): any {
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error('Invalid token', error);
      return null;
    }
  }
  setUserInLocalStorage(user: any, name: any) {
    this.userData = user
    localStorage.setItem(name, JSON.stringify(this.userData));
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
    this.router.navigate(["/login"]);
    this.sharedService.isUserLogin.next({ isUserLoggedIn: false });
  }


  handleError(error: HttpErrorResponse) {
    let msg = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      msg = error.error.message;

    } else {
      // server-side error
      msg = `Error Code: ${error.status}\nMessage: ${error.message}`;

    }
    return throwError(msg);
  }
}