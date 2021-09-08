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
  HEADERS:
    GET:
      content-type: application/json

- GET: https://jsonplaceholder.typicode.com/todos/3

- GET: https://jsonplaceholder.typicode.com/posts/1
```
