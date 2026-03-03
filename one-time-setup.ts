import spawn from "cross-spawn";

const DOCKER_NETWORK_NAME = "ttt_network";

const dockerNetworkExists = (networkName: string): boolean => {
  try {
    const output = spawn.sync(
      "docker",
      ["network", "ls", "--format", "{{.Name}}"],
      { encoding: "utf-8" },
    ).stdout;
    return output.split("\n").includes(networkName);
  } catch (error) {
    console.error("Failed to check Docker networks:", error);
    process.exit(1);
  }
};

const createDockerNetwork = (networkName: string): void => {
  try {
    spawn.sync("docker", ["network", "create", networkName], {
      stdio: "inherit",
    });
  } catch (error) {
    console.error(`Failed to create Docker network '${networkName}':`, error);
    process.exit(1);
  }
};

const main = () => {
  if (dockerNetworkExists(DOCKER_NETWORK_NAME)) {
    console.log(`Docker network '${DOCKER_NETWORK_NAME}' already exists.`);
  } else {
    console.log(`Creating Docker network '${DOCKER_NETWORK_NAME}'...`);
    createDockerNetwork(DOCKER_NETWORK_NAME);
    console.log(`Docker network '${DOCKER_NETWORK_NAME}' created.`);
  }
  console.log("You are all set! Happy coding! 🚀");
};

main();
