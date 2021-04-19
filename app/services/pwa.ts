import { Injectable } from '@angular/core';
import { timer } from 'rxjs';
import { take } from 'rxjs/operators';
import { PromptComponent } from '../components/prompt/prompt.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Platform } from '@angular/cdk/platform';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PwaService {
  private promptEvent: any;

  constructor(
    private bottomSheet: MatBottomSheet,
    private platform: Platform
  ) { 
    // this.openPromptComponent('ios');
  }

  initPwaPrompt() {
    // if (this.platform.ANDROID) {
    //   window.addEventListener('beforeinstallprompt', (event: any) => {
    //     event.preventDefault();
    //     this.promptEvent = event;
    //     this.openPromptComponent('android');
    //   });
    // }
    // if (this.platform.isBrowser) {
    //   window.addEventListener('beforeinstallprompt', (event: any) => {
    //     event.preventDefault();
    //     this.promptEvent = event;
    //     this.openPromptComponent('android');
    //   });
    // }
    if (this.platform.IOS) {
      const isInStandaloneMode = ('standalone' in window.navigator) && (window.navigator['standalone']);
      if (!isInStandaloneMode) {
        this.openPromptComponent('ios');
      }
    } else {
      window.addEventListener('beforeinstallprompt', (event: any) => {
        event.preventDefault();
        this.promptEvent = event;
        this.openPromptComponent('android');
      });
    }
  }

  openPromptComponent(mobileType: 'ios' | 'android') {
    // if (environment.production) {
    if (true) {
      timer(3000)
        .pipe(take(1))
        .subscribe(() => {
          this.bottomSheet.open(PromptComponent, { data: { mobileType, promptEvent: this.promptEvent } });
        });
    }
  }
}