
// https://stackoverflow.com/questions/35397198/how-can-i-watch-for-changes-to-localstorage-in-angular2

import { Component, OnInit, HostListener } from '@angular/core';
import { Subject } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-screen',
  templateUrl: './screen.component.html',
  styleUrls: ['./screen.component.scss']
})

export class ScreenComponent implements OnInit {

  settings = null;
  videoBlob: any;

  constructor(
    private sanitizer: DomSanitizer
  ) {
    this.start();
  }

  private onSubject = new Subject<{ key: string, value: any }>();

  private start(): void {
    window.addEventListener('storage', this.storageEventListener.bind(this));
  }

  private storageEventListener(event: StorageEvent) {
    if (event.storageArea === localStorage) {
      let v;
      try { v = JSON.parse(event.newValue); } catch (e) { v = event.newValue; }
      this.onSubject.next({ key: event.key, value: v });
      this.settings = v;

      // Handle Video
      this.setVideoFromBlob();
    }
  }

  // Listen to screen resize event and set size
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.setSize(event.target.innerWidth, event.target.innerHeight);

    this.setVideoFromBlob();
  }

  ngOnInit() {
    this.settings = this.getStorageSettings();
    this.setSize(window.innerWidth, window.innerHeight);
  }

  setVideoFromBlob() {
    if (this.settings.backgroundVideo) {
      this.videoBlob = this.sanitizer.bypassSecurityTrustUrl(this.settings.backgroundVideo);
    }
  }

  getStorageSettings() {
    const storage = JSON.parse(localStorage.getItem('settings'));
    return storage ? storage : {};
  }

  // Update window size to localStorage
  setSize(width: number, height: number) {
    const storage = this.getStorageSettings();
    storage['screenWidth'] = width;
    storage['screenHeight'] = height;
    localStorage.setItem('settings', JSON.stringify(storage));
  }

}
