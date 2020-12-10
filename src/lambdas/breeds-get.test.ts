import fetch from 'node-fetch'
import { handler } from './breeds-get'

const mockedFetch: jest.Mock = fetch as any

jest.mock('node-fetch')

// subset of entire api
const testAPIMessage = {
  message: {
    akita: [],
    australian: ['shepherd'],
    buhund: ['norwegian'],
    bullterrier: ['staffordshire'],
    cairn: [],
    spaniel: ['blenheim', 'brittany', 'cocker', 'irish', 'japanese', 'sussex', 'welsh'],
    springer: ['english'],
    stbernard: [],
  },
  status: 'success',
}

const flattenedResult = [
  'akita',
  'shepherd',
  'norwegian',
  'staffordshire',
  'cairn',
  'blenheim',
  'brittany',
  'cocker',
  'irish',
  'japanese',
  'sussex',
  'welsh',
  'english',
  'stbernard',
]

describe('stuff-get-breed succesful call mock', () => {
  const mockPayload = testAPIMessage
  beforeEach(() => {
    mockedFetch.mockReturnValueOnce({
      json: () => {
        return mockPayload
      },
      status: 200,
    })
  })

  it('returns payload from fetch request', async () => {
    const response = await handler()
    expect(response).toMatchObject({ statusCode: 200, body: flattenedResult })
  })
})

describe('stuff-get-breed handles a network timeout being exceeded', () => {
  beforeEach(() => {
    mockedFetch.mockReturnValueOnce(
      new Promise(resolve => {
        setTimeout(resolve, 5000, 'timeout')
      }),
    )
  })

  it('returns error message', async () => {
    const response = await handler()
    expect(response).toMatchObject({ statusCode: 500, errorMessage: 'Network Request Timeout' })
  })
})

describe('stuff-get-breed handles bad response ie error code not 200', () => {
  beforeEach(() => {
    mockedFetch.mockReturnValueOnce({
      statusText: 'Not Found',
      status: 404,
    })
  })

  it('returns error message', async () => {
    const response = await handler()
    expect(response).toMatchObject({ statusCode: 404, errorMessage: 'Not Found' })
  })
})

// I have never used jest before (we use chai/mocha/sinon) and am unclear on how to throw an error from a mock function
// I imagine it would be something like the code below

// describe('stuff-get handler address not found', () => {
//     let errorObject = {message: 'request to https://og.ceo/api/breeds/list/all failed, reason: getaddrinfo ENOTFOUND og.ceo', type: 'system'}
//     beforeEach(() => {
//       mockedFetch.mockReturnValueOnce(
//         new FetchError(errorObject.message, errorObject.type)
//       )
//     })

//     it('returns payload from fetch request', async () => {
//       const response = await handler()
//       expect(response).toMatchObject({ status: 500, errorMessage: errorObject.message })
//     })
//   })
