import axios from 'axios';

export type data = {
  JobName: String
  ExecutionType: 'Poll' | 'Run',
  Async: boolean
}

export default class ReplicationManager {
  constructor() {
  }

  public async getJobs(): Promise<any> {
    let response;
    try {
      response = await axios.get(
        "http://localhost:8019/api.rsc/jobs/",
        {
          method: "GET",
          headers: {
            "x-cdata-authtoken": "0u8T9k7l8S0a9c0X4s6c",
            "Content-Type": "application/json"
          }
        }
      );
    } catch (e) {
      console.log(e);
    }
    return response;
  }

  public async executeAllJobs(): Promise<boolean> {
    let failed = true;
    let response: any;
    try {
      response = await this.getJobs();
      response.data.value.map(async (job: any) => {
        console.log(job.JobName);
        await this.executeJob({
          JobName: job.JobName,
          ExecutionType: 'Run',
          Async: true
        })
      });
      failed = false;
    } catch (e) {
      console.log(e);
    }
    return failed;
  }

  public async executeJob(data: data) {
    const response = await axios.post(
      'http://localhost:8019/api.rsc/executeJob',
      JSON.stringify(data), {
      method: "POST",
      headers: {
        "x-cdata-authtoken": "0u8T9k7l8S0a9c0X4s6c",
        "Content-Type": "application/json"
      }
    }
    );
    return response;
  }
}