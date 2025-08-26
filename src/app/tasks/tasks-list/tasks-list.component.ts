import { Component, computed, inject, signal } from '@angular/core';

import { TASK_STATUS_OPTIONS, taskStatusOptionsProvider } from '../task.model';
import { TasksService } from '../tasks.service';
import { TaskItemComponent } from './task-item/task-item.component';

@Component({
  selector: 'app-tasks-list',
  standalone: true,
  templateUrl: './tasks-list.component.html',
  styleUrl: './tasks-list.component.css',
  imports: [TaskItemComponent],
  providers: [taskStatusOptionsProvider],
})
export class TasksListComponent {
  private tasksService = inject(TasksService);
  private selectedFilter = signal<string>('all');
  taskStatuOptions = inject(TASK_STATUS_OPTIONS);

  tasks = computed(() => {
    return this.tasksService.handleFilterTask(this.selectedFilter);
  });

  onChangeTasksFilter(filter: string) {
    this.selectedFilter.set(filter);
  }
}
