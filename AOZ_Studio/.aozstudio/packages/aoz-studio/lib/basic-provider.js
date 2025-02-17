'use babel';

// data source is a simple array of strings
import suggestions from '../data/basic';

const { CompositeDisposable, TextBuffer } = require('atom');

class BasicProvider 
{
	constructor() 
	{
		// offer suggestions when editing aoz files
		this.selector = '.source.aoz';
		// disable for comments and strings
		this.disableForSelector = '.source.aoz .comment, .source.aoz .string';

		this.subscriptions = new CompositeDisposable();
		this.config = atom.config;
		this.enableAutoComplete = null;
		this.minimumWordLength = null;
		this.includeAdditionalSuggestions = null;
		this.subscriptions.add(atom.config.observe('aoz-studio.enableAutoComplete', (value) => { this.enableAutoComplete = value }));
		this.subscriptions.add(atom.config.observe('aoz-studio.minimumWordLength', (value) => { this.minimumWordLength = value }));
		this.subscriptions.add(atom.config.observe('aoz-studio.includeAdditionalSuggestions', (value) => { this.includeAdditionalSuggestions = value }));
	}

	dispose () 
	{
		return this.subscriptions.dispose();
	}	

	clampedRange(maxDelta, cursorRow, maxRow) 
	{
		const clampedMinRow = Math.max( 0, cursorRow - maxDelta );
		const clampedMaxRow = Math.min( maxRow, cursorRow + maxDelta );
		const actualMinRowDelta = cursorRow - clampedMinRow;
		const actualMaxRowDelta = clampedMaxRow - cursorRow;
	
		return {
		  start: 
		  {
			row: clampedMinRow - maxDelta + actualMaxRowDelta,
			column: 0
		  },
		  end: 
		  {
			row: clampedMaxRow + maxDelta - actualMinRowDelta,
			column: 0
		  }
		}
	}

	getSuggestions( {editor, bufferPosition, prefix, scopeDescriptor} ) 
	{
		if ( this.enableAutoComplete === false )
		{
			return;
		}

		if ( !prefix ) 
		{
			return;
		}

		if ( prefix.trim().length < this.minimumWordLength )
		{
			return;
		}		

		let self = this;
		const buffer = editor.getBuffer();
		const position = editor.getLastCursor().getBufferPosition();
		const lastCursorPosition = editor.getLastCursor().getBufferPosition();

		// Limit how much of the buffer to search
		const searchRange = this.clampedRange
		(
			3000,
			position.row,
			buffer.getEndPosition().row
		)

		const compareMatches = (a, b) => 
		{
			if (a.score - b.score === 0) 
			{
			  return a.word.length - b.word.length;
			}

			return b.score - a.score;
		}		

		const bufferResultsToSuggestions = matches => 
		{
			const relevantMatches = [];
			let matchedWords = new Set();
			let match;

			if ( matches && this.includeAdditionalSuggestions === true )
			{
				for (let l = 0; l < matches.length; l++) 
				{
					match = matches[l]

					if (match.word === prefix) continue;
					if (matchedWords.has(match.word)) continue;

					let matchIsUnderCursor = false;

					if (match.score > 0) 
					{
						let closestDistance;
						for (const position of match.positions) 
						{
							const distance = Math.abs(position.row - lastCursorPosition.row);
							
							if (closestDistance == null || distance < closestDistance) 
							{
								closestDistance = distance;
							}
				
							if ( distance === 0 &&
								lastCursorPosition.column >= position.column &&
								lastCursorPosition.column <= position.column + match.word.length
							) 
							{
								matchIsUnderCursor = true;
								break;
							}
						}
					}
			
					if (matchIsUnderCursor) continue;
			
					match.buffer = buffer;
			
					const scopeDescriptor = editor.scopeDescriptorForBufferPosition(match.positions[0]);

					let addWord = true;

					for (let i = 0; i < scopeDescriptor.scopes.length; i++)
					{
						if (scopeDescriptor.scopes[i].includes("comment") || 
								scopeDescriptor.scopes[i].includes("keyword.language.aoz") || 
								scopeDescriptor.scopes[i].includes("constant.numeric") || 
								scopeDescriptor.scopes[i].includes("keyword.control.aoz") )
						{
							addWord = false;
						}
					}

					if (addWord === true)
					{
						if (match.word.toLowerCase().startsWith(prefix.toLowerCase()) || match.word.toLowerCase().indexOf(prefix.toLowerCase()) > 0 )
						{
							relevantMatches.push(match);
							matchedWords.add(match.word);			
						}
					}
				}
			}

			// sort and limit the buffer suggestions
			let sortedMatches = relevantMatches
				.sort(compareMatches)
				.slice(0, 10)

			/// convert the array of words into an array of objects
			let matchingSuggestions = sortedMatches.map((sug) => 
			{
				return { text: sug.word, type: 'variable', rightLabel: 'VAR/LABEL/PROC' };
			});

			// get suggestions from the basic file
			let basicSuggestions = self.findMatchingSuggestions(prefix);
						
			return basicSuggestions.concat(matchingSuggestions);
		}		

		return 	buffer.findWordsWithSubsequenceInRange(
					prefix,
					'_',
					20,
					searchRange
				).then(bufferResultsToSuggestions);

	}

	findMatchingSuggestions(prefix) 
	{
		let prefixLower = prefix.toLowerCase().replace(/\s+/g, '');

		// Get startsWith suggestions
		let matchingWordStart = suggestions.filter((suggestion) => 
		{
			suggestionNoSpace = suggestion.replace(/\s+/g, '').toLowerCase();
			if (suggestionNoSpace.startsWith(prefixLower) == true) 
			{
				return suggestion.toLowerCase();
			}
		});

		// Capitalise
		matchingWordStart = matchingWordStart.map((word) => 
		{
			return word.replace(/\b[a-z]/g, match => match.toUpperCase());
		});

		// Get suggestions that contain the prefix
		let matchingWords = suggestions.filter((suggestion) => 
		{
			suggestionNoSpace = suggestion.replace(/\s+/g, '').toLowerCase();
			if (suggestionNoSpace.indexOf(prefixLower) > 0) 
			{
				return suggestion.toLowerCase();
			}
		});

		// Capitalise
		matchingWords = matchingWords.map((word) => 
		{
			return word.replace(/\b[a-z]/g, match => match.toUpperCase());
		});

		// Sort the arrays
		matchingWordStart.sort();	
		matchingWords.sort();

		// Combine the 2 arrays
		let matchingWordsCombined = matchingWordStart.concat(matchingWords);

		// convert the array of words into an array of objects with a text and type property
		let matchingSuggestions = matchingWordsCombined.map((word) => 
		{
			return { text: word, type: 'keyword' };
		});

		return matchingSuggestions;
	}
}
export default new BasicProvider();
