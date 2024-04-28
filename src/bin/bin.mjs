import { program } from 'commander';
import { generateCmd } from './bin.generator.mjs';

program.addCommand(generateCmd);

await program.parseAsync(process.argv);