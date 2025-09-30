import { createReadStream, writeFileSync } from 'fs';
import { join } from 'path';
import { createInterface } from 'readline';

import { Command } from 'commander';

async function extractLemmas(
  tsvPath: string,
  outputPath: string,
  dryRun = false
) {
  const fileStream = createReadStream(tsvPath);
  const rl = createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  const COR_CODES = [
    '100', // sb.sg.ubest (noun, singular, indefinite)
    '110', // sb.fk.sg.ubest (noun, common gender, singular, indefinite)
    '120', // sb.itk.sg.ubest (noun, neuter gender, singular, indefinite)
    '200', // vb.inf.akt (verb, infinitive, active)
    '201', // vb.inf.pass (verb, infinitive, passive)
    '300', // adj.sg.ubest.fk (adj, singular, indefinite, common gender)
    '301', // adj.sg.ubest.itk (adj, singular, indefinite, neuter gender)
    // "500", // prop (proper noun)
    '600', // talord (numeral)
    '610', // talord.kardinal (cardinal number)
    '880', // præp (preposition)
    '900', // adv (adverb)
    '970', // konj (conjunction)
    '990', // pron (pronoun)
    '991', // pron.nom (pronoun, nominative)
    '870', // udråbsord (interjection)
    '980', // lydord (onomatopoeia)
  ];

  const lemmas = new Set<string>();

  // List of characters to filter out
  const FILTER_CHARS = ['-', "'"];

  for await (const line of rl) {
    const columns = line.split('\t');
    if (!columns[0] || !columns[1]) continue;

    const idParts = columns[0].split('.');
    if (idParts.length < 4 || typeof idParts[2] !== 'string') continue;

    if (!COR_CODES.includes(idParts[2])) continue;

    let lemma = columns[1]?.trim();
    if (lemma) {
      // Remove diacritics except for æ, ø, å
      lemma = lemma
        .normalize('NFD')
        .replace(/(?![æøåÆØÅ])[\u0300-\u036f]/g, '');
    }
    if (
      lemma &&
      lemma.length === 5 &&
      !FILTER_CHARS.some((char) => lemma.includes(char))
    ) {
      lemmas.add(lemma.toUpperCase());
    }
  }

  if (dryRun) {
    console.log(`Dry run: would extract ${lemmas.size} lemmas.`);
  } else {
    const tsContent = `// Auto-generated word list\nexport const words = ${JSON.stringify(Array.from(lemmas), null, 2)};\n`;
    writeFileSync(outputPath, tsContent, 'utf8');
    console.log(`Extracted ${lemmas.size} lemmas to ${outputPath}`);
  }
}

const program = new Command();
program
  .name('extract-lemmas')
  .description(
    'Extract 5-letter lemmas from a TSV file and output as a TypeScript array.'
  )
  .argument('<input>', 'Path to input TSV file')
  .option('-o, --output <output>', 'Path to output TypeScript file')
  .option(
    '--dry-run',
    'Only print the count of extracted lemmas, do not write output file'
  )
  .action(async (input, options) => {
    const outputPath = options.output || join(process.cwd(), 'src', 'words.ts');
    try {
      await extractLemmas(input, outputPath, options.dryRun);
    } catch (err) {
      console.error('Error extracting lemmas:', err);
      process.exit(1);
    }
  });

program.parseAsync(process.argv);
