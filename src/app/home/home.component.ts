import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { BooksService } from '../books.service';

export interface IBook {
  id: string;
  name: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {
  error: any;
  books: IBook[];
  selectedBook1 = null;
  selectedBook2 = null;
  tab = 'general';
  videoBlob: any;

  constructor(
    private sanitizer: DomSanitizer,
    private booksService: BooksService,
  ) {
    this.start();

  }

  settings = {
    screenWidth: 800,
    screenHeight: 600,
    bgColor: '#000',
    backgroundImage: '',
    showVideo: false,
    backgroundVideo: null,
    overlayImage: '',

    title1: '',
    title1Color: '#fff',
    title1FontSize: 300,
    title1TextAlign: 'center',
    title1Font: '',
    title1Top: 15,
    title1Left: 4,
    title1Right: 4,

    title2: '',
    title2Color: '#fff',
    title2FontSize: 300,
    title2TextAlign: 'center',
    title2Font: '',
    title2Top: 30,
    title2Left: 4,
    title2Right: 4,

    verse1Book: '',
    verse1Reference: '',
    verse1Color: '#fff',
    verse1FontSize: 250,
    verse1TextAlign: 'center',
    verse1Font: '',
    verse1Bottom: 20,
    verse1Left: 4,
    verse1Right: 4,

    verse2Book: '',
    verse2Reference: '',
    verse2Color: '#fff',
    verse2FontSize: 250,
    verse2TextAlign: 'center',
    verse2Font: '',
    verse2Bottom: 10,
    verse2Left: 4,
    verse2Right: 4

  };

  // styles
  styleBackgroundImage = {
    'background-color': this.settings.bgColor,
    'background-image': `url('${this.settings.backgroundImage}')`
  };

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
    }
  }

  handleFileInput(files: FileList) {
    const file = files.item(0);

    if (file) {
      const fileBlob = URL.createObjectURL(file);
      console.log('Selected file:', fileBlob);
      this.settings.backgroundVideo = fileBlob;

      this.videoBlob = this.sanitizer.bypassSecurityTrustUrl(fileBlob);
      this.settings.showVideo = true;
    }
  }

  handleVerse1Selection(selected: string) {
    if (selected) {
      const selectedBook = this.books.filter((book: IBook) => book.id === selected);
      this.settings.verse1Book = selectedBook[0].name;
    } else {
      this.settings.verse1Book = '';
    }
  }

  handleVerse2Selection(selected: string) {
    if (selected) {
      const selectedBook = this.books.filter((book: IBook) => book.id === selected);
      this.settings.verse2Book = selectedBook[0].name;
    } else {
      this.settings.verse2Book = '';
    }
  }

  ngOnInit() {

    this.getBooks();
    // Set initials to local storage
    localStorage.setItem('settings', JSON.stringify(this.settings));

    // this.videoData.currentVideo.subscribe(data => this.backgroundVideoData = data);
  }

  // clone the data object, using its known IBook shape
  getBooks() {
    this.booksService.getAllBooks()
      .subscribe(
        (data: IBook[]) => this.books = data, // success
        error => this.error = error // error path
      );
  }

  save(data) {
    // save all settings to localStorage
    localStorage.setItem('settings', JSON.stringify(data));
  }
}
