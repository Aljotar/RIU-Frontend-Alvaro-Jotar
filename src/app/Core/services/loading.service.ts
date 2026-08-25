import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root'})
export class LoadingService {

  private readonly loadingSignal = signal(false);
  private pendingRequest = 0;

  readonly loading = this.loadingSignal.asReadonly();

  show(): void {
    this.pendingRequest++;
    if(this.pendingRequest === 1) {
      this.loadingSignal.set(true);
    }
    
  }
  hide(): void {
    this.pendingRequest = Math.max(0, this.pendingRequest - 1);
    if(this.pendingRequest === 0) {
      this.loadingSignal.set(false);
    }
  }
}
