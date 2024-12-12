const core = require('@actions/core');
const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

async function run() {
  try {
    const filePath = core.getInput('file-path', { required: true });
    const secret = core.getInput('secret', { required: true });
    const serviceName = core.getInput('service-name', { required: true });
    const environment = core.getInput('environment', { required: true });
    const configEndpoint = core.getInput('config-endpoint', { required: true });

    const url = `${configEndpoint}?service=${serviceName}&environment=${environment}&secret=${secret}`;
    const response = await axios.get(url);

    if (response.status !== 200) {
      throw new Error(`Failed to fetch configuration: ${response.statusText}`);
    }

    const directory = path.dirname(filePath);
    await fs.mkdir(directory, { recursive: true });
    await fs.writeFile(filePath, response.data);

    console.log(`Configuration file injected: ${filePath}`);

  } catch (error) {
    core.setFailed(`Action failed: ${error.message}`);
  }
}

run(); 