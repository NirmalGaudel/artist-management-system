import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule} from '@angular/material/dialog';

@Component({
  selector: 'app-alert',
  imports: [MatButtonModule, MatDialogModule],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.scss'
})
export class AlertComponent {
  data = inject(MAT_DIALOG_DATA);
}