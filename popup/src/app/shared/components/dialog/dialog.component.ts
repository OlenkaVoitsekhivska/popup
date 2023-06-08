import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  Observable,
  Subscription,
  combineLatest,
  finalize,
  map,
  switchMap,
  tap,
} from 'rxjs';
import { DialogService } from '../../services/dialog.service';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  existingEmails$!: Observable<string[]>;
  duplicateEmails$!: Observable<string[]>;
  newAllEmails$!: Observable<string[]>;

  submitSubscription!: Subscription;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private dialogService: DialogService,
    private dialogRef: MatDialogRef<DialogComponent>
  ) {
    this.form = this.fb.group({
      saveAllCheckbox: false,
    });
  }

  get checkboxState() {
    return this.form.get('saveAllCheckbox');
  }

  ngOnInit() {
    this.existingEmails$ = this.dialogService.existing$;
    this.duplicateEmails$ = this.dialogService.duplicates$;
    this.newAllEmails$ = this.dialogService.newEmails$;
  }

  handleSubmit() {
    this.submitSubscription = combineLatest([
      this.newAllEmails$,
      this.existingEmails$,
      this.duplicateEmails$,
    ])
      .pipe(
        map(([newEms, existingEms, duplicateEms]) => [
          newEms,
          existingEms,
          duplicateEms,
        ]),
        tap(([newEms, existingEms]) => {
          if (this.checkboxState?.value === true) {
            this.dialogService.writeToExistingEmails(newEms);
          } else {
            const filteredNew = [...new Set(newEms)].filter(
              (em) => !existingEms.includes(em)
            );
            this.dialogService.writeToExistingEmails(filteredNew);
          }

          this.closeDialog();
        })
      )
      .subscribe();
  }

  closeDialog() {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    if (this.submitSubscription) {
      this.submitSubscription.unsubscribe();
    }
  }
}
