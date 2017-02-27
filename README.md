# app://social

## Profile site file structure

### /social/avatar.png

User picture

### /social/profile.json

User info

```
{
  name: string, the shortname of the user
  bio: string, the user's bio
  follows: [{
    url: string, url of the followed user
    title: string, the shortname of the followed user
  }]
}
```

### /social/posts/*.json

User posts

```
{
  body: string
}
```