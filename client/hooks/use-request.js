import axios from 'axios'
import { useState } from 'react'

const useRequest = ({ url, method, body, onSuccess }) => {
  const [errors, setErrors] = useState([])

  const methods = ['delete', 'get', 'post', 'put']
  if (!methods.includes(method.toLowerCase())) {
    console.warn(
      `Invalid method '${method}' supplied to request, expected one of ${methods.join(
        ', '
      )}.`
    )
  }

  const doRequest = async () => {
    try {
      setErrors([])
      const response = await axios[method.toLowerCase()](url, body)

      if (onSuccess) {
        onSuccess(response?.data)
      }

      return response?.data
    } catch (err) {
      setErrors(err?.response?.data?.errors || err)
    }
  }
  return { doRequest, errors }
}

export default useRequest
