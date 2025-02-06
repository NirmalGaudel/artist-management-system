import { Component } from '@angular/core';
import { LoadingService } from '../../services/loading.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.scss',
  imports: [CommonModule],
})
export class LoadingComponent {
  constructor(public loadingService: LoadingService) {}
}
