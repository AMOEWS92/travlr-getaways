import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TripDataService } from '../services/trip-data.service';

function toDateInputValue(isoOrDate: string | Date) {
  if (!isoOrDate) return '';
  const d = new Date(isoOrDate);
  const off = d.getTimezoneOffset();
  const local = new Date(d.getTime() - off * 60000);
  return local.toISOString().slice(0, 10); // yyyy-MM-dd for <input type="date">
}

@Component({
  selector: 'app-edit-trip',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './edit-trip.component.html'
})
export class EditTripComponent implements OnInit {
  editForm!: FormGroup;
  submitted = false;
  id!: string;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private trips: TripDataService
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id')!;

    this.editForm = this.fb.group({
      code: ['', Validators.required],
      name: ['', Validators.required],
      length: ['', Validators.required],
      start: ['', Validators.required],
      resort: ['', Validators.required],
      perPerson: ['', Validators.required],
      image: ['', Validators.required],
      description: ['', Validators.required]
    });

    // load existing trip and patch the form
    this.trips.getTrip(this.id).subscribe({
      next: (t: any) => {
        const data = Array.isArray(t) ? t[0] : t;
        if (data?.start) data.start = toDateInputValue(data.start);
        this.editForm.patchValue(data);
      },
      error: (err) => console.error('getTrip failed:', err)
    });
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.editForm.invalid) return;

    this.trips.updateTrip(this.id, this.editForm.value).subscribe({
      next: () => this.router.navigate(['/']),
      error: (err) => console.error('updateTrip failed:', err)
    });
  }
}