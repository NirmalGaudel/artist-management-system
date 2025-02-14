import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';

export const globalModules = [
  CommonModule,
  RouterModule,
  FormsModule,
  ReactiveFormsModule,
];

export const materialModules = [
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule,
  MatSelectModule,
  MatIconModule,
  MatOptionModule,
  MatToolbarModule,
  MatMenuModule,
  MatTooltipModule
];
