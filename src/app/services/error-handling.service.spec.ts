import { TestBed } from '@angular/core/testing';
import { ErrorHandlingService } from './error-handling.service';
import { NotificationService } from './notification.service';
import { LoggerService } from './logger.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationMessages } from '../notification.enum';

describe('ErrorHandlingService', () => {
  let service: ErrorHandlingService;
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;
  let loggerServiceSpy: jasmine.SpyObj<LoggerService>;

  beforeEach(() => {
    const notificationSpy = jasmine.createSpyObj('NotificationService', ['showError']);
    const loggerSpy = jasmine.createSpyObj('LoggerService', ['error']);

    TestBed.configureTestingModule({
      providers: [
        ErrorHandlingService,
        { provide: NotificationService, useValue: notificationSpy },
        { provide: LoggerService, useValue: loggerSpy }
      ]
    });

    service = TestBed.inject(ErrorHandlingService);
    notificationServiceSpy = TestBed.inject(NotificationService) as jasmine.SpyObj<NotificationService>;
    loggerServiceSpy = TestBed.inject(LoggerService) as jasmine.SpyObj<LoggerService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('handleNonApiError', () => {
    it('should handle Error objects correctly', () => {
      const error = new Error('Test error');
      const context = 'TestContext';

      service.handleNonApiError(error, context);

      expect(loggerServiceSpy.error).toHaveBeenCalledWith(
        '[TestContext] Test error',
        error
      );
    });

    it('should handle unknown error types', () => {
      const error = 'Unknown error type';
      const context = 'TestContext';

      service.handleNonApiError(error, context);

      expect(loggerServiceSpy.error).toHaveBeenCalledWith(
        '[TestContext] An unknown error occurred',
        error
      );
    });
  });

  describe('handleError', () => {
    it('should handle HttpErrorResponse with api_error_code 1026', () => {
      const httpError = new HttpErrorResponse({
        error: {
          api_error_code: 1026,
          message: 'Test error message'
        }
      });
      const context = 'TestContext';

      service.handleError(httpError, context);

      expect(notificationServiceSpy.showError).toHaveBeenCalledWith(
        NotificationMessages.ENTITY_NAME_ALREADY_EXISTS,
        'Error'
      );
    });

    it('should handle HttpErrorResponse with custom error message', () => {
      const httpError = new HttpErrorResponse({
        error: {
          message: 'Custom error message'
        },
        status: 400,
        statusText: 'Bad Request',
        url: 'http://test.com/api'
      });
      const context = 'TestContext';

      service.handleError(httpError, context);

      expect(notificationServiceSpy.showError).toHaveBeenCalledWith(
        'Custom error message',
        'Error'
      );
    });

    it('should handle generic Error objects', () => {
      const error = new Error('Generic error message');
      const context = 'TestContext';

      service.handleError(error, context);

      expect(notificationServiceSpy.showError).toHaveBeenCalledWith(
        'Generic error message',
        'Error'
      );
    });

    it('should handle Error objects with no message', () => {
      const error = new Error('');
      const context = 'TestContext';

      service.handleError(error, context);

      expect(notificationServiceSpy.showError).toHaveBeenCalledWith(
        NotificationMessages.GENERIC_ERROR,
        'Error'
      );
    });
  });
}); 