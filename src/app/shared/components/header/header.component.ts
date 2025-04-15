import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Input() title: string = '';
  @Input() showBackButton: boolean = true;
  @Input() showEndButton: boolean = false;
  @Input() endButtonIcon: string = 'ellipsis-vertical';
  @Output() endButtonClick = new EventEmitter<void>();
}