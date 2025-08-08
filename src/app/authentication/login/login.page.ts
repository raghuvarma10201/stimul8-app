import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { finalize, map } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { LoaderService } from 'src/app/services/loader.service';
import { SharedService } from 'src/app/services/shared.service';
import { ToastService } from 'src/app/services/toast.service';
import { environment } from 'src/environments/environment';

import { ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  submitted = false;
  errorMsg: any;
  isClicked: boolean = false;
  initailType: string = 'password';
  captchaResponse: string | any;
  captcha: string = '';
  userInput: string = '';
  validationMessage: string = '';
  isCaptchaValid: boolean = false;
  rememberMe: boolean = false;
  intervalId: any;
  
  /** ***** For Demo-Only Credentials ***** */
  DEMO_USERNAME = 'john@askiam.ai';
  DEMO_PASSWORD = '123456';
  /** ******************************** */

  constructor(
    private fb: FormBuilder,
    public router: Router,
    private loaderService: LoaderService,
    private toastService: ToastService,
    private sharedService: SharedService,
    private authService: AuthService,
    private activatedRouteService: ActivatedRoute,
    private cdRef: ChangeDetectorRef
  ) {
    this.refreshCaptcha();
    this.loginForm = this.fb.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required]]
    });
  }

  ngOnInit() {
    const selectedSite = localStorage.getItem('selectedSite');
    const userData = localStorage.getItem('userData');
    if (selectedSite && userData) {
      this.router.navigate(['/home']);
    }

  }
  get form() { return this.loginForm.controls; }

  ionViewDidEnter() {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('userData');
    if (token && userData) {
      this.router.navigate(['/home']);
    }
    const storedUsername = localStorage.getItem("username");
    const storedPassword = localStorage.getItem("password");
    const storedRememberMe = localStorage.getItem("rememberMe") === "true";

    if (storedRememberMe && storedUsername && storedPassword) {
      this.loginForm.patchValue({ username: storedUsername });
      this.loginForm.patchValue({ password: storedPassword });
      this.rememberMe = true;
    }

    // Your logic here
  }
  // Generate new CAPTCHA
  refreshCaptcha() {
    this.captcha = this.generateCaptcha();
    this.userInput = '';
    this.validationMessage = '';
  }

  // Generate a random 6-digit number
  generateCaptcha(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Validate user input
  validateCaptcha() {
    if (this.userInput === this.captcha) {
      this.isCaptchaValid = true;
      this.validationMessage = 'CAPTCHA Verified Successfully!';
      return true;
    } else {
      this.isCaptchaValid = false;
      this.validationMessage = 'Incorrect CAPTCHA. Please try again.';
      return false;
    }
  }
  onCaptchaResolved(response: string): void {
    this.captchaResponse = response;
  }
  async onSubmit() {
    this.submitted = true;
    console.log(this.loginForm.value);
    await this.loaderService.loadingPresent();
    if (this.loginForm.invalid) {
      this.loaderService.loadingDismiss();
      return;
    }
    console.log(this.validateCaptcha());

    let formData = this.loginForm.value;
    if (this.rememberMe) {
      localStorage.setItem("username", formData.username);
      localStorage.setItem("password", formData.password);
      localStorage.setItem("rememberMe", "true");
    } else {
      localStorage.removeItem("username");
      localStorage.removeItem("password");
      localStorage.removeItem("rememberMe");
    }
    if (
      formData.username !== this.DEMO_USERNAME ||
      formData.password !== this.DEMO_PASSWORD
    ) {
      this.toastService.showError('Invalid username or password', 'Login failed');
      await this.loaderService.loadingDismiss();
      return;                         // STOP here – do not continue login flow
    }
    formData.device_id = "";
    this.submitted = false;
    const userData = formData;
    // this.toastService.showSuccess('Successfully Login', 'Success');
    
    this.authService.setUserInLocalStorage(userData, 'userData');
    let token = 'assffgdsrewrr_erewrewxqw_qrewtr';
    console.log("token---", token);
    localStorage.setItem('token', token);
    this.loginForm.reset();
    this.refreshCaptcha();
    this.loaderService.loadingDismiss();
    this.router.navigate(["/home"]);
    this.sharedService.isUserLogin.next({ isUserLoggedIn: true });
  }

  showOrHidePassword() {
    if (this.isClicked === true) {
      this.isClicked = false
      this.initailType = "text"
    }
    else if (this.isClicked === false) {
      this.isClicked = true
      this.initailType = "password"
    }
  }

  reset() {
    this.loginForm.reset();
    this.generateCaptcha();
  }

}
