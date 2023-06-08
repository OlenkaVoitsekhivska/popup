import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent {
  @Input() public label: string = '';
  @Input() public color: string = 'primary';

  @Output() private customSubmit = new EventEmitter<void>();

  handleClick() {
    this.customSubmit.emit();
  }
}
