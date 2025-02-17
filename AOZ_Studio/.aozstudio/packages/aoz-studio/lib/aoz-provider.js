'use babel';

// the suggestions file is generated using the guidemap.json file from the documentation batch
// see /tools/autocomplete_updater
import suggestions from '../data/suggestions';

const { CompositeDisposable, TextBuffer } = require('atom');

class AOZProvider
{
	constructor()
	{
		// offer suggestions only when editing aoz files
		this.selector = '.source.aoz';
		// disable for comments and strings
		this.disableForSelector = '.source.aoz .comment, .source.aoz .string';

		this.subscriptions = new CompositeDisposable();
		this.config = atom.config;
		this.enableAutoComplete = null;
		this.minimumWordLength = null;
		this.subscriptions.add(atom.config.observe('aoz-studio.enableAutoComplete', (value) => { this.enableAutoComplete = value }));
		this.subscriptions.add(atom.config.observe('aoz-studio.minimumWordLength', (value) => { this.minimumWordLength = value }));
	}

	dispose ()
	{
		return this.subscriptions.dispose();
	}

	getSuggestions(options)
	{
		if ( this.enableAutoComplete === false )
		{
			return;
		}

		const { prefix } = options;
		// only look for suggestions after 3 characters have been typed
		if ( prefix.length >= this.minimumWordLength )
		{
			return this.findMatchingSuggestions(prefix);
		}
	}

	findMatchingSuggestions(prefix)
	{
		let prefixLower = prefix.toLowerCase().replace(/\s+/g, '');

		if ( suggestions )		// FLtoFB: it was crashing constantly when I typed anything int he IDE... can you check if my modification is correct?
		{
			let matchingWordStart = suggestions.filter((suggestion) =>
			{
				if( suggestion && suggestion.text )
				{
					suggestionNoSpace = suggestion.text.replace(/\s+/g, '').toLowerCase();
					if (suggestionNoSpace.startsWith(prefixLower) == true)
					{
						return suggestion;
					}
				}
			});

			// Get suggestions that contain the prefix
			let matchingWords = suggestions.filter((suggestion) =>
			{
				if( suggestion && suggestion.text )
				{				
					suggestionNoSpace = suggestion.text.replace(/\s+/g, '').toLowerCase();
					if (suggestionNoSpace.indexOf(prefixLower) > 0)
					{
						return suggestion;
					}
				}
			});

			// Sort the sugesstions
			matchingWordStart.sort(function(a,b)
			{
				return b.text.toLowerCase() < a.text.toLowerCase();
			});

			matchingWords.sort(function(a,b)
			{
				return b.text.toLowerCase() < a.text.toLowerCase();
			});

			let matchingWordsCombined = matchingWordStart.concat(matchingWords);

			// run each matching suggestion through inflateSuggestion() and return
			return matchingWordsCombined.map(this.inflateSuggestion);

		}
		return null;
	}

	// clones a suggestion object to a new object
	// cloning also fixes an issue where selecting a suggestion won't insert it
	inflateSuggestion(suggestion)
	{
		return {
			text: suggestion.text.replace(/\b[a-z]/g, match => match.toUpperCase()),
			description: suggestion.description,
			//descriptionMoreURL: suggestion.descriptionMoreURL,
			type: suggestion.type,
			rightLabel: suggestion.rightLabel
		};
	}
}
export default new AOZProvider();
