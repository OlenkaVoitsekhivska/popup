import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Subject,
  distinctUntilChanged,
  shareReplay,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  private existingEmails = [
    'johndoe@example.com',
    'alice.smith@example.com',
    'markwilson@example.com',
    'emilyjones@example.com',
    'davidbrown@example.com',
  ];
  private existingForDisplay = new BehaviorSubject<string[]>(
    this.existingEmails
  );

  public existingForDisplay$ = this.existingForDisplay.asObservable();

  showDialog = new BehaviorSubject<boolean>(false);
  public showDialog$ = this.showDialog.asObservable();

  private newEmail = new BehaviorSubject<string[]>([]);
  public newEmails$ = this.newEmail.asObservable();

  private duplicates = new BehaviorSubject<string[]>([]);
  public duplicates$ = this.duplicates.asObservable();

  private existing = new BehaviorSubject<string[]>([]);
  public existing$ = this.existing.asObservable();

  constructor() {}

  toggleDialogState(value: boolean): void {
    this.showDialog.next(value);
  }

  nextEmptyIntoNewEmails() {
    this.newEmail.next([]);
  }

  handleEmailsArray(emails: string[]) {
    this.newEmail.next(emails);

    const duplicates = this.findDuplicateEmails(emails);
    this.duplicates.next(duplicates);

    const existing = this.findCommonEmails(this.existingEmails, emails);
    this.existing.next(existing);

    if (!duplicates.length && !existing.length) {
      this.showDialog.next(false);
    }

    if (duplicates.length > 0 || existing.length > 0) {
      console.log('dialog condition from service');
      this.showDialog.next(true);
    }
  }

  findDuplicateEmails(emails: string[]): string[] {
    let duplicateEmails: string[] = [];
    const uniqueEmails = new Set<string>();

    for (const email of emails) {
      if (uniqueEmails.has(email)) {
        duplicateEmails = [...duplicateEmails, email];
        uniqueEmails.delete(email);
      } else {
        uniqueEmails.add(email);
      }
    }

    return duplicateEmails;
  }

  findCommonEmails(existingEmails: string[], newEmails: string[]): string[] {
    const commonEmails: string[] = [];

    for (const email of newEmails) {
      if (existingEmails.includes(email)) {
        commonEmails.push(email);
      }
    }
    return [...new Set(commonEmails)];
  }

  writeToExistingEmails(emails: string[]) {
    this.existingEmails = [...this.existingEmails, ...emails];
    this.existingForDisplay.next(this.existingEmails);
  }
}
