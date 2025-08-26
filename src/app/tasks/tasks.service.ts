import {
  inject,
  Injectable,
  InjectionToken,
  signal,
  WritableSignal,
} from '@angular/core';
import { Task, TaskStatus } from './task.model';
import { LoggingService } from '../logging.service';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  private readonly loggingService = inject(LoggingService);
  private tasks = signal<Task[]>([]);

  allTasks = this.tasks.asReadonly();

  handleFilterTask(selectedFilter: WritableSignal<string>) {
    switch (selectedFilter().toLowerCase()) {
      case 'all':
        return this.allTasks();
      case 'open':
        return this.allTasks().filter((task) => task.status === 'OPEN');
      case 'in-progress':
        return this.allTasks().filter((task) => task.status === 'IN_PROGRESS');
      case 'done':
        return this.allTasks().filter((task) => task.status === 'DONE');
      default:
        return this.allTasks();
    }
  }

  onAddTask(taskData: Pick<Task, 'title' | 'description'>): void {
    const newTask: Task = {
      ...taskData,
      id: (this.tasks().length + 1).toString(),
      status: 'OPEN',
    };
    this.tasks.update((oldTasks) => [...oldTasks, newTask]);
    this.loggingService.log(`ADD: ${JSON.stringify(newTask)}`);
  }

  updateTaskStatus(taskId: string, newStatus: TaskStatus): void {
    this.tasks.update((oldTasks) =>
      oldTasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
    this.loggingService.log(`UPDATE STATUS: ${JSON.stringify(newStatus)}`);
  }
}

const TASKS_SERVICE = new InjectionToken<TasksService>('tasks-service-token');

export const TASKS_SERVICE_PROVIDER = {
  provide: TASKS_SERVICE,
  useClass: TasksService,
};
