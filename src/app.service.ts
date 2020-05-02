import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Subject } from 'rxjs';

@Injectable()
export class AppService implements OnModuleDestroy {
  // Create an rxjs Subject that your application can subscribe to
  private shutdownListener$: Subject<void> = new Subject();

  onApplicationShutdown(signal: string) {
    console.log('SHUTDOWN');
    console.log(signal); // e.g. "SIGINT"
    this.shutdownListener$.next();
  }
  // Subscribe to the shutdown in your main.ts
  subscribeToShutdown(shutdownFn: () => void): void {
    this.shutdownListener$.subscribe(() => shutdownFn());
  }

  onModuleDestroy() {
    console.log('Executing OnDestroy Hook');
  }

  getHello(): string {
    return 'Hello World!';
  }
}
