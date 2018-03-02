'use strict';

// TODO: Make the ultime deploy script
// TODO: Add Changelog management /!\/!\/!\
// TODO: Use Env Var for Heroku user and MDP  <==========================
const shell = require('shelljs');
const colors = require('colors');
const readline = require('readline');


const name = 'Deploy.JS';
const version = '0.1.0';
const author = 'Jérémy Young <jeremy.young.pro@gmail.com>'
const command = 'node deploy.js';
const credentials = {};
const options = {};
const shortOptions = ['h', 'v', 's', 'b', 'd'];
const mandatoryOptions = ['version', 'source', 'branch', 'destination'];
const longOptions = ['help'].concat(mandatoryOptions);
const validEnv = ['DEV', 'INT', 'STAGING', 'PROD'];
const nbArguments = process.argv.length;

const optionError = 'Error: Bad options';

let showHelp = false;
let errorOptionOrParams = false;

if (!shell.which('docker')) {
  console.log('Sorry, this script requires docker');
  shell.exit(1);
}
else if (!shell.which('git')) {
  console.log('Sorry, this script requires git');
  shell.exit(1);
}

// Build options
if (nbArguments > 2) {
  for (let i = 0; i < nbArguments; i++) {
    let arg = process.argv[i].replace(/-/gi, '');
    // console.log(`${arg}`);

    if (shortOptions.includes(arg) || longOptions.includes(arg)) {
      if (arg.length === 1) {
        arg = getLongOptions(arg);
      }
      arg = arg.toLowerCase().trim();

      // Check if option "help"
      if (arg === longOptions[0]) {
        showHelp = true;
        break;
      }

      // Check "destination" value
      if (arg === mandatoryOptions[3]) {
        if (validEnv.includes(process.argv[i + 1])) {
          options[arg] = process.argv[i + 1] || true;
        }
        else {
          throw optionError;
        }
      }
      else {
        options[arg] = process.argv[i + 1] || true;
      }

      i++;
      continue;
    }
    else {
      if (i > 2) {
        console.log(`${colors.red(`Option or Param is not good: ${process.argv[i]}`)}`);
        errorOptionOrParams = true;
      }
    }
  }
}
else {
  showHelp = true;
}

if (showHelp) {
  printHelp();
}
else if (errorOptionOrParams) {
  askToUserQuestion('Some bad options or parameters, are you sure to continue ? (Yes|No)', answer => {
    if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
      deploy();
    }
    else {
      console.log(`${name} => exit...`);
      process.exit(0);
    }
  });
}
else {
  deploy();
}

function askToUserQuestion(question, cb) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question(`${question} \n`, answer => {
    cb(answer);
    rl.close();
  });
}

function deploy() {
  console.log(options);
  
  for (const property in options) {
    if (property) {
      if (property === mandatoryOptions[3] && options[property] === validEnv[3]) {
        askToUserQuestion('This is the PROD env, are you ready to deploy ? (Yes|No)', answer => {
          if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
            getCredentialsHeroku();
          }
          else {
            console.log(`${name} => exit...`);
            process.exit(0);
          }
        });
      }
      console.log(property, options[property]);
    }
  }
}

function getCredentialsHeroku() {
  askToUserQuestion('Heroku Email', answer => {
    credentials.email = answer;
    askToUserQuestion('Heroku Password', answer => {
      credentials.password = answer;
      build(credentials);
    });
  });
}

function build(credentials) {
  // const origineRepo = process.cwd();
  // const origineBranch = shell.exec('git rev-parse --abbrev-ref HEAD');
  
  // console.log(origineRepo, origineBranch);
  
  shell.cd('../../')
}

function getLongOptions(shortArg) {
  for(const longArg of longOptions) {
    if (longArg.charAt(0).toLowerCase() === shortArg.toLowerCase()) {
      return longArg.toLowerCase();
      breack;
    }
  }
  return;
}

function printHelp() {
  console.log(colors.bold.underline(colors.cyan(`################# ${name} Version: ${version} #################`)));
  console.log(colors.gray(`by ${author}\n`));

  console.log(`Ex: ${command} -s /home/ubuntu/Projects/checkIN -b feature_deploy_system -d INT\n`);

  console.log(colors.bold.underline(colors.grey('commande \tshort\t\tlong\t\t\t Description')));
  console.log(`${command} \t\t\t\t\t\t ${colors.grey('Show Help')}`);
  console.log(`${command} \t-${shortOptions[0]}\t\t--${longOptions[0]} \t\t\t ${colors.grey('Show Help')}`);
  console.log(`${command} \t-${shortOptions[1]}\t\t--${longOptions[1]} \t\t ${colors.grey(`Show Version of ${name}`)}`);
  console.log(`${command} \t-${shortOptions[2]} [repoPath]\t--${longOptions[2]} [repoPath] \t ${colors.grey('Select git repo')}`);
  console.log(`${command} \t-${shortOptions[3]} [branchName]\t--${longOptions[3]} [branchName] \t ${colors.grey('Select git branch')}`);
  console.log(`${command} \t-${shortOptions[4]} DEV\t\t--${longOptions[4]} DEV \t ${colors.grey('Build and Deploy to Developpement environnement (local)')}`);
  console.log(`${command} \t-${shortOptions[4]} INT\t\t--${longOptions[4]} INT \t ${colors.grey('Build and Deploy to Intégration environnement')}`);
  console.log(`${command} \t-${shortOptions[4]} STAGING\t--${longOptions[4]} STAGING \t ${colors.grey('Build and Deploy to Staging environnement')}`);
  console.log(`${command} \t-${shortOptions[4]} PROD\t\t--${longOptions[4]} PROD \t ${colors.grey('Build and Deploy to Production environnement')}`);
}
