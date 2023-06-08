import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-chip-list-static',
  templateUrl: './chip-list-static.component.html',
  styleUrls: ['./chip-list-static.component.scss'],
})
export class ChipListStaticComponent {
  @Input() emails: string[] = [];
}
