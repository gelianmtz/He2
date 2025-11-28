/**
 * Abstract base class for scheduled jobs.
 */
export abstract class Job {
    /** Name of the job (used for logging/debugging). */
    public abstract name: string;
    /** Whether to log each run of the job. */
    public abstract log: boolean;
    /** Cron-style schedule expression for the job. */
    public abstract schedule: string;
    /** Whether the job should only run once on startup. */
    public runOnce = false;
    /** Delay before the job first runs, in seconds. */
    public initialDelaySecs = 0;

    /**
     * The logic to run when the job is triggered.
     */
    public abstract run(): Promise<void>;
}
