import { AxiosHttpClient } from './axios-http-client'
import axios from 'axios'
import faker, { fake } from 'faker'
import { HttpPostParams } from '@/data/protocols/http'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

const mockAxiosResult = {
  data: faker.random.objectElement(),
  status: faker.random.number()
}

mockedAxios.post.mockResolvedValue(mockAxiosResult)

const makeSut = (): AxiosHttpClient => {
  return new AxiosHttpClient()
}

const mockPostRequest = (): HttpPostParams<any> => ({
  url: faker.internet.url(),
  body: faker.random.objectElement()
})

describe('AxiosHttpClient', () => {
  test('Should call axios with correct URL, BODY and VERB', async () => {
    const sut = makeSut()
    const request = mockPostRequest()
    await sut.post(request)
    expect(mockedAxios.post).toHaveBeenCalledWith(request.url, request.body)
  })

  test('Should return the correct values in requisition', async () => {
    const sut = makeSut()
    const response = await sut.post(mockPostRequest())
    expect(response).toEqual({
      statusCode: mockAxiosResult.status,
      body: mockAxiosResult.data
    })
  })
})
