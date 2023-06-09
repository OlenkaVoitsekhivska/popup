import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {
  ChangeDetectionStrategy,
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormComponent implements OnInit, OnDestroy {
  @ViewChild('input') input: ElementRef<HTMLInputElement> | undefined =
    undefined;

  public newEmails: Observable<string[]>;
  public existingEmailsForDisplay: Observable<string[]>;
  public duplicateEmails: Observable<string[]>;
  public chipConfig = {
    isEditable: true,
  };
  public form: FormGroup;
  public emailChips: string[] = [];
  public addOnBlur = true;
  public readonly separatorKeysCodes = [ENTER, COMMA] as const;

  private dialogSubscription: Subscription;
  private emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  constructor(
    private fb: FormBuilder,
    private dialogService: DialogService,
    public dialog: MatDialog
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.initialize();

    this.dialogSubscription = this.dialogService.showDialog$.subscribe(
      (data) => {
        if (data === true) {
          this.openDialog();
        } else {
          this.dialogService.writeToExistingEmails(this.emailsField?.value);
        }
      }
    );
  }

  ngOnDestroy(): void {
    if (this.dialogSubscription) {
      this.dialogSubscription.unsubscribe();
    }
  }

  get emailsField() {
    return this.form.get('emailsField');
  }

  handleSubmitClick() {
    this.dialogService.handleEmailsArray(this.emailsField?.value);

    this.clear();
    this.form.reset();
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    // Add email
    if (value && this.validateEmail(value)) {
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

  private initialize(): void {
    this.newEmails = this.dialogService.newEmails$;
    this.existingEmailsForDisplay = this.dialogService.existingForDisplay$;
    this.duplicateEmails = this.dialogService.duplicates$;
  }

  private initializeForm(): void {
    this.form = this.fb.group({
      emailsField: [[], [Validators.required, Validators.email]],
    });
  }
  private validateEmail(email: string): boolean {
    return this.emailPattern.test(email);
  }

  private openDialog(): void {
    this.dialog.open(DialogComponent, {
      width: '70%',
    });
  }

  private clear() {
    this.emailChips = [];

    if (this.input) {
      this.input.nativeElement.value = '';
    }
  }
}
