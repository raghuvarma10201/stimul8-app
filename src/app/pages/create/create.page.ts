import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorHandlingService } from 'src/app/services/error-handling.service';
import { CommonService } from 'src/app/services/common.service';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
})
export class CreatePage implements OnInit {
  entityType: string = '';
  entityForm!: FormGroup;

  constructor(private route: ActivatedRoute, private fb: FormBuilder, private commonService: CommonService, private errorHandlingService: ErrorHandlingService, private loader: LoaderService, private router: Router) {}

  ngOnInit() {
    this.entityType = this.route.snapshot.paramMap.get('entity') || 'channel';
    this.initForm();
  }

  private noSpecialCharacters(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern = /^[a-zA-Z0-9\s]*$/;
      const valid = pattern.test(control.value);
      return valid ? null : { specialCharacters: true };
    };
  }

  private initForm(): void {
    this.entityForm = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
          this.noSpecialCharacters(),
        ],
      ],
      description: [
        '',
        [
          Validators.required,
          Validators.minLength(50),
          Validators.maxLength(100),
        ],
      ],
    });
  }

  onSubmit() {

    this.loader.loadingPresent();
   
    if (this.entityForm.valid) {
      console.log(`Creating ${this.entityType}:`, this.entityForm.value);
      // You can now send the form to your backend
      this.commonService.createEntity(this.entityType, this.entityForm.value).pipe(finalize(() => this.loader.loadingDismiss())).subscribe({
        next: (response: any) => {
          if(response){
            this.router.navigate(['/'+this.entityType.toLowerCase()+'s']);
          }
        },
        error: (error: any) => {
          this.errorHandlingService.handleError(error, 'CreatePage.onSubmit');
        }
      });
    } else {
      this.entityForm.markAllAsTouched(); // Show validation errors
      this.loader.loadingDismiss();
    }
  }

  get f() {
    return this.entityForm.controls;
  }
}
