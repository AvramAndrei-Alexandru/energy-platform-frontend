import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PowerPeakMessage } from 'src/app/models/messaging-models';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-dialog-component',
  templateUrl: './dialog-component.component.html',
  styleUrls: ['./dialog-component.component.scss']
})
export class DialogComponentComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DialogComponentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PowerPeakMessage,
    public datePipe: DatePipe
  ) { }

  ngOnInit(): void {
  }

}
