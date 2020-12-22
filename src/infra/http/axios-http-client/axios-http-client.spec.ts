import { AxiosHttpClient } from './axios-http-client'
import { mockedAxios, mockHttpResponse } from '@/infra/test'
import { mockPostRequest } from '@/data/test'
import axios from 'axios'

type SutTypes = {
  sut: AxiosHttpClient
  mockedAxios: jest.Mocked<typeof axios>
}

jest.mock('axios')

const makeSut = (): SutTypes => {
  const sut = new AxiosHttpClient()
  const mockedAxiosSpy = mockedAxios()
  return {
    sut,
    mockedAxios: mockedAxiosSpy
  }
}

describe('AxiosHttpClient', () => {
  test('Should call axios with correct URL, BODY and VERB', async () => {
    const { sut, mockedAxios } = makeSut()
    const request = mockPostRequest()
    await sut.post(request)
    expect(mockedAxios.post).toHaveBeenCalledWith(request.url, request.body)
  })

  test('Should return the correct values in requisition', () => {
    const { sut, mockedAxios } = makeSut()
    const response = sut.post(mockPostRequest())
    expect(response).toEqual(mockedAxios.post.mock.results[0].value)
  })

  test('Should return the correct values in requisition on failure', () => {
    const { sut, mockedAxios } = makeSut()
    mockedAxios.post.mockRejectedValueOnce({
      response: mockHttpResponse()
    })
    const response = sut.post(mockPostRequest())
    expect(response).toEqual(mockedAxios.post.mock.results[0].value)
  })
})
