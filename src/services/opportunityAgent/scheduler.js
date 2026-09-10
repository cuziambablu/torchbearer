/**
 * CampusLaunch AI Opportunity Agent — Background Scheduler & Concurrency Controller
 */

import { defaultAgentPipeline } from './pipeline.js';

class OpportunityAgentScheduler {
  constructor() {
    this.timerId = null;
    this.intervalHours = 6;
    this.isScheduled = false;
    this.lastRunTime = null;
    this.nextRunTime = null;
    this.subscribers = new Set();
  }

  /**
   * Subscribe to scheduler state changes
   */
  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  notifySubscribers() {
    const state = this.getStatus();
    this.subscribers.forEach((cb) => {
      try {
        cb(state);
      } catch (err) {
        console.error('Scheduler subscriber error:', err);
      }
    });
  }

  /**
   * Returns current scheduler status
   */
  getStatus() {
    return {
      isScheduled: this.isScheduled,
      isRunning: defaultAgentPipeline.isRunning,
      intervalHours: this.intervalHours,
      lastRunTime: this.lastRunTime,
      nextRunTime: this.nextRunTime
    };
  }

  /**
   * Starts background recurring schedule
   */
  startSchedule(intervalHours = 6, runImmediately = false, executeFn = null) {
    this.stopSchedule();
    this.intervalHours = intervalHours;
    this.isScheduled = true;

    const intervalMs = intervalHours * 60 * 60 * 1000;
    this.nextRunTime = new Date(Date.now() + intervalMs).toISOString();

    if (runImmediately && typeof executeFn === 'function') {
      this.executeRun(executeFn);
    }

    this.timerId = setInterval(() => {
      if (typeof executeFn === 'function') {
        this.executeRun(executeFn);
      }
    }, intervalMs);

    this.notifySubscribers();
  }

  /**
   * Stops background schedule
   */
  stopSchedule() {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
    this.isScheduled = false;
    this.nextRunTime = null;
    this.notifySubscribers();
  }

  /**
   * Executes a scheduled run safely
   */
  async executeRun(executeFn) {
    if (defaultAgentPipeline.isRunning) {
      console.warn('Agent is already running. Skipping overlapping scheduled execution.');
      return;
    }

    try {
      this.lastRunTime = new Date().toISOString();
      this.nextRunTime = new Date(Date.now() + this.intervalHours * 60 * 60 * 1000).toISOString();
      this.notifySubscribers();

      if (typeof executeFn === 'function') {
        await executeFn();
      }
    } catch (err) {
      console.error('Error during scheduled agent run:', err);
    } finally {
      this.notifySubscribers();
    }
  }
}

export const agentScheduler = new OpportunityAgentScheduler();
