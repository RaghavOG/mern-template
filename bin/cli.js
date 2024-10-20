#!/usr/bin/env node
import { execSync } from "child_process";

const runCommand = (command) => {
    try {
        execSync(command, { stdio: "inherit" });
    } catch (error) {
        console.error(`Failed to run command: ${command}`, error);
        return false;
        
    }
    return true;
};

const repoName = process.argv[2];
if(!repoName){
    console.log("Please provide a repository name");
    process.exit(1);
}

const gitCheckout = `git clone https://github.com/RaghavOG/mern-template.git ${repoName}`;
const installDependencies = `cd ${repoName} && npm install --prefix frontend && npm install`;

console.log("Cloning repository...");
const checkedOut = runCommand(gitCheckout);
if(!checkedOut){
    process.exit(1);
}
console.log("Installing dependencies...");
const installedDependencies = runCommand(installDependencies);
if(!installedDependencies){
    process.exit(1);
}
console.log("Done!");
console.log(`Congratulations! Your project has been created successfully.`);

console.log("Happy coding!");
