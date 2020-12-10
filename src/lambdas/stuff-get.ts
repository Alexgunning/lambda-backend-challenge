import fetch from 'node-fetch'
import { InternalResponse } from './types'

interface StuffResponse extends InternalResponse {
  body: RandomDog
}

interface RandomDog {
  message: string
  status: string
}

export async function handler(): Promise<StuffResponse> {
  const res = await fetch('https://dog.ceo/api/breeds/image/random')
  const payload: RandomDog = await res.json()
  return {
    statusCode: 200,
    body: payload,
  }
}
