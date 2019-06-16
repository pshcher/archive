import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, pipe } from 'rxjs';
import { tap } from 'rxjs/operators';
import { delay } from 'rxjs/operators';
import { LoaderService } from './loader.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { MessageService } from './message.service';
import { AlertType } from './models/misc';
@Injectable({
  providedIn: 'root'
})
export class LoaderInterceptorService implements HttpInterceptor {
  constructor(private loaderService: LoaderService, private spinnerService: Ng4LoadingSpinnerService,
    private messageService: MessageService) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.showLoader();
    return next.handle(req)
      .pipe(
        delay(2000),
        tap((event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            this.onEnd();
          }
        },
          (err: any) => {
            this.onEnd();
          }
        )
      );
  }
  private onEnd(): void {
    this.hideLoader();
    this.messageService.add(
      { Message: "Just Finished HTTP Request, thank YOU for waiting.", Type: AlertType.Info });

    //todo: for tests
    this.messageService.add(
      { Message: "Another Alert.", Type: AlertType.Error });

    this.messageService.add(
      { Message: "Another Alert.", Type: AlertType.Warning });
  }
  private showLoader(): void {
    this.loaderService.show();
    this.spinnerService.show();
  }
  private hideLoader(): void {
    this.loaderService.hide();
    this.spinnerService.hide();
  }
}
