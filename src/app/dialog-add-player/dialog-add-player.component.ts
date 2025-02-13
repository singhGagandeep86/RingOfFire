import { Component } from '@angular/core';
import {MatInput, MatInputModule} from '@angular/material/input';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';



@Component({
  selector: 'app-dialog-add-player',
  imports: [MatInputModule, MatDialogModule, FormsModule, MatButton],
  templateUrl: './dialog-add-player.component.html',
  styleUrl: './dialog-add-player.component.scss'
})
export class DialogAddPlayerComponent {

  name: string = '';

  constructor(private dialogRef: MatDialogRef<DialogAddPlayerComponent>) {}

  onNoClick(){
    this.dialogRef.close();
  }

}
