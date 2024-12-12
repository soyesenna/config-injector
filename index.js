const core = require('@actions/core');
const axios = require('axios');
const fs = require('fs').promises;

async function run() {
  try {
    const filePath = core.getInput('file-path', { required: true });
    const secret = core.getInput('secret', { required: true });
    const serviceName = core.getInput('service-name', { required: true });
    const environments = core.getInput('environments', { required: true });
    const configEndpoint = core.getInput('config-endpoint', { required: true });

    const url = `${configEndpoint}?service=${serviceName}&environments=${environments}&secret=${secret}`;
    const response = await axios.get(url);

    if (response.status !== 200) {
      throw new Error(`Failed to fetch configuration: ${response.statusText}`);
    }

    await fs.writeFile(filePath, response.data);

    console.log(`Configuration file injected: ${filePath}`);

  } catch (error) {
    core.setFailed(`Action failed: ${error.message}`);
  }
}

run(); 