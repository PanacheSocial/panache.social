import { tool as createTool } from 'ai'
import { z } from 'zod'

export default class ToolsService {
  async getTools() {
    return {
      draftEmail: createTool({
        description: 'Draft an email',
        parameters: z.object({
          to: z.string(),
          subject: z.string(),
          body: z.string(),
        }),
        execute: async (params) => params,
      }),
    }
  }
}
