
# leader-utils

  A set of utilities to work with Leader by extracting
  and normalizing various search keys from a person object

## Installation

    $ npm install leader-utils

## API

### .objcase

  Exported version of [obj-case](https://github.com/tedjt/objcase)

### .name

  Exported version of [people-names](https://github.com/tedjt/people-names)

### .fuzzifyNumberRange(someString)

  Returns an object with structure:
  {
    value: number,
    errorRange: number
  }

### .getCompanyName(person)

  Returns company name string or null if not found

### .getInterestingDomain(person)

  Returns domain name associated with the person if it's interesting (not personal or disposable), otherwise null.

### .getInterestingDomainStripped(person)

  Returns the stripped domain name without TLD associated with the person if it's interesting (not personal or disposable), otherwise null. E.g stacklead.com -> stacklead

### .getCompanyDomain(person)

  Returns the top level hostname associated with the company website. E.g. www.stacklead.com => stacklead.com

### .accurateTitle(title, query, [maxDistance])
  Given a title string and a query string scans the title to see if the query string is similar enough to the title based on Levenshtein distance.

## License

  MIT
