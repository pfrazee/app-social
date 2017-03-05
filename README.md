# Microblog site template

## Site structure

The site's feed can interact with any other site that follows this structure.

### /favicon.png

Site icon (optional)

### /dat.json

General site info (required)

```
{
  title: string, the shortname of the site
  description: string
}
```

### /microblog.json

Micro-blog site info (optional)

```
{
  follows: [{
    url: string, url of the followed site
    title: string, the shortname of the followed site
  }]
}
```

### /posts/*.txt

Micro-blog posts. Unstructured text.