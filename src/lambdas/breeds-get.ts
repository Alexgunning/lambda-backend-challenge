import fetch, { Response, FetchError } from 'node-fetch'
import { InternalResponse } from './types'

interface DogBreedListResponse extends InternalResponse {
  body: string[]
  statusCode: number
}

interface DogBreedListErrorResponse extends InternalResponse {
  errorMessage: string
  statusCode: number
}

interface Map {
  [key: string]: string[]
}

interface DogBreedList {
  message: Map
  status: string
}

export async function handler(): Promise<DogBreedListResponse | DogBreedListErrorResponse> {
  let res: Response
  try {
    res = await fetch('https://dog.ceo/api/breeds/list/all')
  } catch (e) {
    // Handle unreachable addresses
    // Tested on https://frog.ceo/api/breeds/list/all
    if (e instanceof FetchError) {
      return {
        statusCode: 500,
        errorMessage: e.message,
      }
    }

    // I don't know what other errors node-fetch would return and I have never used the package before
    return {
      statusCode: 500,
      errorMessage: 'unknown error',
    }
  }

  if (res.status !== 200) {
    return {
      statusCode: res.status,
      errorMessage: res.statusText,
    }
  }
  const payload: DogBreedList = await res.json()
  const dogMappings = payload.message

  const dogBreeds = Object.keys(dogMappings).map(breed => {
    if (dogMappings[breed].length === 0) {
      return [breed]
    }
    return dogMappings[breed]
  })
  //flatten array of arrays
  const flattendDogBreeds = Array.prototype.concat.apply([], dogBreeds)

  return {
    statusCode: 200,
    body: flattendDogBreeds,
  }
}
