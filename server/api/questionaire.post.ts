import { nextQuestion } from '../state'

export default defineEventHandler(async (event: any) => {
  const body = await readBody(event)

  if (body.operation === 'nextQuestion') {
    nextQuestion()
  }

  return {
    success: true
  }
})
