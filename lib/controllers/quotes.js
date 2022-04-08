const { Router } = require('express');
const fetch = require('cross-fetch');

module.exports = Router()

  .get('/', (req, res) => {
    const arrayOfUrls = [
      'https://programming-quotes-api.herokuapp.com/quotes/random',
      'https://futuramaapi.herokuapp.com/api/quotes/1',
      'https://api.quotable.io/random'
    ];

    function fetchQuotes(arrayOfUrls) {
      return Promise.all(arrayOfUrls.map((url) => fetch(url))).then((responses) => {
        return Promise.all(responses.map((response) => response.json()));
      });
    }

    function mungeQuotes(quote) {
      if (quote.en) return quote.en;
      if (quote.content) return quote.content;
      if (quote[0].quote) return quote[0].quote;
    }
    
    fetchQuotes(arrayOfUrls).then((rawQuotes) =>
      rawQuotes.map((quote) => {
        return {
          author: quote.author || quote[0].character,
          content: mungeQuotes(quote)
        };
      })).then((mungedQuotes) => res.send(mungedQuotes));

  });
