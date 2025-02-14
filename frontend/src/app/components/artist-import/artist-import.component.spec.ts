import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtistImportComponent } from './artist-import.component';

describe('ArtistImportComponent', () => {
  let component: ArtistImportComponent;
  let fixture: ComponentFixture<ArtistImportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArtistImportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArtistImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
