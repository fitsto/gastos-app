import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-category-chip',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './category-chip.component.html',
  styleUrls: ['./category-chip.component.scss']
})
export class CategoryChipComponent {
  @Input() name: string = '';
  @Input() color: string = '#757575';
  @Input() selected: boolean = false;
}
