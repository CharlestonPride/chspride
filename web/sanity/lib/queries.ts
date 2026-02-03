// Simple groq tag function for syntax highlighting
const groq = String.raw;

export const slugsQuery = groq`*[_type == "page" && defined(slug.current)][]{
  _id,
  'slug':slug.current
}`;

export const pageBySlugQuery = groq`*[_type == "page" && slug.current == $slug][0]`;

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
  }`;

export const navigationQuery = groq`*[_type == "navigation"][0]
{
  ...,
  main[]{
    _type,
    _type=='dropdownItem' =>{
      label,
      list[]{
        _type,
        _type=='Page' => @-> {
          'label': title,
          'slug': slug.current
        },
        _type == 'externalUrl' => {
          label,
          url
        }
      }
    }
  },
  callToAction[] -> {
    title,
    slug
  }
}
`;

export const sponsorsQuery = groq`
*[_type == "sponsor"]{
  name,
  website,
  "logo":logo.asset->{
    altText,
    description,
    url,
  }
}`;

export const sponsorshipsQuery = groq`
*[_type == "sponsorship" && year==$year]{
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
} | order(level desc)`;

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
`;
export const ourTeamQuery = groq`
*[_type == "ourTeam" ][0]{
...
}`;

export const footerQuery = groq`
*[_type == "footer"][0]`;

groq`
"image": image{
      ...,
      "asset": asset->,
    }`;
