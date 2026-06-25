import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IntentService } from '../../../../core/services/intent.service';

@Component({
  selector: 'app-intents-stats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats-cards.component.html',
  styleUrl: './stats-cards.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IntentsStatsComponent {
  readonly intentService = inject(IntentService);
}
