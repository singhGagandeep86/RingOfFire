import { Component } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-edit-player',
  imports: [MatDialogModule, MatButton],
  templateUrl: './edit-player.component.html',
  styleUrl: './edit-player.component.scss'
})
export class EditPlayerComponent {

  allProfilePics = ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg',];

  constructor(private dialogRef: MatDialogRef<EditPlayerComponent>) {}

  onNoClick() {
    this.dialogRef.close();
  }
}
