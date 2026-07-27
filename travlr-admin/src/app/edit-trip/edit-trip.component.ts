import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { TripDataService } from '../services/trip-data.service';

function toDateInputValue(isoOrDate: string | Date): string {
  const date = new Date(isoOrDate);
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60000);

  return localDate.toISOString().slice(0, 10);
}

function nonNegativeCurrencyValidator(
  control: AbstractControl
): ValidationErrors | null {
  const rawValue = String(control.value ?? '').trim();

  if (!rawValue) {
    return null;
  }

  const normalizedValue = rawValue.replace(/[$,]/g, '');
  const numericValue = Number(normalizedValue);

  if (Number.isNaN(numericValue) || numericValue < 0) {
    return { invalidCurrency: true };
  }

  return null;
}

@Component({
  selector: 'app-edit-trip',
  templateUrl: './edit-trip.component.html',
  styleUrls: ['./edit-trip.component.css']
})
export class EditTripComponent implements OnInit {
  editForm!: FormGroup;
  submitted = false;
  isLoading = true;
  isSaving = false;

  successMessage = '';
  errorMessage = '';

  private tripCode = '';

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly trips: TripDataService
  ) {}

  ngOnInit(): void {
    const routeTripCode = this.route.snapshot.paramMap.get('tripCode');

    if (!routeTripCode) {
      this.errorMessage = 'No trip identifier was provided.';
      this.isLoading = false;
      return;
    }

    this.tripCode = routeTripCode;

    this.editForm = this.fb.group({
      code: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(20)
        ]
      ],

      name: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(100)
        ]
      ],

      length: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50)
        ]
      ],

      start: ['', Validators.required],

      resort: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(100)
        ]
      ],

      perPerson: [
        '',
        [
          Validators.required,
          nonNegativeCurrencyValidator
        ]
      ],

      image: [
        '',
        [
          Validators.required,
          Validators.maxLength(255)
        ]
      ],

      description: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(2000)
        ]
      ]
    });

    this.loadTrip();
  }

  get formControls(): { [key: string]: AbstractControl } {
    return this.editForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    this.successMessage = '';
    this.errorMessage = '';

    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      this.errorMessage =
        'Please correct the highlighted fields before saving.';
      return;
    }

    this.isSaving = true;

    this.trips.updateTrip(this.tripCode, this.editForm.value).subscribe({
      next: () => {
        this.isSaving = false;
        this.successMessage = 'Trip updated successfully.';
        this.errorMessage = '';

        setTimeout(() => {
          this.router.navigate(['/']);
        }, 3000);
      },

      error: (error: unknown) => {
        console.error('updateTrip failed', error);
        this.isSaving = false;
        this.errorMessage =
          'This trip could not be updated. Please try again.';
      }
    });
  }

  private loadTrip(): void {
    this.trips.getTrip(this.tripCode).subscribe({
      next: (tripResponse: unknown) => {
        console.log('Trip API response:', tripResponse);

        const trip = Array.isArray(tripResponse)
          ? tripResponse[0]
          : tripResponse;

        if (!trip || typeof trip !== 'object') {
          this.errorMessage = 'The requested trip could not be found.';
          this.isLoading = false;
          return;
        }

        const tripData = { ...trip } as Record<string, unknown>;

        if (tripData['start']) {
          tripData['start'] = toDateInputValue(
            tripData['start'] as string | Date
          );
        }

        this.editForm.patchValue(tripData);
        this.isLoading = false;
      },

      error: (error: unknown) => {
        console.error('getTrip failed', error);
        this.errorMessage = 'The trip data could not be loaded.';
        this.isLoading = false;
      }
    });
  }
}