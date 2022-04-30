import circoData from '@/datasets/circonscriptions.json'
import deputysData from '@/datasets/deputes.json'
import { booleanPointInPolygon, point, polygon, Position, feature, polygonize, multiPolygon } from '@turf/turf'

export interface ILatLng {
  lat: number
  lng: number
}

export interface Response extends Record<string, any> {
  circonscription: {
    ID: string
    code_dpt: string
    nom_dpt: string
    nom_reg: string
    num_circ: string
    code_reg: string
  } | null
  deputy: Record<string, any> | null
}

export default defineEventHandler(async (event) => {
  const { coords } = await useBody<{ coords: ILatLng }>(event)

  const res: Response = {
    circonscription: null,
    deputy: null
  }

  const addressPoint = point(Object.values(coords).reverse())

  const circoDataset = circoData.features
  const deputysDataset = deputysData.deputes

  for (const circo of circoDataset) {
    const circoFeature = feature(circo.geometry)
    if (circoFeature.geometry.type === 'MultiPolygon') {
      const poly = multiPolygon(circoFeature.geometry.coordinates as unknown as Position[][][])
      if (booleanPointInPolygon(addressPoint, poly)) {
        res.circonscription = circo.properties
        break
      }
    } else if (circoFeature.geometry.type === 'Polygon') {
      const poly = polygon(circoFeature.geometry.coordinates as unknown as Position[][])
      if (booleanPointInPolygon(addressPoint, poly)) {
        res.circonscription = circo.properties
        break
      }
    }
  }

  if (res.circonscription.code_dpt && res.circonscription.num_circ) {
    const deputy = deputysDataset.find(item => item.depute.num_deptmt === res.circonscription.code_dpt && item.depute.num_circo === parseInt(res.circonscription.num_circ))
    res.deputy = deputy || null
  }
  return res
})
