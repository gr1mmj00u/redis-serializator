#!/usr/bin/env node
import commander from 'commander';
import serializer from '..';

commander
  .version('1.0.2')
  .description('Redis serializer.')
  .command('keys <key> [otherKeys...]')
  .action((key, otherKeys = []) => {
    if (typeof key === 'undefined') {
      console.error('No key parameter.');
      process.exit(1);
    }

    const keys = [key, ...otherKeys];

    try {
      process.stdin
        .pipe(serializer(keys))
        .pipe(process.stdout);
    } catch (err) {
      console.error('Oops, something went wrong!');
      console.error(err.toString());
      process.exit(1);
    }
  });

commander.parse(process.argv);
