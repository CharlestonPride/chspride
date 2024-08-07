import groq from 'groq'

export const slugsQuery = groq`*[_type == "page" && defined(slug.current)][]{
  _id,
  'slug':slug.current
}`

export const pageBySlugQuery = groq`*[_type == "page" && slug.current == $slug][0]`

export const homeQuery = groq`*[_type == "home"]{
  ...,
  header{
    ...,
    buttons[]{
      label,
      url,
      reference->{slug{...}}
    }
    },
  content[]{
    ...,
    buttons[]{
      label,
      url,
      reference->{slug{...}}
    }
    }
  }`

export const navigationQuery = groq`*[_type == "navigation"]
{
  _type,
  title,
  main[]{
    _type,
    _type=='dropdownItem' =>{
      label,
      list[]{
        _type,
        _type=='Page' => @-> {
          title,
          'slug': slug.current
        },
        _type == 'singleItem' => {
          label,
          url
        }
      }
    }
  }
}
`

export const sponsorsQuery = groq`
*[_type == "sponsor"]{
  name,
  website,
  "logo":logo.asset->{
    altText,
    description,
    url,
  }
}`

export const sponsorshipsQuery = groq`
*[_type == "sponsorship" && year==$year && event in $event]{
  featured,
  level,
  event,
  sponsor->{
  name,
  website,
  "logo":logo.asset->{
    altText,
    description,
    url,
  }
}
} | order(level desc)`

export const peopleQuery = groq`
*[_type == "person" ]{
  name,
  title,
  bio,
  email,
  pronouns,
  "image":image.asset->{
    altText,
    description,
    url
  }
}
`
export const ourTeamQuery = groq`
*[_type == "page" && slug.current == 'our-team' ]{
...,
content[]{
  _type,
  _type == "list" => {
    _type,
    label,
    list[]{
      _type,
      _type == 'reference' =>@-> {
        _type,
        _type == 'person' =>
        {
          name,
          title,
          email,
          bio,
          pronouns,
          "image":image.asset->{
            altText,
            description,
            url,
          }
        }
      }
    }
  }
}
}`

groq`
"image": image{
      ...,
      "asset": asset->,
    }`