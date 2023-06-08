import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  Observable,
  Subscription,
  combineLatest,
  distinctUntilChanged,
  map,
  switchMap,
  tap,
} from 'rxjs';
import { DialogService } from '../../services/dialog.service';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogComponent implements OnInit, OnDestroy {
  public form!: FormGroup;
  public existingEmails$!: Observable<string[]>;
  public duplicateEmails$!: Observable<string[]>;
  public newAllEmails$!: Observable<string[]>;

  private submitSubscription!: Subscription;

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

  ngOnInit() {
    this.initialize();
  }

  ngOnDestroy(): void {
    if (this.submitSubscription) {
      this.submitSubscription.unsubscribe();
    }
    this.dialogService.nextEmptyIntoNewEmails();

    this.checkboxState.reset();
    // this.dialogService.toggleDialogState(false);

    console.log('fall of the house ');
  }

  get checkboxState() {
    return this.form.get('saveAllCheckbox');
  }

  handleSubmit() {
    this.submitSubscription = combineLatest([
      this.newAllEmails$,
      this.existingEmails$,
    ])
      .pipe(
        map(([newEms, existingEms]) => [newEms, existingEms]),
        tap(([newEms, existingEms]) => {
          if (this.checkboxState.value === true) {
            this.dialogService.writeToExistingEmails(newEms);
            // this.closeDialog();
          } else {
            const filteredNew = [...new Set(newEms)].filter(
              (em) => !existingEms.includes(em)
            );
            this.dialogService.writeToExistingEmails(filteredNew);
            // this.closeDialog();
          }
          this.closeDialog();
        })
      )
      .subscribe();
  }

  private closeDialog() {
    this.dialogRef.close();
  }

  private initialize() {
    this.existingEmails$ = this.dialogService.existing$;
    this.duplicateEmails$ = this.dialogService.duplicates$;
    this.newAllEmails$ = this.dialogService.newEmails$;
  }
}
