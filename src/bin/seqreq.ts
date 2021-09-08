#!/usr/bin/env node

import { SequentialRequest } from "../";
import yargs from "yargs";
import fetch from "node-fetch";
import { hideBin } from "yargs/helpers";
import * as yaml from "js-yaml";
import * as fs from "fs";

const argv = yargs(hideBin(process.argv))
  .command("<file.yml>", "Sequential request using YAML file")
  .demandCommand(1).argv;

main(argv);

async function main(params: any) {
  try {
    const doc = yaml.load(fs.readFileSync(params._[0], "utf8")) as any[];
    const config = doc[0] as IOpConfig;
    const requests = doc.slice(1) as OpRequest[];

    const seqreq = new SequentialRequest( config,requests,fetch);
    const resultContext = await seqreq.execute();

    // tslint:disable-next-line:no-console
    console.log(resultContext);
  } catch (e) {
    // tslint:disable-next-line:no-console
    console.error(e);
  }
}
