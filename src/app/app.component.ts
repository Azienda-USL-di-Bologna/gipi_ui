import { Component } from '@angular/core';
import { GlobalService } from './global-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [GlobalService]
})
export class AppComponent {
  title = 'app';
  constructor(private gs: GlobalService){

  }

  
}
