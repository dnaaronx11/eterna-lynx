import { Command } from 'commander';
import Docker from 'dockerode';

const docker = new Docker();
const program = new Command();

program
  .name('athena')
  .description('EternaLynX Network CLI Assistant')
  .version('1.0.0');

program
  .command('status')
  .description('Check status of all EternaLynX services')
  .action(async () => {
    console.log('🔍 Checking service status...\n');
    const containers = await docker.listContainers({ all: true });
    
    containers
      .filter(c => c.Names[0].includes('eternalynx') || c.Names[0].includes('postgres') || c.Names[0].includes('redis'))
      .forEach(c => {
        const status = c.State === 'running' ? '✅' : '❌';
        console.log(`${status} ${c.Names[0]}:  ${c.State}`);
      });
  });

program
  .command('logs <service>')
  .description('View logs for a specific service')
  .action(async (service) => {
    const container = docker.getContainer(service);
    const stream = await container.logs({ stdout: true, stderr: true, follow: true });
    stream.pipe(process.stdout);
  });

program
  .command('voice')
  .description('Activate Athena voice mode')
  .action(() => {
    console.log('🎤 Athena voice mode activated.. .');
    console.log('Try saying: "Show me the status" or "Deploy the network"');
  });

program.parse(process.argv);
