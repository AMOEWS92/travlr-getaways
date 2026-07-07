import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TripDataService } from '../services/trip-data.service';

@Component({
  selector: 'app-add-trip',
  templateUrl: './add-trip.component.html',
  styleUrls: ['./add-trip.component.css']
})
export class AddTripComponent implements OnInit {
  public addForm!: FormGroup;
  public submitted = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private trips: TripDataService
  ) {}

  ngOnInit(): void {
    this.addForm = this.fb.group({
      code: ['', Validators.required],
      name: ['', Validators.required],
      length: ['', Validators.required],
      start: ['', Validators.required],
      resort: ['', Validators.required],
      perPerson: ['', Validators.required],
      image: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  public onSubmit(): void {
    this.submitted = true;
    if (this.addForm.valid) {
      this.trips.addTrip(this.addForm.value).subscribe({
        next: () => this.router.navigate(['/']),
        error: err => console.error(err)
      });
    }
  }

  get f() {
    return this.addForm.controls;
  }
}