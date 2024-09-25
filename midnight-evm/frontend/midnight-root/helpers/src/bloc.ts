import { Observable, scan, shareReplay, Subject } from 'rxjs';
import { Logger, noopLogger } from './logging.js';
import { Resource } from './resource.js';
import { StateUpdate } from './types.js';

export abstract class Bloc<T> {
  static asResource<B extends Bloc<unknown>>(bloc: () => B): Resource<B> {
    return Resource.makeSync(bloc, (bloc: B) => {
      bloc.complete();
    });
  }

  #stateChanges = new Subject<StateUpdate<T>>();
  #logger: Logger;

  state$: Observable<T>;

  protected constructor(initialState: T, logger: Logger = noopLogger) {
    this.#logger = logger;
    this.state$ = this.#stateChanges.pipe(
      scan((prev: T, update: StateUpdate<T>) => {
        return update(prev);
      }, initialState),
      shareReplay(1),
    );
    this.state$.subscribe({
      next: (newBlocState) => this.#logger.info({ newBlocState }),
      error: (error: unknown) => this.#logger.error(error, 'Bloc state error'),
      complete: () => this.#logger.debug('Bloc state completed'),
    });
    this.#stateChanges.next((a) => a); // to run the state
  }

  protected updateState(cb: StateUpdate<T>): Observable<void> {
    return new Observable((observer) => {
      this.#stateChanges.next((prev) => {
        const next = cb(prev);
        setTimeout(() => {
          observer.next();
          observer.complete();
        }, 0);
        return next;
      });
    });
  }

  protected complete(): void {
    this.#stateChanges.complete();
  }
}
