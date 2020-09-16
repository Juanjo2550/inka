# Replication triggers for CData - Sync
## Usage
```js
const manager = new ReplicationManager();

  let res = await manager.executeAllJobs({
    ExecutionType: 'Run',
    JobName: 'master_reservas',
    Async: true
  });
```