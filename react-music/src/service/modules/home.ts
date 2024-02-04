import request from '..'
import { resultType } from '../request/type'

request
  .request<resultType>({
    url: '/home/multidata'
  })
  .then((res) => {
    console.log(res)
  })
