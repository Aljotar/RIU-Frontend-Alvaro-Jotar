import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root'})
export class LoadingService {

  private readonly _loadingSignal = signal(false);
  private _pendingRequest = 0;

  readonly loading = this._loadingSignal.asReadonly();

  show(): void {
    this._pendingRequest++;
    if(this._pendingRequest === 1) {
      this._loadingSignal.set(true);
    }
    
  }
  hide(): void {
    this._pendingRequest = Math.max(0, this._pendingRequest - 1);
    if(this._pendingRequest === 0) {
      this._loadingSignal.set(false);
    }
  }
}
