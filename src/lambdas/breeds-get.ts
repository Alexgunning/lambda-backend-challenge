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
  let res:Response;
  try {
    res = await fetch('https://dog.ceo/api/breeds/list/all');
  }
  catch(e) {
    //Handle unreachable addresses
    //Tested on https://frog.ceo/api/breeds/list/all 
    if (e instanceof FetchError) {
     return{ 
       statusCode: 500,
       errorMessage: e.message
     }
    }
    else{
      //I don't know what other errors node-fetch would return and I have never used the package before
      return {
      statusCode: 500,
      errorMessage: 'unknown error'
      }
    }
  }

  if(res.status != 200) {
    return {
      statusCode: res.status,
      errorMessage: res.statusText
    }
  }
  const payload: DogBreedList = await res.json()
  let flattendDogBreeds:string[] = [];
  for (let breed of Object.keys(payload.message)) {
    let subBreed = payload.message[breed];
    if (subBreed.length == 0) {
      flattendDogBreeds.push(breed);
    }
    else{
      flattendDogBreeds = flattendDogBreeds.concat(subBreed);
    }
  }

  return {
    statusCode: 200,
    body: flattendDogBreeds,
  }
}
