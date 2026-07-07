export interface Trip {
  _id?: string;

  // Readable identifier used by the API for trip detail, update, and delete routes.
  code: string;

  name: string;

  // Stored as display text, such as "4 nights / 5 days".
  length: string;

  // ISO date string returned by the API.
  start: string;

  resort: string;

  // Stored as display text, such as "$999.00".
  perPerson: string;

  image: string;

  // HTML-formatted description text returned by the API.
  description: string;
}