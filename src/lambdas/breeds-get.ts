
import fetch from 'node-fetch'
import { Response } from './types'


interface DogBreedListResponse extends Response {
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

export async function handler(): Promise<DogBreedListResponse> {
  const res = await fetch('https://dog.ceo/api/breeds/list/all')
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
