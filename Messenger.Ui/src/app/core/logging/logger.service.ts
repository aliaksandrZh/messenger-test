import { Service } from '@angular/core';

/**
 * Thin structured logging seam for the UI. Console-backed today so failures
 * surface loudly during development; the single `emit*` indirection is the
 * place to swap in a remote/telemetry sink later without touching call sites.
 *
 * `context` is a short tag identifying the subsystem (e.g. 'ChatHub') so log
 * lines stay greppable. `err` is normalized to `Error` to avoid stringifying
 * arbitrary rejection payloads.
 */
@Service()
export class Logger {
  info(context: string, message: string): void {
    this.emit('info', context, message);
  }

  error(context: string, message: string, err?: unknown): void {
    this.emit('error', context, message, this.toError(err));
  }

  private emit(level: 'info' | 'error', context: string, message: string, err?: Error): void {
    const payload = err ? `${message}: ${err.name}: ${err.message}` : message;
    // Single swappable seam: replace with a real telemetry sink here.
    console[level](`[${context}] ${payload}`);
  }

  private toError(err: unknown): Error | undefined {
    if (err instanceof Error) return err;
    if (err == null) return undefined;
    return new Error(typeof err === 'string' ? err : JSON.stringify(err));
  }
}