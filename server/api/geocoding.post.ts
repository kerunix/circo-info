interface IGeocodingResponse {
  [x: string]: any
  documentation: string
  licenses: { name: string, url: string }[]
  rate: { limit: number, remaining: number, reset: number }
  results: { formatted: string }[]
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const { address } = await useBody(event)
  const baseUrl = 'https://api.opencagedata.com/geocode/v1/json?q='
  const token = config.openCageToken
  const encoded = encodeURI(address)
  const res = await $fetch<IGeocodingResponse>(`${baseUrl}${encoded}&key=${token}&countrycode=fr`)
  return res
})
