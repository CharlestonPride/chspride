'use client'

/**
 * This configuration is used to for the Sanity Studio that’s mounted on the `\app\studio\[[...tool]]\page.tsx` route
 */

import { visionTool } from '@sanity/vision'
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { dataset, projectId } from './sanity/env'
import { schemaTypes } from './sanity/schema'
import { pageStructure, singletonPlugin } from './sanity/plugins/setttings'
import footer from './sanity/schema/documents/singletons/footer'
import home from './sanity/schema/documents/singletons/home'
import navigation from './sanity/schema/documents/singletons/navigation'
import ourTeam from './sanity/schema/documents/singletons/ourTeam'
import { media } from 'sanity-plugin-media'
import { guide } from './sanity/tools/guide'

export default defineConfig({
  basePath: '/studio',
  projectId,
  dataset,
  plugins: [structureTool({
    structure: pageStructure([home, ourTeam, navigation, footer,]),
  }), visionTool(), singletonPlugin([home.name, ourTeam.name, navigation.name, footer.name,]), media()],
  //tools: [guide()],
  // Add and edit the content schema in the './sanity/schema' folder
  schema: {
    types: schemaTypes,
  },
})
