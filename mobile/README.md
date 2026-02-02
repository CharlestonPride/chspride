# Charleston Pride - Mobile App

This directory will contain the Flutter mobile application for Charleston Pride.

## Setup

To initialize the Flutter project, run:

```bash
flutter create --org com.charlestonpride --project-name chspride_mobile .
```

## Sanity Integration

This mobile app will use the shared Sanity schema located in `../sanity-schema/`.

The app will connect to the same Sanity instance as the web application, but may use different GROQ queries optimized for mobile views.

## Development

Coming soon...

## Configuration

You'll need to create a `.env` file with the following Sanity credentials:

```
SANITY_PROJECT_ID=your_project_id
SANITY_DATASET=your_dataset
SANITY_API_TOKEN=your_token
```
