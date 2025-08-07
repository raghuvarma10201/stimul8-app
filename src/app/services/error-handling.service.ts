/*===============================================================================
File Name: error-handling.service.ts
Description:
    This file provides a comprehensive interface for managing error handling service with the following capabilities and testing: 

Author(s):
    Naresh        
  
Version History:
    - v1 (04-Mar-2025):     

License:      
    This software is proprietary and is not open source.   
    Unauthorized copying, distribution, modification, or use of this file,        
    via any medium, is strictly prohibited unless expressly authorized by           
    stimul8.ai Inc. A valid license must be purchased
    and is required for lawful use of this software.  

    For licensing inquiries, please contact: [license@stimul8.ai] 
    All rights reserved. Unauthorized copying of this file, via any medium,     
    is strictly prohibited. Proprietary and confidential.   
===============================================================================  
*/

import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationMessages } from '../shared/notification.enum';
import { ToastService } from './toast.service';
@Injectable({
  providedIn: 'root',
})
export class ErrorHandlingService {
  constructor(
    private notificationService: ToastService
  ) {}

  handleNonApiError(error: unknown, context: string): void {
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';
    //this.logger.error(`[${context}] ${errorMessage}`, error);
    // Add additional error handling logic here (e.g., showing toast notifications)
  }

  handleError(error: HttpErrorResponse | Error, context: string): void {
    console.error(`Error in ${context}:`, error);

    if (error instanceof HttpErrorResponse) {
      this.handleHttpError(error);
    } else {
      this.handleGenericError(error);
    }
  }

  private handleHttpError(error: HttpErrorResponse): void {
    const apiErrorCode = error.error?.api_error_code;
    const errorMessage =
      error.error?.message || error.error?.detail || error.message || '';

    if (apiErrorCode === 1026) {
      this.notificationService.showError(
        NotificationMessages.ENTITY_NAME_ALREADY_EXISTS,
        'Error'
      );
    } else {
      this.notificationService.showError(errorMessage, 'Error');
    }
  }

  private handleGenericError(error: Error): void {
    this.notificationService.showError(
      error.message || NotificationMessages.GENERIC_ERROR,
      'Error'
    );
  }
}
