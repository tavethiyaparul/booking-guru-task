
Api CRl
curl --location 'http://localhost:3000/cities?page=1&limit=10'


1. How do you determine whether something is a city?

The Wikipedia API itself doesn’t have a built-in “is this a city?” flag — it just returns whatever is on the relevant Wikipedia page (summary, description, categories, etc.).

If you want to determine whether something is a city using the Wikipedia API, the usual approach is:

Call the Wikipedia summary endpoint for the name:

https://en.wikipedia.org/api/rest_v1/page/summary/{cityName}


Example:

https://en.wikipedia.org/api/rest_v1/page/summary/Berlin


Check the returned JSON:

Look at description → It often says "City in ..." or "Capital of ...".

Check extract → This is the first paragraph of the article and may contain words like "city", "town", "municipality".

If you enable the prop=categories parameter via the MediaWiki API, you can also check if the page has categories like "Cities in India", "Populated places in...".

Logic for identifying a city:

If description contains "city" (case-insensitive), that’s usually a safe indicator.

Or, if categories contain "Cities" or "Towns", you can also classify it as a city.

Optionally, cross-check with other APIs like GeoNames or OpenStreetMap for higher accuracy.

Example JSON snippet from Wikipedia Summary API for Surat:

{
  "title": "Surat",
  "description": "City in Gujarat, India",
  "extract": "Surat is a city in the Indian state of Gujarat..."
}


Here, description already tells you it’s a city.

2. Any limitations or assumptions.

If you’re using the Wikipedia API to determine whether something is a city, the main limitations and assumptions are:

Limitations

1. No official “city” flag – Wikipedia’s API doesn’t explicitly mark something as a city; you must infer it from text or categories.

2. Inconsistent descriptions – The description field might say "Metropolitan area", "Town", "Capital of...", or even something vague like "Place in...".

3. Language dependence –
