# sequential-request

### Status

![CI Status](https://github.com/packagely/sequential-request/actions/workflows/ciact.yml/badge.svg)

## Usage

You can be helpful to install it globally:

```sh
npm i -g seqreq

# then use it for your requests
seqreq myfile.yml
```

But you can use it even without installing:

```sh
npx seqreq myfile.yml
```

## YAML File

A sample file would look like this:

```yml
- VERSION: 0.0.1
  BASE_URL: https://jsonplaceholder.typicode.com
  DEFAULT:
    HEADERS:
      Cache-Control: no-cache
  DEFAULT_GET:
    HEADERS:
      Accept: application/json

- GET: /todos/3

- GET: /posts/1

- POST: https://example.com/api/test
  HEADERS:
    Content-Type: application/json
  BODY:
    property1: data1
    property2: data2
```
