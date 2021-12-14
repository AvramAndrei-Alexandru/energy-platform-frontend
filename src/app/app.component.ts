import { Component, OnDestroy, OnInit } from '@angular/core';
import { MessagingService } from './services/messaging.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'EnergyVisualizationPlatform';

  constructor(private _messagingService: MessagingService) { }

  public ngOnDestroy(): void {
    //this._messagingService.stop();
  }

  public ngOnInit(): void {
    //this._messagingService.start();
  }
  

}
