import fetch, { Response, FetchError } from 'node-fetch'
import { ErrorResponse, InternalResponse } from './types'

interface DogBreedListResponse extends InternalResponse {
  body: string[]
  statusCode: number
}

interface Map {
  [key: string]: string[]
}

interface DogBreedList {
  message: Map
  status: string
}

export async function handler(): Promise<DogBreedListResponse | ErrorResponse> {
  const url = 'https://dog.ceo/api/breeds/list/all'
  let res: Response
  try {
    // set a 2.5 second timer for the api request
    const timer = new Promise(resolve => {
      setTimeout(resolve, 2500, 'timeout')
    })
    // calling a promise race to check whether the api request or two second timer finishes first
    const timeOutRes = await Promise.race([fetch(url), timer])
    if (timeOutRes === 'timeout')
      return {
        statusCode: 500,
        errorMessage: 'Network Request Timeout',
      }
    // Set res to the network request since it did not time out
    res = timeOutRes as Response
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
  // flatten array of arrays
  const flattendDogBreeds = Array.prototype.concat.apply([], dogBreeds)

  return {
    statusCode: 200,
    body: flattendDogBreeds,
  }
}
