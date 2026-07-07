import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Trip } from '../models/trip';

@Component({
  selector: 'app-trip-card',
  templateUrl: './trip-card.component.html',
  styleUrls: ['./trip-card.component.css']
})
export class TripCardComponent {
  @Input('trip') set tripInput(value: Trip | undefined) {
    this.trip = value;
    this.safeDescription = value
      ? this.sanitizer.bypassSecurityTrustHtml(value.description)
      : '';
  }

  trip?: Trip;
  safeDescription: SafeHtml = '';

  constructor(private sanitizer: DomSanitizer) {}
}