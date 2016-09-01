CSV-ifies transcripts such as ```.inqscr``` files.

expects text files with formatting like:
```[00:00:59.13] [2] [L]: Brother, two step brothers```

that is

[```timestamp```] [```questionNumber```] [```speaker```]: ```response```

and results in a csv like:

```16-1-15-1,00:00:59.13,[2] ,L,"Brother, two step brothers"```

which is

```filename (so name them in a useful way, like date/session number)```,```timestamp```,```questionNumber```,```speaker```,```response```

## Usage ##

```node app.js <path to directory with all the transcripts> <path to output file>```

e.g. ```node app.js /Users/tgm/research-project/transcripts /Users/tgm/research-project/aggregated-transcript-data.csv```

n.b. right now it assumes all files in the input directory are input.
