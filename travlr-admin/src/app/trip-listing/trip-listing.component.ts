import { Component, OnInit } from '@angular/core';
import { TripDataService } from '../services/trip-data.service';
import { Trip } from '../models/trip';

@Component({
  selector: 'app-trip-listing',
  templateUrl: './trip-listing.component.html',
  styleUrls: ['./trip-listing.component.css']
})
export class TripListingComponent implements OnInit {
  trips: Trip[] = [];
  loading = true;
  error = '';

  constructor(private tripDataService: TripDataService) {}

  ngOnInit(): void {
    this.tripDataService.getTrips().subscribe({
      next: (data) => {
        this.trips = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching trips:', err);
        this.error = 'Failed to load trips.';
        this.loading = false;
      }
    });
  }

  onDelete(code: string): void {
    if (confirm('Are you sure you want to delete this trip?')) {
      this.tripDataService.deleteTrip(code).subscribe({
        next: () => {
          this.trips = this.trips.filter(t => t._id !== code);
        },
        error: (err) => {
          console.error('Error deleting trip:', err);
          this.error = 'Failed to delete trip.';
        }
      });
    }
  }
}