import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatChipEditedEvent, MatChipInputEvent } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subscription } from 'rxjs';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';
import { DialogService } from 'src/app/shared/services/dialog.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit, OnDestroy {
  @ViewChild('input') input!: ElementRef;

  newEmails!: Observable<string[]>;
  existingEmailsForDisplay!: Observable<string[]>;
  duplicateEmails!: Observable<string[]>;

  form!: FormGroup;
  shouldOpenDialog!: Observable<boolean>;
  dialogSubscription!: Subscription;

  emailChips: string[] = [];
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  constructor(
    private fb: FormBuilder,
    private dialogService: DialogService,
    public dialog: MatDialog
  ) {
    this.form = this.fb.group({
      emailsField: [[], [Validators.required, Validators.email]],
    });
  }

  ngOnInit(): void {
    this.newEmails = this.dialogService.newEmails$;
    this.existingEmailsForDisplay = this.dialogService.existingForDisplay$;
    this.duplicateEmails = this.dialogService.duplicates$;
    this.shouldOpenDialog = this.dialogService.showDialog$;
  }

  get emailsField() {
    return this.form.get('emailsField');
  }

  validateEmail(email: string, pattern: RegExp): boolean {
    return pattern.test(email);
  }

  handleSubmitClick() {
    this.dialogService.handleEmailsArray(this.emailsField?.value);
    this.dialogSubscription = this.shouldOpenDialog.subscribe((data) => {
      if (data === true) {
        this.openDialog();
      } else {
        this.dialogService.writeToExistingEmails(this.emailsField?.value);
      }
    });
    this.clear();
    this.form.reset();
  }

  openDialog(): void {
    this.dialog.open(DialogComponent, {
      width: '70%',
    });
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    // Add email
    if (value && this.validateEmail(value, this.emailPattern)) {
      this.emailChips.push(value);
    }
    // Clear the input value
    event.chipInput!.clear();
  }

  remove(email: string): void {
    const index = this.emailChips.indexOf(email);

    if (index >= 0) {
      this.emailChips.splice(index, 1);
    }
  }

  edit(email: string, event: MatChipEditedEvent) {
    const value = event.value.trim();

    // Remove email if it no longer has a name
    if (!value) {
      this.remove(email);
      return;
    }

    // Edit existing email
    const index = this.emailChips.indexOf(email);
    if (index >= 0) {
      this.emailChips[index] = value;
    }
  }

  clear() {
    this.emailChips = [];
    this.input.nativeElement.value = '';
  }

  ngOnDestroy(): void {
    if (this.dialogSubscription) {
      this.dialogSubscription.unsubscribe();
    }
  }
}
