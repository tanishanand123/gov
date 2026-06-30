"""
Scheduler daemon — runs as a separate process, keeps the APScheduler alive.
"""
import asyncio
import logging
from scheduler.jobs import create_scheduler, daily_full_scrape

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def main():
    logger.info("[Daemon] Starting SmartGov Scheduler Daemon...")

    # Run an initial scrape on startup so the DB isn't empty
    logger.info("[Daemon] Running initial MyScheme scrape...")
    await daily_full_scrape()

    # Start the scheduler
    scheduler = create_scheduler()
    scheduler.start()
    logger.info("[Daemon] Scheduler started. Jobs scheduled:")
    for job in scheduler.get_jobs():
        logger.info(f"  - {job.name}: {job.next_run_time}")

    # Keep running
    try:
        while True:
            await asyncio.sleep(60)
    except (KeyboardInterrupt, SystemExit):
        scheduler.shutdown()
        logger.info("[Daemon] Scheduler stopped.")


if __name__ == "__main__":
    asyncio.run(main())
